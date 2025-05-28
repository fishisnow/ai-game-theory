import { useState, useCallback } from 'react';

export const useAIConsole = () => {
  const [logs, setLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeAIs, setActiveAIs] = useState([]); // 当前参赛的AI列表

  // 设置当前参赛的AI列表
  const setActiveAIList = useCallback((aiList) => {
    setActiveAIs(aiList);
  }, []);

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
      data,
      round: data?.round || null, // 添加回合信息
      category: aiName === 'SYSTEM' ? 'system' : 'ai' // 添加分类
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
    setActiveAIList(selectedAIs); // 设置参赛AI列表
    addLog('info', `🎮 游戏开始！参赛AI: ${selectedAIs.join(', ')}`, 'SYSTEM', { selectedAIs });
  }, [addLog, setActiveAIList]);

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
    addLog('info', message, 'SYSTEM', { ...result, round });
  }, [addLog]);

  // 记录游戏结束
  const logGameEnd = useCallback((winner, totalRounds) => {
    addLog('info', `🏆 游戏结束！获胜者: ${winner}，总轮数: ${totalRounds}`, 'SYSTEM', { winner, totalRounds });
  }, [addLog]);

  // 获取按AI分组的日志
  const getLogsByAI = useCallback(() => {
    const groupedLogs = {
      SYSTEM: [],
      ...Object.fromEntries(activeAIs.map(ai => [ai, []]))
    };

    logs.forEach(log => {
      const aiName = log.aiName || 'SYSTEM';
      if (groupedLogs[aiName]) {
        groupedLogs[aiName].push(log);
      } else {
        // 如果AI不在当前列表中，放到SYSTEM组
        groupedLogs.SYSTEM.push(log);
      }
    });

    return groupedLogs;
  }, [logs, activeAIs]);

  // 获取按回合分组的日志
  const getLogsByRound = useCallback(() => {
    const roundLogs = {};
    
    logs.forEach(log => {
      const round = log.round || 'general';
      if (!roundLogs[round]) {
        roundLogs[round] = [];
      }
      roundLogs[round].push(log);
    });

    return roundLogs;
  }, [logs]);

  return {
    logs,
    isConsoleOpen,
    activeAIs,
    addLog,
    clearLogs,
    openConsole,
    closeConsole,
    setActiveAIList,
    logAIThinking,
    logAIDecision,
    logError,
    logInfo,
    logWarning,
    logGameStart,
    logRoundStart,
    logRoundResult,
    logGameEnd,
    getLogsByAI,
    getLogsByRound
  };
}; 