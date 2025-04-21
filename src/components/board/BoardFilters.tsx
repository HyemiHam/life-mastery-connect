
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type SortOption = "latest" | "popular" | "views";

interface BoardFiltersProps {
  onSortChange: (option: SortOption) => void;
  onSearch: (query: string) => void;
  currentSort: SortOption;
}

const sortLabels: Record<SortOption, string> = {
  latest: "최신순",
  popular: "인기순",
  views: "조회순",
};

const BoardFilters = ({
  onSortChange,
  onSearch,
  currentSort,
}: BoardFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            {sortLabels[currentSort]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => onSortChange("latest")}>
            최신순
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("popular")}>
            인기순
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("views")}>
            조회순
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <form onSubmit={handleSearch} className="flex w-full gap-2 md:w-auto">
        <Input
          type="search"
          placeholder="검색어를 입력하세요"
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">검색</Button>
      </form>
    </div>
  );
};

export default BoardFilters;
