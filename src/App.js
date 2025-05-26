import React from 'react';
import { useGame } from './hooks/useGame';
import Header from './components/Header';
import GameRules from './components/GameRules';
import AIPlayers from './components/AIPlayers';
import GameControl from './components/GameControl';
import TournamentResults from './components/TournamentResults';
import BackgroundDecorations from './components/BackgroundDecorations';

function App() {
  const {
    playerChoice,
    tournamentResult,
    isGameStarted,
    isPlaying,
    startTournament,
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
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6">
        
        {/* 页面标题 */}
        <Header />
        
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GameRules />
          <AIPlayers />
        </div>
        
        {/* 游戏控制区域 */}
        <GameControl
          playerChoice={playerChoice}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onStartTournament={startTournament}
          onResetGame={resetGame}
          isPlaying={isPlaying}
        />
        
        {/* 锦标赛结果展示 */}
        {isGameStarted && (
          <div className="mt-6">
            <TournamentResults tournamentResult={tournamentResult} />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App; 