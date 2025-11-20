const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage (replace with database in production)
let collections = [];
let environments = [];
let history = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stormer API is running' });
});

// Execute API request
app.post('/api/execute', async (req, res) => {
  const { method, url, headers, body, params, cookies, auth } = req.body;
  
  console.log('Execute request received:', { method, url });
  
  try {
    const startTime = Date.now();
    
    // Ensure URL has a protocol
    let fullUrl = url;
    if (url && !url.match(/^https?:\/\//)) {
      fullUrl = `http://${url}`;
      console.log('Added http:// protocol to URL:', fullUrl);
    }
    
    // Build headers object
    const requestHeaders = { ...headers } || {};
    
    // Add cookies as Cookie header
    if (cookies && Object.keys(cookies).length > 0) {
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
      requestHeaders['Cookie'] = cookieString;
      console.log('Added cookies:', cookieString);
    }
    
    // Add authentication headers
    if (auth && auth.type !== 'none') {
      if (auth.type === 'bearer' && auth.token) {
        requestHeaders['Authorization'] = `Bearer ${auth.token}`;
        console.log('Added Bearer token authentication');
      } else if (auth.type === 'basic' && auth.username && auth.password) {
        const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
        requestHeaders['Authorization'] = `Basic ${credentials}`;
        console.log('Added Basic authentication');
      }
    }
    
    // Add default Content-Type for JSON bodies if not set
    if (body && typeof body === 'object' && !requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    
    console.log('Request headers:', requestHeaders);
    console.log('Request params:', params);
    
    // Build axios config
    const config = {
      method: method.toLowerCase(),
      url: fullUrl,
      headers: requestHeaders,
      params: params || {},
      validateStatus: () => true // Don't throw on any status
    };

    // Add body for methods that support it
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
      config.data = body;
      console.log('Request body:', typeof body === 'object' ? JSON.stringify(body).substring(0, 100) : body);
    }

    // Execute request
    const response = await axios(config);
    const endTime = Date.now();
    
    console.log('Request successful:', response.status, (endTime - startTime) + 'ms');
    
    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      time: endTime - startTime,
      size: JSON.stringify(response.data).length,
      // Debug info (can be removed in production)
      requestInfo: {
        sentHeaders: requestHeaders,
        sentParams: params,
        sentCookies: cookies,
        sentBody: body ? (typeof body === 'object' ? '[Object]' : '[Data]') : null
      }
    };

    // Save to history
    const historyItem = {
      id: uuidv4(),
      method,
      url,
      timestamp: new Date().toISOString(),
      status: response.status,
      time: result.time
    };
    history.unshift(historyItem);
    if (history.length > 50) history.pop(); // Keep last 50 requests

    console.log('Request successful:', response.status, result.time + 'ms');
    res.json(result);
  } catch (error) {
    console.error('Execute request error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Collections CRUD
app.get('/api/collections', (req, res) => {
  res.json(collections);
});

app.post('/api/collections', (req, res) => {
  const collection = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description || '',
    requests: req.body.requests || [],
    createdAt: new Date().toISOString()
  };
  collections.push(collection);
  res.status(201).json(collection);
});

app.put('/api/collections/:id', (req, res) => {
  const index = collections.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  collections[index] = { ...collections[index], ...req.body, id: req.params.id };
  res.json(collections[index]);
});

app.delete('/api/collections/:id', (req, res) => {
  const index = collections.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  collections.splice(index, 1);
  res.status(204).send();
});

// Environments CRUD
app.get('/api/environments', (req, res) => {
  res.json(environments);
});

app.post('/api/environments', (req, res) => {
  const environment = {
    id: uuidv4(),
    name: req.body.name,
    variables: req.body.variables || {},
    createdAt: new Date().toISOString()
  };
  environments.push(environment);
  res.status(201).json(environment);
});

app.put('/api/environments/:id', (req, res) => {
  const index = environments.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Environment not found' });
  }
  environments[index] = { ...environments[index], ...req.body, id: req.params.id };
  res.json(environments[index]);
});

app.delete('/api/environments/:id', (req, res) => {
  const index = environments.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Environment not found' });
  }
  environments.splice(index, 1);
  res.status(204).send();
});

// History
app.get('/api/history', (req, res) => {
  res.json(history);
});

app.delete('/api/history', (req, res) => {
  history = [];
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stormer API Server running on http://localhost:${PORT}`);
});
