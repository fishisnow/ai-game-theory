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
      this.log('thinking', `开始分析第${gameContext.round}轮的策略...`);
      
      const prompt = this.buildPrompt(gameContext);
      this.log('thinking', `构建提示词完成，准备向${this.vendor}发送请求`);
      
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一个参与博弈论游戏的AI。你需要在"猜2/3平均数"游戏中做出最优选择。请详细说明你的思考过程，然后给出你的选择。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300, // 增加token数量以获取更详细的思考过程
        temperature: 0.7
      };

      this.log('thinking', `发送API请求到 ${this.apiUrl}`);
      
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
      
      this.log('thinking', `收到AI回复: ${aiResponse}`);
      
      // 从AI回复中提取数字
      const choice = this.extractNumber(aiResponse);
      
      if (choice === null || choice < 0 || choice > 100) {
        const warningMsg = `返回无效选择: ${aiResponse}, 使用备选策略`;
        this.log('warning', warningMsg);
        const fallbackChoice = this.getFallbackChoice();
        this.log('decision', `使用备选策略选择: ${fallbackChoice}`, { 
          originalResponse: aiResponse, 
          fallbackChoice 
        });
        return fallbackChoice;
      }
      
      this.log('decision', `最终选择: ${choice}`, { 
        choice, 
        reasoning: aiResponse,
        round: gameContext.round,
        activePlayers: gameContext.activePlayers
      });
      
      return choice;
    } catch (error) {
      this.log('error', `AI请求失败: ${error.message}`, error);
      // 如果API调用失败，返回一个基于简单策略的数字
      const fallbackChoice = this.getFallbackChoice();
      this.log('decision', `使用紧急备选策略: ${fallbackChoice}`, { fallbackChoice });
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
          this.logger.logAIDecision(this.name, message, data);
          break;
        case 'error':
          this.logger.logError(message, this.name, data);
          break;
        case 'warning':
          this.logger.logWarning(message, this.name, data);
          break;
        default:
          this.logger.logInfo(message, this.name, data);
      }
    }
  }

  buildPrompt(gameContext) {
    const { round, activePlayers, previousRounds, isFirstMatch } = gameContext;
    
    let prompt = `这是一个"猜2/3平均数"的博弈游戏。

游戏规则：
- 每位玩家选择0到100之间的整数
- 计算所有选择的平均值，然后乘以2/3得到目标值
- 距离目标值最远的玩家被淘汰
- 游戏继续直到只剩一人

当前情况：
- 第${round}轮
- 当前参与者：${activePlayers.join(', ')}`;

    if (previousRounds && previousRounds.length > 0) {
      prompt += `\n\n历史轮次：`;
      previousRounds.forEach((r, index) => {
        prompt += `\n第${index + 1}轮: 平均值${r.average}, 目标值${r.target}, 淘汰${r.eliminatedPlayers.join(', ')}`;
      });
    }

    prompt += `\n\n请分析当前局势，考虑其他玩家可能的策略，然后选择一个0到100之间的整数。
请直接回答数字，可以简单说明理由。`;

    return prompt;
  }

  extractNumber(text) {
    // 尝试提取文本中的数字
    const matches = text.match(/\b(\d{1,3})\b/g);
    if (matches) {
      for (const match of matches) {
        const num = parseInt(match);
        if (num >= 0 && num <= 100) {
          return num;
        }
      }
    }
    return null;
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
      'OpenAI': {
        vendor: 'OpenAI',
        name: 'OpenAI',
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
      'Azure-OpenAI': {
        vendor: 'Microsoft',
        name: 'Azure-OpenAI',
        apiUrl: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview',
        apiKey: '',
        model: 'gpt-4',
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
      'Alibaba': {
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

  // 获取实际参赛的模型名称（厂商 + 模型）
  getDisplayName(name) {
    const config = this.configs[name];
    if (!config) return name;
    return `${config.vendor} ${config.model}`;
  }

  // 获取厂商名称
  getVendorName(name) {
    const config = this.configs[name];
    return config ? config.vendor : name;
  }
} 