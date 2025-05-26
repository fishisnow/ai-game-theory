import React from 'react';

const GameControl = ({ 
  playerChoice, 
  onInputChange, 
  onKeyPress, 
  onStartGame, 
  onResetGame 
}) => {
  return (
    <div className="cyber-card border-cyber-green shadow-lg shadow-cyber-green/20 text-center">
      <h3 className="text-2xl text-cyber-green text-center mb-6 flex items-center justify-center">
        <span className="mr-3">🎮</span>
        开始游戏
      </h3>
      <div className="space-y-6">
        <div>
          <label 
            htmlFor="playerChoice" 
            className="block text-cyber-green text-xl mb-4"
          >
            请输入您的选择 (0-100):
          </label>
          <input
            type="number"
            id="playerChoice"
            className="cyber-input w-48 mx-4"
            min="0"
            max="100"
            placeholder="输入数字"
            value={playerChoice}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button 
            className="cyber-button text-lg uppercase"
            onClick={onStartGame}
          >
            开始对决
          </button>
          <button 
            className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 uppercase"
            style={{
              background: 'linear-gradient(45deg, #ff4444, #ff8888)',
              boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)'
            }}
            onClick={onResetGame}
          >
            重置游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControl; 