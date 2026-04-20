const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar producto..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-orange-500 transition-all"
    />
  );
};

export default SearchBar;
