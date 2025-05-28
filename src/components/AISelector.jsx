import React, { useState, useEffect } from 'react';
import { getEligibleAIs, aiVendors, getAIStatus } from '../utils/aiStrategies';
import { formatModelName } from '../utils/aiClient';

const AISelector = ({ onSelectionChange, selectedAIs = [] }) => {
  const [eligibleAIs, setEligibleAIs] = useState([]);
  const [localSelectedAIs, setLocalSelectedAIs] = useState(selectedAIs);
  const [aiStatus, setAiStatus] = useState({});

  useEffect(() => {
    const eligible = getEligibleAIs();
    const status = getAIStatus();
    setEligibleAIs(eligible);
    setAiStatus(status);
    
    // 如果当前选中的AI中有不再符合条件的，需要移除
    const validSelected = localSelectedAIs.filter(ai => eligible.includes(ai));
    if (validSelected.length !== localSelectedAIs.length) {
      setLocalSelectedAIs(validSelected);
      onSelectionChange(validSelected);
    }
  }, [localSelectedAIs, onSelectionChange]);

  const handleAIToggle = (aiName) => {
    const newSelection = localSelectedAIs.includes(aiName)
      ? localSelectedAIs.filter(ai => ai !== aiName)
      : [...localSelectedAIs, aiName];
    
    setLocalSelectedAIs(newSelection);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    setLocalSelectedAIs([...eligibleAIs]);
    onSelectionChange([...eligibleAIs]);
  };

  const handleClearAll = () => {
    setLocalSelectedAIs([]);
    onSelectionChange([]);
  };

  const getModelInfo = (aiName) => {
    const status = aiStatus[aiName];
    return status ? formatModelName(status.model) : '';
  };

  const getVendorInfo = (aiName) => {
    const status = aiStatus[aiName];
    return status ? status.vendor : aiName;
  };

  if (eligibleAIs.length === 0) {
    return (
      <div className="cyber-card border-red-500 shadow-lg shadow-red-500/20 p-3">
        <h3 className="text-lg text-red-400 text-center mb-3 flex items-center justify-center">
          <span className="mr-2">⚠️</span>
          无可参赛AI
        </h3>
        <div className="text-center text-gray-300">
          <p className="mb-3 text-sm">当前没有可参赛的AI模型。</p>
          <p className="text-xs text-gray-400">
            请先在AI配置中完成：配置API → 测试连接 → 启用参赛
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg text-cyber-yellow flex items-center">
          <span className="mr-2">🎯</span>
          裁判选择参赛AI ({localSelectedAIs.length}/{eligibleAIs.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-xs px-2 py-1 bg-cyber-green text-black rounded hover:bg-opacity-80 transition-all duration-300 font-semibold"
          >
            全选
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-opacity-80 transition-all duration-300 font-semibold"
          >
            清空
          </button>
        </div>
      </div>

      {/* 卡片形式的AI选择列表 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
        {eligibleAIs.map((aiName) => {
          const modelInfo = getModelInfo(aiName);
          const vendorInfo = getVendorInfo(aiName);
          const isSelected = localSelectedAIs.includes(aiName);
          
          return (
            <div
              key={aiName}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? 'border-cyber-green bg-cyber-green bg-opacity-10 shadow-lg shadow-cyber-green/30'
                  : 'border-gray-600 bg-black bg-opacity-20 hover:border-cyber-yellow hover:bg-opacity-30 hover:shadow-md hover:shadow-cyber-yellow/20'
              }`}
              onClick={() => handleAIToggle(aiName)}
            >
              {/* 选中状态指示器 */}
              <div className="absolute top-2 right-2">
                <span className="text-lg">
                  {isSelected ? '✅' : '⭕'}
                </span>
              </div>
              
              {/* AI信息 */}
              <div className="pr-8">
                <div className="font-bold text-cyber-blue text-sm mb-1 truncate">
                  {vendorInfo}
                </div>
                {modelInfo && (
                  <div className="text-xs text-cyber-yellow bg-black bg-opacity-40 px-2 py-1 rounded mb-2 truncate">
                    {modelInfo}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        {localSelectedAIs.length < 2 ? (
          <div className="text-red-400 text-xs">
            ⚠️ 至少需要选择2个AI才能开始比赛
          </div>
        ) : (
          <div className="text-cyber-green text-xs">
            ✅ 已选择 {localSelectedAIs.length} 个AI，可以开始比赛
          </div>
        )}
      </div>
    </div>
  );
};

export default AISelector; 