import React from 'react';
import { TotalIcon, CheckCircleIcon, ErrorIcon, MuteIcon } from './IconComponents';

interface DashboardStatsData {
    total: number;
    ok: number;
    error: number;
    muted: number;
}

export type StatType = 'total' | 'ok' | 'error' | 'muted';

interface DashboardStatsProps {
  stats: DashboardStatsData;
  onStatClick: (statType: StatType) => void;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClasses: string;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClasses, onClick }) => (
    <button onClick={onClick} className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div className={`p-3 rounded-full ${colorClasses}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </button>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onStatClick }) => {
    return (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                title="Total Channels"
                value={stats.total}
                icon={<TotalIcon />}
                colorClasses="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                onClick={() => onStatClick('total')}
            />
            <StatCard 
                title="OK"
                value={stats.ok}
                icon={<CheckCircleIcon />}
                colorClasses="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
                onClick={() => onStatClick('ok')}
            />
             <StatCard 
                title="Errors"
                value={stats.error}
                icon={<ErrorIcon />}
                colorClasses="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
                onClick={() => onStatClick('error')}
            />
             <StatCard 
                title="Muted"
                value={stats.muted}
                icon={<MuteIcon />}
                colorClasses="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                onClick={() => onStatClick('muted')}
            />
        </div>
    );
};
