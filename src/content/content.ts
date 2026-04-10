// 内容数据：后续运营时只要改这里即可（无需改页面布局）

export type CaseStatus = "进行中" | "已结案" | "归档";

export type CaseFile = {
  id: string;
  title: string;
  status: CaseStatus;
  hook: string;
  tags: string[];
  detail: {
    background: string;
    observations: string[];
    deductions: string[];
    conclusion: string;
  };
};

export type JournalPost = {
  id: string;
  title: string;
  date: string;
  cover: string; // image import
  mood: string;
  excerpt: string;
  likes: number;
};

export const CASE_FILES: CaseFile[] = [
  {
    id: "green-ladder",
    title: "绿色梯子：铸铁不在场证明",
    status: "已结案",
    hook: "一个“看起来像意外”的溺亡，真相却藏在碎石里的两撮绿漆。",
    tags: ["行为诱导", "微量证据", "心理弱点"],
    detail: {
      background:
        "一名警员来求助：丈夫在花园池塘溺亡，众人认定是意外。妻子坚信弟弟‘铸铁不在场’背后另有机关。",
      observations: [
        "小路是松散碎石；花坛无脚印；墙面无窗。",
        "碎石里出现两处‘绿漆’微量残留，间距约一米。",
        "受害者有强烈迷信习惯：洒盐要往肩后抛。",
      ],
      deductions: [
        "绿漆+两处间距 → 有过一把梯子被放置在不合常理的位置。",
        "迷信 → 受害者会绕开‘坏运气’路径，走向更危险的边缘。",
        "酒精浓度异常 → 被引诱饮烈酒，降低警觉与平衡。",
      ],
      conclusion:
        "布置梯子并非为了攀爬，而是为了‘引导路线’。当所有人都在找打斗痕迹时，真正的凶器是：心理暗示 + 环境微差。",
    },
  },
  {
    id: "perfume",
    title: "香水成分：二十分钟的气味现场",
    status: "进行中",
    hook: "气味会撒谎吗？不会。人会。",
    tags: ["化学痕量", "嗅觉记忆", "时间线"],
    detail: {
      background: "一封匿名邮件附上一小片纸巾：上面残留的香调与时间线不匹配。需要你帮我验证。",
      observations: ["前调挥发过快但仍残留柑橘酸味", "纸巾纤维里有粉末状定香剂", "边缘有轻微潮气与金属味"],
      deductions: [
        "并非直接喷洒，更像是二次接触转移",
        "粉末定香剂提示：香水可能被‘改装’以延迟挥发",
        "金属味可能来自电梯/地铁扶手等高频触点",
      ],
      conclusion: "需要更多样本：同一地点、不同时间的对照。",
    },
  },
  {
    id: "tobacco-ash",
    title: "烟灰分析：已删除（请别再问）",
    status: "归档",
    hook: "你们更爱看博客，不爱看证据。那就别看了。",
    tags: ["分类学", "燃烧残留", "不耐烦"],
    detail: {
      background: "本档案已归档并撤下。原因：我懒得解释。",
      observations: ["……"],
      deductions: ["……"],
      conclusion: "——SH",
    },
  },
];

export function makeJournalPosts(covers: {
  flowers: string;
  strawberries: string;
  cooking: string;
  bicycle: string;
}): JournalPost[] {
  return [
    {
      id: "j-flowers",
      title: "春节",
      date: "02-16",
      cover: covers.flowers,
      mood: "福",
      excerpt: "中国特色的农历新年，约翰说这是纪念日，我认为价值大于情人节: )",
      likes: 391,
    },
    {
      id: "j-strawberries",
      title: "想念",
      date: "12-25",
      cover: covers.strawberries,
      mood: "圣诞节",
      excerpt: "圣诞节惯例出现拥挤的餐厅，我只做这一次比心手势。",
      likes: 728,
    },
    {
      id: "j-cooking",
      title: "冰糖梨子汤",
      date: "01-20",
      cover: covers.cooking,
      mood: "无聊处理",
      excerpt:
        "我没有感冒，更没有嗓子不舒服，我需要解决无聊，你们的关注点只会在这一碗梨子汤，我已经知道了。",
      likes: 3743,
    },
    {
      id: "j-bicycle",
      title: "1月6日",
      date: "01-06",
      cover: covers.bicycle,
      mood: "礼物与显微镜",
      excerpt:
        "照片是相机，蛋糕只有堆砌的奶油，我没有拆mycroft的礼物，新的显微镜是约翰送的。",
      likes: 410,
    },
  ];
}
