// AI策略模拟
export const aiStrategies = {
  'GPT-4': () => {
    // 深度递归思考策略
    const levels = 3;
    let value = 50;
    for (let i = 0; i < levels; i++) {
      value = value * 2/3;
    }
    return Math.round(value + Math.random() * 5);
  },
  'Claude': () => {
    // 逻辑分析策略 - 假设其他人会选择理性值
    return Math.round(22 + Math.random() * 8);
  },
  'Gemini': () => {
    // 概率分布策略
    const base = 33.33;
    return Math.round(base * 0.67 + Math.random() * 10);
  }
};

// AI选手信息
export const aiPlayers = [
  {
    name: 'GPT-4',
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
    name: '您',
    strategy: '人类直觉型',
    description: '依靠人类的直觉和经验进行选择'
  }
];

// 单轮游戏逻辑
export const calculateRoundResult = (playerChoice, aiChoices, activePlayers) => {
  const choices = {};
  
  // 只包含仍在游戏中的玩家
  activePlayers.forEach(player => {
    if (player === '您') {
      choices[player] = playerChoice;
    } else {
      choices[player] = aiChoices[player];
    }
  });

  const values = Object.values(choices);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const target = average * 2/3;

  // 计算每个玩家与目标的差距
  const results = Object.entries(choices).map(([name, choice]) => ({
    name,
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
    hasElimination: eliminatedPlayers.length < activePlayers.length // 只有在不是全员平局时才算有淘汰
  };
};

// 单次完整比赛（从4人到1人）
export const playSingleMatch = (playerChoice) => {
  let activePlayers = ['您', 'GPT-4', 'Claude', 'Gemini'];
  const roundResults = [];
  const survivalRounds = {
    '您': 0,
    'GPT-4': 0,
    'Claude': 0,
    'Gemini': 0
  };
  
  let round = 1;
  
  while (activePlayers.length > 1) {
    // 生成AI选择
    const aiChoices = {};
    activePlayers.forEach(player => {
      if (player !== '您' && aiStrategies[player]) {
        aiChoices[player] = aiStrategies[player]();
      }
    });

    // 计算本轮结果
    const roundResult = calculateRoundResult(playerChoice, aiChoices, activePlayers);
    
    // 记录本轮结果
    roundResults.push({
      round,
      ...roundResult,
      activePlayers: [...activePlayers]
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
    if (round > 10) break;
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
    totalRounds: round - 1
  };
};

// 5次完整比赛的锦标赛
export const playTournament = (playerChoice) => {
  const totalMatches = 5;
  const allMatches = [];
  const totalSurvivalRounds = {
    '您': 0,
    'GPT-4': 0,
    'Claude': 0,
    'Gemini': 0
  };
  const winCounts = {
    '您': 0,
    'GPT-4': 0,
    'Claude': 0,
    'Gemini': 0
  };

  // 进行5次完整比赛
  for (let matchNumber = 1; matchNumber <= totalMatches; matchNumber++) {
    const matchResult = playSingleMatch(playerChoice);
    
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

  return {
    allMatches,
    totalSurvivalRounds,
    averageSurvivalRounds,
    winCounts,
    totalMatches
  };
}; 