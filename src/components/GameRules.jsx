import React from 'react';

const GameRules = () => {
  const rules = [
    '每位玩家选择0-100之间的整数',
    '计算所有选择数字的平均值',
    '将平均值乘以2/3得到目标值',
    '最接近目标值的玩家获胜',
    '如果有平局，则共享胜利',
    '理论最优策略需要无限递归思考'
  ];

  return (
    <div className="cyber-card border-blue-500 shadow-lg shadow-blue-500/20">
      <h3 className="text-2xl text-cyber-blue text-center mb-6 flex items-center justify-center">
        <span className="mr-3">🎯</span>
        游戏规则
      </h3>
      <ul className="space-y-3 text-gray-300">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="text-cyber-green mr-3 animate-pulse-custom">▶</span>
            <span className="leading-relaxed">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameRules; 