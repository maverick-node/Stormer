import { create } from 'zustand';
import { storageUtils } from './utils/storage';

export const useStore = create((set, get) => ({
  // Request state
  method: 'GET',
  url: '',
  headers: [],
  body: '',
  bodyItems: [],
  bodyMode: 'raw', // 'raw' or 'form'
  params: [],
  auth: { type: 'none' },
  cookies: [],
  
  // Response state
  response: null,
  loading: false,
  
  // Collections & Requests
  collections: typeof window !== 'undefined' ? storageUtils.getCollections() : [],
  selectedCollection: null,
  requests: typeof window !== 'undefined' ? storageUtils.getRequests() : [],
  selectedRequest: null,
  autoSaveEnabled: true, // Auto-save feature
  lastSavedTime: null,
  
  // Environments
  environments: [],
  selectedEnvironment: null,
  
  // History
  history: [],
  
  // UI state
  activeTab: 'body',
  sidebarOpen: true,
  
  // Actions
  setMethod: (method) => set((state) => {
    const newState = { method };
    if (state.selectedRequest && state.autoSaveEnabled) {
      // Trigger auto-save
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setUrl: (url) => set((state) => {
    const newState = { url };
    
    // Auto-save existing request
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    
    // Auto-create request if entering URL for first time in a collection
    if (!state.selectedRequest && state.selectedCollection && url && state.autoSaveEnabled) {
      setTimeout(() => {
        const requestName = `${state.method} ${url.split('/').pop() || 'Request'}`;
        get().saveRequestToCollection(state.selectedCollection.id, requestName);
      }, 100);
    }
    
    return newState;
  }),
  setHeaders: (headers) => set((state) => {
    const newState = { headers };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setBody: (body) => set((state) => {
    const newState = { body };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setBodyItems: (bodyItems) => set((state) => {
    const newState = { bodyItems };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setBodyMode: (bodyMode) => set((state) => {
    const newState = { bodyMode };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setParams: (params) => set((state) => {
    const newState = { params };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setAuth: (auth) => set((state) => {
    const newState = { auth };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setCookies: (cookies) => set((state) => {
    const newState = { cookies };
    if (state.selectedRequest && state.autoSaveEnabled) {
      setTimeout(() => get().autoSaveCurrentRequest?.(), 100);
    }
    return newState;
  }),
  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ loading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  addHeader: () => set((state) => ({
    headers: [...state.headers, { key: '', value: '', enabled: true }]
  })),
  
  updateHeader: (index, field, value) => set((state) => {
    const headers = [...state.headers];
    headers[index] = { ...headers[index], [field]: value };
    return { headers };
  }),
  
  removeHeader: (index) => set((state) => ({
    headers: state.headers.filter((_, i) => i !== index)
  })),
  
  addParam: () => set((state) => ({
    params: [...state.params, { key: '', value: '', enabled: true }]
  })),
  
  updateParam: (index, field, value) => set((state) => {
    const params = [...state.params];
    params[index] = { ...params[index], [field]: value };
    return { params };
  }),
  
  removeParam: (index) => set((state) => ({
    params: state.params.filter((_, i) => i !== index)
  })),
  
  addCookie: () => set((state) => ({
    cookies: [...state.cookies, { key: '', value: '', enabled: true }]
  })),
  
  updateCookie: (index, field, value) => set((state) => {
    const cookies = [...state.cookies];
    cookies[index] = { ...cookies[index], [field]: value };
    return { cookies };
  }),
  
  removeCookie: (index) => set((state) => ({
    cookies: state.cookies.filter((_, i) => i !== index)
  })),
  
  addBodyItem: () => set((state) => ({
    bodyItems: [...state.bodyItems, { key: '', value: '', enabled: true }]
  })),
  
  updateBodyItem: (index, field, value) => set((state) => {
    const bodyItems = [...state.bodyItems];
    bodyItems[index] = { ...bodyItems[index], [field]: value };
    return { bodyItems };
  }),
  
  removeBodyItem: (index) => set((state) => ({
    bodyItems: state.bodyItems.filter((_, i) => i !== index)
  })),
  
  setCollections: (collections) => set((state) => {
    storageUtils.saveCollections(collections);
    return { collections };
  }),
  setSelectedCollection: (collection) => set({
    selectedCollection: collection,
    selectedRequest: null, // Clear the current request when switching collections
    // Reset form to defaults
    method: 'GET',
    url: '',
    headers: [],
    body: '',
    bodyItems: [],
    bodyMode: 'raw',
    params: [],
    auth: { type: 'none' },
    cookies: [],
  }),
  setRequests: (requests) => set({ requests }),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  
  // Save current request to collection
  saveRequestToCollection: (collectionId, requestName) => set((state) => {
    const newRequest = {
      id: `${collectionId}_${Date.now()}`, // Unique ID combining collection + timestamp
      collectionId, // Link to specific collection
      name: requestName,
      method: state.method,
      url: state.url,
      headers: [...state.headers], // Deep copy
      body: state.body,
      bodyItems: [...state.bodyItems], // Deep copy
      bodyMode: state.bodyMode,
      params: [...state.params], // Deep copy
      auth: { ...state.auth }, // Deep copy
      cookies: [...state.cookies], // Deep copy
      createdAt: new Date().toISOString(),
    };
    const newRequests = [...state.requests, newRequest];
    storageUtils.saveRequests(newRequests);
    return { requests: newRequests, selectedRequest: newRequest };
  }),
  
  // Load request from collection
  loadRequest: (requestId) => set((state) => {
    const request = state.requests.find(r => r.id === requestId);
    if (request) {
      return {
        method: request.method,
        url: request.url,
        headers: request.headers ? [...request.headers] : [],
        body: request.body,
        bodyItems: request.bodyItems ? [...request.bodyItems] : [],
        bodyMode: request.bodyMode,
        params: request.params ? [...request.params] : [],
        auth: request.auth ? { ...request.auth } : { type: 'none' },
        cookies: request.cookies ? [...request.cookies] : [],
        selectedRequest: request,
      };
    }
    return {};
  }),
  
  // Delete request from collection
  deleteRequest: (requestId) => set((state) => {
    const newRequests = state.requests.filter(r => r.id !== requestId);
    storageUtils.saveRequests(newRequests);
    return {
      requests: newRequests,
      selectedRequest: state.selectedRequest?.id === requestId ? null : state.selectedRequest,
    };
  }),
  
  // Update saved request
  updateSavedRequest: (requestId) => set((state) => {
    const requests = state.requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          method: state.method,
          url: state.url,
          headers: state.headers,
          body: state.body,
          bodyItems: state.bodyItems,
          bodyMode: state.bodyMode,
          params: state.params,
          auth: state.auth,
          cookies: state.cookies,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    storageUtils.saveRequests(requests);
    return { requests, lastSavedTime: new Date().toISOString() };
  }),
  
  // Auto-save current request
  autoSaveCurrentRequest: () => set((state) => {
    if (!state.selectedRequest || !state.selectedCollection) return {};
    
    // Only update requests from the current collection
    const requests = state.requests.map(r => {
      if (r.id === state.selectedRequest.id && r.collectionId === state.selectedCollection.id) {
        return {
          ...r,
          method: state.method,
          url: state.url,
          headers: [...state.headers], // Deep copy
          body: state.body,
          bodyItems: [...state.bodyItems], // Deep copy
          bodyMode: state.bodyMode,
          params: [...state.params], // Deep copy
          auth: { ...state.auth }, // Deep copy
          cookies: [...state.cookies], // Deep copy
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    
    // Save all requests to localStorage
    storageUtils.saveRequests(requests);
    
    return { 
      requests, 
      lastSavedTime: new Date().toISOString(),
      selectedRequest: requests.find(r => r.id === state.selectedRequest.id),
    };
  }),

  // Duplicate a request within the same collection
  duplicateRequest: (requestId, newName) => set((state) => {
    const requestToDuplicate = state.requests.find(r => r.id === requestId);
    if (!requestToDuplicate) return {};

    const newRequest = {
      id: `${requestToDuplicate.collectionId}_${Date.now()}`,
      collectionId: requestToDuplicate.collectionId,
      name: newName || `${requestToDuplicate.name} (Copy)`,
      method: requestToDuplicate.method,
      url: requestToDuplicate.url,
      headers: [...requestToDuplicate.headers],
      body: requestToDuplicate.body,
      bodyItems: [...requestToDuplicate.bodyItems],
      bodyMode: requestToDuplicate.bodyMode,
      params: [...requestToDuplicate.params],
      auth: { ...requestToDuplicate.auth },
      cookies: [...requestToDuplicate.cookies],
      createdAt: new Date().toISOString(),
    };

    const newRequests = [...state.requests, newRequest];
    storageUtils.saveRequests(newRequests);
    return { requests: newRequests };
  }),

  // Rename a request
  renameRequest: (requestId, newName) => set((state) => {
    const requests = state.requests.map(r => {
      if (r.id === requestId) {
        return { ...r, name: newName };
      }
      return r;
    });
    storageUtils.saveRequests(requests);
    return { 
      requests,
      selectedRequest: state.selectedRequest?.id === requestId 
        ? requests.find(r => r.id === requestId)
        : state.selectedRequest,
    };
  }),
  
  setEnvironments: (environments) => set({ environments }),
  setSelectedEnvironment: (environment) => set({ selectedEnvironment: environment }),
  
  setHistory: (history) => set({ history }),
  addToHistory: (item) => set((state) => ({
    history: [item, ...state.history].slice(0, 50)
  })),
}));
