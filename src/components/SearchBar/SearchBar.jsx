import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import searchIcon from '../../assets/icon/search.svg';

function SearchBar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className='search-bar'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search for movies...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type='submit' tabIndex='-1' aria-label='Search'>
          <img src={searchIcon} alt='Search' />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
