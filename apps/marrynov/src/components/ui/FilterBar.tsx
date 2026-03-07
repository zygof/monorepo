"use client";

type FilterBarProps = {
  filters: { key: string; label: string }[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
};

export function FilterBar({ filters, activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeFilter === filter.key
              ? "bg-primary text-white"
              : "bg-bg-white text-body hover:bg-primary-light hover:text-primary"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
