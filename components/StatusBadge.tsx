import React from 'react';
import { ChannelStatus } from '../types';

interface StatusBadgeProps {
  status: ChannelStatus;
  mutedUntil?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, mutedUntil }) => {
  const isMuted = mutedUntil && new Date(mutedUntil) > new Date();

  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusConfig = {
    [ChannelStatus.OK]: {
      text: 'OK',
      classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      dotClasses: 'bg-green-500'
    },
    [ChannelStatus.PENDING]: {
      text: 'Pending',
      classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      dotClasses: 'bg-yellow-500'
    },
    [ChannelStatus.ERROR]: {
      text: 'Error',
      classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      dotClasses: 'bg-red-500'
    }
  };

  if (isMuted) {
      const mutedConfig = {
        text: 'Muted',
        classes: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        dotClasses: 'bg-purple-500'
      };
      const expiryTime = new Date(mutedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <span className={`${baseClasses} ${mutedConfig.classes} relative group`}>
           <span className={`w-2 h-2 mr-1.5 rounded-full ${mutedConfig.dotClasses}`}></span>
          {mutedConfig.text}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Muted until {expiryTime}
          </span>
        </span>
      );
  }

  const config = statusConfig[status];

  return (
    <span className={`${baseClasses} ${config.classes}`}>
       <span className={`w-2 h-2 mr-1.5 rounded-full ${config.dotClasses}`}></span>
      {config.text}
    </span>
  );
};
