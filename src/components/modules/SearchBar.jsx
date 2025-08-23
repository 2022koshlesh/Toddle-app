import SearchOutlined from '../../assets/SearchOutlined.svg';

const SearchBar = ({ query, setQuery }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '6px 10px',
        background: '#fff',
        width: '100%',
        maxWidth: '300px',
      }}
    >
      <img
        src={SearchOutlined}
        alt="Search"
        style={{ width: 16, height: 16, marginRight: 6, opacity: 0.6 }}
      />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          flex: 1,
          fontSize: '14px',
          padding: '8px 12px',
          maxWidth: '450px',
        }}
      />
    </div>
  );
};

export default SearchBar;
