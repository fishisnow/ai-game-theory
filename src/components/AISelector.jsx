import React, { useState, useEffect } from 'react';
import { getEligibleAIs, aiVendors, getAIStatus } from '../utils/aiStrategies';

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

  const getAIInfo = (aiName) => {
    return aiVendors.find(vendor => vendor.name === aiName);
  };

  const getModelInfo = (aiName) => {
    const status = aiStatus[aiName];
    return status ? status.model : '';
  };

  const getVendorInfo = (aiName) => {
    const status = aiStatus[aiName];
    return status ? status.vendor : aiName;
  };

  if (eligibleAIs.length === 0) {
    return (
      <div className="cyber-card border-red-500 shadow-lg shadow-red-500/20 p-4">
        <h3 className="text-xl text-red-400 text-center mb-4 flex items-center justify-center">
          <span className="mr-2">⚠️</span>
          无可参赛AI
        </h3>
        <div className="text-center text-gray-300">
          <p className="mb-4">当前没有可参赛的AI模型。</p>
          <p className="text-sm text-gray-400">
            请先在AI配置中完成以下步骤：
            <br />1. 配置API信息
            <br />2. 测试连接成功
            <br />3. 启用参赛
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-card border-cyber-yellow shadow-lg shadow-cyber-yellow/20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-cyber-yellow flex items-center">
          <span className="mr-2">🎯</span>
          裁判选择参赛AI ({localSelectedAIs.length}/{eligibleAIs.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 bg-cyber-green text-black rounded-lg hover:bg-opacity-80 transition-all duration-300 font-semibold"
          >
            全选
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-opacity-80 transition-all duration-300 font-semibold"
          >
            清空
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {eligibleAIs.map((aiName) => {
          const aiInfo = getAIInfo(aiName);
          const modelInfo = getModelInfo(aiName);
          const vendorInfo = getVendorInfo(aiName);
          const isSelected = localSelectedAIs.includes(aiName);
          
          return (
            <div
              key={aiName}
              className={`bg-black bg-opacity-40 rounded-lg p-3 border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-cyber-green shadow-lg shadow-cyber-green/30'
                  : 'border-gray-600 hover:border-cyber-yellow'
              }`}
              onClick={() => handleAIToggle(aiName)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {isSelected ? '✅' : '⭕'}
                  </span>
                  <span className="font-bold text-cyber-blue text-sm">{vendorInfo}</span>
                </div>
                <span className="text-xs text-cyber-green font-semibold">
                  可参赛
                </span>
              </div>
              {modelInfo && (
                <div className="text-xs text-cyber-yellow mb-1">
                  <span className="text-cyber-green">模型:</span> {modelInfo}
                </div>
              )}
              {aiInfo && (
                <>
                  <div className="text-xs text-gray-300 mb-1">
                    <span className="text-cyber-green">策略:</span> {aiInfo.strategy}
                  </div>
                  <div className="text-xs text-gray-400">
                    {aiInfo.description}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        {localSelectedAIs.length < 2 ? (
          <div className="text-red-400 text-sm">
            ⚠️ 至少需要选择2个AI才能开始比赛
          </div>
        ) : (
          <div className="text-cyber-green text-sm">
            ✅ 已选择 {localSelectedAIs.length} 个AI，可以开始比赛
          </div>
        )}
      </div>
    </div>
  );
};

export default AISelector; 