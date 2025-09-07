import React from 'react';
import { ChannelType } from '../types';

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const SlackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.522h5.042a2.527 2.527 0 0 1 0 5.042H8.834a2.528 2.528 0 0 1-2.521-2.52zM8.834 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 13.876 5.04a2.527 2.527 0 0 1-2.52 2.522v-2.52zM8.834 6.313a2.527 2.527 0 0 1-2.52 2.521v5.042a2.527 2.527 0 0 1 5.042 0V8.834a2.528 2.528 0 0 1-2.522-2.521zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.52A2.528 2.528 0 0 1 24 8.834a2.527 2.527 0 0 1-2.522 2.52h-2.522V8.834zM17.688 8.834a2.527 2.527 0 0 1-2.523 2.522v-5.042a2.527 2.527 0 0 1 5.042 0v2.52h-2.519zM15.165 18.956a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 15.165 13.876a2.527 2.527 0 0 1 2.52 2.52v2.56zM15.165 17.688a2.527 2.527 0 0 1 2.52-2.523h-5.04a2.527 2.527 0 0 1 0-5.042h2.52a2.528 2.528 0 0 1 2.52 2.522v5.043z" />
    </svg>
);

const PagerDutyIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.16 2.83a.47.47 0 00-.67 0l-5.74 5.75-1.12 3.86a.48.48 0 00.12.5.47.47 0 00.5.12l3.86-1.12 5.75-5.75a.48.48 0 000-.67zm-4.14 3.73l.67.67L14 8.95l-.67-.68zM5.3 12.35l4.33 4.32a.48.48 0 00.68 0l4.32-4.32a6.1 6.1 0 10-9.33 0zm5.17 3.49l-3.33-3.32a4.46 4.46 0 016.3 0z" />
    </svg>
);

const WebhookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const SmsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 3h-11C5.12 3 4 4.12 4 5.5v13C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-13C20 4.12 18.88 3 17.5 3zM12 18h.01" />
    </svg>
);


interface ChannelIconProps {
  type: ChannelType;
}

export const ChannelIcon: React.FC<ChannelIconProps> = ({ type }) => {
  switch (type) {
    case ChannelType.EMAIL:
      return <EmailIcon />;
    case ChannelType.SLACK:
      return <SlackIcon />;
    case ChannelType.PAGERDUTY:
        return <PagerDutyIcon />;
    case ChannelType.WEBHOOK:
        return <WebhookIcon />;
    case ChannelType.SMS:
        return <SmsIcon />;
    default:
      return null;
  }
};
