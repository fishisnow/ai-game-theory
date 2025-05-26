import React from 'react';

const GameControl = ({ 
  playerChoice, 
  onInputChange, 
  onKeyPress, 
  onStartTournament, 
  onResetGame,
  isPlaying
}) => {
  return (
    <div className="cyber-card border-cyber-green shadow-lg shadow-cyber-green/20 text-center p-4">
      <h3 className="text-xl text-cyber-green text-center mb-4 flex items-center justify-center">
        <span className="mr-2">🎮</span>
        开始游戏
      </h3>
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="playerChoice" 
            className="block text-cyber-green text-lg mb-3"
          >
            请输入您的选择 (0-100):
          </label>
          <input
            type="number"
            id="playerChoice"
            className="cyber-input w-40 mx-3"
            min="0"
            max="100"
            placeholder="输入数字"
            value={playerChoice}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            disabled={isPlaying}
          />
        </div>
        <div className="flex justify-center space-x-3">
          <button 
            className={`cyber-button text-base uppercase px-5 py-2 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onStartTournament}
            disabled={isPlaying}
          >
            {isPlaying ? '比赛进行中...' : '开始对决'}
          </button>
          <button 
            className="px-5 py-2 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 uppercase text-base"
            style={{
              background: 'linear-gradient(45deg, #ff4444, #ff8888)',
              boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)'
            }}
            onClick={onResetGame}
            disabled={isPlaying}
          >
            重置游戏
          </button>
        </div>
        {isPlaying && (
          <div className="text-cyber-yellow text-sm animate-pulse">
            🔥 5场激烈比赛进行中，请稍候...
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControl; 