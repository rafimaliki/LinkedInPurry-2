import React, { useState, useEffect } from "react";

const FilterOptions = ["All", "Connected", "Not Connected"];

interface SearchBarProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filter?: string;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filter,
  setFilter,
  setSearchTerm,
  title,
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const changeFilter = () => {
    const currentIndex = FilterOptions.indexOf(filter || "All");
    const nextIndex = (currentIndex + 1) % FilterOptions.length;
    if (setFilter) {
      setFilter(FilterOptions[nextIndex]);
    }
  };

  return (
    <div className="px-4 border-b pb-3 cursor-default">
      <p className="text-lg font-semibold">{title}</p>
      <div className="flex justify-between">
        <p className="text-neutral-500">
          {filter ? (
            <>
              <span className="font-normal">Filter:</span>{" "}
              <span
                className="font-medium cursor-pointer"
                onClick={changeFilter}
              >
                {filter} ▾
              </span>
            </>
          ) : null}
        </p>
        <div className="flex">
          <input
            type="text"
            placeholder="⌕ Search by name"
            className="border rounded-sm border-neutral-500 px-2 mr-4 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {filter ? (
            <p
              className="text-[#0072b1] font-semibold cursor-pointer"
              onClick={changeFilter}
            >
              Search with filters
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
