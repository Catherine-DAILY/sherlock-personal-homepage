import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";

import heroImg from "@/assets/hero.jpeg";
import markImg from "@/assets/mark.jpeg";
import caseImg from "@/assets/casefiles.jpeg";

import journalBicycle from "@/assets/journal-bicycle.jpeg";
import journalCooking from "@/assets/journal-cooking.jpeg";
import journalFlowers from "@/assets/journal-flowers.jpeg";
import journalStrawberries from "@/assets/journal-strawberries.jpeg";

import { CASE_FILES, makeJournalPosts, type CaseFile, type JournalPost } from "@/content/content";
import {
  fetchCaseEntries,
  fetchJournalEntries,
  fetchSiteSettings,
  isSanityEnabled,
  type CaseEntry,
  type JournalEntry,
  type SiteSettings,
} from "@/lib/sanity";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Fingerprint,
  FlaskConical,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Search,
  Sparkles,
  Telescope,
} from "lucide-react";

interface HomeProps {
  targetSection?: string;
}


function SectionTitle(props: { kicker: string; title: string; desc?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{props.kicker}</div>
        <h2 className="mt-2 text-3xl md:text-4xl leading-tight">{props.title}</h2>
        {props.desc ? <p className="mt-3 text-muted-foreground">{props.desc}</p> : null}
      </div>
      {props.right ? <div className="hidden md:block">{props.right}</div> : null}
    </div>
  );
}

function Noise() {
  // Tiny noise overlay via CSS gradients (no external asset)
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(0,0,0,.22) 0 1px, transparent 2px), radial-gradient(circle at 80% 40%, rgba(0,0,0,.18) 0 1px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(0,0,0,.2) 0 1px, transparent 2px)",
        backgroundSize: "120px 120px",
      }}
    />
  );
}

export default function Home({ targetSection }: HomeProps) {
  // Scroll to target section when URL changes (e.g., /#/cases → scroll to #cases)
  useEffect(() => {
    if (targetSection) document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetSection]);

  const [cipherInput, setCipherInput] = useState("PIGS LIVE WHERE?");
  const [shift, setShift] = useState(5);

  // --- Local fallback content (no CMS)
  const localCases: CaseFile[] = useMemo(() => CASE_FILES, []);
  const localJournal: JournalPost[] = useMemo(
    () =>
      makeJournalPosts({
        flowers: journalFlowers,
        strawberries: journalStrawberries,
        cooking: journalCooking,
        bicycle: journalBicycle,
      }),
    []
  );

  // --- CMS content (Sanity) with graceful fallback
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [cmsCases, setCmsCases] = useState<CaseEntry[] | null>(null);
  const [cmsJournal, setCmsJournal] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    if (!isSanityEnabled()) return;
    let cancelled = false;

    (async () => {
      try {
        const [s, c, j] = await Promise.all([
          fetchSiteSettings(),
          fetchCaseEntries(),
          fetchJournalEntries(),
        ]);
        if (cancelled) return;
        if (s) setSiteSettings(s);
        setCmsCases(c);
        setCmsJournal(j);
      } catch {
        // If CMS fails, keep local content
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cases: CaseFile[] = useMemo(() => {
    if (!cmsCases || cmsCases.length === 0) return localCases;
    return cmsCases.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      hook: c.hook,
      tags: c.tags ?? [],
      detail: {
        background: c.background,
        observations: c.observations ?? [],
        deductions: c.deductions ?? [],
        conclusion: c.conclusion,
      },
    }));
  }, [cmsCases, localCases]);

  const journal: JournalPost[] = useMemo(() => {
    if (!cmsJournal || cmsJournal.length === 0) return localJournal;
    return cmsJournal.map((p) => ({
      id: p._id,
      title: p.title,
      date: (p.date ?? "").slice(5).replace("-", "-") || "-- --",
      cover: p.coverUrl ?? localJournal[0]?.cover ?? "",
      mood: p.mood ?? "",
      excerpt: p.excerpt,
      likes: p.likes ?? 0,
    }));
  }, [cmsJournal, localJournal]);


  // ---
  // (keep decoding / interactions below)

  const decoded = useMemo(() => {
    const s = ((shift % 26) + 26) % 26;
    const a = "A".charCodeAt(0);
    return cipherInput
      .toUpperCase()
      .split("")
      .map((ch) => {
        const code = ch.charCodeAt(0);
        if (code < a || code > a + 25) return ch;
        const shifted = (code - a + s) % 26;
        return String.fromCharCode(a + shifted);
      })
      .join("");
  }, [cipherInput, shift]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <img
              src={markImg}
              alt="站点标记"
              className="h-9 w-9 rounded-xl border border-border/80 object-cover"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Sherlock Holmes</div>
              <div className="text-[11px] text-muted-foreground tracking-[0.2em] uppercase">Science of Deduction</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/method" className="px-3 py-2 rounded-lg hover:bg-muted transition">方法</Link>
            <Link href="/cases" className="px-3 py-2 rounded-lg hover:bg-muted transition">案件</Link>
            <Link href="/journal" className="px-3 py-2 rounded-lg hover:bg-muted transition">日常</Link>
            <Link href="/puzzle" className="px-3 py-2 rounded-lg hover:bg-muted transition">暗号</Link>
            <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-muted transition">联系</Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="打开菜单">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px]">
                  <SheetHeader>
                    <SheetTitle>导航</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 grid gap-2 text-sm">
                    {[
                      { href: "/method", label: "方法" },
                      { href: "/cases", label: "案件" },
                      { href: "/journal", label: "日常" },
                      { href: "/puzzle", label: "暗号" },
                      { href: "/contact", label: "联系" },
                    ].map((x) => (
                      <Link key={x.href} href={x.href} className="rounded-xl border border-border/70 bg-card px-4 py-3 hover:bg-muted transition">
                        {x.label}
                      </Link>
                    ))}
                  </div>
                  <Separator className="my-6" />
                  <Button className="w-full" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                    <Mail className="mr-2 h-4 w-4" />
                    提交委托
                  </Button>
                </SheetContent>
              </Sheet>
            </div>
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => toast.message("提示", { description: "这是前端原型：你可以把表单接到任意邮件/表单服务来运营。" })}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              运营说明
            </Button>
            <Button
              className="rounded-full"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Mail className="mr-2 h-4 w-4" />
              提交委托
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImg} alt="科学演绎法主视觉" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
            <Noise />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-20 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="grid md:grid-cols-12 gap-10 items-end"
            >
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs">
                  <Fingerprint className="h-3.5 w-3.5" />
                  <span className="text-muted-foreground">221B · 仅限有趣案件</span>
                </div>

                <h1 className="mt-4 text-4xl md:text-6xl leading-[1.05]">
                  {(siteSettings?.title ?? "Sherlock Holmes") + "，"}
                  <span className="block">{siteSettings?.tagline ?? "把世界拆开再拼回去。"}</span>
                </h1>
                <p className="mt-4 max-w-xl text-muted-foreground">
                  {siteSettings?.description ??
                    "这是一个可运营的个人主页原型：既保留案件档案与分析，也允许生活化日常“插队”。你会看到证据板、暗号练习，以及一小块不那么严肃的日常记录。"}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    className="rounded-full"
                    onClick={() => document.getElementById("cases")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    查看案件档案 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    阅读日常 <BookOpen className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => toast.success("已复制：221B Baker Street（示例）", { description: "实际运营时请替换为你的邮箱/表单链接。" })}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    复制地址
                  </Button>
                </div>
              </div>


            </motion.div>
          </div>
        </section>

        {/* Weekly */}
        <section className="mx-auto max-w-6xl px-4 -mt-2 pb-10">
          <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl">本周行动清单</CardTitle>
                <CardDescription>把“推理”拆成可执行的动作。</CardDescription>
              </div>
              <Badge variant="secondary" className="mt-2 sm:mt-0 rounded-full">
                Weekly
              </Badge>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[{ icon: Search, text: "观察：三处细节，不记录不算" }, { icon: Brain, text: "推断：写下两个‘更可能’" }, { icon: FlaskConical, text: "验证：做一个小实验" }, { icon: Telescope, text: "收尾：删掉一个不必要的习惯" }].map(
                  (it) => (
                    <div key={it.text} className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                        <it.icon className="h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{it.text}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="text-sm font-semibold">使用方式</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  把每条动作当作一次小实验：写下观察、给出两种解释、再用证据否定其中一个。
                </p>
                <Separator className="my-3" />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.message("已标记完成", { description: "原型演示：此处可接入真实待办/订阅。" })}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  标记今日完成
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Method */}
        <section id="method" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <SectionTitle
            kicker="Method"
            title="三步法：观察 → 推断 → 排除"
            desc="参考官方站点的骨架，但换成更‘可训练’的版本：每一步给你一个可执行动作。"
            right={
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm">
                <ClipboardList className="h-4 w-4" />
                <span className="text-muted-foreground">训练比天赋更稳定</span>
              </div>
            }
          />

          <div className="mt-10 grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">科学演绎法 · 训练版</CardTitle>
                <CardDescription>把“我觉得”换成“我有证据”。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  {["观察", "推断", "排除"].map((t, i) => (
                    <div
                      key={t}
                      className={cn(
                        "rounded-2xl border border-border/70 bg-muted/40 p-4",
                        i === 1 && "translate-y-1 sm:translate-y-4",
                        i === 2 && "sm:-translate-y-2"
                      )}
                    >
                      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Step {i + 1}</div>
                      <div className="mt-2 text-lg font-semibold">{t}</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t === "观察"
                          ? "先记事实：光线、材质、气味、时间、距离。"
                          : t === "推断"
                            ? "把事实连成线：写下两种可能，再找证据击倒其中一个。"
                            : "排除不可能：如果一条路无法解释全部证据，就让它死。"}
                      </p>
                    </div>
                  ))}
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="a">
                    <AccordionTrigger>一个简单练习：一分钟内观察你桌面</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      写下：3个你能证实的事实、2个你想推断的结论、1个你愿意立刻排除的猜测。然后再看一眼——你会发现第四个细节。
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b">
                    <AccordionTrigger>为什么要“先观察”？</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      因为大脑喜欢补全。补全是偷懒，也是误判的起点。证据越早写下，越不容易被后续故事污染。
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 relative overflow-hidden">
              <div className="absolute inset-0">
                <img src={caseImg} alt="案件档案插画" className="h-full w-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
              </div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl">证据板不是装饰</CardTitle>
                <CardDescription>它是一种思考姿势。</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="text-sm font-medium">今日关键词</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["微量残留", "行为诱导", "时间线", "不在场证明", "环境微差"].map((t) => (
                      <Badge key={t} variant="secondary" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={() => toast.message("已保存", { description: "原型演示：此处可写入数据库/Notion/表格。" })}
                  >
                    保存到我的线索本
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cases */}
        <section id="cases" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <SectionTitle
            kicker="Case Files"
            title="案件档案"
            desc="案例、进行中调查与归档记录。每一份都按“背景-观察-推断-结论”写清楚。"
            right={
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => toast.info("原型演示", { description: "可接入搜索与标签筛选。" })}>
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.message("Coming soon", { description: "下一步可做：论坛/评论/投票。" })}
                >
                  <MessageSquareText className="mr-2 h-4 w-4" />
                  论坛
                </Button>
              </div>
            }
          />

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((c) => (
              <Dialog key={c.id}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-50px_rgba(0,0,0,.45)]">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          className={cn(
                            "rounded-full",
                            c.status === "进行中" && "bg-[oklch(0.83_0.16_75)] text-[oklch(0.18_0.02_255)]",
                            c.status === "已结案" && "bg-[oklch(0.72_0.12_120)] text-[oklch(0.18_0.02_255)]",
                            c.status === "归档" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {c.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground">#{c.id}</div>
                      </div>
                      <CardTitle className="mt-3 text-xl leading-snug">{c.title}</CardTitle>
                      <CardDescription>{c.hook}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {c.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-full">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 inline-flex items-center text-sm text-muted-foreground group-hover:text-foreground transition">
                        打开档案 <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{c.title}</DialogTitle>
                    <DialogDescription>结构化笔记：背景 → 观察 → 推断 → 结论。</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5">
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <div className="text-sm font-semibold">背景</div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.detail.background}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border/70 bg-card p-4">
                        <div className="text-sm font-semibold">观察</div>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          {c.detail.observations.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-card p-4">
                        <div className="text-sm font-semibold">推断</div>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                          {c.detail.deductions.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4">
                      <div className="text-sm font-semibold">结论</div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.detail.conclusion}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">注：此站点为原创原型文本，灵感来自“科学演绎法”的网站结构，但不复制其内容。</div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => toast.success("已收藏", { description: "原型演示：可接入登录/收藏功能。" })}
                        >
                          收藏
                        </Button>
                        <Button
                          onClick={() => toast.message("已生成分享链接（示例）", { description: "下一步可接入短链/社交分享。" })}
                        >
                          分享
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        {/* Journal */}
        <section id="journal" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <SectionTitle
            kicker="Journal"
            title="生活化日常（但仍然可推理）"
            desc="更像你的截图里那种“把日常当作采样”的气质：花、厨房、草莓、路线。"
          />

          <Tabs defaultValue="grid" className="mt-10">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="grid">瀑布流</TabsTrigger>
              <TabsTrigger value="notes">短札</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {journal.map((p) => (
                  <div key={p.id} className="break-inside-avoid mb-6">
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <img src={p.cover} alt={p.title} className="w-full h-auto" />
                        <div className="absolute left-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs">
                          {p.date}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{p.title}</CardTitle>
                        <CardDescription>{p.mood}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <Badge variant="secondary" className="rounded-full">♥ {p.likes}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.message("原型演示", { description: "这里可以跳转到文章页或评论区。" })}
                          >
                            打开
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {["别把‘喜欢’当证据。", "最危险的推断：因为他看起来像。", "当你想解释一切时，先问：我观察了吗？", "‘无聊’是一种保护色。"].map((n) => (
                  <Card key={n} className="relative overflow-hidden">
                    <Noise />
                    <CardHeader>
                      <CardTitle className="text-xl">短札</CardTitle>
                      <CardDescription>一行就够。</CardDescription>
                    </CardHeader>
                    <CardContent className="text-lg leading-relaxed">“{n}”</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Puzzle */}
        <section id="puzzle" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <SectionTitle
            kicker="Weekly Puzzle"
            title="本周暗号：移位试验"
            desc="致敬官方站点的“隐藏讯息”，但做成可互动的小练习：用凯撒移位先热身。"
          />

          <div className="mt-10 grid lg:grid-cols-12 gap-6 items-start">
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle className="text-2xl">把噪声变成文本</CardTitle>
                <CardDescription>输入一段字符，调节移位，观察模式出现。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">暗号内容</div>
                  <Input value={cipherInput} onChange={(e) => setCipherInput(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">移位（Shift）</div>
                    <Badge variant="secondary" className="rounded-full">{shift}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShift((s) => s - 1)}>
                      -
                    </Button>
                    <div className="flex-1 h-2 rounded-full bg-muted relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-[oklch(0.83_0.16_75)]"
                        style={{ width: `${((shift % 26) + 26) % 26 / 25 * 100}%` }}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShift((s) => s + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="text-sm font-semibold">输出</div>
                  <div className="mt-2 font-mono text-sm leading-relaxed">{decoded}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(decoded).catch(() => {});
                      toast.success("已复制输出");
                    }}
                  >
                    复制结果
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toast.message("下一步可做", { description: "增加猪圈密码/Pigpen、维吉尼亚表、图片暗号等。" })}
                  >
                    升级为高级暗号
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-2xl">小提示</CardTitle>
                <CardDescription>让暗号更像“案件”，而不是游戏。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center border border-border/60">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">先猜“载体”</div>
                    <div>文本、图片、声音、地点？载体决定你该用什么工具。</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center border border-border/60">
                    <Fingerprint className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">找重复模式</div>
                    <div>重复就是线索：频率、间隔、对称、边缘。</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center border border-border/60">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">把“猜测”写下来</div>
                    <div>写下来才有资格被验证或被否决。</div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-2xl border border-border/70 bg-card p-4">
                  <div className="text-sm font-semibold text-foreground">匿名留言（示例）</div>
                  <p className="mt-2">“Also, where is it the pigs live?”</p>
                  <p className="mt-2 text-xs">注：原句来自公开页面的剧情式提示，这里仅作结构灵感参考。</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <SectionTitle
            kicker="Contact"
            title="提交委托（有趣的才回）"
            desc="这是可运营的入口：你可以把它接到邮箱、表单服务或Notion。原型里先用前端提示代替。"
          />

          <div className="mt-10 grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle className="text-2xl">委托表单</CardTitle>
                <CardDescription>把你的问题写得像证据：时间、地点、你确定的事实。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">称呼</div>
                    <Input placeholder="John / Lestrade / 你" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">联系方式</div>
                    <Input placeholder="邮箱 / 社交账号" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">你确定的事实</div>
                  <Textarea placeholder="例如：昨晚23:40，门锁无撬痕，但桌面出现了不属于我的白色粉末……" rows={5} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      toast.success("已提交（原型）", {
                        description: "下一步：把这个按钮改成真实提交（例如 Formspree / Google Forms / Notion API）。",
                      })
                    }
                  >
                    发送
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toast.message("联系方式（示例）", { description: "221B Baker Street · London / contact via blog" })}
                  >
                    查看备用渠道
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.985_0.01_95)_0%,oklch(0.965_0.012_95)_40%,oklch(0.985_0.01_95)_100%)]" />
              <Noise />
              <CardHeader className="relative">
                <CardTitle className="text-2xl">运营建议</CardTitle>
                <CardDescription>让它真的能跑起来。</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">最省事：表单服务</div>
                    <div>Formspree / Google Forms / 飞书表单，把“发送”直连邮件。</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">内容管理：把数据抽出来</div>
                    <div>把案件/日常写成JSON或Markdown，便于后续替换为真实内容。</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">想要论坛？</div>
                    <div>静态站建议接 Disqus / Giscus（GitHub） 或跳转外部社区。</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <footer className="mt-14 border-t border-border/70 pt-8 pb-10 text-sm text-muted-foreground">
            <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-0">
              <div>
                <div className="font-medium text-foreground">{siteSettings?.title ?? "Sherlock Holmes"}</div>
                <div className="mt-1">非官方粉丝向原型设计：仅作网页设计与内容结构示例。</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.message("Coming soon", { description: "可以加：订阅邮箱、RSS、播客。" })}>
                  订阅
                </Button>
                <Button variant="secondary" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  回到顶部
                </Button>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
