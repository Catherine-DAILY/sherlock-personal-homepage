# 运营后台（Sanity）零代码指南

> 你现在的站是“静态站”（打开即显示），要实现**像小红书一样的后台编辑 + 发布**，最省心的做法是接入 **Sanity**：它提供一个可视化后台（Studio），你在后台填表/上传图 → 网站自动读取并展示。

---

## 你将获得什么

- **一个可视化后台**：发布「日常（日记/瀑布流）」「案件档案」「站点设置（标题/简介/联系方式）」
- **图片直接在后台上传**（Sanity 自带图床）
- 网站端无需你写代码：后续只用后台编辑

> 注意：你仍然需要一次性完成“创建后台 + 绑定域名/发布站点”的配置。

---

## 重要说明：你截图那里为什么找不到 schemaTypes？

你截图所在页面是 **sanity.io 的项目管理后台**（网页），那里只显示项目、数据集、权限、部署状态。

- `schemaTypes/` / `schemas/` **不是网页里能点出来的**
- 它们属于 **Sanity Studio（后台编辑器）的代码项目目录**
- 你目前页面显示 “There are no studios deployed …” 说明你还没部署 Studio，所以当然找不到 schema 文件夹

✅ 解决方法：先把 Studio 建好（我已在本项目里准备好一个可直接部署的 Studio 目录：`studio/`），然后再部署成一个后台链接。

---

## 第一步：创建 Sanity 项目（后台）

1. 打开 https://www.sanity.io/ 并注册/登录
2. 进入 Sanity 管理台 → **New project**
3. 选择 **Dataset**：建议用 `production`
4. 记下两项：
   - **Project ID**（一串字母数字）
   - **Dataset 名称**（通常是 `production`）

---

## 第二步：创建“后台数据结构”（只需复制粘贴）

你在 Sanity Studio 里需要 3 个内容类型：

- `siteSettings`（站点设置）
- `journalEntry`（日常条目）
- `caseEntry`（案件档案）

我已经为你准备了 Schema（复制即可）。

### Schema 放在哪里？

在 Sanity Studio 项目里找到类似路径：

- `schemaTypes/` 或 `schemas/`

把下面三段文件分别新建进去。

#### 1) siteSettings.ts

```ts
export default {
  name: "siteSettings",
  title: "站点设置",
  type: "document",
  fields: [
    { name: "title", title: "站点标题", type: "string" },
    { name: "tagline", title: "主标题第二行（Tagline）", type: "string" },
    { name: "description", title: "首页简介", type: "text" },
    { name: "contactHint", title: "联系方式提示（可选）", type: "string" },
  ],
};
```

#### 2) journalEntry.ts

```ts
export default {
  name: "journalEntry",
  title: "日常（日记/瀑布流）",
  type: "document",
  fields: [
    { name: "title", title: "标题", type: "string" },
    { name: "date", title: "日期", type: "date" },
    { name: "mood", title: "副标题/情绪", type: "string" },
    { name: "excerpt", title: "摘要（卡片文字）", type: "text" },
    { name: "likes", title: "点赞数（可选）", type: "number" },
    { name: "cover", title: "封面图", type: "image", options: { hotspot: true } },
  ],
};
```

#### 3) caseEntry.ts

```ts
export default {
  name: "caseEntry",
  title: "案件档案",
  type: "document",
  fields: [
    { name: "id", title: "英文ID（唯一）", type: "string" },
    { name: "title", title: "标题", type: "string" },
    {
      name: "status",
      title: "状态",
      type: "string",
      options: {
        list: [
          { title: "进行中", value: "进行中" },
          { title: "已结案", value: "已结案" },
          { title: "归档", value: "归档" },
        ],
        layout: "radio",
      },
    },
    { name: "hook", title: "一句话钩子（卡片简介）", type: "text" },
    { name: "tags", title: "标签", type: "array", of: [{ type: "string" }] },
    { name: "background", title: "背景", type: "text" },
    { name: "observations", title: "观察（列表）", type: "array", of: [{ type: "string" }] },
    { name: "deductions", title: "推断（列表）", type: "array", of: [{ type: "string" }] },
    { name: "conclusion", title: "结论", type: "text" },
  ],
};
```

最后在 schema 的入口文件里（通常叫 `schemaTypes/index.ts` 或 `schema.ts`），把这三个导入并加入数组。

---

## 第三步：让网站读取你的后台（不写代码：只填环境变量）

网站已经支持 Sanity 读取；你只需要在发布平台配置 2 个变量：

- `VITE_SANITY_PROJECT_ID` = 你在 Sanity 看到的 Project ID
- `VITE_SANITY_DATASET` = 你的 dataset（一般是 `production`）

> 可选：`VITE_SANITY_API_VERSION`（不填也行）

配置完重新部署一次，网站就会从后台拉取内容。

---

## 第四步：发布网站（建议 Vercel）

### 推荐方案：Vercel

1. 注册/登录 Vercel
2. Import 你的项目（GitHub 方式最省心）
3. 在 Vercel 项目设置 → **Environment Variables** 填上上面的 2 个变量
4. Deploy
5. 绑定域名：Vercel 里添加域名，然后把 DNS 按提示配置即可

---

## 你日常怎么发内容（像发动态一样）

1. 打开 Sanity Studio 后台
2. 新建 `日常（日记/瀑布流）`
3. 填标题、日期、摘要
4. 上传封面
5. 发布（Publish）
6. 等几秒刷新你的网站就能看到

---

## 常见问题

### Q1：如果我不配后台会怎样？
不影响：网站会自动使用本地内容（你现在已有的内容），当成“备用方案”。

### Q2：我想新增一个新板块（比如“播客/图库/时间线”）怎么办？
后台层面：新增一个内容类型（Schema）
网站层面：新增一个 section 展示它

你不懂代码也没关系：你只要告诉我“新板块要长什么样、需要哪些字段”，我可以帮你把后台结构和前台展示一次性做完。
