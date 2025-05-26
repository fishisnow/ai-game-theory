import { useState, useCallback } from 'react';
import { playTournament } from '../utils/aiStrategies';

export const useGame = () => {
  const [playerChoice, setPlayerChoice] = useState('');
  const [tournamentResult, setTournamentResult] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTournament = useCallback(async () => {
    const choice = parseInt(playerChoice);
    
    if (isNaN(choice) || choice < 0 || choice > 100) {
      alert('请输入0到100之间的有效数字！');
      return;
    }

    setIsPlaying(true);
    setIsGameStarted(true);
    
    // 模拟逐轮进行的效果
    const result = playTournament(choice);
    
    // 添加延迟以模拟实时对战的感觉
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTournamentResult(result);
    setIsPlaying(false);
  }, [playerChoice]);

  const resetGame = () => {
    setPlayerChoice('');
    setTournamentResult(null);
    setIsGameStarted(false);
    setIsPlaying(false);
  };

  const handleInputChange = (value) => {
    setPlayerChoice(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isPlaying) {
      startTournament();
    }
  };

  return {
    playerChoice,
    tournamentResult,
    isGameStarted,
    isPlaying,
    startTournament,
    resetGame,
    handleInputChange,
    handleKeyPress
  };
}; 