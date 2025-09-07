import React from 'react';
import { SunIcon, MoonIcon, SparklesIcon } from './IconComponents';

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 17.5L20 20" />
    </svg>
);

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

interface HeaderProps {
    onAddNew: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onOpenAIAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNew, theme, onToggleTheme, onOpenAIAssistant }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notification channels</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage how and when you are notified about alerts.</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button
                    onClick={onToggleTheme}
                    className="flex items-center justify-center h-10 w-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <RefreshIcon />
                    Refresh
                </button>
                <button onClick={onAddNew} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <AddIcon />
                    Add New
                </button>
                 <button onClick={onOpenAIAssistant} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                    <SparklesIcon />
                    AI Assistant
                </button>
            </div>
        </div>
    );
};