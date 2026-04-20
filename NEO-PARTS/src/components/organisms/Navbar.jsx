import useCartStore from "../../store/useCartStore";
import SearchBar from "../atoms/SearchBar";

const Navbar = ({ search, onSearchChange }) => {
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 px-8 py-4 flex items-center justify-between gap-4">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-orange-500 whitespace-nowrap">
        Nexo.io
      </h1>

      {/* Buscador al centro */}
      <div className="flex-1 max-w-md">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>

      {/* Carrito */}
      <div className="relative cursor-pointer">
        <span className="text-2xl">🛒</span>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
