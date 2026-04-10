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
          { title: "归档", value: "归档" }
        ],
        layout: "radio"
      }
    },
    { name: "hook", title: "一句话钩子（卡片简介）", type: "text" },
    { name: "tags", title: "标签", type: "array", of: [{ type: "string" }] },
    { name: "background", title: "背景", type: "text" },
    { name: "observations", title: "观察（列表）", type: "array", of: [{ type: "string" }] },
    { name: "deductions", title: "推断（列表）", type: "array", of: [{ type: "string" }] },
    { name: "conclusion", title: "结论", type: "text" }
  ]
};
