import React from 'react';
import { getAIDisplayName } from '../utils/aiStrategies';

const GameControl = ({ 
  onStartTournament, 
  onResetGame,
  onStopTournament,
  isPlaying,
  selectedAIs = []
}) => {
  const canStart = selectedAIs.length >= 2 && !isPlaying;

  // 获取选中AI的显示名称
  const getSelectedAIDisplayNames = () => {
    return selectedAIs.map(ai => getAIDisplayName(ai));
  };

  return (
    <div className="cyber-card border-cyber-green shadow-lg shadow-cyber-green/20 text-center p-4">
      <h3 className="text-xl text-cyber-green text-center mb-4 flex items-center justify-center">
        <span className="mr-2">🎮</span>
        AI博弈对战控制台
      </h3>
      <div className="space-y-4">
        <div className="text-gray-300 text-sm mb-4">
          {selectedAIs.length > 0 ? (
            <>
              已选择 <span className="text-cyber-blue font-bold">{selectedAIs.length}</span> 个AI参赛：
              <div className="text-cyber-yellow mt-2 text-xs">
                {getSelectedAIDisplayNames().join(' | ')}
              </div>
            </>
          ) : (
            <span className="text-red-400">请先选择参赛的AI模型</span>
          )}
        </div>
        
        <div className="flex justify-center space-x-3">
          <button 
            className={`cyber-button text-base uppercase px-6 py-3 ${!canStart ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onStartTournament}
            disabled={!canStart}
          >
            {isPlaying ? '🔥 AI激战中...' : '🚀 开始AI锦标赛'}
          </button>
          
          {isPlaying && (
            <button 
              className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 uppercase text-base"
              style={{
                background: 'linear-gradient(45deg, #ff6b35, #ff8e53)',
                boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
              }}
              onClick={onStopTournament}
              title="立即终止当前比赛"
            >
              ⏹️ 终止比赛
            </button>
          )}
          
          <button 
            className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 uppercase text-base"
            style={{
              background: 'linear-gradient(45deg, #ff4444, #ff8888)',
              boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)'
            }}
            onClick={onResetGame}
            disabled={isPlaying}
          >
            🔄 重置对战
          </button>
        </div>
        
        {isPlaying && selectedAIs.length > 0 && (
          <div className="text-cyber-yellow text-sm animate-pulse">
            ⚡ {selectedAIs.length}个AI正在进行10场激烈的淘汰制锦标赛，请稍候...
            <div className="text-xs text-gray-400 mt-1">
              💡 可以随时点击"终止比赛"按钮停止当前比赛
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          {selectedAIs.length < 2 ? (
            <span className="text-red-400">💡 至少需要选择2个AI才能开始比赛</span>
          ) : (
            <span>💡 每场比赛将从{selectedAIs.length}个AI开始，逐轮淘汰距离目标值最远的AI，直到决出单场胜者</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameControl; 