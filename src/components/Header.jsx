import React from 'react';

const Header = () => {
  return (
    <header className="cyber-card border-cyber-blue shadow-lg shadow-cyber-blue/30 mb-10">
      <h1 className="text-5xl md:text-6xl font-bold cyber-gradient-text text-center mb-4 animate-title-glow">
        AI心理博弈实验室
      </h1>
      <h2 className="text-xl md:text-2xl text-cyber-green text-center mb-6">
        猜2/3平均数 - 智能策略对决
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto text-center">
        这是一个经典的博弈论游戏实验。每位参与者（包括AI）需要选择0到100之间的一个数字，
        目标是猜出所有参与者选择数字平均值的2/3。最接近这个目标值的参与者获胜。
        让我们看看不同的AI在心理博弈中谁更胜一筹！
      </p>
    </header>
  );
};

export default Header; 