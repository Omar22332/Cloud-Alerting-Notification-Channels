import React, { useMemo } from 'react';
import { NotificationChannel } from '../types';
import { ChannelTableRow } from './ChannelTableRow';
import { SortIcon } from './IconComponents';

type SortableKeys = 'displayName' | 'type' | 'status';
interface SortConfig {
  key: SortableKeys;
  direction: 'ascending' | 'descending';
}

interface ChannelTableProps {
  channels: NotificationChannel[];
  allFilteredChannels: NotificationChannel[];
  selectedChannelIds: string[];
  testingChannelId: string | null;
  sortConfig: SortConfig;
  onToggle: (id: string) => void;
  onDelete: (channel: NotificationChannel) => void;
  onEdit: (channel: NotificationChannel) => void;
  onClone: (channel: NotificationChannel) => void;
  onSendTest: (channel: NotificationChannel) => void;
  onMute: (channel: NotificationChannel) => void;
  onUnmute: (channelId: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onSort: (key: SortableKeys) => void;
}

const SortableHeader: React.FC<{
  columnKey: SortableKeys;
  title: string;
  onSort: (key: SortableKeys) => void;
  sortConfig: SortConfig;
}> = ({ columnKey, title, onSort, sortConfig }) => (
  <th 
    scope="col" 
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
    onClick={() => onSort(columnKey)}
  >
    <div className="flex items-center">
      <span>{title}</span>
      <SortIcon 
        isSorted={sortConfig.key === columnKey} 
        direction={sortConfig.direction} 
      />
    </div>
  </th>
);


export const ChannelTable: React.FC<ChannelTableProps> = ({ 
  channels, 
  allFilteredChannels,
  selectedChannelIds, 
  testingChannelId,
  onToggle, 
  onDelete, 
  onEdit,
  onClone, 
  onSendTest,
  onMute,
  onUnmute,
  onSelect, 
  onSelectAll, 
  sortConfig, 
  onSort 
}) => {
  
  const selectedCount = selectedChannelIds.length;
  const isAllSelected = allFilteredChannels.length > 0 && selectedCount === allFilteredChannels.length;
  const isIndeterminate = selectedCount > 0 && !isAllSelected;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                checked={isAllSelected}
                ref={input => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label="Select all channels"
                disabled={allFilteredChannels.length === 0}
              />
            </th>
            <SortableHeader columnKey="displayName" title="Display Name" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="type" title="Type" onSort={onSort} sortConfig={sortConfig} />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Labels
            </th>
            <SortableHeader columnKey="status" title="Status" onSort={onSort} sortConfig={sortConfig} />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Enabled
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {channels.length > 0 ? (
            channels.map(channel => (
              <ChannelTableRow 
                key={channel.id} 
                channel={channel} 
                isSelected={selectedChannelIds.includes(channel.id)}
                isTesting={testingChannelId === channel.id}
                onToggle={onToggle} 
                onDelete={onDelete} 
                onEdit={onEdit}
                onClone={onClone}
                onSendTest={onSendTest}
                onMute={onMute}
                onUnmute={onUnmute}
                onSelect={onSelect} 
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No notification channels match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};