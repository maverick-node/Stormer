/**
 * Local storage utilities for persisting requests and collections
 */

const STORAGE_KEYS = {
  COLLECTIONS: 'stormer_collections',
  REQUESTS: 'stormer_requests',
};

export const storageUtils = {
  // Collections
  saveCollections: (collections) => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (error) {
      console.error('Error saving collections:', error);
    }
  },

  getCollections: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading collections:', error);
      return [];
    }
  },

  // Requests
  saveRequests: (requests) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving requests:', error);
    }
  },

  getRequests: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading requests:', error);
      return [];
    }
  },

  // Clear all
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
