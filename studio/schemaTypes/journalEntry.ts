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
    { name: "cover", title: "封面图", type: "image", options: { hotspot: true } }
  ]
};
