
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const { t } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={t('fixer.search.repairs')}
        className="pl-9"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
