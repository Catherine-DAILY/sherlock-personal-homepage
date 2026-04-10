# Sherlock Holmes Studio（后台）

你刚才找不到 `schemaTypes/` 的原因：

- 你当前打开的是 **sanity.io 的项目管理后台**（网页）
- `schemaTypes/` 是 **Sanity Studio 代码项目**里的文件夹

我已经把 Studio 代码放在本仓库的：

- `studio/`

你不需要写代码，只需要按下面步骤点几下即可把后台“跑起来”，并获得一个可打开的后台链接。

---

## 方式A：用 Vercel 部署 Studio（推荐，最省事）

### 1. 把本项目上传到 GitHub
- 如果你没有 GitHub：注册一个
- 新建一个仓库（Repository）
- 把整个项目上传（或让开发者帮你推上去）

### 2. 在 Vercel 导入项目
- Vercel → Add New → Project → 选择你的仓库

### 3. 关键：设置 Root Directory
- 在 Vercel 的 Build 设置里，把 **Root Directory** 选为：`studio`

### 4. 配置环境变量（Vercel 项目设置 → Environment Variables）
- `SANITY_STUDIO_PROJECT_ID` = `qox1gvkg`
- `SANITY_STUDIO_DATASET` = `production`

### 5. Deploy
部署成功后，Vercel 会给你一个 URL，这就是你的 **后台链接**。

---

## 方式B：Sanity 官方托管（需要命令行登录，不推荐给纯零代码）
如果你后面愿意用命令行，我再给你一步步带着做。

---

## 部署后你会看到什么
后台左侧会出现 3 个入口：
- 站点设置
- 日常（日记/瀑布流）
- 案件档案

你新增/编辑并发布后，网站端只要配置了 `VITE_SANITY_PROJECT_ID` 和 `VITE_SANITY_DATASET` 就会自动读取并展示。
