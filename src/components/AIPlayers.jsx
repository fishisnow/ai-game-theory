import React from 'react';
import { aiVendors } from '../utils/aiStrategies';

const AIPlayers = ({ aiStatus, onConfigClick }) => {
  const getStatusIcon = (playerName) => {
    const status = aiStatus[playerName];
    if (!status) return '❓';
    
    if (status.configured && status.enabled && status.tested) {
      return '✅'; // 可参赛
    } else if (status.tested) {
      return '🔵'; // 已测试但未启用
    } else if (status.configured) {
      return '⚠️'; // 已配置但未测试
    } else {
      return '❌'; // 未配置
    }
  };

  const getStatusText = (playerName) => {
    const status = aiStatus[playerName];
    if (!status) return '未知状态';
    
    if (status.configured && status.enabled && status.tested) {
      return '可参赛';
    } else if (status.tested) {
      return '已测试';
    } else if (status.configured) {
      return '待测试';
    } else {
      return '未配置';
    }
  };

  const getStatusColor = (playerName) => {
    const status = aiStatus[playerName];
    if (!status) return 'text-gray-500';
    
    if (status.configured && status.enabled && status.tested) {
      return 'text-cyber-green'; // 可参赛
    } else if (status.tested) {
      return 'text-cyber-blue'; // 已测试但未启用
    } else if (status.configured) {
      return 'text-cyber-yellow'; // 已配置但未测试
    } else {
      return 'text-gray-500'; // 未配置
    }
  };

  // 获取配置的模型信息
  const getModelInfo = (playerName) => {
    const status = aiStatus[playerName];
    if (!status || !status.model) return '';
    return status.model;
  };

  // 统计可参赛的AI数量
  const eligibleCount = aiVendors.filter(vendor => {
    const status = aiStatus[vendor.name];
    return status && status.configured && status.enabled && status.tested;
  }).length;

  return (
    <div className="cyber-card border-cyber-purple shadow-lg shadow-cyber-purple/20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-cyber-purple flex items-center">
          <span className="mr-2">🤖</span>
          AI厂商配置 ({eligibleCount}/{aiVendors.length} 可参赛)
        </h3>
        <button
          onClick={onConfigClick}
          className="text-xs px-3 py-1 bg-cyber-blue text-black rounded-lg hover:bg-opacity-80 transition-all duration-300 font-semibold"
        >
          配置AI
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {aiVendors.map((vendor, index) => {
          const modelInfo = getModelInfo(vendor.name);
          return (
            <div key={index} className="bg-black bg-opacity-40 rounded-lg p-3 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(vendor.name)}</span>
                  <span className="font-bold text-cyber-blue text-sm">{vendor.name}</span>
                </div>
                <span className={`text-xs font-semibold ${getStatusColor(vendor.name)}`}>
                  {getStatusText(vendor.name)}
                </span>
              </div>
              {modelInfo && (
                <div className="text-xs text-cyber-yellow mb-1">
                  <span className="text-cyber-green">模型:</span> {modelInfo}
                </div>
              )}
              <div className="text-xs text-gray-300 mb-1">
                <span className="text-cyber-green">策略:</span> {vendor.strategy}
              </div>
              <div className="text-xs text-gray-400">
                {vendor.description}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        💡 只有"可参赛"状态的AI厂商才能被选中参与比赛。点击"配置AI"设置和测试AI模型。
      </div>
    </div>
  );
};

export default AIPlayers; 