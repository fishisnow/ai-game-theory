import React, { useState } from 'react';
import Header from './components/Header';
import GameRules from './components/GameRules';
import AIPlayers from './components/AIPlayers';
import AISelector from './components/AISelector';
import GameControl from './components/GameControl';
import TournamentResults from './components/TournamentResults';
import AIConfigPanel from './components/AIConfigPanel';
import BackgroundDecorations from './components/BackgroundDecorations';
import { useGame } from './hooks/useGame';

function App() {
  const {
    tournamentResult,
    isPlaying,
    aiStatus,
    selectedAIs,
    startTournament,
    resetGame,
    updateAIStatus,
    handleAISelection
  } = useGame();

  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const handleConfigUpdate = () => {
    updateAIStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-x-hidden">
      <BackgroundDecorations />
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GameRules />
          <AIPlayers 
            aiStatus={aiStatus}
            onConfigClick={() => setShowConfigPanel(true)}
          />
        </div>
        
        <div className="mb-6">
          <AISelector 
            onSelectionChange={handleAISelection}
            selectedAIs={selectedAIs}
          />
        </div>
        
        <div className="mb-6">
          <GameControl
            onStartTournament={startTournament}
            onResetGame={resetGame}
            isPlaying={isPlaying}
            selectedAIs={selectedAIs}
          />
        </div>
        
        {tournamentResult && (
          <TournamentResults tournamentResult={tournamentResult} />
        )}
      </div>

      {/* AI配置面板 */}
      <AIConfigPanel
        isOpen={showConfigPanel}
        onClose={() => setShowConfigPanel(false)}
        onConfigUpdate={handleConfigUpdate}
      />
    </div>
  );
}

export default App; 