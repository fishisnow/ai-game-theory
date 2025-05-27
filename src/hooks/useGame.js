import { useState } from 'react';
import { playTournament, getAIStatus, setAILogger } from '../utils/aiStrategies';
import { useAIConsole } from './useAIConsole';

export const useGame = () => {
  const [tournamentResult, setTournamentResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiStatus, setAiStatus] = useState(getAIStatus());
  const [selectedAIs, setSelectedAIs] = useState([]);
  const [tournamentController, setTournamentController] = useState(null);

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
    
    // 创建一个AbortController来控制比赛的终止
    const controller = new AbortController();
    setTournamentController(controller);
    
    try {
      // 异步执行AI锦标赛
      const result = await playTournament(selectedAIs, controller.signal);
      if (!controller.signal.aborted) {
        setTournamentResult(result);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        aiConsole.logInfo('比赛已被用户终止', 'SYSTEM');
        console.log('比赛已被用户终止');
      } else {
        console.error('AI锦标赛执行失败:', error);
        aiConsole.logError(`AI对战过程中出现错误：${error.message}`, 'SYSTEM', error);
        alert(`AI对战过程中出现错误：${error.message}`);
      }
    } finally {
      setIsPlaying(false);
      setTournamentController(null);
    }
  };

  const stopTournament = () => {
    if (tournamentController && isPlaying) {
      tournamentController.abort();
      aiConsole.logInfo('用户手动终止了比赛', 'SYSTEM');
    }
  };

  const resetGame = () => {
    // 如果比赛正在进行，先终止比赛
    if (isPlaying && tournamentController) {
      tournamentController.abort();
    }
    setTournamentResult(null);
    setIsPlaying(false);
    setTournamentController(null);
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
    stopTournament,
    resetGame,
    updateAIStatus,
    handleAISelection,
    // AI控制台相关
    aiConsole
  };
}; 