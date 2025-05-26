import React, { useState, useEffect } from 'react';
import { AIConfigManager } from '../utils/aiClient';

const AIConfigPanel = ({ isOpen, onClose, onConfigUpdate }) => {
  const [configManager] = useState(() => new AIConfigManager());
  const [configs, setConfigs] = useState({});
  const [activeTab, setActiveTab] = useState('OpenAI');
  const [testingAI, setTestingAI] = useState(null);

  useEffect(() => {
    setConfigs(configManager.getAllConfigs());
  }, [configManager]);

  const handleConfigChange = (aiName, field, value) => {
    const newConfigs = {
      ...configs,
      [aiName]: {
        ...configs[aiName],
        [field]: value
      }
    };
    
    // 如果修改了关键配置，重置测试状态
    if (['apiUrl', 'apiKey', 'model'].includes(field)) {
      newConfigs[aiName].tested = false;
    }
    
    setConfigs(newConfigs);
  };

  const handleSave = (aiName) => {
    configManager.updateConfig(aiName, configs[aiName]);
    onConfigUpdate && onConfigUpdate();
    alert(`${configs[aiName].vendor || aiName} 配置已保存！`);
  };

  const handleTest = async (aiName) => {
    const config = configs[aiName];
    if (!config.apiKey || !config.apiUrl || !config.model) {
      alert('请先完整填写配置信息！');
      return;
    }

    setTestingAI(aiName);
    
    try {
      // 简单的测试请求
      console.log(config.apiUrl)
      console.log(config.apiKey)
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'user',
              content: '请回复一个0到100之间的数字'
            }
          ],
          max_tokens: 10
        })
      });

      if (response.ok) {
        // 测试成功，保存测试状态
        configManager.setTestStatus(aiName, true);
        const updatedConfigs = { ...configs };
        updatedConfigs[aiName].tested = true;
        setConfigs(updatedConfigs);
        onConfigUpdate && onConfigUpdate();
        alert(`${config.vendor || aiName} 连接测试成功！该AI现在可以参赛了。`);
      } else {
        // 测试失败，清除测试状态
        configManager.setTestStatus(aiName, false);
        const updatedConfigs = { ...configs };
        updatedConfigs[aiName].tested = false;
        setConfigs(updatedConfigs);
        onConfigUpdate && onConfigUpdate();
        alert(`${config.vendor || aiName} 连接测试失败: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // 测试失败，清除测试状态
      configManager.setTestStatus(aiName, false);
      const updatedConfigs = { ...configs };
      updatedConfigs[aiName].tested = false;
      setConfigs(updatedConfigs);
      onConfigUpdate && onConfigUpdate();
      alert(`${config.vendor || aiName} 连接测试失败: ${error.message}`);
    } finally {
      setTestingAI(null);
    }
  };

  const getStatusColor = (aiName) => {
    const config = configs[aiName];
    if (!config) return 'text-gray-500';
    
    if (config.enabled && config.apiKey && config.apiUrl && config.model && config.tested) {
      return 'text-cyber-green'; // 完全就绪
    } else if (config.tested) {
      return 'text-cyber-blue'; // 已测试但未启用
    } else if (config.apiKey && config.apiUrl && config.model) {
      return 'text-cyber-yellow'; // 已配置但未测试
    } else {
      return 'text-gray-500'; // 未配置
    }
  };

  const getStatusText = (aiName) => {
    const config = configs[aiName];
    if (!config) return '未配置';
    
    if (config.enabled && config.apiKey && config.apiUrl && config.model && config.tested) {
      return '可参赛';
    } else if (config.tested) {
      return '已测试';
    } else if (config.apiKey && config.apiUrl && config.model) {
      return '待测试';
    } else {
      return '未配置';
    }
  };

  const getStatusIcon = (aiName) => {
    const config = configs[aiName];
    if (!config) return '❓';
    
    if (config.enabled && config.apiKey && config.apiUrl && config.model && config.tested) {
      return '✅'; // 可参赛
    } else if (config.tested) {
      return '🔵'; // 已测试但未启用
    } else if (config.apiKey && config.apiUrl && config.model) {
      return '⚠️'; // 已配置但未测试
    } else {
      return '❌'; // 未配置
    }
  };

  const getDisplayName = (aiName) => {
    const config = configs[aiName];
    return config ? config.vendor || aiName : aiName;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="cyber-card border-cyber-blue shadow-lg shadow-cyber-blue/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyber-blue">AI厂商配置</h2>
          <button
            onClick={onClose}
            className="text-cyber-blue hover:text-cyber-yellow transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* AI选择标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(configs).map((aiName) => (
            <button
              key={aiName}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === aiName
                  ? 'bg-cyber-blue text-black font-bold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab(aiName)}
            >
              <div className="flex items-center space-x-2">
                <span>{getDisplayName(aiName)}</span>
                <span className="text-sm">{getStatusIcon(aiName)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 配置表单 */}
        {configs[activeTab] && (
          <div className="space-y-6">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 mb-4">
              <h4 className="text-cyber-yellow font-semibold mb-2">
                配置 {getDisplayName(activeTab)} 厂商
              </h4>
              <p className="text-xs text-gray-300">
                配置此厂商的API信息和模型。实际参赛时将显示为：
                <span className="text-cyber-blue font-bold ml-1">
                  {configs[activeTab].vendor} {configs[activeTab].model || '[模型名称]'}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cyber-green text-sm font-semibold mb-2">
                  API URL
                </label>
                <input
                  type="text"
                  className="w-full bg-black bg-opacity-80 border-2 border-gray-600 rounded-lg px-4 py-2 text-cyber-blue focus:border-cyber-yellow focus:outline-none transition-colors"
                  value={configs[activeTab].apiUrl || ''}
                  onChange={(e) => handleConfigChange(activeTab, 'apiUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1/chat/completions"
                />
              </div>

              <div>
                <label className="block text-cyber-green text-sm font-semibold mb-2">
                  Model
                </label>
                <input
                  type="text"
                  className="w-full bg-black bg-opacity-80 border-2 border-gray-600 rounded-lg px-4 py-2 text-cyber-blue focus:border-cyber-yellow focus:outline-none transition-colors"
                  value={configs[activeTab].model || ''}
                  onChange={(e) => handleConfigChange(activeTab, 'model', e.target.value)}
                  placeholder="gpt-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-cyber-green text-sm font-semibold mb-2">
                API Key
              </label>
              <input
                type="password"
                className="w-full bg-black bg-opacity-80 border-2 border-gray-600 rounded-lg px-4 py-2 text-cyber-blue focus:border-cyber-yellow focus:outline-none transition-colors"
                value={configs[activeTab].apiKey || ''}
                onChange={(e) => handleConfigChange(activeTab, 'apiKey', e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`enabled-${activeTab}`}
                className="w-4 h-4 text-cyber-green bg-gray-800 border-gray-600 rounded focus:ring-cyber-green"
                checked={configs[activeTab].enabled || false}
                onChange={(e) => handleConfigChange(activeTab, 'enabled', e.target.checked)}
              />
              <label htmlFor={`enabled-${activeTab}`} className="text-cyber-green">
                启用此AI参与游戏
              </label>
              <span className={`text-sm font-semibold ${getStatusColor(activeTab)}`}>
                ({getStatusText(activeTab)})
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSave(activeTab)}
                className="cyber-button px-6 py-2"
              >
                保存配置
              </button>
              <button
                onClick={() => handleTest(activeTab)}
                disabled={testingAI === activeTab}
                className="px-6 py-2 bg-cyber-purple text-white rounded-lg hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50"
              >
                {testingAI === activeTab ? '测试中...' : '测试连接'}
              </button>
            </div>

            {/* 配置说明 */}
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-sm text-gray-300">
              <h4 className="text-cyber-yellow font-semibold mb-2">参赛条件：</h4>
              <ul className="space-y-1 text-xs">
                <li>• <strong>✅ 可参赛:</strong> 已配置 + 已启用 + 测试通过</li>
                <li>• <strong>🔵 已测试:</strong> 连接正常但未启用参赛</li>
                <li>• <strong>⚠️ 待测试:</strong> 已配置但需要测试连接</li>
                <li>• <strong>❌ 未配置:</strong> 缺少必要的配置信息</li>
              </ul>
              <div className="mt-3 text-xs text-cyber-yellow">
                💡 只有状态为"可参赛"的AI厂商才能被选中参与比赛。
                比赛结果将显示具体的模型名称（如：OpenAI gpt-4）
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConfigPanel; 