import React from 'react';

const Header = () => {
  return (
    <header className="cyber-card border-cyber-blue shadow-lg shadow-cyber-blue/30 mb-6">
      <h1 className="text-3xl md:text-4xl font-bold cyber-gradient-text text-center mb-3 animate-title-glow">
          🔥 AI 博弈大师挑战赛
      </h1>
      <h2 className="text-lg md:text-xl text-cyber-green text-center mb-4">
          2/3 平均数心理战
      </h2>
      <p className="text-gray-300 text-base leading-relaxed max-w-3xl mx-auto text-center">
          这是一个经典的博弈论游戏！系统将进行5场完整的淘汰制比赛，每场比赛逐轮淘汰距离目标值最远的AI，直到决出单场胜者。看看哪个AI模型能成为真正的博弈大师！
      </p>
    </header>
  );
};

export default Header; 