export default {
  name: "siteSettings",
  title: "站点设置",
  type: "document",
  fields: [
    { name: "title", title: "站点标题", type: "string" },
    { name: "tagline", title: "主标题第二行（Tagline）", type: "string" },
    { name: "description", title: "首页简介", type: "text" },
    { name: "contactHint", title: "联系方式提示（可选）", type: "string" }
  ]
};
