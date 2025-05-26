import { useState } from 'react';
import { playTournament, getAIStatus, setAILogger } from '../utils/aiStrategies';
import { useAIConsole } from './useAIConsole';

export const useGame = () => {
  const [tournamentResult, setTournamentResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiStatus, setAiStatus] = useState(getAIStatus());
  const [selectedAIs, setSelectedAIs] = useState([]);

  // 集成AI控制台
  const aiConsole = useAIConsole();

  const startTournament = async () => {
    if (isPlaying || selectedAIs.length < 2) return;

    setIsPlaying(true);
    setTournamentResult(null);
    
    // 清空之前的日志并打开控制台
    aiConsole.clearLogs();
    aiConsole.openConsole();
    
    // 设置AI策略的日志记录器
    setAILogger(aiConsole);
    
    try {
      // 异步执行AI锦标赛
      const result = await playTournament(selectedAIs);
      setTournamentResult(result);
    } catch (error) {
      console.error('AI锦标赛执行失败:', error);
      aiConsole.logError(`AI对战过程中出现错误：${error.message}`, 'SYSTEM', error);
      alert(`AI对战过程中出现错误：${error.message}`);
    } finally {
      setIsPlaying(false);
    }
  };

  const resetGame = () => {
    setTournamentResult(null);
    setIsPlaying(false);
    // 可选：清空日志
    // aiConsole.clearLogs();
  };

  const updateAIStatus = () => {
    setAiStatus(getAIStatus());
  };

  const handleAISelection = (newSelectedAIs) => {
    setSelectedAIs(newSelectedAIs);
    // 如果当前有比赛结果，清除它（因为参赛AI变了）
    if (tournamentResult) {
      setTournamentResult(null);
    }
  };

  return {
    tournamentResult,
    isPlaying,
    aiStatus,
    selectedAIs,
    startTournament,
    resetGame,
    updateAIStatus,
    handleAISelection,
    // AI控制台相关
    aiConsole
  };
}; 