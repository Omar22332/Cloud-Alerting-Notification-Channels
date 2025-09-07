import React from 'react';

interface ToggleButtonProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ enabled, onChange, disabled = false }) => {
  const baseClasses = "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-blue-500";
  const stateClasses = enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600';
  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      disabled={disabled}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      />
    </button>
  );
};