import React, { useState, useRef, useEffect } from 'react';
import { NotificationChannel } from '../types';
import { ChannelIcon } from './ChannelIcon';
import { StatusBadge } from './StatusBadge';
import { ToggleButton } from './ToggleButton';
import { MoreVertIcon, EditIcon, DeleteIcon, SendIcon, SpinnerIcon, MuteIcon, UnmuteIcon, CloneIcon } from './IconComponents';

interface ChannelTableRowProps {
  channel: NotificationChannel;
  isSelected: boolean;
  isTesting: boolean;
  onToggle: (id: string) => void;
  onDelete: (channel: NotificationChannel) => void;
  onEdit: (channel: NotificationChannel) => void;
  onClone: (channel: NotificationChannel) => void;
  onSendTest: (channel: NotificationChannel) => void;
  onMute: (channel: NotificationChannel) => void;
  onUnmute: (channelId: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
}

export const ChannelTableRow: React.FC<ChannelTableRowProps> = ({ 
    channel, 
    isSelected, 
    isTesting, 
    onToggle, 
    onDelete, 
    onEdit,
    onClone,
    onSendTest, 
    onMute,
    onUnmute,
    onSelect 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isMuted = channel.mutedUntil && new Date(channel.mutedUntil) > new Date();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const rowClasses = [
        "transition-colors",
        isSelected 
            ? "bg-blue-50 dark:bg-blue-900/50" 
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        isTesting ? "opacity-50 pointer-events-none" : "",
        isMuted ? "bg-gray-50 dark:bg-gray-800/50" : ""
    ].join(' ');


    return (
        <tr className={rowClasses}>
            <td className="px-6 py-4 whitespace-nowrap">
                <input 
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                    checked={isSelected}
                    onChange={(e) => onSelect(channel.id, e.target.checked)}
                    aria-label={`Select channel ${channel.displayName}`}
                    disabled={isTesting}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6">
                        <ChannelIcon type={channel.type} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{channel.displayName}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{channel.type}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                {channel.labels.map((label, index) => (
                    <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                    {label.key}:{label.value}
                    </span>
                ))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={channel.status} mutedUntil={channel.mutedUntil} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <ToggleButton enabled={channel.enabled} onChange={() => onToggle(channel.id)} disabled={isTesting || isMuted} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block text-left" ref={menuRef}>
                    {isTesting ? (
                        <div className="p-2">
                           <SpinnerIcon />
                        </div>
                    ) : (
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500" disabled={isSelected}>
                           <MoreVertIcon />
                        </button>
                    )}
                    {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {isMuted ? (
                                     <button onClick={() => { onUnmute(channel.id); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                        <UnmuteIcon />
                                        Unmute
                                    </button>
                                ) : (
                                    <>
                                    <button onClick={() => { onMute(channel); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                        <MuteIcon />
                                        Mute
                                    </button>
                                    <button onClick={() => { onSendTest(channel); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" disabled={isMuted}>
                                        <SendIcon />
                                        Send Test
                                    </button>
                                    </>
                                )}
                                <button onClick={() => { onEdit(channel); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                    <EditIcon />
                                    Edit
                                </button>
                                 <button onClick={() => { onClone(channel); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                    <CloneIcon />
                                    Clone
                                </button>
                                <button onClick={() => { onDelete(channel); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                                   <DeleteIcon />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};