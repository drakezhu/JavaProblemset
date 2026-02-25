# Java后端面试准备工具

一个专为Java后端开发者设计的面试准备工具，帮助你系统地复习Java核心知识、框架原理和面试常见问题。

## 🚀 技术栈

### 后端
- **Spring Boot 3.2.5** - 轻量级Java后端框架
- **Gradle 9.3.1** - 项目构建工具
- **Java 17** - 编程语言
- **JSON** - 数据存储格式

### 前端
- **React 19.2.0** - 用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 现代化前端构建工具
- **CSS Grid/Flexbox** - 响应式布局

## 📦 安装和运行

### 前提条件
- Java 17 或更高版本
- Node.js 16 或更高版本
- npm 或 yarn
- Gradle 9.3.1 或更高版本（或使用项目中的Gradle Wrapper）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd InterviewPrep
   ```

2. **启动后端服务**
   ```bash
   # 使用Gradle Wrapper
   ./gradlew bootRun
   # 或使用系统安装的Gradle
   gradle bootRun
   ```
   后端服务将在 `http://localhost:8080` 启动

3. **启动前端服务**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   前端服务将在 `http://localhost:5173` 或其他可用端口启动

## 📁 项目结构

```
InterviewPrep/
├── build.gradle          # Gradle构建配置
├── src/
│   ├── main/
│   │   ├── java/com/interviewprep/
│   │   │   ├── controller/      # REST控制器
│   │   │   │   └── InterviewQuestionController.java
│   │   │   ├── service/         # 业务逻辑
│   │   │   │   └── InterviewQuestionService.java
│   │   │   ├── model/           # 数据模型
│   │   │   │   └── InterviewQuestion.java
│   │   │   └── InterviewPrepApplication.java  # 应用入口
│   │   └── resources/
│   │       └── questions.json   # 面试题数据
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # 主应用组件
│   │   ├── App.css              # 样式文件
│   │   ├── services/api.ts      # API服务
│   │   ├── types/InterviewQuestion.ts  # TypeScript类型定义
│   │   └── main.tsx             # 前端入口
│   ├── package.json             # 前端依赖配置
│   └── vite.config.ts           # Vite配置
└── README.md                    # 项目说明文档
```

## ✨ 功能特性

### 🎯 核心功能
- **按类别筛选** - 支持按Java核心、Spring、数据库等类别筛选问题
- **按难度筛选** - 支持按Easy、Medium、Hard难度级别筛选
- **分页浏览** - 避免无限滚动，每页显示固定数量的问题
- **详细查看** - 点击问题卡片查看完整答案和解析
- **响应式设计** - 适配桌面、平板和移动设备

### 📚 问题分类
- **Java核心** - 面向对象、集合框架、多线程、JVM等
- **Spring框架** - Spring Boot、Spring MVC、Spring AOP等
- **数据库** - SQL、事务、索引、Redis等
- **分布式系统** - 微服务、消息队列、分布式一致性等
- **设计模式** - 常用设计模式及其应用场景
- **算法** - 常见算法问题和解决方案
- **系统设计** - 高并发、高可用系统设计

## 📝 如何添加新问题

1. **编辑 `questions.json` 文件**
   ```json
   {
     "id": "unique-id",
     "question": "问题内容",
     "answer": "答案内容",
     "category": "类别名称",
     "difficulty": 1  // 1=Easy, 2=Medium, 3=Hard
   }
   ```

2. **重启后端服务** 以加载新问题
   ```bash
   ./gradlew bootRun
   ```

3. **刷新前端页面** 查看新问题

## 🎨 使用指南

1. **访问前端应用** - 打开浏览器访问 `http://localhost:5173`

2. **筛选问题**
   - 点击类别标签（如 "Java核心"、"Spring"）筛选特定类别的问题
   - 点击难度标签（如 "Easy"、"Medium"）筛选特定难度的问题
   - 支持组合筛选（同时按类别和难度）

3. **分页浏览**
   - 使用 "Previous" 和 "Next" 按钮切换页面
   - 在 "Questions per page" 下拉菜单中调整每页显示的问题数量

4. **查看详细答案**
   - 点击问题卡片或 "View Details" 按钮
   - 在弹出的模态框中查看完整问题和答案
   - 点击右上角 "×" 按钮或模态框外部关闭详情

5. **重置筛选**
   - 再次点击已选中的类别或难度标签取消选择

## 🔧 后端API

### 获取所有问题
```http
GET /api/questions
```

### 按类别获取问题
```http
GET /api/questions/category/{category}
```

### 按难度获取问题
```http
GET /api/questions/difficulty/{difficulty}
```

### 获取所有类别
```http
GET /api/categories
```

## 🤝 贡献指南

1. **Fork 项目**
2. **创建特性分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add some amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **打开 Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎉 鸣谢

- **Spring Boot** - 提供强大的后端框架支持
- **React** - 提供现代化的前端开发体验
- **TypeScript** - 增强代码可维护性和类型安全
- **Vite** - 提供快速的前端开发和构建体验

## 📞 联系

如有问题或建议，欢迎提交 Issue 或联系项目维护者。

---

**祝你面试顺利！💪**
