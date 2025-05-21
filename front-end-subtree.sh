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

REMOTE_PULL_BRANCH="master"    # branch to pull from
REMOTE_PUSH_BRANCH="develop"   # branch to push to

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
typewriter() {
  for ((i=0; i<${#1}; i++)); do
    echo -n "${1:$i:1}"
    sleep 0.01
  done
  echo ""
}

scene_break() {
  clear
  echo -e "${CYN}"
  for ((i=0; i<$(tput cols); i+=6)); do
    echo -n "######"
  done
  echo -e "\n${RST}"
  sleep 0.2
}

pause_and_continue() {
  echo -e "${YLW}"
  read -p "⏳ Press [Enter] to continue..." dummy
  echo -e "${RST}"
}

# 🧠 Ensure remote exists
ensure_remote() {
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

# 🧹 Check for uncommitted changes and offer commit before subtree ops
check_dirty_and_prompt_commit() {
  if ! git diff-index --quiet HEAD --; then
    typewriter "${YLW}⚠️ You have uncommitted changes.${RST}"
    git status --short
    echo
    while true; do
      read -rp "Do you want to commit them first? (y/n): " yn
      case $yn in
        [Yy]* )
          read -rp "Enter commit message: " msg
          git add -A
          if git commit -m "$msg"; then
            play_success_tone
            break
          else
            play_error_tone
            typewriter "${RED}❌ Commit failed. Try again or cancel.${RST}"
          fi
          ;;
        [Nn]* ) 
          typewriter "${RED}❌ Operation cancelled due to uncommitted changes.${RST}"
          play_error_tone
          return 1
          ;;
        * ) typewriter "${YLW}Please answer y or n.${RST}" ;;
      esac
    done
  fi
  return 0
}

# 🧾 Checkout branch, create if missing
checkout_branch() {
  local branch=$1
  if git show-ref --verify --quiet refs/heads/"$branch"; then
    git checkout "$branch"
  else
    typewriter "${YLW}Branch '$branch' does not exist locally. Creating...${RST}"
    if git checkout -b "$branch"; then
      play_success_tone
    else
      typewriter "${RED}❌ Failed to create branch '$branch'.${RST}"
      play_error_tone
      exit 1
    fi
  fi
}

# 🌲 Run subtree command: add/pull/push with branch + prefix + commit check + branch checkout
run_subtree_cmd() {
  local cmd=$1     # add | pull | push
  local branch=$2  # branch to operate on
  local extra_args=$3

  ensure_remote

  # Checkout the branch first
  checkout_branch "$branch" || return 1

  # For pull/push, check if repo is dirty before running subtree commands (add rarely needed)
  if [[ "$cmd" != "add" ]]; then
    check_dirty_and_prompt_commit || return 1
  fi

  scene_break

  case "$cmd" in
    add)
      typewriter "${BLU}🌳 Adding subtree on branch '$branch'...${RST}"
      if git subtree add --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$branch" --squash $extra_args; then
        typewriter "${GRN}✅ Subtree added on branch '$branch'.${RST}"
        play_success_tone
      else
        typewriter "${RED}❌ Failed to add subtree on branch '$branch'.${RST}"
        play_error_tone
      fi
      ;;
    pull)
      typewriter "${CYN}🔄 Pulling subtree updates from branch '$branch'...${RST}"
      if git subtree pull --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$branch" --squash $extra_args; then
        typewriter "${GRN}✅ Pulled latest subtree changes from '$branch'.${RST}"
        play_success_tone
      else
        typewriter "${RED}❌ Failed to pull subtree changes from '$branch'.${RST}"
        play_error_tone
      fi
      ;;
    push)
      typewriter "${CYN}🚀 Pushing subtree changes to remote branch '$branch'...${RST}"
      if git subtree push --prefix="$SUBTREE_PATH" "$REMOTE_NAME" "$branch" $extra_args; then
        typewriter "${GRN}✅ Changes pushed to remote branch '$branch'.${RST}"
        play_success_tone
      else
        typewriter "${RED}❌ Failed to push changes to '$branch'.${RST}"
        play_error_tone
      fi
      ;;
    *)
      typewriter "${RED}❌ Unknown subtree command: $cmd${RST}"
      play_error_tone
      return 1
      ;;
  esac
  pause_and_continue
}

# 🧼 Handle replacement if folder exists
choose_replace() {
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
show_menu() {
  while true; do
    scene_break
    echo -e "${CYN}${BOLD}==== SUBTREE MANAGER ====${RST}"
    echo -e "${YLW}Select an option using numbers or arrow keys:${RST}"
    options=(
      "➕ Add subtree"
      "📥 Pull from master (pull branch)"
      "🚀 Push to develop (push branch)"
      "🔄 Sync (pull + push)"
      "🧼 Re-add subtree (wipe or backup)"
      "❌ Exit"
    )
    select opt in "${options[@]}"; do
      case $REPLY in
        1)
          # If folder exists, ask what to do
          if [ -d "$SUBTREE_PATH" ]; then
            typewriter "${YLW}⚠️ Folder already exists: $SUBTREE_PATH${RST}"
            choose_replace
          fi
          run_subtree_cmd add "$REMOTE_PULL_BRANCH"
          break
          ;;
        2) run_subtree_cmd pull "$REMOTE_PULL_BRANCH" ;;
        3) run_subtree_cmd push "$REMOTE_PUSH_BRANCH" ;;
        4)
          run_subtree_cmd pull "$REMOTE_PULL_BRANCH" && run_subtree_cmd push "$REMOTE_PUSH_BRANCH"
          ;;
        5)
          if [ -d "$SUBTREE_PATH" ]; then
            choose_replace
          else
            typewriter "${RED}No subtree folder to re-add.${RST}"
          fi
          run_subtree_cmd add "$REMOTE_PULL_BRANCH"
          ;;
        6)
          typewriter "${GRN}Bye!${RST}"
          exit 0
          ;;
        *)
          typewriter "${YLW}Invalid option. Try again.${RST}"
          ;;
      esac
    done
  done
}

# 🚀 Entry point
show_menu
