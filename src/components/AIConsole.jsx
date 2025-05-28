import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Terminal, Trash2, Download, Users, Clock } from 'lucide-react';

const AIConsole = ({ 
  isOpen, 
  onClose, 
  logs = [], 
  onClearLogs, 
  activeAIs = [], 
  getLogsByAI, 
  getLogsByRound 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'byAI', 'byRound'
  const [selectedAI, setSelectedAI] = useState('all');
  const [selectedRound, setSelectedRound] = useState('all');
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
        return 'text-blue-300 bg-blue-900/20 border-blue-500';
      case 'decision':
        return 'text-green-300 bg-green-900/20 border-green-500';
      case 'error':
        return 'text-red-300 bg-red-900/20 border-red-500';
      case 'info':
        return 'text-gray-300 bg-gray-900/20 border-gray-500';
      case 'warning':
        return 'text-yellow-300 bg-yellow-900/20 border-yellow-500';
      default:
        return 'text-gray-300 bg-gray-900/20 border-gray-500';
    }
  };

  // 获取AI的颜色
  const getAIColor = (aiName) => {
    const colors = [
      'text-cyan-400 bg-cyan-900/20',
      'text-purple-400 bg-purple-900/20', 
      'text-pink-400 bg-pink-900/20',
      'text-orange-400 bg-orange-900/20',
      'text-indigo-400 bg-indigo-900/20',
      'text-emerald-400 bg-emerald-900/20'
    ];
    
    if (aiName === 'SYSTEM') return 'text-gray-400 bg-gray-900/20';
    
    const index = activeAIs.indexOf(aiName);
    return colors[index % colors.length] || 'text-gray-400 bg-gray-900/20';
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

  // 过滤日志
  const getFilteredLogs = () => {
    let filteredLogs = logs;

    if (selectedAI !== 'all') {
      filteredLogs = filteredLogs.filter(log => 
        (log.aiName || 'SYSTEM') === selectedAI
      );
    }

    if (selectedRound !== 'all') {
      filteredLogs = filteredLogs.filter(log => 
        log.round === parseInt(selectedRound) || (selectedRound === 'general' && !log.round)
      );
    }

    return filteredLogs;
  };

  // 渲染日志项
  const renderLogItem = (log, index) => (
    <div
      key={log.id || index}
      className={`p-3 rounded-lg border-l-4 ${getLogTypeStyle(log.type)}`}
    >
      <div className="flex items-start space-x-2">
        <span className="text-lg">{getLogTypeIcon(log.type)}</span>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1 flex-wrap">
            <span className="text-xs text-gray-400">{log.timestamp}</span>
            {log.aiName && (
              <span className={`text-xs px-2 py-1 rounded font-medium ${getAIColor(log.aiName)}`}>
                {log.aiName}
              </span>
            )}
            <span className="text-xs bg-gray-600 px-2 py-1 rounded uppercase">
              {log.type}
            </span>
            {log.round && (
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                第{log.round}轮
              </span>
            )}
          </div>
          <div className="whitespace-pre-wrap break-words">
            {log.message}
          </div>
          {log.data && (
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
              <pre className="text-gray-300">{JSON.stringify(log.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 渲染按AI分组的日志
  const renderLogsByAI = () => {
    if (!getLogsByAI) return null;
    
    const groupedLogs = getLogsByAI();
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedLogs).map(([aiName, aiLogs]) => {
          if (aiLogs.length === 0) return null;
          
          return (
            <div key={aiName} className="border border-gray-700 rounded-lg">
              <div className={`p-3 rounded-t-lg font-semibold ${getAIColor(aiName)} border-b border-gray-700`}>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{aiName}</span>
                  <span className="text-xs opacity-75">({aiLogs.length} 条日志)</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {aiLogs.map((log, index) => renderLogItem(log, index))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染按回合分组的日志
  const renderLogsByRound = () => {
    if (!getLogsByRound) return null;
    
    const roundLogs = getLogsByRound();
    const sortedRounds = Object.keys(roundLogs).sort((a, b) => {
      if (a === 'general') return -1;
      if (b === 'general') return 1;
      return parseInt(a) - parseInt(b);
    });
    
    return (
      <div className="space-y-6">
        {sortedRounds.map(round => {
          const logs = roundLogs[round];
          if (logs.length === 0) return null;
          
          return (
            <div key={round} className="border border-gray-700 rounded-lg">
              <div className="p-3 bg-blue-900/20 rounded-t-lg font-semibold text-blue-300 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{round === 'general' ? '游戏总体' : `第 ${round} 轮`}</span>
                  <span className="text-xs opacity-75">({logs.length} 条日志)</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {logs.map((log, index) => renderLogItem(log, index))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  const filteredLogs = getFilteredLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-96 h-16' : 'w-full max-w-7xl h-5/6'
      }`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">AI 思考控制台</h3>
            <span className="text-sm text-gray-400">({logs.length} 条日志)</span>
            {activeAIs.length > 0 && (
              <span className="text-xs text-blue-400">
                参赛AI: {activeAIs.join(', ')}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 视图模式切换 */}
            {!isMinimized && (
              <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    viewMode === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setViewMode('byAI')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    viewMode === 'byAI' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  按AI
                </button>
                <button
                  onClick={() => setViewMode('byRound')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    viewMode === 'byRound' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  按轮次
                </button>
              </div>
            )}

            {/* 过滤器 */}
            {!isMinimized && viewMode === 'all' && (
              <>
                <select
                  value={selectedAI}
                  onChange={(e) => setSelectedAI(e.target.value)}
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
                >
                  <option value="all">所有AI</option>
                  <option value="SYSTEM">系统</option>
                  {activeAIs.map(ai => (
                    <option key={ai} value={ai}>{ai}</option>
                  ))}
                </select>

                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
                >
                  <option value="all">所有轮次</option>
                  <option value="general">游戏总体</option>
                  {Array.from(new Set(logs.filter(log => log.round).map(log => log.round)))
                    .sort((a, b) => a - b)
                    .map(round => (
                      <option key={round} value={round}>第{round}轮</option>
                    ))}
                </select>
              </>
            )}
            
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
                {viewMode === 'all' && (
                  <>
                    {filteredLogs.map((log, index) => renderLogItem(log, index))}
                    <div ref={logsEndRef} />
                  </>
                )}
                
                {viewMode === 'byAI' && (
                  <>
                    {renderLogsByAI()}
                    <div ref={logsEndRef} />
                  </>
                )}
                
                {viewMode === 'byRound' && (
                  <>
                    {renderLogsByRound()}
                    <div ref={logsEndRef} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConsole; 