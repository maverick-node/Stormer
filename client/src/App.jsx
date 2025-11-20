import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import BackgroundAnimation from './components/BackgroundAnimation';
import { useStore } from './store';

function App() {
  const { sidebarOpen, setSidebarOpen } = useStore();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [responseHeight, setResponseHeight] = useState(50);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingResponse, setIsResizingResponse] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen]);

  // Sidebar resize handlers
  const handleSidebarMouseDown = (e) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    document.body.classList.add('resizing');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingSidebar) {
        const newWidth = Math.max(200, Math.min(600, e.clientX));
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      document.body.classList.remove('resizing');
    };

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);

  // Response panel resize handlers
  const handleResponseMouseDown = (e) => {
    e.preventDefault();
    setIsResizingResponse(true);
    document.body.classList.add('resizing-vertical');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingResponse) {
        const container = document.getElementById('main-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const percentage = ((containerRect.bottom - e.clientY) / containerRect.height) * 100;
          const newHeight = Math.max(20, Math.min(80, percentage));
          setResponseHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingResponse(false);
      document.body.classList.remove('resizing-vertical');
    };

    if (isResizingResponse) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingResponse]);

  return (
    <div className="min-h-screen bg-darker overflow-hidden relative">
      <BackgroundAnimation />
      
      <div className="relative z-10">
        <Header />
        
        <div className="flex h-[calc(100vh-64px)]">
          {/* Mobile Overlay */}
          <AnimatePresence>
            {sidebarOpen && isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 mobile-overlay z-20 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <Sidebar 
                  isMobile={isMobile} 
                  width={isMobile ? undefined : sidebarWidth}
                />
                {!isMobile && (
                  <div
                    onMouseDown={handleSidebarMouseDown}
                    className="w-1 bg-gray-800 hover:bg-primary hover:w-1.5 cursor-col-resize transition-all relative group"
                    style={{ flexShrink: 0 }}
                  >
                    <div className="absolute inset-y-0 -left-1 -right-1" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1 h-8 bg-primary rounded-full" />
                    </div>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
          
          <motion.main 
            id="main-container"
            className="flex-1 overflow-hidden w-full"
            animate={{ 
              marginLeft: sidebarOpen ? 0 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col">
              <div 
                className="overflow-auto"
                style={{ height: `${100 - responseHeight}%` }}
              >
                <RequestBuilder />
              </div>
              
              {/* Horizontal Resizer */}
              <div
                onMouseDown={handleResponseMouseDown}
                className="h-1 bg-gray-800 hover:bg-primary hover:h-1.5 cursor-row-resize transition-all relative group"
                style={{ flexShrink: 0 }}
              >
                <div className="absolute -top-1 -bottom-1 inset-x-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                </div>
              </div>
              
              <div 
                className="overflow-auto"
                style={{ height: `${responseHeight}%` }}
              >
                <ResponseViewer />
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export default App;
