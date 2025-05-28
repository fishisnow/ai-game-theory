// 处理模型名称，截断超过3个连字符的部分
export const formatModelName = (modelName) => {
  if (!modelName) return '';
  
  const parts = modelName.split('-');
  if (parts.length > 3) {
    return parts.slice(0, 3).join('-');
  }
  return modelName;
};

// OpenAI 格式的 AI 客户端
export class AIClient {
  constructor(config, logger = null) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.name = config.name;
    this.vendor = config.vendor;
    this.logger = logger; // 日志记录器
  }

  async makeChoice(gameContext) {
    try {
      const prompt = this.buildPrompt(gameContext);
      console.log(prompt);
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一个参与博弈论游戏的AI。你需要在"猜2/3平均数"游戏中做出最优选择。请分析局势并严格按照JSON格式回复：{"reasoning": "你的分析", "choice": 数字}。choice必须是0-100之间的整数。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      };
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorMsg = `API请求失败: ${response.status} ${response.statusText}`;
        this.log('error', errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // 从AI回复中提取数字和推理过程
      const { choice, reasoning } = this.extractChoiceAndReasoning(aiResponse);
      
      if (choice === null || choice < 0 || choice > 100) {
        const fallbackChoice = this.getFallbackChoice();
        this.log('decision', `选择: ${fallbackChoice} (备选策略)`);
        return fallbackChoice;
      }
      
      // 记录AI的思考过程和最终选择
      if (reasoning) {
        this.log('thinking', reasoning);
      }
      this.log('decision', `选择: ${choice}`);
      
      return choice;
    } catch (error) {
      this.log('error', `请求失败: ${error.message}`);
      const fallbackChoice = this.getFallbackChoice();
      this.log('decision', `选择: ${fallbackChoice} (紧急备选)`);
      return fallbackChoice;
    }
  }

  // 日志记录方法
  log(type, message, data = null) {
    if (this.logger) {
      switch (type) {
        case 'thinking':
          this.logger.logAIThinking(this.name, message);
          break;
        case 'decision':
          this.logger.logAIDecision(this.name, message);
          break;
        case 'error':
          this.logger.logError(message, this.name);
          break;
        case 'warning':
          this.logger.logWarning(message, this.name);
          break;
        default:
          this.logger.logInfo(message, this.name);
      }
    }
  }

  buildPrompt(gameContext) {
    const { round, activePlayers, previousRounds, isFirstMatch } = gameContext;
    
    // 从参与者列表中排除当前AI，得到对手列表
    const opponents = activePlayers.filter(player => player !== this.name);
    
    let prompt = `这是一个"猜2/3平均数"的博弈游戏。

游戏规则：
- 每位玩家选择0到100之间的整数
- 计算所有选择的平均值，然后乘以2/3得到目标值
- 距离目标值最远的玩家被淘汰
- 游戏继续直到只剩一人

**重要说明：在以下所有信息中，"You"代表你自己（${this.name}），其他名称代表你的对手。**

当前情况：
- 第${round}轮
- 你的对手：${opponents.length > 0 ? opponents.join(', ') : '无（你已获胜）'}`;

    if (previousRounds && previousRounds.length > 0) {
      prompt += `\n\n历史轮次详情：`;
      previousRounds.forEach((r, index) => {
        prompt += `\n\n第${index + 1}轮:`;
        prompt += `\n  平均值: ${r.average}, 目标值: ${r.target}`;
        
        // 显示每个玩家的选择
        prompt += `\n  各玩家选择:`;
        Object.entries(r.choices).forEach(([player, choice]) => {
          const isEliminated = r.eliminatedPlayers.includes(player);
          const status = isEliminated ? ' (被淘汰)' : '';
          const isMe = player === this.name;
          const playerLabel = isMe ? 'You' : player;
          prompt += `\n    ${playerLabel}: ${choice}${status}`;
        });
        
        if (r.eliminatedPlayers.length > 0) {
          // 在淘汰信息中也使用相同的标识方式
          const eliminatedDisplay = r.eliminatedPlayers.map(player => 
            player === this.name ? 'You' : player
          ).join(', ');
          prompt += `\n  本轮淘汰: ${eliminatedDisplay}`;
        }
      });
      
      // 添加对手策略分析提示
      if (opponents.length > 0) {
        prompt += `\n\n对手策略分析提示：`;
        prompt += `\n- 观察对手的历史选择模式`;
        prompt += `\n- 分析对手是否趋向保守或激进`;
        prompt += `\n- 考虑对手可能的心理变化和适应性`;
        prompt += `\n- 预测对手在当前轮次的可能选择范围`;
        prompt += `\n- 注意：上述历史数据中"You"是你自己的选择，其他名称是对手的选择`;
      }
    }

    prompt += `\n\n请基于以上信息进行深度分析：
1. 分析每个对手的选择模式和策略倾向
2. 考虑对手可能的心理状态变化（如被淘汰压力、适应性调整等）
3. 预测对手在本轮的可能选择范围
4. 制定你的最优策略来应对当前局势

然后选择一个0到100之间的整数。

**重要：请严格按照以下JSON格式回复，不要添加任何其他内容：**

{
  "reasoning": "你的详细分析和推理过程，包括对手策略分析",
  "choice": 你的数字选择
}

示例：
{
  "reasoning": "通过分析历史数据，发现对手A倾向于选择较大数字，对手B比较保守。考虑到当前轮次和心理压力，我预测平均值会在X附近，因此选择Y",
  "choice": 33
}`;

    return prompt;
  }

  extractChoiceAndReasoning(text) {
    // 首先尝试解析JSON格式
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData.choice !== undefined) {
          const choice = parseInt(jsonData.choice);
          const reasoning = jsonData.reasoning || null;
          if (!isNaN(choice) && choice >= 0 && choice <= 100) {
            return { choice, reasoning };
          }
        }
      }
    } catch (error) {
      // JSON解析失败，继续尝试备用方案
    }

    // 备用方案：查找最后一个有效的数字
    const matches = text.match(/\b(\d{1,3})\b/g);
    if (matches) {
      // 从后往前查找，优先选择最后出现的有效数字
      for (let i = matches.length - 1; i >= 0; i--) {
        const num = parseInt(matches[i]);
        if (num >= 0 && num <= 100) {
          return { choice: num, reasoning: null };
        }
      }
    }
    
    return { choice: null, reasoning: null };
  }

  getFallbackChoice() {
    // 简单的备选策略：基于2/3递归思考
    let value = 50;
    for (let i = 0; i < 3; i++) {
      value = value * 2/3;
    }
    return Math.round(value + Math.random() * 5);
  }
}

// AI配置管理
export class AIConfigManager {
  constructor() {
    this.configs = this.loadConfigs();
  }

  loadConfigs() {
    const saved = localStorage.getItem('aiConfigs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('加载AI配置失败:', error);
      }
    }
    return this.getDefaultConfigs();
  }

  saveConfigs() {
    localStorage.setItem('aiConfigs', JSON.stringify(this.configs));
  }

  getDefaultConfigs() {
    return {
      'GPT': {
        vendor: 'OpenAI',
        name: 'GPT',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-4',
        enabled: false,
        tested: false
      },
      'Claude': {
        vendor: 'Anthropic',
        name: 'Claude',
        apiUrl: 'https://api.anthropic.com/v1/messages',
        apiKey: '',
        model: 'claude-3-sonnet-20240229',
        enabled: false,
        tested: false
      },
      'Gemini': {
        vendor: 'Google',
        name: 'Gemini',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: '',
        model: 'gemini-pro',
        enabled: false,
        tested: false
      },
      'Doubao': {
        vendor: 'ByteDance',
        name: 'Doubao',
        apiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        apiKey: '',
        model: 'doubao-pro-4k',
        enabled: false,
        tested: false
      },
      'DeepSeek': {
        vendor: 'DeepSeek',
        name: 'DeepSeek',
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: '',
        model: 'deepseek-chat',
        enabled: false,
        tested: false
      },
      'Qwen': {
        vendor: 'Alibaba',
        name: 'Qwen',
        apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        apiKey: '',
        model: 'qwen-turbo',
        enabled: false,
        tested: false
      }
    };
  }

  updateConfig(name, config) {
    this.configs[name] = { ...this.configs[name], ...config };
    this.saveConfigs();
  }

  // 设置测试状态
  setTestStatus(name, tested) {
    if (this.configs[name]) {
      this.configs[name].tested = tested;
      this.saveConfigs();
    }
  }

  getConfig(name) {
    return this.configs[name];
  }

  getAllConfigs() {
    return this.configs;
  }

  isConfigured(name) {
    const config = this.configs[name];
    return config && config.apiKey && config.apiUrl && config.model && config.enabled;
  }

  // 检查是否可参赛（已配置、已启用、已测试通过）
  isEligible(name) {
    const config = this.configs[name];
    return this.isConfigured(name) && config.tested;
  }

  // 获取实际参赛的模型名称
  getDisplayName(name) {
    const config = this.configs[name];
    if (!config) return name;
    return formatModelName(config.model);
  }

  // 获取厂商名称
  getVendorName(name) {
    const config = this.configs[name];
    return config ? config.vendor : name;
  }
} 