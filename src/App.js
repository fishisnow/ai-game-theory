import React, { useState } from 'react';
import Header from './components/Header';
import GameRules from './components/GameRules';
import AIPlayers from './components/AIPlayers';
import AISelector from './components/AISelector';
import GameControl from './components/GameControl';
import TournamentResults from './components/TournamentResults';
import AIConfigPanel from './components/AIConfigPanel';
import AIConsole from './components/AIConsole';
import BackgroundDecorations from './components/BackgroundDecorations';
import { useGame } from './hooks/useGame';
import { Terminal } from 'lucide-react';

function App() {
  const {
    tournamentResult,
    isPlaying,
    aiStatus,
    selectedAIs,
    startTournament,
    stopTournament,
    resetGame,
    updateAIStatus,
    handleAISelection,
    aiConsole
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
            onStopTournament={stopTournament}
            onResetGame={resetGame}
            isPlaying={isPlaying}
            selectedAIs={selectedAIs}
          />
        </div>
        
        {tournamentResult && (
          <TournamentResults tournamentResult={tournamentResult} />
        )}
      </div>

      {/* AI控制台开关按钮 */}
      <button
        onClick={aiConsole.openConsole}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        title="打开AI思考控制台"
      >
        <Terminal className="w-6 h-6" />
        {aiConsole.logs.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {aiConsole.logs.length > 99 ? '99+' : aiConsole.logs.length}
          </span>
        )}
      </button>

      {/* AI配置面板 */}
      <AIConfigPanel
        isOpen={showConfigPanel}
        onClose={() => setShowConfigPanel(false)}
        onConfigUpdate={handleConfigUpdate}
      />

      {/* AI控制台 */}
      <AIConsole
        isOpen={aiConsole.isConsoleOpen}
        onClose={aiConsole.closeConsole}
        logs={aiConsole.logs}
        onClearLogs={aiConsole.clearLogs}
      />
    </div>
  );
}

export default App; 