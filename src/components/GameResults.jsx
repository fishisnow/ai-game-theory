import React from 'react';

const GameResults = ({ gameResult }) => {
  if (!gameResult) return null;

  const { average, target, winner, results } = gameResult;

  return (
    <div className="space-y-8">
      {/* 结果摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 text-center">
          <div className="text-xl text-cyber-yellow mb-4">平均值</div>
          <div className="text-3xl font-bold text-cyber-blue drop-shadow-lg">
            {average}
          </div>
        </div>
        <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 text-center">
          <div className="text-xl text-cyber-yellow mb-4">目标值 (2/3平均)</div>
          <div className="text-3xl font-bold text-cyber-blue drop-shadow-lg">
            {target}
          </div>
        </div>
        <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 text-center">
          <div className="text-xl text-cyber-yellow mb-4">获胜者</div>
          <div className="text-3xl font-bold text-cyber-blue drop-shadow-lg">
            {winner}
          </div>
        </div>
      </div>

      {/* 详细结果表格 */}
      <div className="cyber-card border-cyber-blue shadow-lg shadow-cyber-blue/20">
        <h3 className="text-2xl text-cyber-blue text-center mb-6 flex items-center justify-center">
          <span className="mr-3">📊</span>
          详细结果分析
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-300 border-collapse">
            <thead>
              <tr className="bg-cyber-blue bg-opacity-10">
                <th className="border border-cyber-blue p-4 text-cyber-blue">参与者</th>
                <th className="border border-cyber-blue p-4 text-cyber-blue">选择</th>
                <th className="border border-cyber-blue p-4 text-cyber-blue">与目标差距</th>
                <th className="border border-cyber-blue p-4 text-cyber-blue">状态</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr 
                  key={index} 
                  className={`${result.isWinner ? 'bg-cyber-green bg-opacity-20' : ''} 
                             hover:bg-white hover:bg-opacity-5 transition-colors duration-200`}
                >
                  <td className="border border-cyber-blue p-4 font-semibold">
                    {result.name}
                  </td>
                  <td className="border border-cyber-blue p-4 text-center text-cyber-blue font-bold">
                    {result.choice}
                  </td>
                  <td className="border border-cyber-blue p-4 text-center">
                    {result.difference}
                  </td>
                  <td className="border border-cyber-blue p-4 text-center">
                    {result.isWinner ? (
                      <span className="text-cyber-green font-bold">🏆 获胜</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 数据可视化占位符 */}
        <div className="mt-8 h-48 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 
                       border border-dashed border-cyber-blue rounded-lg 
                       flex items-center justify-center text-cyber-blue text-xl">
          <div className="text-center">
            <div className="mb-2">📈 数据可视化图表区域</div>
            <div className="text-sm text-gray-400">
              (可集成 Chart.js 或 D3.js 进行数据展示)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResults; 