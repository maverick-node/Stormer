import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiClock, FiDatabase } from 'react-icons/fi';
import { useState } from 'react';
import { useStore } from '../store';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';

SyntaxHighlighter.registerLanguage('json', json);

const ResponseViewer = () => {
  const { response, loading } = useStore();
  const [activeTab, setActiveTab] = useState('body');

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 md:px-6 py-3 border-b border-gray-800 space-y-2 sm:space-y-0">
        <h3 className="text-base md:text-lg font-semibold">Response</h3>
        
        {response && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap items-center gap-2 sm:space-x-4"
          >
            <div className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-semibold ${
              response.error
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : response.status >= 200 && response.status < 300
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : response.status >= 400
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {response.error ? 'Error' : `${response.status} ${response.statusText}`}
            </div>
            
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-400">
              <FiClock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{response.time}ms</span>
            </div>
            
            {response.size && (
              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-400">
                <FiDatabase className="w-3 h-3 md:w-4 md:h-4" />
                <span>{(response.size / 1024).toFixed(2)} KB</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader className="w-12 h-12 text-primary" />
              </motion.div>
            </motion.div>
          ) : response ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              {/* Tabs */}
              <div className="flex space-x-1 border-b border-gray-800 px-3 md:px-6 overflow-x-auto">
                {['body', 'headers', 'request'].map((tab) => (
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
              <div className="flex-1 overflow-auto p-3 md:p-6">
                {activeTab === 'body' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    {response.error ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <h4 className="text-red-400 font-semibold mb-2">Error</h4>
                          <p className="text-red-300">{response.message}</p>
                        </div>
                        {response.details && (
                          <SyntaxHighlighter
                            language="json"
                            style={atomOneDark}
                            customStyle={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            {JSON.stringify(response.details, null, 2)}
                          </SyntaxHighlighter>
                        )}
                      </div>
                    ) : (
                      <SyntaxHighlighter
                        language="json"
                        style={atomOneDark}
                        customStyle={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                        wrapLongLines
                      >
                        {JSON.stringify(response.data, null, 2)}
                      </SyntaxHighlighter>
                    )}
                  </motion.div>
                )}

                {activeTab === 'headers' && !response.error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    {Object.entries(response.headers || {}).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-primary font-mono text-sm min-w-[200px]">
                          {key}:
                        </span>
                        <span className="text-gray-300 font-mono text-sm break-all">
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'request' && !response.error && response.requestInfo && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Sent Headers</h4>
                      {Object.keys(response.requestInfo.sentHeaders || {}).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(response.requestInfo.sentHeaders).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg">
                              <span className="text-green-400 font-mono text-sm min-w-[200px]">
                                {key}:
                              </span>
                              <span className="text-gray-300 font-mono text-sm break-all">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No headers sent</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Sent Parameters</h4>
                      {Object.keys(response.requestInfo.sentParams || {}).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(response.requestInfo.sentParams).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg">
                              <span className="text-blue-400 font-mono text-sm min-w-[200px]">
                                {key}:
                              </span>
                              <span className="text-gray-300 font-mono text-sm break-all">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No parameters sent</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Sent Cookies</h4>
                      {Object.keys(response.requestInfo.sentCookies || {}).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(response.requestInfo.sentCookies).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg">
                              <span className="text-purple-400 font-mono text-sm min-w-[200px]">
                                {key}:
                              </span>
                              <span className="text-gray-300 font-mono text-sm break-all">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No cookies sent</p>
                      )}
                    </div>

                    {response.requestInfo.sentBody && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Sent Body</h4>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <span className="text-purple-400 font-mono text-sm">
                            {response.requestInfo.sentBody}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-6xl"
                >
                  🚀
                </motion.div>
                <p className="text-gray-400">
                  Send a request to see the response here
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResponseViewer;
