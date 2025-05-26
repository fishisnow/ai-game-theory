import { AIClient, AIConfigManager } from './aiClient';

// AI配置管理器实例
const configManager = new AIConfigManager();

// 创建AI客户端实例
const createAIClients = () => {
  const clients = {};
  const configs = configManager.getAllConfigs();
  
  Object.entries(configs).forEach(([name, config]) => {
    if (configManager.isConfigured(name)) {
      clients[name] = new AIClient(config);
    }
  });
  
  return clients;
};

// AI策略选择器
export const aiStrategies = {
  async getChoice(aiName, gameContext) {
    const clients = createAIClients();
    
    // 只使用已配置且启用的真实AI
    if (clients[aiName]) {
      return await clients[aiName].makeChoice(gameContext);
    }
    
    throw new Error(`AI ${aiName} 未配置或未启用`);
  }
};

// AI厂商信息（用于选择界面）
export const aiVendors = [
  {
    name: 'OpenAI',
    strategy: '深度推理型',
    description: '通过多层递归思考来预测其他玩家的选择'
  },
  {
    name: 'Claude',
    strategy: '逻辑分析型',
    description: '基于理性假设进行逻辑推理'
  },
  {
    name: 'Gemini',
    strategy: '概率计算型',
    description: '使用概率分布模型进行决策'
  },
  {
    name: 'Azure-OpenAI',
    strategy: '保守稳健型',
    description: '采用保守策略，倾向于选择较小的安全数值'
  },
  {
    name: 'DeepSeek',
    strategy: '心理分析型',
    description: '深度分析对手心理，采用激进的博弈策略'
  },
  {
    name: 'Qwen',
    strategy: '适应进化型',
    description: '根据游戏进程动态调整策略，具有强适应性'
  }
];

// 保持向后兼容
export const aiPlayers = aiVendors;

// 获取AI状态信息
export const getAIStatus = () => {
  const configs = configManager.getAllConfigs();
  const status = {};
  
  Object.entries(configs).forEach(([name, config]) => {
    status[name] = {
      configured: configManager.isConfigured(name),
      enabled: config.enabled,
      hasApiKey: !!config.apiKey,
      hasUrl: !!config.apiUrl,
      hasModel: !!config.model,
      tested: config.tested || false,
      vendor: config.vendor || name,
      model: config.model || ''
    };
  });
  
  return status;
};

// 获取可参赛的AI列表（已配置、已启用、已测试通过）
export const getEligibleAIs = () => {
  const configs = configManager.getAllConfigs();
  const eligible = [];
  
  Object.entries(configs).forEach(([name, config]) => {
    if (configManager.isConfigured(name) && config.tested) {
      eligible.push(name);
    }
  });
  
  return eligible;
};

// 获取AI的显示名称（厂商 + 模型）
export const getAIDisplayName = (aiName) => {
  return configManager.getDisplayName(aiName);
};

// 获取AI的厂商名称
export const getAIVendorName = (aiName) => {
  return configManager.getVendorName(aiName);
};

// 单轮游戏逻辑
export const calculateRoundResult = (aiChoices, activePlayers) => {
  const choices = {};
  
  // 只包含仍在游戏中的玩家
  activePlayers.forEach(player => {
    choices[player] = aiChoices[player];
  });

  const values = Object.values(choices);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const target = average * 2/3;

  // 计算每个玩家与目标的差距
  const results = Object.entries(choices).map(([name, choice]) => ({
    name,
    displayName: getAIDisplayName(name), // 添加显示名称
    choice,
    difference: parseFloat(Math.abs(choice - target).toFixed(2)),
  }));

  // 按差距排序，找出最远的玩家（被淘汰的）
  results.sort((a, b) => a.difference - b.difference);
  
  // 找出差距最大的玩家们（可能有平局）
  const maxDifference = Math.max(...results.map(r => r.difference));
  const eliminatedPlayers = results.filter(r => r.difference === maxDifference).map(r => r.name);
  
  return {
    choices,
    average: parseFloat(average.toFixed(2)),
    target: parseFloat(target.toFixed(2)),
    results: results.map(r => ({
      ...r,
      isEliminated: eliminatedPlayers.includes(r.name)
    })),
    eliminatedPlayers,
    eliminatedDisplayNames: eliminatedPlayers.map(name => getAIDisplayName(name)), // 添加显示名称
    hasElimination: eliminatedPlayers.length < activePlayers.length // 只有在不是全员平局时才算有淘汰
  };
};

// 单次完整比赛（从选定的AI开始）
export const playSingleMatch = async (selectedAIs) => {
  if (selectedAIs.length < 2) {
    throw new Error('至少需要2个AI参赛');
  }

  let activePlayers = [...selectedAIs];
  const roundResults = [];
  const survivalRounds = {};
  
  // 初始化存活轮数
  selectedAIs.forEach(ai => {
    survivalRounds[ai] = 0;
  });
  
  let round = 1;
  
  while (activePlayers.length > 1) {
    // 生成AI选择（支持异步）
    const aiChoices = {};
    const aiPromises = [];
    
    activePlayers.forEach(player => {
      const gameContext = {
        round,
        activePlayers: [...activePlayers],
        previousRounds: roundResults,
        isFirstMatch: roundResults.length === 0
      };
      
      aiPromises.push(
        aiStrategies.getChoice(player, gameContext).then(choice => {
          aiChoices[player] = choice;
        }).catch(error => {
          console.error(`${player} 选择失败:`, error);
          // 如果AI调用失败，该AI自动被淘汰
          aiChoices[player] = -1; // 设置一个无效值，确保被淘汰
        })
      );
    });
    
    // 等待所有AI做出选择
    await Promise.all(aiPromises);

    // 计算本轮结果
    const roundResult = calculateRoundResult(aiChoices, activePlayers);
    
    // 记录本轮结果
    roundResults.push({
      round,
      ...roundResult,
      activePlayers: [...activePlayers],
      activeDisplayNames: activePlayers.map(name => getAIDisplayName(name)) // 添加显示名称
    });

    // 如果有淘汰发生
    if (roundResult.hasElimination) {
      // 更新存活轮数（被淘汰的玩家记录当前轮数）
      roundResult.eliminatedPlayers.forEach(player => {
        survivalRounds[player] = round;
      });
      
      // 移除被淘汰的玩家
      activePlayers = activePlayers.filter(player => 
        !roundResult.eliminatedPlayers.includes(player)
      );
    }
    
    round++;
    
    // 防止无限循环
    if (round > 20) break;
  }
  
  // 最后的胜者获得最高轮数
  if (activePlayers.length === 1) {
    survivalRounds[activePlayers[0]] = round;
  } else if (activePlayers.length > 1) {
    // 如果最后仍有多人，他们都获得当前轮数
    activePlayers.forEach(player => {
      survivalRounds[player] = round;
    });
  }

  return {
    roundResults,
    survivalRounds,
    winner: activePlayers.length === 1 ? activePlayers[0] : activePlayers,
    winnerDisplayName: activePlayers.length === 1 ? getAIDisplayName(activePlayers[0]) : activePlayers.map(name => getAIDisplayName(name)), // 添加显示名称
    totalRounds: round - 1
  };
};

// 5次完整比赛的锦标赛
export const playTournament = async (selectedAIs) => {
  if (selectedAIs.length < 2) {
    throw new Error('至少需要2个AI参赛');
  }

  const totalMatches = 5;
  const allMatches = [];
  const totalSurvivalRounds = {};
  const winCounts = {};

  // 初始化统计数据
  selectedAIs.forEach(ai => {
    totalSurvivalRounds[ai] = 0;
    winCounts[ai] = 0;
  });

  // 进行5次完整比赛
  for (let matchNumber = 1; matchNumber <= totalMatches; matchNumber++) {
    const matchResult = await playSingleMatch(selectedAIs);
    
    // 累计存活轮数
    Object.entries(matchResult.survivalRounds).forEach(([player, rounds]) => {
      totalSurvivalRounds[player] += rounds;
    });
    
    // 统计获胜次数
    if (typeof matchResult.winner === 'string') {
      winCounts[matchResult.winner]++;
    } else if (Array.isArray(matchResult.winner)) {
      // 平局的情况
      matchResult.winner.forEach(winner => {
        winCounts[winner] += 1 / matchResult.winner.length;
      });
    }
    
    allMatches.push({
      matchNumber,
      ...matchResult
    });
  }

  // 计算平均存活轮数
  const averageSurvivalRounds = {};
  Object.entries(totalSurvivalRounds).forEach(([player, total]) => {
    averageSurvivalRounds[player] = parseFloat((total / totalMatches).toFixed(2));
  });

  // 添加显示名称映射
  const displayNameMap = {};
  selectedAIs.forEach(ai => {
    displayNameMap[ai] = getAIDisplayName(ai);
  });

  return {
    allMatches,
    totalSurvivalRounds,
    averageSurvivalRounds,
    winCounts,
    totalMatches,
    selectedAIs,
    displayNameMap // 添加显示名称映射
  };
}; 