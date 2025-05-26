import { useState, useCallback } from 'react';

export const useAIConsole = () => {
  const [logs, setLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // 添加日志
  const addLog = useCallback((type, message, aiName = null, data = null) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });

    const newLog = {
      id: Date.now() + Math.random(),
      timestamp,
      type,
      message,
      aiName,
      data
    };

    setLogs(prevLogs => [...prevLogs, newLog]);
  }, []);

  // 清空日志
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // 打开控制台
  const openConsole = useCallback(() => {
    setIsConsoleOpen(true);
  }, []);

  // 关闭控制台
  const closeConsole = useCallback(() => {
    setIsConsoleOpen(false);
  }, []);

  // 记录AI思考过程
  const logAIThinking = useCallback((aiName, thinking) => {
    addLog('thinking', thinking, aiName);
  }, [addLog]);

  // 记录AI决策
  const logAIDecision = useCallback((aiName, decision, data = null) => {
    addLog('decision', decision, aiName, data);
  }, [addLog]);

  // 记录错误
  const logError = useCallback((message, aiName = null, error = null) => {
    addLog('error', message, aiName, error);
  }, [addLog]);

  // 记录信息
  const logInfo = useCallback((message, aiName = null, data = null) => {
    addLog('info', message, aiName, data);
  }, [addLog]);

  // 记录警告
  const logWarning = useCallback((message, aiName = null, data = null) => {
    addLog('warning', message, aiName, data);
  }, [addLog]);

  // 记录游戏开始
  const logGameStart = useCallback((selectedAIs) => {
    addLog('info', `🎮 游戏开始！参赛AI: ${selectedAIs.join(', ')}`, 'SYSTEM', { selectedAIs });
  }, [addLog]);

  // 记录回合开始
  const logRoundStart = useCallback((round, activePlayers) => {
    addLog('info', `🔄 第 ${round} 轮开始，剩余玩家: ${activePlayers.join(', ')}`, 'SYSTEM', { round, activePlayers });
  }, [addLog]);

  // 记录回合结果
  const logRoundResult = useCallback((round, result) => {
    const { average, target, eliminatedPlayers } = result;
    const message = `📊 第 ${round} 轮结果 - 平均值: ${average}, 目标值: ${target.toFixed(2)}${
      eliminatedPlayers.length > 0 ? `, 淘汰: ${eliminatedPlayers.join(', ')}` : ''
    }`;
    addLog('info', message, 'SYSTEM', result);
  }, [addLog]);

  // 记录游戏结束
  const logGameEnd = useCallback((winner, totalRounds) => {
    addLog('info', `🏆 游戏结束！获胜者: ${winner}，总轮数: ${totalRounds}`, 'SYSTEM', { winner, totalRounds });
  }, [addLog]);

  return {
    logs,
    isConsoleOpen,
    addLog,
    clearLogs,
    openConsole,
    closeConsole,
    logAIThinking,
    logAIDecision,
    logError,
    logInfo,
    logWarning,
    logGameStart,
    logRoundStart,
    logRoundResult,
    logGameEnd
  };
}; 