import { useState } from 'react';
import { aiStrategies, calculateGameResult } from '../utils/aiStrategies';

export const useGame = () => {
  const [playerChoice, setPlayerChoice] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    const choice = parseInt(playerChoice);
    
    if (isNaN(choice) || choice < 0 || choice > 100) {
      alert('请输入0到100之间的有效数字！');
      return;
    }

    // 生成AI选择
    const aiChoices = {
      'GPT-4': aiStrategies['GPT-4'](),
      'Claude': aiStrategies['Claude'](),
      'Gemini': aiStrategies['Gemini']()
    };

    // 计算结果
    const result = calculateGameResult(choice, aiChoices);
    
    setGameResult(result);
    setIsGameStarted(true);
  };

  const resetGame = () => {
    setPlayerChoice('');
    setGameResult(null);
    setIsGameStarted(false);
  };

  const handleInputChange = (value) => {
    setPlayerChoice(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      startGame();
    }
  };

  return {
    playerChoice,
    gameResult,
    isGameStarted,
    startGame,
    resetGame,
    handleInputChange,
    handleKeyPress
  };
}; 