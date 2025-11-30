import { motion } from 'framer-motion';
import { FiFolder, FiClock, FiDatabase, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useStore } from '../store';
import api from '../api';

const Sidebar = ({ isMobile, width = 320 }) => {
  const [activeSection, setActiveSection] = useState('collections');
  const { 
    collections, 
    setCollections, 
    history, 
    setHistory,
    requests,
    loadRequest,
    deleteRequest,
    setSidebarOpen,
    selectedCollection,
    setSelectedCollection
  } = useStore();

  useEffect(() => {
    fetchCollections();
    fetchHistory();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      setCollections(res.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const createCollection = async () => {
    const name = prompt('Collection name:');
    if (!name) return;

    try {
      const res = await api.post('/collections', { name });
      setCollections([...collections, res.data]);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 20 }}
      className={`${
        isMobile 
          ? 'fixed inset-y-0 left-0 z-30 w-72' 
          : ''
      } glass border-r border-gray-800 flex flex-col`}
      style={!isMobile ? { width: `${width}px`, flexShrink: 0 } : {}}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'collections', icon: FiFolder, label: 'Collections' },
          { id: 'history', icon: FiClock, label: 'History' },
          { id: 'environments', icon: FiDatabase, label: 'Environments' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-colors ${
              activeSection === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs md:text-sm">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'collections' && (
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createCollection}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Collection</span>
            </motion.button>

            {collections.map((collection) => {
              const collectionRequests = requests.filter(r => r.collectionId === collection.id);
              const isSelected = selectedCollection?.id === collection.id;
              const hasRequests = collectionRequests.length > 0;

              return (
                <motion.button
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCollection(collection);
                    // Automatically load first request from this collection
                    if (hasRequests) {
                      loadRequest(collectionRequests[0].id);
                    }
                    isMobile && setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                    isSelected
                      ? 'bg-primary/30 border-primary/50 text-primary'
                      : 'bg-white/5 border-transparent hover:border-primary/30 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <FiFolder className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{collection.name}</p>
                      <span className="text-xs text-gray-400">
                        {collectionRequests.length} request{collectionRequests.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {activeSection === 'history' && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No history yet
              </p>
            ) : (
              history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer border border-transparent hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-1 rounded border method-${item.method.toLowerCase()}`}>
                      {item.method}
                    </span>
                    <span className="text-xs text-gray-400">{item.time}ms</span>
                  </div>
                  <p className="text-xs text-gray-300 truncate">{item.url}</p>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeSection === 'environments' && (
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Environment</span>
            </motion.button>
            <p className="text-gray-400 text-sm text-center py-8">
              No environments yet
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
