import React from 'react';

const Header = () => {
  return (
    <header className="cyber-card border-cyber-blue shadow-lg shadow-cyber-blue/30 mb-6">
      <h1 className="text-3xl md:text-4xl font-bold cyber-gradient-text text-center mb-3 animate-title-glow">
        AI心理博弈实验室
      </h1>
      <h2 className="text-lg md:text-xl text-cyber-green text-center mb-4">
        猜2/3平均数 - 5场淘汰制锦标赛
      </h2>
      <p className="text-gray-300 text-base leading-relaxed max-w-3xl mx-auto text-center">
        这是一个经典的博弈论游戏实验的锦标赛版本。将进行5场完整的淘汰制比赛，
        每场比赛从4人开始，逐轮淘汰距离目标值最远的玩家，直到决出单场胜者。
        最终统计总存活轮数和获胜次数，看看谁能成为真正的博弈大师！
      </p>
    </header>
  );
};

export default Header; 