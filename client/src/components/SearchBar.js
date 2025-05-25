import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleButtonClick = () => {
      onSearch(searchTerm); // Also trigger search on button click
  };

  return React.createElement('div', { className: 'search-bar-container' }, 
    React.createElement('input', { 
      type: 'text', 
      placeholder: 'Search by name or roll number...', 
      value: searchTerm, 
      onChange: handleInputChange
    }),
    React.createElement('button', { onClick: handleButtonClick }, 'Search')
  );
}

export default SearchBar; 