import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ChannelTable } from './components/ChannelTable';
import { NotificationChannel, ChannelStatus, ToastMessage, FilterState, ChannelType } from './types';
import { MOCK_CHANNELS } from './constants';
import { AddChannelModal } from './components/AddChannelModal';
import { EditChannelModal } from './components/EditChannelModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { BulkActionBar } from './components/BulkActionBar';
import { Pagination } from './components/Pagination';
import { ToastContainer } from './components/ToastContainer';
import { FilterBar } from './components/FilterBar';
import { AIAssistantModal, ChatMessage } from './components/AIAssistantModal';
import { processCommand } from './utils/aiProcessor';
import { MuteChannelModal } from './components/MuteChannelModal';
import { DashboardStats, StatType } from './components/DashboardStats';


type SortableKeys = 'displayName' | 'type' | 'status';
interface SortConfig {
  key: SortableKeys;
  direction: 'ascending' | 'descending';
}
type Theme = 'light' | 'dark';

const ITEMS_PER_PAGE = 7;
const initialFilters: FilterState = { type: 'all', status: 'all', muted: false };

function App() {
  const [channels, setChannels] = useState<NotificationChannel[]>(MOCK_CHANNELS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialAddModalData, setInitialAddModalData] = useState<Omit<NotificationChannel, 'id' | 'status'> | null>(null);
  const [editingChannel, setEditingChannel] = useState<NotificationChannel | null>(null);
  const [deletingChannels, setDeletingChannels] = useState<NotificationChannel[] | null>(null);
  const [mutingChannel, setMutingChannel] = useState<NotificationChannel | null>(null);
  const [testingChannelId, setTestingChannelId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'displayName', direction: 'ascending' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('theme', theme);
    }
  }, [theme]);
  
  // Effect to check for expired mutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let changed = false;
      const updatedChannels = channels.map(channel => {
        if (channel.mutedUntil && new Date(channel.mutedUntil) <= now) {
          changed = true;
          const { mutedUntil, ...rest } = channel;
          return rest;
        }
        return channel;
      });
      if (changed) {
        setChannels(updatedChannels);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [channels]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const openAddModal = () => {
    setInitialAddModalData(null);
    setIsAddModalOpen(true);
  }

  const handleAddChannel = (newChannelData: Omit<NotificationChannel, 'id' | 'status'>) => {
    const newChannel: NotificationChannel = {
      ...newChannelData,
      id: Date.now().toString(),
      status: ChannelStatus.PENDING,
    };
    setChannels(prev => [newChannel, ...prev]);
    setIsAddModalOpen(false);
    addToast('Notification channel created successfully.');
  };

  const handleUpdateChannel = (updatedChannel: NotificationChannel) => {
    setChannels(prev => prev.map(c => c.id === updatedChannel.id ? updatedChannel : c));
    setEditingChannel(null);
    addToast('Notification channel updated successfully.');
  };

  const handleCloneChannel = (channelToClone: NotificationChannel) => {
    const { id, status, ...rest } = channelToClone;
    setInitialAddModalData({
      ...rest,
      displayName: `Copy of ${channelToClone.displayName}`,
    });
    setIsAddModalOpen(true);
  };

  const handleToggle = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleConfirmDelete = () => {
    if (deletingChannels) {
      const idsToDelete = deletingChannels.map(c => c.id);
      setChannels(prev => prev.filter(c => !idsToDelete.includes(c.id)));
      setSelectedChannelIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      addToast(idsToDelete.length > 1 ? `${idsToDelete.length} channels deleted.` : 'Channel deleted successfully.');
    }
    setDeletingChannels(null);
  };
  
  const handleConfirmMute = (durationInMinutes: number) => {
    if (!mutingChannel) return;
    const mutedUntil = new Date(Date.now() + durationInMinutes * 60 * 1000).toISOString();
    setChannels(prev => 
        prev.map(c => c.id === mutingChannel.id ? { ...c, mutedUntil } : c)
    );
    addToast(`Channel "${mutingChannel.displayName}" muted.`);
    setMutingChannel(null);
  };

  const handleUnmute = (channelId: string) => {
     setChannels(prev =>
        prev.map(c => {
            if (c.id === channelId) {
                const { mutedUntil, ...rest } = c;
                return rest;
            }
            return c;
        })
    );
    addToast("Channel unmuted.");
  }


  const handleSendTest = async (channel: NotificationChannel) => {
    setTestingChannelId(channel.id);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
        addToast(`Test notification sent successfully to "${channel.displayName}".`);
    } else {
        addToast(`Failed to send test notification to "${channel.displayName}".`, 'error');
    }
    setTestingChannelId(null);
  };
  
  const handleSelect = (id: string, isSelected: boolean) => {
    setSelectedChannelIds(prev => isSelected ? [...prev, id] : prev.filter(channelId => channelId !== id));
  };

  const sortedAndFilteredChannels = useMemo(() => {
    let filtered = channels.filter(channel => 
      channel.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.labels.some(l => `${l.key}:${l.value}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filters.type !== 'all') {
      filtered = filtered.filter(channel => channel.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(channel => channel.status === filters.status);
    }
    
    if (filters.muted) {
        filtered = filtered.filter(channel => channel.mutedUntil && new Date(channel.mutedUntil) > new Date());
    }


    const sorted = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    return sorted;
  }, [channels, searchTerm, sortConfig, filters]);


  const handleSelectAll = (isSelected: boolean) => {
    setSelectedChannelIds(isSelected ? sortedAndFilteredChannels.map(c => c.id) : []);
  };


  const paginatedChannels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAndFilteredChannels, currentPage]);

  const handleSort = (key: SortableKeys) => {
    setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleBulkEnable = () => {
    setChannels(prev => prev.map(c => selectedChannelIds.includes(c.id) ? { ...c, enabled: true } : c));
    addToast(`${selectedChannelIds.length} channels enabled.`);
    setSelectedChannelIds([]);
  };

  const handleBulkDisable = () => {
    setChannels(prev => prev.map(c => selectedChannelIds.includes(c.id) ? { ...c, enabled: false } : c));
    addToast(`${selectedChannelIds.length} channels disabled.`);
    setSelectedChannelIds([]);
  };

  const handleBulkDelete = () => {
    const channelsToDelete = channels.filter(c => selectedChannelIds.includes(c.id));
    setDeletingChannels(channelsToDelete);
  };

  const onFilterChange = (newFilters: Partial<FilterState>) => {
    setCurrentPage(1);
    setFilters(prev => ({...prev, ...newFilters}));
  }

  const onClearFilters = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setFilters(initialFilters);
  }

  const activeFilterCount = useMemo(() => {
      let count = 0;
      if (filters.type !== 'all') count++;
      if (filters.status !== 'all') count++;
      if (filters.muted) count++;
      return count;
  }, [filters]);

  const dashboardStats = useMemo(() => {
    return {
        total: sortedAndFilteredChannels.length,
        ok: sortedAndFilteredChannels.filter(c => c.status === ChannelStatus.OK && !(c.mutedUntil && new Date(c.mutedUntil) > new Date())).length,
        error: sortedAndFilteredChannels.filter(c => c.status === ChannelStatus.ERROR).length,
        muted: sortedAndFilteredChannels.filter(c => c.mutedUntil && new Date(c.mutedUntil) > new Date()).length
    };
  }, [sortedAndFilteredChannels]);

  const handleStatClick = (statType: StatType) => {
      setIsFilterPanelOpen(true);
      if (statType === 'total') {
          onFilterChange({ status: 'all', muted: false, type: filters.type });
          setIsFilterPanelOpen(false); // Don't open for total
      } else if (statType === 'ok') {
          onFilterChange({ status: ChannelStatus.OK, muted: false, type: filters.type });
      } else if (statType === 'error') {
          onFilterChange({ status: ChannelStatus.ERROR, muted: false, type: filters.type });
      } else if (statType === 'muted') {
          onFilterChange({ status: 'all', muted: true, type: filters.type });
      }
  };


  useEffect(() => {
    const totalPages = Math.ceil(sortedAndFilteredChannels.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (sortedAndFilteredChannels.length === 0) {
      setCurrentPage(1);
    }
  }, [sortedAndFilteredChannels.length, currentPage]);

  const handleAISubmit = async (prompt: string): Promise<ChatMessage> => {
    try {
      const command = await processCommand(prompt);
      
      let targetChannels: NotificationChannel[] = [];
      if (command.target) {
        targetChannels = channels.filter(c => {
          let match = true;
          if (command.target?.displayName && !c.displayName.toLowerCase().includes(command.target.displayName.toLowerCase())) {
            match = false;
          }
          if (command.target?.type && c.type !== command.target.type) {
            match = false;
          }
          if (command.target?.status && c.status !== command.target.status) {
            match = false;
          }
          if (command.target?.label) {
            const labelMatch = c.labels.some(l => l.key === command.target.label?.key && l.value === command.target.label?.value);
            if (!labelMatch) match = false;
          }
          return match;
        });
      }

      switch (command.action) {
        case 'FILTER':
          setSearchTerm(command.target?.displayName || '');
          setFilters({
            type: command.target?.type || 'all',
            status: command.target?.status || 'all',
            muted: false,
          });
          break;
        case 'ENABLE':
          setChannels(prev => prev.map(c => targetChannels.some(tc => tc.id === c.id) ? { ...c, enabled: true } : c));
          break;
        case 'DISABLE':
           setChannels(prev => prev.map(c => targetChannels.some(tc => tc.id === c.id) ? { ...c, enabled: false } : c));
          break;
        case 'DELETE':
          if (targetChannels.length > 0) {
            setDeletingChannels(targetChannels);
          }
          break;
      }
      return { sender: 'ai', text: command.confirmationMessage || "I'm not sure how to respond to that." };
    } catch (error) {
      console.error("AI processing error:", error);
      addToast("An error occurred with the AI assistant.", "error");
      return { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
    }
  };


  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <Header onAddNew={openAddModal} onToggleTheme={toggleTheme} theme={theme} onOpenAIAssistant={() => setIsAIAssistantOpen(true)}/>
          
          <DashboardStats stats={dashboardStats} onStatClick={handleStatClick} />

          <main className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {selectedChannelIds.length > 0 ? (
                    <BulkActionBar 
                        selectedCount={selectedChannelIds.length}
                        onEnable={handleBulkEnable}
                        onDisable={handleBulkDisable}
                        onDelete={handleBulkDelete}
                        onClearSelection={() => setSelectedChannelIds([])}
                    />
                ) : (
                    <FilterBar
                      searchTerm={searchTerm}
                      onSearchTermChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      filters={filters}
                      onFilterChange={onFilterChange}
                      onClearFilters={onClearFilters}
                      activeFilterCount={activeFilterCount}
                      isPanelOpen={isFilterPanelOpen}
                      onTogglePanel={() => setIsFilterPanelOpen(prev => !prev)}
                    />
                )}
            </div>
            <ChannelTable
              channels={paginatedChannels}
              allFilteredChannels={sortedAndFilteredChannels}
              selectedChannelIds={selectedChannelIds}
              testingChannelId={testingChannelId}
              onToggle={handleToggle}
              onDelete={(channel) => setDeletingChannels([channel])}
              onEdit={setEditingChannel}
              onClone={handleCloneChannel}
              onSendTest={handleSendTest}
              onMute={setMutingChannel}
              onUnmute={handleUnmute}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
             {sortedAndFilteredChannels.length > 0 && paginatedChannels.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={sortedAndFilteredChannels.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </main>
        </div>

        <AddChannelModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddChannel}
          initialData={initialAddModalData} 
        />
        <EditChannelModal
          isOpen={!!editingChannel}
          onClose={() => setEditingChannel(null)}
          onSave={handleUpdateChannel}
          channel={editingChannel}
        />
        <DeleteConfirmationModal
          isOpen={!!deletingChannels}
          onClose={() => setDeletingChannels(null)}
          onConfirm={handleConfirmDelete}
          channels={deletingChannels}
        />
         <MuteChannelModal
          isOpen={!!mutingChannel}
          onClose={() => setMutingChannel(null)}
          onConfirm={handleConfirmMute}
          channel={mutingChannel}
        />
        <AIAssistantModal 
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          onSubmit={handleAISubmit}
        />
      </div>
    </>
  );
}

export default App;