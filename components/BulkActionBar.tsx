import React from 'react';

interface BulkActionBarProps {
  selectedCount: number;
  onEnable: () => void;
  onDisable: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        {...props}
        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onEnable, onDisable, onDelete, onClearSelection }) => {
    return (
        <div className="flex items-center justify-between w-full h-[38px]">
            <div className="flex items-center gap-4">
                 <button onClick={onClearSelection} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="sr-only">Clear selection</span>
                </button>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedCount} selected</span>
            </div>
            <div className="flex items-center space-x-2">
                <ActionButton onClick={onEnable}>Enable</ActionButton>
                <ActionButton onClick={onDisable}>Disable</ActionButton>
                <ActionButton onClick={onDelete} className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                    Delete
                </ActionButton>
            </div>
        </div>
    );
};