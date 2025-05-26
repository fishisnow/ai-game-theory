import React, { useState } from 'react';
import { aiPlayers } from '../utils/aiStrategies';

const AIPlayers = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(selectedPlayer?.name === player.name ? null : player);
  };

  return (
    <div className="cyber-card border-cyber-purple shadow-lg shadow-cyber-purple/20">
      <h3 className="text-2xl text-cyber-purple text-center mb-6 flex items-center justify-center">
        <span className="mr-3">🤖</span>
        AI选手阵容
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {aiPlayers.map((player, index) => (
          <div
            key={index}
            className={`bg-black bg-opacity-60 border border-cyber-purple rounded-lg p-4 text-center 
                       transition-all duration-300 cursor-pointer transform hover:-translate-y-2 
                       hover:shadow-lg hover:shadow-cyber-purple/30 hover:border-cyber-yellow
                       ${selectedPlayer?.name === player.name ? 'border-cyber-yellow shadow-lg shadow-cyber-yellow/30' : ''}`}
            onClick={() => handlePlayerClick(player)}
          >
            <div className="text-lg font-bold text-cyber-purple mb-2">
              {player.name}
            </div>
            <div className="text-sm text-gray-300">
              {player.strategy}
            </div>
            {selectedPlayer?.name === player.name && (
              <div className="mt-3 text-xs text-cyber-green border-t border-cyber-purple pt-3">
                {player.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPlayers; 