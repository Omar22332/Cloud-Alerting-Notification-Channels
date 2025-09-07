import React, { useState, useEffect, useRef } from 'react';
import { NotificationChannel } from '../types';
import { MuteIcon } from './IconComponents';

interface MuteChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (durationInMinutes: number) => void;
  channel: NotificationChannel | null;
}

const durationOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '4 hours', value: 240 },
    { label: 'Until tomorrow (9am)', value: -1 }, // Special value
];


export const MuteChannelModal: React.FC<MuteChannelModalProps> = ({ isOpen, onClose, onConfirm, channel }) => {
    const [selectedDuration, setSelectedDuration] = useState<number>(30);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Reset to default duration when modal opens
            setSelectedDuration(30);
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const handleConfirm = () => {
        let duration = selectedDuration;
        if (duration === -1) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            duration = (tomorrow.getTime() - now.getTime()) / (1000 * 60);
        }
        onConfirm(duration);
    }


    if (!isOpen || !channel) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 sm:mx-0 sm:h-10 sm:w-10">
                           <MuteIcon />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                Mute Notification Channel
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                   Mute notifications from <span className="font-semibold">{channel.displayName}</span> for a specified period.
                                </p>
                            </div>
                             <div className="mt-4">
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                                <select 
                                    id="duration"
                                    value={selectedDuration}
                                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {durationOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 sm:w-auto sm:text-sm"
                    >
                        Mute Channel
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
