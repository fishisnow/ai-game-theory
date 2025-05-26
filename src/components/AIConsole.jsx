import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Terminal, Trash2, Download } from 'lucide-react';

const AIConsole = ({ isOpen, onClose, logs = [], onClearLogs }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef(null);
  const consoleRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // 检测用户是否手动滚动
  const handleScroll = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  };

  // 导出日志
  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.aiName || 'SYSTEM'}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-console-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取日志类型的样式
  const getLogTypeStyle = (type) => {
    switch (type) {
      case 'thinking':
        return 'text-blue-300 bg-blue-900/20';
      case 'decision':
        return 'text-green-300 bg-green-900/20';
      case 'error':
        return 'text-red-300 bg-red-900/20';
      case 'info':
        return 'text-gray-300 bg-gray-900/20';
      case 'warning':
        return 'text-yellow-300 bg-yellow-900/20';
      default:
        return 'text-gray-300 bg-gray-900/20';
    }
  };

  // 获取日志类型的图标
  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'thinking':
        return '🤔';
      case 'decision':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      default:
        return '📝';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-96 h-16' : 'w-full max-w-6xl h-5/6'
      }`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">AI 思考控制台</h3>
            <span className="text-sm text-gray-400">({logs.length} 条日志)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 自动滚动开关 */}
            {!isMinimized && (
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  autoScroll 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                自动滚动
              </button>
            )}
            
            {/* 清空日志 */}
            {!isMinimized && (
              <button
                onClick={onClearLogs}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="清空日志"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            {/* 导出日志 */}
            {!isMinimized && (
              <button
                onClick={exportLogs}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                title="导出日志"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {/* 最小化/最大化 */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            
            {/* 关闭 */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 控制台内容 */}
        {!isMinimized && (
          <div 
            ref={consoleRef}
            onScroll={handleScroll}
            className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-y-auto h-full"
            style={{ maxHeight: 'calc(100% - 80px)' }}
          >
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>等待AI开始思考...</p>
                <p className="text-xs mt-2">AI的思考过程和决策将在这里显示</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${getLogTypeStyle(log.type)} border-l-current`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{getLogTypeIcon(log.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-gray-400">{log.timestamp}</span>
                          {log.aiName && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {log.aiName}
                            </span>
                          )}
                          <span className="text-xs bg-gray-600 px-2 py-1 rounded uppercase">
                            {log.type}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-words">
                          {log.message}
                        </div>
                        {log.data && (
                          <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                            <pre>{JSON.stringify(log.data, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConsole; 