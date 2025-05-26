import React from 'react';

const GameRules = () => {
  const rules = [
    '裁判选择已测试通过的AI模型参赛',
    '每个AI选择0-100之间的整数',
    '计算所有选择数字的平均值',
    '将平均值乘以2/3得到目标值',
    '距离目标值最远的AI被淘汰',
    '如果平局则继续下一轮',
    '单场比赛直到剩下1个AI获胜'
  ];

  return (
    <div className="cyber-card border-blue-500 shadow-lg shadow-blue-500/20 p-4">
      <h3 className="text-xl text-cyber-blue text-center mb-4 flex items-center justify-center">
        <span className="mr-2">🎯</span>
        比赛规则
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
        <div className="text-xs text-cyber-purple font-semibold mb-1">🏆 裁判规则</div>
        <div className="text-xs text-gray-300">
          您作为裁判可以自由选择参赛 AI。系统将进行5场完整比赛，统计每个 AI 的总存活轮数和获胜次数。
          只有配置完整、测试通过且启用的 AI 才能参赛，您可以在日志控制台查看比赛的过程。
        </div>
      </div>
    </div>
  );
};

export default GameRules; 