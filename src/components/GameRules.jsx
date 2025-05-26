import React from 'react';

const GameRules = () => {
  const rules = [
    '每位玩家选择0-100之间的整数',
    '计算所有选择数字的平均值',
    '将平均值乘以2/3得到目标值',
    '距离目标值最远的玩家被淘汰',
    '如果平局则继续下一轮',
    '单场比赛直到剩下1人获胜'
  ];

  return (
    <div className="cyber-card border-blue-500 shadow-lg shadow-blue-500/20 p-4">
      <h3 className="text-xl text-cyber-blue text-center mb-4 flex items-center justify-center">
        <span className="mr-2">🎯</span>
        淘汰制规则
      </h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="text-cyber-green mr-2 animate-pulse-custom text-xs">▶</span>
            <span className="leading-relaxed">{rule}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 p-3 bg-cyber-purple bg-opacity-10 rounded-lg border border-cyber-purple">
        <div className="text-xs text-cyber-purple font-semibold mb-1">🏆 锦标赛模式</div>
        <div className="text-xs text-gray-300">
          将进行5场完整比赛，统计每个玩家的总存活轮数和获胜次数。存活轮数最多者为总冠军。
        </div>
      </div>
    </div>
  );
};

export default GameRules; 