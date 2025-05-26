import React from 'react';
import { useGame } from './hooks/useGame';
import Header from './components/Header';
import GameRules from './components/GameRules';
import AIPlayers from './components/AIPlayers';
import GameControl from './components/GameControl';
import GameResults from './components/GameResults';
import BackgroundDecorations from './components/BackgroundDecorations';

function App() {
  const {
    playerChoice,
    gameResult,
    isGameStarted,
    startGame,
    resetGame,
    handleInputChange,
    handleKeyPress
  } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-secondary to-dark-tertiary 
                    text-cyber-blue font-mono relative overflow-x-hidden">
      
      {/* 背景装饰 */}
      <BackgroundDecorations />
      
      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto p-5 md:p-8">
        
        {/* 页面标题 */}
        <Header />
        
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <GameRules />
          <AIPlayers />
        </div>
        
        {/* 游戏控制区域 */}
        <GameControl
          playerChoice={playerChoice}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onStartGame={startGame}
          onResetGame={resetGame}
        />
        
        {/* 游戏结果展示 */}
        {isGameStarted && (
          <div className="mt-10">
            <GameResults gameResult={gameResult} />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App; 