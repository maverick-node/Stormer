import { create } from 'zustand';

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
  
  // Collections
  collections: [],
  selectedCollection: null,
  
  // Environments
  environments: [],
  selectedEnvironment: null,
  
  // History
  history: [],
  
  // UI state
  activeTab: 'body',
  sidebarOpen: true,
  
  // Actions
  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setBody: (body) => set({ body }),
  setBodyItems: (bodyItems) => set({ bodyItems }),
  setBodyMode: (bodyMode) => set({ bodyMode }),
  setParams: (params) => set({ params }),
  setAuth: (auth) => set({ auth }),
  setCookies: (cookies) => set({ cookies }),
  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ loading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
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
  
  setCollections: (collections) => set({ collections }),
  setSelectedCollection: (collection) => set({ selectedCollection: collection }),
  
  setEnvironments: (environments) => set({ environments }),
  setSelectedEnvironment: (environment) => set({ selectedEnvironment: environment }),
  
  setHistory: (history) => set({ history }),
  addToHistory: (item) => set((state) => ({
    history: [item, ...state.history].slice(0, 50)
  })),
}));
