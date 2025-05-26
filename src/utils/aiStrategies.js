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

// 游戏逻辑
export const calculateGameResult = (playerChoice, aiChoices) => {
  const choices = {
    '您': playerChoice,
    ...aiChoices
  };

  const values = Object.values(choices);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const target = average * 2/3;

  // 找出获胜者
  let winner = '';
  let minDiff = Infinity;
  for (const [name, choice] of Object.entries(choices)) {
    const diff = Math.abs(choice - target);
    if (diff < minDiff) {
      minDiff = diff;
      winner = name;
    }
  }

  return {
    choices,
    average: parseFloat(average.toFixed(2)),
    target: parseFloat(target.toFixed(2)),
    winner,
    results: Object.entries(choices).map(([name, choice]) => ({
      name,
      choice,
      difference: parseFloat(Math.abs(choice - target).toFixed(2)),
      isWinner: Math.abs(choice - target) === minDiff
    }))
  };
}; 