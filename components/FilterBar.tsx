import React from 'react';
import { FilterState, ChannelType, ChannelStatus } from '../types';
import { FilterIcon } from './IconComponents';
import { SearchBar } from './SearchBar';
import { ToggleButton } from './ToggleButton';

interface FilterBarProps {
  searchTerm: string;
  onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
}

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="mt-1 w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);


export const FilterBar: React.FC<FilterBarProps> = ({ 
    searchTerm, 
    onSearchTermChange,
    filters,
    onFilterChange,
    onClearFilters,
    activeFilterCount,
    isPanelOpen,
    onTogglePanel
}) => {
  
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...Object.values(ChannelType).map(t => ({ value: t, label: t }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(ChannelStatus).map(s => ({ value: s, label: s }))
  ];

  return (
    <div>
        <div className="flex items-center space-x-2">
            <SearchBar value={searchTerm} onChange={onSearchTermChange} />
            <button 
                onClick={onTogglePanel}
                className="relative flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <FilterIcon />
                <span className="ml-2">Filter</span>
                {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
        {isPanelOpen && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                     <FilterSelect 
                        label="Type"
                        value={filters.type}
                        onChange={(e) => onFilterChange({ type: e.target.value as ChannelType | 'all' })}
                        options={typeOptions}
                    />
                     <FilterSelect 
                        label="Status"
                        value={filters.status}
                        onChange={(e) => onFilterChange({ status: e.target.value as ChannelStatus | 'all' })}
                        options={statusOptions}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Other</label>
                        <div className="mt-1 flex items-center justify-between bg-white dark:bg-gray-700/80 p-2 rounded-md border border-gray-300 dark:border-gray-600">
                           <span className="text-sm text-gray-800 dark:text-gray-200 ml-1">Show only muted</span>
                           <ToggleButton enabled={filters.muted} onChange={() => onFilterChange({ muted: !filters.muted })} />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => { onClearFilters(); }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};