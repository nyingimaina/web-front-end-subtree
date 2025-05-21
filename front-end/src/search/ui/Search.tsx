// Search.tsx
import React from "react";
import styles from "../styles/search.module.css";

interface SearchProps {
  onSearch: (query: string) => void;
}

class Search extends React.Component<SearchProps> {
  state = {
    query: "",
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.query);
    this.setState({ query: "" }); // Clear the input after search
  };

  render() {
    return (
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search HBL..."
          value={this.state.query}
          onChange={this.handleInputChange}
        />
        <button
          className={styles.searchButton}
          onClick={this.handleSearch}
          disabled={this.state.query ? false : true}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
