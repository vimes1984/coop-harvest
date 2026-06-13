# 为 Growers' Collective 贡献力量 ☘️

感谢您有兴趣为 **Growers' Collective** 贡献力量！无论您是开发者、设计师、文案撰写者、农户还是社区活动家，您的帮助对于构建一个更公平、农户直连消费者的合作社网络都是无价的。

> [!IMPORTANT]
> **概念验证 (PoC) 阶段**  
> 该项目目前是一个本地开发原型和概念验证。我们目前还没有活跃用户或实际交易。所有的代码库样式、模拟账本和本地化数据都是为了验证未来实际试点的架构而设计的。

---

## 🗺️ 如何参与

我们欢迎各种形式的贡献：
* **💻 开发**：修复 Bug，为 React 前端或 Express 后端添加功能，或改进原生打包（Electron/Capacitor）。
* **🎨 UI/UX 设计**：改进响应式移动端/桌面端布局，设计无障碍仪表板，或创建图形。
* **✍️ 文案与本地化**：为爱尔兰当地农场撰写故事，翻译术语，或完善有关粮食主权的宣传教育内容。
* **🚜 推广与物流**：设计社区分发模板（例如 GAA 自提指南、教区中心指南）。

---

## 🛠️ 本地开发环境设置

该项目结构为一个解耦的单体多仓库，包含 `/frontend` (React + TypeScript) 和 `/backend` (Express + MongoDB)。

### 前提条件
* Node.js（推荐版本 16.x 或更高）
* MongoDB（本地实例或免费的 [MongoDB Atlas 集群](https://www.mongodb.com/cloud/atlas)）
* Git

### 逐步环境配置步骤

1. **Fork 并克隆仓库**：
   ```bash
   git clone https://github.com/vimes1984/coop-harvest.git
   cd coop-harvest
   ```

2. **配置后端**：
   - 导航到 `/backend`。
   - 将 `.env.example` 复制为 `.env`（或创建一个新的 `.env` 文件）。
   - 配置您的 `MONGO_URI`（例如来自 Atlas 的连接字符串）以及您期望的 `PORT`（默认为 `5001`）。
   - 安装依赖项并启动开发服务器：
     ```bash
     npm install
     npm run dev
     ```
   - *注意：如果已连接 MongoDB 且数据库为空，服务器将自动播种初始的模拟爱尔兰种植者、产品和提案。*

3. **配置前端**：
   - 导航到 `/frontend`。
   - 安装依赖项：
     ```bash
     npm install --ignore-scripts
     ```
   - 启动 Vite 开发服务器：
     ```bash
     npm run dev
     ```
   - 在浏览器中打开 [http://localhost:5173](http://localhost:5173)。

---

## 🤝 贡献工作流

我们遵循标准的 Fork-and-Pull 模型：

1. **查找 Issue**：浏览打开的 Issue 或打开一个新的 Issue 来讨论功能提案或 Bug 报告。
2. **创建分支**：从 `main` 分支拉出一个功能分支，对其进行描述性命名（例如 `feature/add-csa-calculator` 或 `bugfix/fix-checkout-total`）。
3. **提交您的更改**：
   - 保持提交专注，并编写清晰、描述性的提交信息。
   - 保持该代码库作为**概念验证**的定位至关重要。请确保任何新增的文本均明确地将分配/运营界定为*预测/目标模型*，以避免误导用户。
4. **提交拉取请求 (PR)**：
   - 提供您更改的清晰摘要并引用 Issue 编号。
   - 确保您的代码编译成功（在后端和前端运行 `npm run build` 均无错误）。

---

## 🎨 代码与设计指南

为了保持视觉和技术上的卓越水准：
* **强类型**：为所有数据模型、组件属性 (props) 和 API 响应使用 TypeScript 接口。避免使用 `any`。
* **Vanilla CSS**：我们使用 `/frontend/src/App.css` 中干净、灵活的 CSS 标记 (tokens) 来为组件设置样式，而不是使用臃肿的实用程序框架。保持高端的绿色/温暖泥土色、毛玻璃感配色。
* **零占位符政策**：不要留下未完成的 `// TODO` 注释或损坏的模拟布局。确保在数据库服务器离线时，存在一个功能完全正常的模拟回退状态。

---

## 📜 合作社行为准则

作为一个专注于粮食主权、生态农业和民主治理的社区驱动型项目，我们珍视尊重、开放协作和包容性。请支持他人、透明协作，并尊重不同的背景。

如果您有任何疑问，请通过在 GitHub 上开一个 Issue 与我们联系！
