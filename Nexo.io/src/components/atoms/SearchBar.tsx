import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-[#0F172A] focus:shadow-md transition-all"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;