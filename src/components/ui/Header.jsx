import { useState, useRef, useEffect } from 'react';
import SearchBar from '../modules/SearchBar';
import SinglePointRubricsIcon from '../../assets/SinglePointRubric.svg';
import LinkOutlined from '../../assets/LinkOutlined.svg';
import UploadOutlined from '../../assets/UploadOutlined.svg';
import AddOutlined from '../../assets/AddOutlined.svg';
import CaretUpFilled from '../../assets/CaretUpFilled.svg';

const Header = ({ onAddClick, query, setQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddClick = () => setIsDropdownOpen(s => !s);

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <SearchBar query={query} setQuery={setQuery} style={{}} />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            <img src={AddOutlined} alt="Add" className="btn-icon" />
            <span>Add</span>
            <img
              src={CaretUpFilled}
              alt="toggle"
              className="btn-caret"
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <img src={SinglePointRubricsIcon} alt="Create module" />
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <img src={LinkOutlined} alt="link" />
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <img src={UploadOutlined} alt="upload" />
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
