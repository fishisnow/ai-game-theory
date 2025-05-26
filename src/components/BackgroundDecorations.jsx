import React from 'react';

const BackgroundDecorations = () => {
  return (
    <>
      {/* 网格背景 */}
      <div className="fixed inset-0 grid-background opacity-50 pointer-events-none z-0" />
      
      {/* 装饰性圆圈 */}
      <div className="decoration-circle top-[10%] left-[5%]" style={{ animationDelay: '0s' }} />
      <div className="decoration-circle top-[60%] right-[5%]" style={{ animationDelay: '-5s' }} />
      
      {/* 额外的装饰元素 */}
      <div className="fixed top-[30%] left-[10%] w-2 h-2 bg-cyber-green rounded-full animate-ping opacity-75 pointer-events-none" />
      <div className="fixed top-[70%] right-[15%] w-1 h-1 bg-cyber-purple rounded-full animate-pulse opacity-60 pointer-events-none" />
      <div className="fixed top-[20%] right-[25%] w-3 h-3 bg-cyber-yellow rounded-full animate-bounce opacity-40 pointer-events-none" />
    </>
  );
};

export default BackgroundDecorations; 