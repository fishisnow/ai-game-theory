import React, { useState } from 'react';
import { aiPlayers } from '../utils/aiStrategies';

const AIPlayers = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(selectedPlayer?.name === player.name ? null : player);
  };

  return (
    <div className="cyber-card border-cyber-purple shadow-lg shadow-cyber-purple/20 p-4">
      <h3 className="text-xl text-cyber-purple text-center mb-4 flex items-center justify-center">
        <span className="mr-2">🤖</span>
        AI选手阵容
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {aiPlayers.map((player, index) => (
          <div
            key={index}
            className={`bg-black bg-opacity-60 border border-cyber-purple rounded-lg p-3 text-center 
                       transition-all duration-300 cursor-pointer transform hover:-translate-y-1 
                       hover:shadow-lg hover:shadow-cyber-purple/30 hover:border-cyber-yellow
                       ${selectedPlayer?.name === player.name ? 'border-cyber-yellow shadow-lg shadow-cyber-yellow/30' : ''}`}
            onClick={() => handlePlayerClick(player)}
          >
            <div className="text-base font-bold text-cyber-purple mb-1">
              {player.name}
            </div>
            <div className="text-xs text-gray-300">
              {player.strategy}
            </div>
            {selectedPlayer?.name === player.name && (
              <div className="mt-2 text-xs text-cyber-green border-t border-cyber-purple pt-2">
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