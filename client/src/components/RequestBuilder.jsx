import { motion } from 'framer-motion';
import { FiSend, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import { useStore } from '../store';
import api from '../api';

const RequestBuilder = () => {
  const {
    method,
    setMethod,
    url,
    setUrl,
    headers,
    body,
    setBody,
    bodyItems,
    bodyMode,
    setBodyMode,
    params,
    auth,
    setAuth,
    cookies,
    activeTab,
    setActiveTab,
    setResponse,
    setLoading,
    addHeader,
    updateHeader,
    removeHeader,
    addParam,
    updateParam,
    removeParam,
    addCookie,
    updateCookie,
    removeCookie,
    addBodyItem,
    updateBodyItem,
    removeBodyItem,
    addToHistory,
  } = useStore();

  const [methodDropdown, setMethodDropdown] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const handleSendRequest = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const enabledHeaders = headers
        .filter(h => h.enabled)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const enabledParams = params
        .filter(p => p.enabled)
        .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});

      const enabledCookies = cookies
        .filter(c => c.enabled)
        .reduce((acc, c) => ({ ...acc, [c.key]: c.value }), {});

      let parsedBody = body;
      
      // If in form mode, use bodyItems
      if (bodyMode === 'form') {
        parsedBody = bodyItems
          .filter(item => item.enabled)
          .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
      } else {
        // Raw mode - try to parse as JSON
        try {
          parsedBody = body ? JSON.parse(body) : null;
        } catch (e) {
          parsedBody = body;
        }
      }

      const response = await api.post('/execute', {
        method,
        url,
        headers: enabledHeaders,
        body: parsedBody,
        params: enabledParams,
        cookies: enabledCookies,
        auth: auth.type !== 'none' ? auth : null,
      });

      setResponse(response.data);
      addToHistory({
        id: Date.now().toString(),
        method,
        url,
        timestamp: new Date().toISOString(),
        status: response.data.status,
        time: response.data.time,
      });
    } catch (error) {
      setResponse({
        error: true,
        message: error.message,
        details: error.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-3 md:p-6 space-y-3 md:space-y-4">
      {/* URL Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
      >
        {/* Method Dropdown */}
        <div className="relative sm:w-auto w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMethodDropdown(!methodDropdown)}
            className="w-full sm:w-auto px-4 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg flex items-center justify-between sm:justify-start space-x-2 sm:min-w-[120px] transition-colors"
          >
            <span className={`text-sm font-semibold method-${method.toLowerCase()}`}>
              {method}
            </span>
            <FiChevronDown className="w-4 h-4" />
          </motion.button>

          {methodDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-2 w-full glass border border-gray-700 rounded-lg overflow-hidden z-10"
            >
              {methods.map((m) => (
                <motion.button
                  key={m}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => {
                    setMethod(m);
                    setMethodDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors method-${m.toLowerCase()}`}
                >
                  {m}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* URL Input */}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
          placeholder="https://api.example.com"
          className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors placeholder-gray-500 text-sm"
        />

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendRequest}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
        >
          <FiSend className="w-4 h-4" />
          <span>Send</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-800 overflow-x-auto">
        {['params', 'headers', 'cookies', 'body', 'auth'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 overflow-auto"
      >
        {activeTab === 'params' && (
          <ParamsTab
            params={params}
            addParam={addParam}
            updateParam={updateParam}
            removeParam={removeParam}
          />
        )}

        {activeTab === 'headers' && (
          <HeadersTab
            headers={headers}
            addHeader={addHeader}
            updateHeader={updateHeader}
            removeHeader={removeHeader}
          />
        )}

        {activeTab === 'cookies' && (
          <CookiesTab
            cookies={cookies}
            addCookie={addCookie}
            updateCookie={updateCookie}
            removeCookie={removeCookie}
          />
        )}

        {activeTab === 'body' && (
          <BodyTab 
            body={body} 
            setBody={setBody}
            bodyItems={bodyItems}
            bodyMode={bodyMode}
            setBodyMode={setBodyMode}
            addBodyItem={addBodyItem}
            updateBodyItem={updateBodyItem}
            removeBodyItem={removeBodyItem}
          />
        )}

        {activeTab === 'auth' && (
          <AuthTab auth={auth} setAuth={setAuth} />
        )}
      </motion.div>
    </div>
  );
};

const ParamsTab = ({ params, addParam, updateParam, removeParam }) => (
  <div className="space-y-2">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={addParam}
      className="w-full sm:w-auto px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-sm transition-colors"
    >
      Add Parameter
    </motion.button>

    {params.map((param, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="checkbox"
            checked={param.enabled}
            onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
            className="w-4 h-4"
          />
          <input
            type="text"
            value={param.key}
            onChange={(e) => updateParam(index, 'key', e.target.value)}
            placeholder="Key"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="text"
            value={param.value}
            onChange={(e) => updateParam(index, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeParam(index)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Remove
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>
);

const HeadersTab = ({ headers, addHeader, updateHeader, removeHeader }) => (
  <div className="space-y-2">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={addHeader}
      className="w-full sm:w-auto px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-sm transition-colors"
    >
      Add Header
    </motion.button>

    {headers.map((header, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="checkbox"
            checked={header.enabled}
            onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
            className="w-4 h-4"
          />
          <input
            type="text"
            value={header.key}
            onChange={(e) => updateHeader(index, 'key', e.target.value)}
            placeholder="Header"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="text"
            value={header.value}
            onChange={(e) => updateHeader(index, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeHeader(index)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Remove
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>
);

const CookiesTab = ({ cookies, addCookie, updateCookie, removeCookie }) => (
  <div className="space-y-2">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={addCookie}
      className="w-full sm:w-auto px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm transition-colors"
    >
      Add Cookie
    </motion.button>

    {cookies.length === 0 && (
      <p className="text-gray-400 text-sm py-4">
        No cookies added. Cookies will be sent as Cookie header.
      </p>
    )}

    {cookies.map((cookie, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="checkbox"
            checked={cookie.enabled}
            onChange={(e) => updateCookie(index, 'enabled', e.target.checked)}
            className="w-4 h-4"
          />
          <input
            type="text"
            value={cookie.key}
            onChange={(e) => updateCookie(index, 'key', e.target.value)}
            placeholder="Cookie Name"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 sm:flex-1">
          <input
            type="text"
            value={cookie.value}
            onChange={(e) => updateCookie(index, 'value', e.target.value)}
            placeholder="Cookie Value"
            className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeCookie(index)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Remove
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>
);

const BodyTab = ({ body, setBody, bodyItems, bodyMode, setBodyMode, addBodyItem, updateBodyItem, removeBodyItem }) => {
  const [jsonError, setJsonError] = useState('');

  const handleBodyChange = (value) => {
    setBody(value);
    
    // Validate JSON in real-time
    if (value.trim()) {
      try {
        JSON.parse(value);
        setJsonError('');
      } catch (e) {
        setJsonError(e.message);
      }
    } else {
      setJsonError('');
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (e) {
      setJsonError('Invalid JSON: ' + e.message);
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed));
      setJsonError('');
    } catch (e) {
      setJsonError('Invalid JSON: ' + e.message);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-2">
      {/* Mode Selector */}
      <div className="flex items-center space-x-2">
        <div className="flex bg-white/5 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setBodyMode('raw')}
            className={`px-4 py-2 text-sm transition-colors ${
              bodyMode === 'raw'
                ? 'bg-primary/30 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Raw JSON
          </button>
          <button
            onClick={() => setBodyMode('form')}
            className={`px-4 py-2 text-sm transition-colors ${
              bodyMode === 'form'
                ? 'bg-primary/30 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Form Data
          </button>
        </div>

        {bodyMode === 'raw' && body && (
          <div className="flex space-x-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={formatJSON}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-sm transition-colors"
            >
              Format
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={minifyJSON}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm transition-colors"
            >
              Minify
            </motion.button>
          </div>
        )}
      </div>

      {/* Raw JSON Editor */}
      {bodyMode === 'raw' && (
        <div className="flex-1 flex flex-col space-y-2">
          <textarea
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder='{\n  "key": "value"\n}'
            className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary resize-none font-mono text-sm"
            style={{ minHeight: '200px' }}
          />
          {jsonError && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
              ⚠️ {jsonError}
            </div>
          )}
          {!jsonError && body && (
            <div className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs">
              ✓ Valid JSON
            </div>
          )}
        </div>
      )}

      {/* Form Data Editor */}
      {bodyMode === 'form' && (
        <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addBodyItem}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-sm transition-colors"
          >
            Add Field
          </motion.button>

          {bodyItems.length === 0 && (
            <p className="text-gray-400 text-sm py-4">
              No fields added. Add key-value pairs for your request body.
            </p>
          )}

          {bodyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => updateBodyItem(index, 'enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <input
                type="text"
                value={item.key}
                onChange={(e) => updateBodyItem(index, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateBodyItem(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeBodyItem(index)}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm transition-colors"
              >
                Remove
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const AuthTab = ({ auth, setAuth }) => {
  const [authType, setAuthType] = useState(auth.type || 'none');

  const handleTypeChange = (type) => {
    setAuthType(type);
    setAuth({ type });
  };

  return (
    <div className="space-y-4">
      <select
        value={authType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
      >
        <option value="none">No Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic Auth</option>
      </select>

      {authType === 'bearer' && (
        <input
          type="text"
          value={auth.token || ''}
          onChange={(e) => setAuth({ ...auth, type: 'bearer', token: e.target.value })}
          placeholder="Token"
          className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
        />
      )}

      {authType === 'basic' && (
        <div className="space-y-2">
          <input
            type="text"
            value={auth.username || ''}
            onChange={(e) => setAuth({ ...auth, type: 'basic', username: e.target.value })}
            placeholder="Username"
            className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            value={auth.password || ''}
            onChange={(e) => setAuth({ ...auth, type: 'basic', password: e.target.value })}
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
};

export default RequestBuilder;
