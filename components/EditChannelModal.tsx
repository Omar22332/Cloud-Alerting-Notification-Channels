import React, { useState, useEffect, useRef } from 'react';
import { ChannelType, NotificationChannel } from '../types';
import { ToggleButton } from './ToggleButton';

interface EditChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: NotificationChannel) => void;
  channel: NotificationChannel | null;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
        {props.children}
    </select>
);

export const EditChannelModal: React.FC<EditChannelModalProps> = ({ isOpen, onClose, onSave, channel }) => {
  const [displayName, setDisplayName] = useState('');
  const [type, setType] = useState<ChannelType>(ChannelType.EMAIL);
  const [labels, setLabels] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (channel) {
        setDisplayName(channel.displayName);
        setType(channel.type);
        setLabels(channel.labels.length > 0 ? [...channel.labels] : [{ key: '', value: '' }]);
        setEnabled(channel.enabled);
        setError('');
    }
  }, [channel]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    if (!channel) return;
    
    const filteredLabels = labels.filter(l => l.key.trim() && l.value.trim());
    onSave({ 
        ...channel,
        displayName, 
        type, 
        labels: filteredLabels, 
        enabled 
    });
  };

  const handleLabelChange = (index: number, field: 'key' | 'value', value: string) => {
    const newLabels = [...labels];
    newLabels[index][field] = value;
    setLabels(newLabels);
  };

  const addLabel = () => {
    setLabels([...labels, { key: '', value: '' }]);
  };

  const removeLabel = (index: number) => {
    const newLabels = labels.filter((_, i) => i !== index);
    if (newLabels.length === 0) {
      setLabels([{key: '', value: ''}]);
    } else {
      setLabels(newLabels);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">Edit Notification Channel</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name *</label>
              <FormInput
                id="edit-displayName"
                type="text"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
                required
              />
               {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div>
              <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <FormSelect
                id="edit-type"
                value={type}
                onChange={(e) => setType(e.target.value as ChannelType)}
              >
                {Object.values(ChannelType).map(channelType => (
                  <option key={channelType} value={channelType}>{channelType}</option>
                ))}
              </FormSelect>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Labels</label>
              <div className="space-y-2">
                {labels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FormInput
                      type="text"
                      placeholder="Key"
                      value={label.key}
                      onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
                    />
                    <FormInput
                      type="text"
                      placeholder="Value"
                      value={label.value}
                      onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
                    />
                    <button onClick={() => removeLabel(index)} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Remove label">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addLabel} className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">+ Add Label</button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enabled</span>
              <ToggleButton enabled={enabled} onChange={() => setEnabled(!enabled)} />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-2 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};