#!/bin/bash

# 🎨 Colors
RED=$(tput setaf 1)
GRN=$(tput setaf 2)
YLW=$(tput setaf 3)
BLU=$(tput setaf 4)
CYN=$(tput setaf 6)
RST=$(tput sgr0)
BOLD=$(tput bold)

# 🛠 Config
SUBTREE_PATH="front-end/src/web-front-end-subtree"
REMOTE_NAME="web-front-end-subtree"
REMOTE_URL="https://github.com/nyingimaina/web-front-end-subtree.git"
REMOTE_BRANCH="master"

# 🔊 Cross-platform beep with fallback tones
play_success_tone() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v afplay >/dev/null 2>&1 && [ -f "/System/Library/Sounds/Glass.aiff" ]; then
      afplay /System/Library/Sounds/Glass.aiff &
      return
    fi
  fi
  printf '\a'
}

play_error_tone() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v afplay >/dev/null 2>&1 && [ -f "/System/Library/Sounds/Basso.aiff" ]; then
      afplay /System/Library/Sounds/Basso.aiff &
      return
    fi
  fi
  for i in {1..3}; do printf '\a'; sleep 0.1; done
}

# 🎥 Text Animation Functions
function typewriter() {
  for ((i=0; i<${#1}; i++)); do
    echo -n "${1:$i:1}"
    sleep 0.01
  done
  echo ""
}

function scene_break() {
  clear
  echo -e "${CYN}"
  for ((i=0; i<$(tput cols); i = i + 6)); do
    echo -n "######"
    # sleep 0.000002
  done
  echo -e "\n${RST}"
  sleep 0.2
}

function pause_and_continue() {
  echo -e "${YLW}"
  read -p "⏳ Press [Enter] to continue..." dummy
  echo -e "${RST}"
}

# 🧠 Ensure remote exists
function ensure_remote() {
  if ! git remote | grep -q "$REMOTE_NAME"; then
    typewriter "${BLU}🔗 Adding remote '$REMOTE_NAME'...${RST}"
    git remote add "$REMOTE_NAME" "$REMOTE_URL"
    if [ $? -eq 0 ]; then
      play_success_tone
    else
      play_error_tone
    fi
  fi
}

# 📥 Add subtree
function add_subtree() {
  if [ -d "$SUBTREE_PATH" ]; then
    typewriter "${YLW}⚠️ Folder already exists: $SUBTREE_PATH${RST}"
    choose_replace
  fi

  ensure_remote
  scene_break
  typewriter "${BLU}🌳 Adding subtree...${RST}"
  if git subtree add --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$REMOTE_BRANCH" --squash; then
    typewriter "${GRN}✅ Subtree added.${RST}"
    play_success_tone
  else
    typewriter "${RED}❌ Failed to add subtree.${RST}"
    play_error_tone
  fi
  pause_and_continue
}

# 🔁 Pull updates
function pull_subtree() {
  ensure_remote
  scene_break
  typewriter "${CYN}🔄 Pulling updates from subtree...${RST}"
  if git subtree pull --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$REMOTE_BRANCH" --squash; then
    typewriter "${GRN}✅ Pulled latest changes.${RST}"
    play_success_tone
  else
    typewriter "${RED}❌ Failed to pull subtree changes.${RST}"
    play_error_tone
  fi
  pause_and_continue
}

# 🚀 Push updates
function push_subtree() {
  ensure_remote
  scene_break
  typewriter "${CYN}🚀 Pushing subtree changes to remote...${RST}"
  if git subtree push --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$REMOTE_BRANCH"; then
    typewriter "${GRN}✅ Changes pushed to remote.${RST}"
    play_success_tone
  else
    typewriter "${RED}❌ Failed to push changes.${RST}"
    play_error_tone
  fi
  pause_and_continue
}

# 🔄 Sync (pull + push)
function sync_subtree() {
  scene_break
  pull_subtree
  push_subtree
}

# 🧼 Handle replacement if folder exists
function choose_replace() {
  typewriter "${BLU}🤔 What should we do with the existing folder?${RST}"
  options=("📦 Backup & Replace" "💀 Force Delete" "❌ Cancel")
  select opt in "${options[@]}"; do
    case $REPLY in
      1)
        BACKUP_DIR="../subtree-backup-$(date +%s)"
        typewriter "${BLU}📦 Backing up to $BACKUP_DIR...${RST}"
        mkdir -p "$BACKUP_DIR"
        if mv "$SUBTREE_PATH" "$BACKUP_DIR"; then
          play_success_tone
        else
          play_error_tone
        fi
        break
        ;;
      2)
        typewriter "${RED}⚠️ Forcing replace...${RST}"
        if rm -rf "$SUBTREE_PATH"; then
          play_success_tone
        else
          play_error_tone
        fi
        break
        ;;
      3)
        typewriter "${RED}❌ Cancelled.${RST}"
        play_error_tone
        exit 0
        ;;
      *)
        typewriter "${YLW}Invalid choice. Try again.${RST}"
        play_error_tone
        ;;
    esac
  done

  git add -A
  git commit -m "Cleaned existing subtree folder before re-adding"
  play_success_tone
}

# 🎮 Menu
function show_menu() {
  while true; do
    scene_break
    echo -e "${CYN}${BOLD}==== SUBTREE MANAGER ====${RST}"
    echo -e "${YLW}Select an option using numbers or arrow keys:${RST}"
    options=(
      "➕ Add subtree"
      "📥 Pull from subtree"
      "🚀 Push to subtree"
      "🔄 Sync (pull + push)"
      "🧼 Re-add subtree (wipe or backup)"
      "❌ Exit"
    )
    select opt in "${options[@]}"; do
      case $REPLY in
        1) add_subtree; break ;;
        2) pull_subtree; break ;;
        3) push_subtree; break ;;
        4) sync_subtree; break ;;
        5) add_subtree; break ;;
        6) typewriter "${RED}👋 Exiting. Goodnight, Mr. Anderson...${RST}"; play_success_tone; exit 0 ;;
        *) typewriter "${YLW}❓ Invalid option. Try again.${RST}"; play_error_tone ;;
      esac
    done
  done
}

show_menu
