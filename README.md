# Mnemoflow 产品介绍页

Mnemoflow是一款基于认知科学理论，利用大型语言模型（LLM）为核心的智能化英语词汇学习应用。本项目为产品介绍页面，提供产品展示、功能介绍，并引导用户跳转到已部署的主应用。

## 项目结构

```
mnemoflow-landing/
├── landing-page/          # 产品介绍页
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React组件
│   │   ├── lib/           # 工具库
│   │   └── styles/        # 全局样式
│   ├── public/            # 静态资源
│   └── package.json
└── README.md
```

## 项目说明

### landing-page
- **项目定位**: 纯前端产品介绍页面
- **主要功能**: 产品展示、功能介绍、引导用户到登录页面
- **技术栈**:
  - **应用框架**: Next.js (App Router)
  - **核心库**: React + TypeScript
  - **样式方案**: Tailwind CSS
  - **组件体系**: shadcn/ui

## 开发指南

### 环境要求
- Node.js 18.0+
- npm 或 yarn

### 开发步骤

1. **安装依赖**
   ```bash
   cd landing-page && npm install
   ```

2. **启动开发服务器**
   ```bash
   cd landing-page && npm run dev
   ```

3. **构建生产版本**
   ```bash
   cd landing-page && npm run build
   ```

### 部署说明

本项目可以独立部署到根域名或子路径：

- **推荐部署**: 根域名 (https://mnemoflow.com)
- **跳转链接**: 介绍页底部会提供"开始使用"按钮，链接到已部署的主应用

### 页面跳转配置

在介绍页中配置跳转到主应用的链接：

```typescript
// 示例配置
const MAIN_APP_URL = process.env.MAIN_APP_URL || 'https://app.mnemoflow.com';
```