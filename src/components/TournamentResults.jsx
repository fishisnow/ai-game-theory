import React, { useState } from 'react';

const TournamentResults = ({ tournamentResult }) => {
  const [selectedMatch, setSelectedMatch] = useState(1);
  
  if (!tournamentResult) return null;

  const { allMatches, totalSurvivalRounds, averageSurvivalRounds, winCounts, totalMatches, displayNameMap } = tournamentResult;

  // 为柱状图准备数据（总存活轮数）- 使用显示名称
  const chartData = Object.entries(totalSurvivalRounds).map(([name, rounds]) => ({
    name,
    displayName: displayNameMap[name] || name,
    rounds,
    average: averageSurvivalRounds[name],
    wins: winCounts[name],
    percentage: (rounds / Math.max(...Object.values(totalSurvivalRounds))) * 100
  }));

  // 获取颜色
  const getPlayerColor = (name) => {
    const colors = {
      'OpenAI': '#00ffff',
      'Claude': '#ff00ff', 
      'Gemini': '#00ff88',
      'Azure-OpenAI': '#ffff00',
      'DeepSeek': '#ff6600',
      'Qwen': '#9966ff'
    };
    return colors[name] || '#ffffff';
  };

  // 找出总冠军 - 使用显示名称
  const maxWins = Math.max(...Object.values(winCounts));
  const champions = Object.entries(winCounts)
    .filter(([_, wins]) => wins === maxWins)
    .map(([name, _]) => displayNameMap[name] || name);

  return (
    <div className="space-y-6">
      {/* 锦标赛总结 */}
      <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 p-4">
        <h3 className="text-xl text-cyber-yellow text-center mb-4 flex items-center justify-center">
          <span className="mr-2">🏆</span>
          5场比赛总结
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg text-cyber-green mb-2">总比赛数</div>
            <div className="text-2xl font-bold text-cyber-blue">{totalMatches}</div>
          </div>
          <div>
            <div className="text-lg text-cyber-green mb-2">总冠军</div>
            <div className="text-2xl font-bold text-cyber-blue">
              {champions.join(', ')}
            </div>
          </div>
          <div>
            <div className="text-lg text-cyber-green mb-2">最高获胜次数</div>
            <div className="text-2xl font-bold text-cyber-blue">{maxWins}</div>
          </div>
        </div>
      </div>

      {/* 总存活轮数柱状图 */}
      <div className="cyber-card border-cyber-purple shadow-lg shadow-cyber-purple/20 p-4">
        <h3 className="text-xl text-cyber-purple text-center mb-6 flex items-center justify-center">
          <span className="mr-2">📊</span>
          总存活轮数统计
        </h3>
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold">{data.displayName}</span>
                <div className="text-right">
                  <div className="text-cyber-blue font-bold">{data.rounds} 轮总计</div>
                  <div className="text-xs text-gray-400">平均 {data.average} 轮 | {data.wins} 胜</div>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${data.percentage}%`,
                    backgroundColor: getPlayerColor(data.name),
                    boxShadow: `0 0 10px ${getPlayerColor(data.name)}50`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 各场比赛选择器 */}
      <div className="cyber-card border-cyber-green shadow-lg shadow-cyber-green/20 p-4">
        <h3 className="text-xl text-cyber-green text-center mb-4 flex items-center justify-center">
          <span className="mr-2">🎯</span>
          比赛详情
        </h3>
        <div className="flex justify-center mb-4 space-x-2">
          {allMatches.map((match, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                selectedMatch === match.matchNumber
                  ? 'bg-cyber-green text-black font-bold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedMatch(match.matchNumber)}
            >
              第{match.matchNumber}场
            </button>
          ))}
        </div>

        {/* 选中比赛的详情 */}
        {allMatches.find(m => m.matchNumber === selectedMatch) && (
          <div className="space-y-4">
            {(() => {
              const match = allMatches.find(m => m.matchNumber === selectedMatch);
              const winnerDisplay = Array.isArray(match.winnerDisplayName) 
                ? match.winnerDisplayName.join(', ') 
                : match.winnerDisplayName;
              
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <span className="text-cyber-yellow">总轮数:</span>
                      <span className="text-cyber-blue ml-2 font-bold">{match.totalRounds}</span>
                    </div>
                    <div>
                      <span className="text-cyber-yellow">胜者:</span>
                      <span className="text-cyber-blue ml-2 font-bold">
                        {winnerDisplay}
                      </span>
                    </div>
                    <div>
                      <span className="text-cyber-yellow">比赛状态:</span>
                      <span className="text-cyber-green ml-2 font-bold">已完成</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {match.roundResults.map((round, index) => (
                      <div key={index} className="border border-gray-600 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-base font-bold text-cyber-green">
                            第 {round.round} 轮
                          </h4>
                          <div className="text-xs text-gray-400">
                            参与: {round.activeDisplayNames ? round.activeDisplayNames.join(', ') : round.activePlayers.join(', ')}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 text-xs">
                          <div>
                            <span className="text-cyber-yellow">平均:</span>
                            <span className="text-cyber-blue ml-1 font-bold">{round.average}</span>
                          </div>
                          <div>
                            <span className="text-cyber-yellow">目标:</span>
                            <span className="text-cyber-blue ml-1 font-bold">{round.target}</span>
                          </div>
                          <div>
                            <span className="text-cyber-yellow">淘汰:</span>
                            <span className="text-red-400 ml-1 font-bold">
                              {round.hasElimination ? 
                                (round.eliminatedDisplayNames ? round.eliminatedDisplayNames.join(', ') : round.eliminatedPlayers.join(', ')) 
                                : '无'}
                            </span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="bg-gray-800">
                                <th className="border border-gray-600 p-1 text-cyber-blue">AI模型</th>
                                <th className="border border-gray-600 p-1 text-cyber-blue">选择</th>
                                <th className="border border-gray-600 p-1 text-cyber-blue">差距</th>
                                <th className="border border-gray-600 p-1 text-cyber-blue">状态</th>
                              </tr>
                            </thead>
                            <tbody>
                              {round.results.map((result, idx) => (
                                <tr key={idx} className={result.isEliminated ? 'bg-red-900 bg-opacity-30' : ''}>
                                  <td className="border border-gray-600 p-1 font-semibold">
                                    {result.displayName || result.name}
                                  </td>
                                  <td className="border border-gray-600 p-1 text-center text-cyber-blue font-bold">
                                    {result.choice}
                                  </td>
                                  <td className="border border-gray-600 p-1 text-center">{result.difference}</td>
                                  <td className="border border-gray-600 p-1 text-center">
                                    {result.isEliminated ? (
                                      <span className="text-red-400">❌</span>
                                    ) : (
                                      <span className="text-cyber-green">✅</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentResults; 