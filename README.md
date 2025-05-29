[![Image](./public/readme.jpg "AIGameTheory Front Page")](https://fishisnow.github.io/ai-game-theory)

中文 | [English](README_en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) &ensp;

# AI心理博弈大PK

一个 AI 心理博弈游戏项目，实现经典的"猜2/3平均数"博弈论游戏。

## 🎯 项目简介

这是一个经典的博弈论游戏实验。每位参与者需要选择0到100之间的一个数字，目标是猜出所有参与者选择数字平均值的2/3。最接近这个目标值的参与者获胜。


## 🎮 游戏特色

- **AI选手**: 让 GPT、Claude、Gemini、DeepSeek、Doubao 和 Qwen 的模型进行心理博弈 PK
- **科技风格**: 赛博朋克风格的用户界面
- **实时计算**: 自动计算游戏结果和获胜者
- **比赛控制台**: 实时显示AI思考过程和决策的过程

## 📦 安装和运行

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.jsx      # 页面头部
│   ├── GameRules.jsx   # 游戏规则
│   ├── AIPlayers.jsx   # AI选手展示
│   ├── GameControl.jsx # 游戏控制
│   ├── GameResults.jsx # 结果展示
│   └── BackgroundDecorations.jsx # 背景装饰
├── hooks/              # 自定义 Hooks
│   └── useGame.js      # 游戏状态管理
├── utils/              # 工具函数
│   └── aiStrategies.js # AI策略逻辑
├── App.js              # 主应用组件
├── index.js            # 应用入口
└── index.css           # 全局样式
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！ 