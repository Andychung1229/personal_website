"use client";

import Image from "next/image";
import {
  AlertTriangle,
  BedDouble,
  CalendarDays,
  Camera,
  Car,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CloudSun,
  Copy,
  Droplets,
  ExternalLink,
  Luggage,
  Map as MapIcon,
  MapPinned,
  Navigation,
  Plane,
  Search,
  Share2,
  Sparkles,
  Star,
  Sun,
  ThermometerSun,
  TrainFront,
  UtensilsCrossed,
  Users,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import {
  budgetCategories,
  budgetTargets,
  days,
  foodStops,
  lodgingOptions,
  pilgrimageSpots,
  sources
} from "./tripData";
import imageCreditData from "../../../public/images/makeine-trip/credits.json";
import styles from "./trip.module.css";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type PlanKey = "car" | "noCar";
type PlanSelection = PlanKey | "both";
type PeopleCount = 3 | 4;
type TabId =
  | "overview"
  | "itinerary"
  | "comparison"
  | "spots"
  | "food"
  | "stay"
  | "budget"
  | "checklist";
type SpotFilter = "all" | "city" | "tahara" | "shinshiro" | "futagawa" | "food" | "limited";
type Spot = (typeof pilgrimageSpots)[number];
type ScheduleItem = (typeof days)[number]["common"][number];

interface ImageCredit {
  localFile: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourcePage: string;
}

interface DisplayEvent {
  item: ScheduleItem;
  plan?: PlanKey;
}

interface ChecklistItem {
  id: string;
  title: string;
  hint: string;
  category: string;
  plan?: PlanKey;
}

interface LocalImage {
  src: string;
  alt: string;
}

const imageCredits = imageCreditData as ImageCredit[];
const IMAGE_ROOT = "/images/makeine-trip";
const FX_JPY_PER_HKD = 20.5;
const SPOT_STORAGE_KEY = "makeine-trip-visited-spots-v1";
const CHECKLIST_STORAGE_KEY = "makeine-trip-booking-checklist-v1";

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "總覽", icon: MapIcon },
  { id: "itinerary", label: "逐日行程", icon: CalendarDays },
  { id: "comparison", label: "兩案比較", icon: TrainFront },
  { id: "spots", label: "23 點", icon: MapPinned },
  { id: "food", label: "劇中美食", icon: UtensilsCrossed },
  { id: "stay", label: "住宿行李", icon: BedDouble },
  { id: "budget", label: "預算", icon: WalletCards },
  { id: "checklist", label: "出發清單", icon: ClipboardCheck }
];

const spotFilters: Array<{ id: SpotFilter; label: string }> = [
  { id: "all", label: "全部" },
  { id: "city", label: "豐橋市區" },
  { id: "tahara", label: "田原" },
  { id: "shinshiro", label: "新城" },
  { id: "futagawa", label: "二川" },
  { id: "food", label: "餐廳／美食" },
  { id: "limited", label: "外觀／限制" }
];

const checklistItems: ChecklistItem[] = [
  {
    id: "headcount",
    title: "確認 3 人或 4 人成團",
    hint: "住宿及交通預算會跟人數變動。",
    category: "決定"
  },
  {
    id: "plan-vote",
    title: "群組投票：租車案／無租車案",
    hint: "兩案都留在此頁，投票後再按結果訂交通。",
    category: "決定"
  },
  {
    id: "flights",
    title: "訂香港往返名古屋機票",
    hint: "參考時段：24/8 午後抵達、30/8 下午離境；下單前核對行李額。",
    category: "預訂"
  },
  {
    id: "toyohashi-stay",
    title: "訂 24–28/8 豐橋 Airbnb",
    hint: "確認 3–4 位入住、分房、兩個廁所及自助入住。",
    category: "預訂"
  },
  {
    id: "nagoya-stay",
    title: "訂 28–30/8 名古屋 Airbnb",
    hint: "確認 20kg 行李可放置，以及前往名古屋站／機場的路線。",
    category: "預訂"
  },
  {
    id: "car-booking",
    title: "預約 26–27/8 租車",
    hint: "豐橋站取還車；選 CDW／NOC 保障及 ETC，行李留住宿。",
    category: "A 租車",
    plan: "car"
  },
  {
    id: "idp",
    title: "申請 1949 日內瓦格式國際駕駛許可證",
    hint: "每位司機帶香港駕照正本、IDP、護照；申請費參考 HK$80。",
    category: "A 租車",
    plan: "car"
  },
  {
    id: "tahara-taxi",
    title: "預約 26/8 田原的士",
    hint: "白谷海岸 → 江比間外觀 → 三河田原，約 75–90 分鐘；先報價。",
    category: "B 無車",
    plan: "noCar"
  },
  {
    id: "shinshiro-taxi",
    title: "預約 27/8 新城的士",
    hint: "本長篠 → 双瀬（ならぜ）の川渡り → 副川諏訪神社 → Mokkuru → 車站。",
    category: "B 無車",
    plan: "noCar"
  },
  {
    id: "timetable",
    title: "出發前 7 日重查巴士及 JR 時刻",
    hint: "田原 Gururin、飯田線及二川接駁是無車案的關鍵。",
    category: "B 無車",
    plan: "noCar"
  },
  {
    id: "baggage",
    title: "預約 28/8 名古屋站行李寄存",
    hint: "按每人一件 20kg 計，ecbo cloak 要一次預約 3–4 件大行李。",
    category: "行李"
  },
  {
    id: "restaurants",
    title: "重查店休日及營業時間",
    hint: "特別留意 UNO、珈琲とカヌレ、ボン千賀、みやこ；小店可能臨休。",
    category: "巡禮"
  },
  {
    id: "offline-map",
    title: "下載離線地圖及 23 點清單",
    hint: "各卡片都有 Google Maps；郊區亦準備日文地址截圖。",
    category: "巡禮"
  },
  {
    id: "cash",
    title: "準備日圓現金及零錢",
    hint: "舊式咖啡店、小店及巴士不應只依賴信用卡。",
    category: "金錢"
  },
  {
    id: "insurance",
    title: "購買旅遊保險並設定颱風備案",
    hint: "八月底炎熱兼有颱風風險；戶外點可調到早上或後備日。",
    category: "安全"
  },
  {
    id: "summer-kit",
    title: "帶防曬、補水鹽、雨具及充電器",
    hint: "平均高溫約 33°C；安排早出晚返仍要保留室內降溫時間。",
    category: "裝備"
  }
];

const exactSpotImages: Record<number, LocalImage> = {
  2: {
    src: `${IMAGE_ROOT}/toyohashi-ekimae-tram.jpg`,
    alt: "豐橋站前電車站實景"
  },
  3: {
    src: `${IMAGE_ROOT}/gusto-toyohashi-hashira.jpg`,
    alt: "Gusto 豐橋橋良店實景"
  },
  4: {
    src: `${IMAGE_ROOT}/shiroya-beach.jpg`,
    alt: "田原白谷海濱公園實景"
  },
  8: {
    src: `${IMAGE_ROOT}/bon-senga.jpg`,
    alt: "豐橋ボン千賀咖啡店實景"
  },
  15: {
    src: `${IMAGE_ROOT}/mokkuru-stone-grilled-frank.jpg`,
    alt: "道之驛 Mokkuru 新城的石燒法蘭克福腸"
  },
  22: {
    src: `${IMAGE_ROOT}/nonhoi-park.jpg`,
    alt: "豐橋綜合動植物公園 Nonhoi Park 實景"
  }
};

const nagoyaPhotoStory = [
  {
    src: `${IMAGE_ROOT}/nagoya-castle.jpg`,
    alt: "名古屋城與本丸御殿一帶",
    label: "DAY 6 · 09:00",
    title: "名古屋城",
    detail: "城內、本丸御殿與庭園；天守閣仍不開放入內。"
  },
  {
    src: `${IMAGE_ROOT}/osu-shopping-street.jpg`,
    alt: "名古屋大須商店街入口與街景",
    label: "DAY 6 · 11:30",
    title: "大須商店街",
    detail: "午餐、動漫、模型與二手店集中自由活動。"
  },
  {
    src: `${IMAGE_ROOT}/sakae-night.jpg`,
    alt: "名古屋榮區夜景",
    label: "DAY 5–6 · NIGHT",
    title: "榮・夜名古屋",
    detail: "MIRAI TOWER 日落後，再食手羽先、味噌カツ或居酒屋。"
  }
];

const kindLabels: Record<string, string> = {
  flight: "航班",
  travel: "移動",
  pilgrimage: "巡禮",
  food: "劇中美食",
  stay: "住宿",
  flex: "彈性",
  city: "市內"
};

function formatHkd(value: number) {
  return `HK$${Math.round(value).toLocaleString("zh-HK")}`;
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

function formatRange(range: { min: number; max: number }) {
  return range.min === range.max
    ? formatHkd(range.min)
    : `${formatHkd(range.min)}–${formatHkd(range.max)}`;
}

function planLabel(plan: PlanSelection) {
  if (plan === "car") return "A｜租車案";
  if (plan === "noCar") return "B｜無租車案";
  return "兩案並列";
}

function getTargetText(people: PeopleCount, plan: PlanSelection) {
  if (plan === "car" || plan === "noCar") return formatHkd(budgetTargets[people][plan]);
  const values = [budgetTargets[people].noCar, budgetTargets[people].car].sort((a, b) => a - b);
  return `${formatHkd(values[0])}–${formatHkd(values[1])}`;
}

function spotImage(spot: Spot): LocalImage {
  if (typeof spot.id === "number" && exactSpotImages[spot.id]) return exactSpotImages[spot.id];
  if (spot.area.includes("田原")) {
    return {
      src: `${IMAGE_ROOT}/shiroya-beach.jpg`,
      alt: `${spot.nameZh}所在田原地區的參考實景`
    };
  }
  if (spot.area.includes("新城")) {
    return {
      src: `${IMAGE_ROOT}/mokkuru-stone-grilled-frank.jpg`,
      alt: `${spot.nameZh}所在新城地區的巡禮參考相片`
    };
  }
  if (spot.area.includes("二川") || spot.nameJp.includes("のんほい")) {
    return {
      src: `${IMAGE_ROOT}/nonhoi-park.jpg`,
      alt: `${spot.nameZh}所在二川地區的參考實景`
    };
  }
  return {
    src: `${IMAGE_ROOT}/toyohashi-ekimae-tram.jpg`,
    alt: `${spot.nameZh}所在豐橋市區的參考實景`
  };
}

function matchesSpotFilter(spot: Spot, filter: SpotFilter) {
  if (filter === "all") return true;
  if (filter === "city") return spot.area.includes("豐橋") && !spot.area.includes("二川");
  if (filter === "tahara") return spot.area.includes("田原");
  if (filter === "shinshiro") return spot.area.includes("新城");
  if (filter === "futagawa") return spot.area.includes("二川");
  if (filter === "food") {
    return spot.category.includes("食") || foodStops.some((food) => food.spotId === spot.id);
  }
  return spot.status !== "open";
}

function sectionClass(activeTab: TabId, id: TabId) {
  return `${styles.section} ${activeTab === id ? "" : styles.hidden}`;
}

export function TripPlanner() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [plan, setPlan] = useState<PlanSelection>("both");
  const [people, setPeople] = useState<PeopleCount>(4);
  const [search, setSearch] = useState("");
  const [spotFilter, setSpotFilter] = useState<SpotFilter>("all");
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [storageReady, setStorageReady] = useState(false);
  const [urlReady, setUrlReady] = useState(false);
  const [toast, setToast] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const officialSpots = useMemo(() => pilgrimageSpots.filter((spot) => spot.official), []);
  const bonusSpot = useMemo(() => pilgrimageSpots.find((spot) => !spot.official), []);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const sharedPlan = parameters.get("plan");
    const sharedPeople = Number(parameters.get("people"));
    if (sharedPlan === "both" || sharedPlan === "car" || sharedPlan === "noCar") {
      setPlan(sharedPlan);
    }
    if (sharedPeople === 3 || sharedPeople === 4) setPeople(sharedPeople);

    try {
      const savedSpots = JSON.parse(localStorage.getItem(SPOT_STORAGE_KEY) ?? "[]") as string[];
      const savedChecklist = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) ?? "[]") as string[];
      setVisitedSpots(new Set(savedSpots));
      setCheckedItems(new Set(savedChecklist));
    } catch {
      setVisitedSpots(new Set());
      setCheckedItems(new Set());
    }
    setStorageReady(true);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    url.searchParams.set("plan", plan);
    url.searchParams.set("people", String(people));
    window.history.replaceState({}, "", url);
  }, [people, plan, urlReady]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(SPOT_STORAGE_KEY, JSON.stringify([...visitedSpots]));
  }, [storageReady, visitedSpots]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify([...checkedItems]));
  }, [checkedItems, storageReady]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const filteredSpots = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("zh-Hant");
    return officialSpots.filter((spot) => {
      if (!matchesSpotFilter(spot, spotFilter)) return false;
      if (!query) return true;
      return [
        spot.nameZh,
        spot.nameJp,
        spot.area,
        spot.category,
        spot.address,
        spot.episode,
        spot.scene
      ]
        .join(" ")
        .toLocaleLowerCase("zh-Hant")
        .includes(query);
    });
  }, [officialSpots, search, spotFilter]);

  const visibleChecklist = useMemo(
    () => checklistItems.filter((item) => plan === "both" || !item.plan || item.plan === plan),
    [plan]
  );

  const visitedCount = officialSpots.filter((spot) => visitedSpots.has(String(spot.id))).length;
  const spotProgress = Math.round((visitedCount / officialSpots.length) * 100) || 0;
  const checkedCount = visibleChecklist.filter((item) => checkedItems.has(item.id)).length;
  const checklistProgress = Math.round((checkedCount / visibleChecklist.length) * 100) || 0;

  const budgetRows = budgetCategories.filter(
    (category) => category.appliesTo === "all" || plan === "both" || category.appliesTo === plan
  );
  const largestBudgetRow = Math.max(
    1,
    ...budgetRows.map((category) =>
      people === 3 ? category.people3.max : category.people4.max
    )
  );

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  function changeTab(id: TabId, shouldScroll = false) {
    setActiveTab(id);
    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document.getElementById("trip-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function onTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  function toggleSpot(id: string) {
    setVisitedSpots((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleChecklist(id: string) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function currentShareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("plan", plan);
    url.searchParams.set("people", String(people));
    return url.toString();
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error("Copy failed");
    }
  }

  async function copyUrl() {
    try {
      await copyText(currentShareUrl());
      notify("已複製目前方案連結");
    } catch {
      notify("未能自動複製，請從瀏覽器網址列複製");
    }
  }

  async function sharePage() {
    const url = currentShareUrl();
    const shareData = {
      title: "敗犬女主太多了！名古屋・豐橋聖地巡禮",
      text: `24–30/8，${people} 人；目前顯示：${planLabel(plan)}。`,
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await copyText(url);
      notify("瀏覽器未提供分享面板，已改為複製連結");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("分享未完成，可使用旁邊的複製按鈕");
    }
  }

  async function copyVoteMessage() {
    const message = [
      "【敗犬女主太多了！名古屋・豐橋巡禮】",
      "日期：2026/8/24–30（7日6夜）",
      `暫按 ${people} 人計：`,
      `A 租車案：約 ${formatHkd(budgetTargets[people].car)}／人`,
      `B 無租車案：約 ${formatHkd(budgetTargets[people].noCar)}／人`,
      "兩案都以完成 23 個官方巡禮點為目標；#5、#6 只影外觀。",
      "每人 20kg 行李，28/8 會預約名古屋站寄存。",
      "大家睇完行程後投 A / B，再確認 3 人或 4 人：",
      currentShareUrl()
    ].join("\n");
    try {
      await copyText(message);
      notify("已複製群組投票文字");
    } catch {
      notify("未能自動複製投票文字");
    }
  }

  function displayEvents(day: (typeof days)[number]): DisplayEvent[] {
    const common = day.common.map((item) => ({ item }));
    if (!day.variants) return common;
    if (plan === "both") {
      return [
        ...common,
        ...day.variants.car.map((item) => ({ item, plan: "car" as const })),
        ...day.variants.noCar.map((item) => ({ item, plan: "noCar" as const }))
      ];
    }
    return [...common, ...day.variants[plan].map((item) => ({ item, plan }))];
  }

  return (
    <div className={styles.page} lang="zh-Hant">
      <a className={styles.skipLink} href="#trip-content">
        跳到行程內容
      </a>
      <span className={`${styles.ambientShape} ${styles.ambientBlue}`} aria-hidden="true" />
      <span className={`${styles.ambientShape} ${styles.ambientCoral}`} aria-hidden="true" />

      <header className={`${styles.hero} ${styles.shell}`}>
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>非官方朋友旅行指南 · 2026</span>
          <Image
            src={`${IMAGE_ROOT}/makeine-logo.svg`}
            width={335}
            height={171}
            alt="敗犬女主太多了！作品標誌"
            priority
            style={{ width: "min(275px, 75%)", height: "auto", marginTop: "1.1rem" }}
          />
          <h1 className={styles.heroTitle}>
            <span className={styles.titleAccent}>名古屋・豐橋</span>
            <span className={styles.heroTitleSmall}>聖地巡禮 2026</span>
          </h1>
          <p className={styles.heroLead}>
            8 月 24–30 日，3–4 人男仔團，早出晚返完成 23 個官方巡禮點。租車與無租車兩案完整保留，
            由大家睇完路線、預算同風險之後再揀。
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} type="button" onClick={() => changeTab("itinerary", true)}>
              <CalendarDays size={18} aria-hidden="true" />
              睇 7 日 rundown
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => changeTab("comparison", true)}>
              <TrainFront size={18} aria-hidden="true" />
              並排比較兩案
            </button>
          </div>
          <div className={styles.heroMeta} aria-label="旅程重點">
            <span className={styles.metaPill}><CalendarDays size={14} />24–30 AUG</span>
            <span className={styles.metaPill}><Users size={14} />3–4 人</span>
            <span className={styles.metaPill}><MapPinned size={14} />23 + 1 點</span>
            <span className={styles.metaPill}><Luggage size={14} />每人 20kg</span>
          </div>
          <p className={styles.heroNote}>
            <Sparkles size={18} aria-hidden="true" />
            <span>這是投票版，不預先替大家揀方案；選項只會改變 Day 3–4 路線及預算顯示。</span>
          </p>
        </div>

        <div className={styles.photoCollage} aria-label="巡禮地點相片拼貼">
          <figure className={`${styles.photoCard} ${styles.photoMain}`}>
            <span className={styles.photoTape} aria-hidden="true" />
            <Image
              className={styles.photoImage}
              src={`${IMAGE_ROOT}/shiroya-beach.jpg`}
              alt="田原白谷海濱公園"
              fill
              priority
              sizes="(max-width: 800px) 80vw, 42vw"
            />
            <figcaption className={styles.photoCaption}>#4 白谷海水浴場 · 田原</figcaption>
          </figure>
          <figure className={`${styles.photoCard} ${styles.photoTop}`}>
            <Image
              className={styles.photoImage}
              src={`${IMAGE_ROOT}/toyohashi-ekimae-tram.jpg`}
              alt="豐橋站前路面電車站"
              fill
              sizes="(max-width: 800px) 46vw, 22vw"
            />
            <figcaption className={styles.photoCaption}>#2 豐橋站前電停</figcaption>
          </figure>
          <figure className={`${styles.photoCard} ${styles.photoBottom}`}>
            <Image
              className={styles.photoImage}
              src={`${IMAGE_ROOT}/mokkuru-stone-grilled-frank.jpg`}
              alt="Mokkuru 新城石燒法蘭克福腸"
              fill
              sizes="(max-width: 800px) 55vw, 27vw"
            />
            <figcaption className={styles.photoCaption}>#15 Mokkuru 新城</figcaption>
          </figure>
          <span className={styles.heroSticker} aria-hidden="true">23 點<br />全制霸<br />+ 吉田神社</span>
        </div>
      </header>

      <div className={styles.tabRail} id="trip-tabs">
        <nav className={styles.tabNav} role="tablist" aria-label="旅行計劃分頁">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                id={`tab-${tab.id}`}
                className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => changeTab(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className={styles.tabIcon}><Icon size={17} aria-hidden="true" /></span>
                {tab.label}
                {tab.id === "spots" ? <span className={styles.tabCount}>{visitedCount}/23</span> : null}
              </button>
            );
          })}
        </nav>
      </div>

      <main className={`${styles.main} ${styles.shell}`} id="trip-content">
        <div className={styles.controlBar} aria-label="共用行程設定">
          <div className={styles.controlGroup}>
            <p className={styles.controlLabel}><Navigation size={15} />交通方案</p>
            <div className={styles.segment} role="group" aria-label="選擇交通方案">
              {([
                ["both", "兩案並列"],
                ["car", "A 租車"],
                ["noCar", "B 無車"]
              ] as Array<[PlanSelection, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.segmentButton} ${plan === value ? styles.segmentButtonActive : ""}`}
                  aria-pressed={plan === value}
                  onClick={() => setPlan(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <p className={styles.controlLabel}><Users size={15} />成行人數</p>
            <div className={styles.segment} role="group" aria-label="選擇人數">
              {([3, 4] as PeopleCount[]).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`${styles.segmentButton} ${people === count ? styles.segmentButtonActive : ""}`}
                  aria-pressed={people === count}
                  onClick={() => setPeople(count)}
                >
                  {count} 人
                </button>
              ))}
            </div>
          </div>
          <div className={styles.selectionHint} aria-live="polite">
            目前顯示：{planLabel(plan)} · {people} 人<br />預算目標 {getTargetText(people, plan)}／人
          </div>
        </div>

        <section
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className={sectionClass(activeTab, "overview")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Trip snapshot</span>
              <h2 className={styles.sectionTitle}>先睇全局，再一齊揀玩法</h2>
            </div>
            <p className={styles.sectionLead}>
              前四晚住豐橋、後兩晚住名古屋；Day 3–4 處理田原、新城及二川郊區點，Day 5 留做巡禮補漏及轉場。
            </p>
          </div>

          <div className={styles.metricGrid}>
            <article className={`${styles.metricCard} ${styles.metricBlue}`}>
              <span className={styles.metricLabel}>日期</span>
              <strong className={styles.metricValue}>7日6夜</strong>
              <span className={styles.metricHint}>2026/8/24（一）至 8/30（日）</span>
            </article>
            <article className={`${styles.metricCard} ${styles.metricYellow}`}>
              <span className={styles.metricLabel}>巡禮完成度</span>
              <strong className={styles.metricValue}>23 + 1</strong>
              <span className={styles.metricHint}>23 個官方點；吉田神社作順路 bonus</span>
            </article>
            <article className={`${styles.metricCard} ${styles.metricCoral}`}>
              <span className={styles.metricLabel}>團隊節奏</span>
              <strong className={styles.metricValue}>早出晚返</strong>
              <span className={styles.metricHint}>3–4 人男仔團；郊區戶外盡量排早上</span>
            </article>
            <article className={`${styles.metricCard} ${styles.metricPurple}`}>
              <span className={styles.metricLabel}>每人預算</span>
              <strong className={styles.metricValue}>{getTargetText(people, plan)}</strong>
              <span className={styles.metricHint}>不包括大量周邊購物及酒精</span>
            </article>
          </div>

          <div className={styles.routeStrip} aria-label="旅程主要落腳點">
            {["香港", "中部國際機場", "豐橋 4 晚", "田原／新城／二川", "名古屋 2 晚", "香港"].map((place, index, array) => (
              <span key={place + index} style={{ display: "contents" }}>
                <span className={styles.routeNode}>{place}</span>
                {index < array.length - 1 ? <span className={styles.routeArrow}>›</span> : null}
              </span>
            ))}
          </div>

          <div className={styles.restaurantGrid} style={{ marginTop: "1.25rem" }}>
            {nagoyaPhotoStory.map((photo) => (
              <article className={styles.restaurantCard} key={photo.src}>
                <div className={styles.restaurantImageWrap}>
                  <Image
                    className={styles.restaurantImage}
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1040px) 50vw, 33vw"
                  />
                  <span className={styles.restaurantEpisode}>{photo.label}</span>
                </div>
                <div className={styles.restaurantBody}>
                  <h3 className={styles.restaurantName}>{photo.title}</h3>
                  <p className={styles.restaurantScene}>{photo.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.notice} style={{ marginTop: "1.25rem" }}>
            <AlertTriangle className={styles.noticeIcon} size={32} aria-hidden="true" />
            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>「完成全部」的實際定義</strong>
              #5 江比間野外活動中心已永久閉館、#6 USA 豐橋站前店亦已結業，所以只在原址外觀拍照；#4 白谷海水浴場的 2026 游泳季在 8/23 完結，8/26 只作海岸巡禮，不落水。
            </div>
          </div>
          <div className={`${styles.notice} ${styles.noticeDanger}`} style={{ marginTop: "0.75rem" }}>
            <Clock3 className={styles.noticeIcon} size={32} aria-hidden="true" />
            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>已避開已知關門日</strong>
              #9 豐橋市まちなか圖書館逢第四個星期五休館（今次為 28/8），所以排在 25/8；#14 地下資源館及 #22 Nonhoi Park 逢星期一休館，排在 27/8。
            </div>
          </div>

          <div className={styles.panel} style={{ marginTop: "1.25rem", padding: "1.2rem" }}>
            <strong className={styles.noticeTitle}>畀朋友投票</strong>
            <p className={styles.sectionLead} style={{ marginTop: "0.25rem" }}>
              連結會記住目前的人數及方案顯示；投票文字同時列出 A／B 兩案，沒有預設答案。
            </p>
            <div className={styles.heroActions} style={{ marginTop: "0.9rem" }}>
              <button className={styles.shareButton} type="button" onClick={sharePage}>
                <Share2 size={17} />分享目前頁面
              </button>
              <button className={styles.copyButton} type="button" onClick={copyVoteMessage}>
                <Copy size={17} />複製群組投票文
              </button>
            </div>
          </div>
        </section>

        <section
          id="panel-itinerary"
          role="tabpanel"
          aria-labelledby="tab-itinerary"
          className={sectionClass(activeTab, "itinerary")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>7-day rundown</span>
              <h2 className={styles.sectionTitle}>逐日早出晚返時間表</h2>
            </div>
            <p className={styles.sectionLead}>
              {plan === "both"
                ? "Day 3–4 同時列出 A 租車與 B 無車事件，方便逐項比較。"
                : `Day 3–4 已切換成${plan === "car" ? " A 租車案" : " B 無租車案"}；其他日子相同。`}
            </p>
          </div>

          <div className={styles.timeline}>
            {days.map((day, dayIndex) => {
              const events = displayEvents(day);
              const accent = (["blue", "yellow", "coral", "purple"] as const)[dayIndex % 4];
              return (
                <article className={styles.dayCard} data-accent={accent} key={day.day}>
                  <div className={styles.dayRail}>
                    <span className={styles.dayNumber}>DAY {day.day}</span>
                    <strong className={styles.dayDate}>{day.date}</strong>
                    <span className={styles.dayWeekday}>{day.weekday}</span>
                  </div>
                  <div className={styles.dayContent}>
                    <div className={styles.dayHeader}>
                      <div>
                        <h3 className={styles.dayTitle}>{day.title}</h3>
                        <p className={styles.daySubtitle}>{day.subtitle}</p>
                      </div>
                      <span className={styles.dayBadge}>
                        {day.variants ? planLabel(plan) : day.base}
                      </span>
                    </div>
                    <ol className={styles.eventList}>
                      {events.map(({ item, plan: eventPlan }, eventIndex) => (
                        <li className={styles.eventItem} key={`${day.day}-${eventPlan ?? "common"}-${eventIndex}-${item.time}`}>
                          <time className={styles.eventTime}>{item.time}</time>
                          <span className={styles.eventMarker} aria-hidden="true" />
                          <div className={styles.eventBody}>
                            <strong className={styles.eventTitle}>{item.title}</strong>
                            <p className={styles.eventDescription}>{item.detail}</p>
                            <div className={styles.eventTags}>
                              {eventPlan ? (
                                <span className={styles.sceneTag}>{eventPlan === "car" ? "A 租車" : "B 無車"}</span>
                              ) : null}
                              {item.kind ? <span className={styles.tag}>{kindLabels[item.kind] ?? item.kind}</span> : null}
                              {item.spots?.map((spot) => (
                                <span className={styles.tag} key={String(spot)}>
                                  {spot === "bonus" ? "BONUS" : `#${spot}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <div className={styles.routeStrip} aria-label={`Day ${day.day} 路線摘要`}>
                      {events.slice(0, 6).map(({ item }, index) => (
                        <span key={`${item.title}-${index}`} style={{ display: "contents" }}>
                          <span className={styles.routeNode}>{item.title}</span>
                          {index < Math.min(events.length, 6) - 1 ? <span className={styles.routeArrow}>›</span> : null}
                        </span>
                      ))}
                    </div>
                    {day.notes?.map((note) => (
                      <p className={styles.sourceNote} key={note}>※ {note}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="panel-comparison"
          role="tabpanel"
          aria-labelledby="tab-comparison"
          className={sectionClass(activeTab, "comparison")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>A / B vote</span>
              <h2 className={styles.sectionTitle}>同一目標，兩種郊區走法</h2>
            </div>
            <p className={styles.sectionLead}>
              兩案都以 23 點完成為目標。差別集中在 26–27/8 的自由度、司機責任、預約工作及轉乘風險。
            </p>
          </div>

          <div className={styles.comparisonGrid}>
            <article className={styles.comparisonCard}>
              <header className={styles.comparisonHeader}>
                <div>
                  <span className={styles.comparisonLabel}>PLAN A</span>
                  <h3 className={styles.comparisonTitle}>兩日租車</h3>
                </div>
                <div className={styles.comparisonPrice}>
                  {formatHkd(budgetTargets[people].car)}
                  <small>每人全程目標</small>
                </div>
              </header>
              <div className={styles.comparisonBody}>
                <p className={styles.comparisonSummary}>
                  26/8 08:00 至 27/8 約 18:00 於豐橋站取還車；行李留在 Airbnb，郊區路線可按天氣及拍照時間微調。
                </p>
                <ul className={styles.comparisonList}>
                  <li className={styles.comparisonItem}>田原：Gusto → 白谷海岸 → 江比間外觀 → 道之驛豐橋</li>
                  <li className={styles.comparisonItem}>新城：本長篠 → 双瀬（ならぜ）の川渡り → 副川諏訪神社 → Mokkuru</li>
                  <li className={styles.comparisonItem}>下午再去地下資源館及 Nonhoi Park，18:00 前還車</li>
                  <li className={styles.comparisonItem}>需合資格司機、1949 IDP、香港駕照、護照及全保障</li>
                </ul>
                <div className={styles.comparisonTable}>
                  <div className={styles.comparisonRow}><span>兩日車租／保險／ETC／油</span><strong>全組約 ¥30,000–38,000</strong></div>
                  <div className={styles.comparisonRow}><span>主要風險</span><strong>司機疲勞／窄路／泊車</strong></div>
                  <div className={styles.comparisonRow}><span>20kg 行李</span><strong>留住宿，不佔尾箱</strong></div>
                </div>
                <button
                  className={styles.primaryButton}
                  type="button"
                  aria-pressed={plan === "car"}
                  onClick={() => setPlan("car")}
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  <Car size={17} />於頁面顯示 A 案
                </button>
              </div>
            </article>

            <article className={`${styles.comparisonCard} ${styles.comparisonCardAlt}`}>
              <header className={styles.comparisonHeader}>
                <div>
                  <span className={styles.comparisonLabel}>PLAN B</span>
                  <h3 className={styles.comparisonTitle}>鐵路＋預約的士</h3>
                </div>
                <div className={styles.comparisonPrice}>
                  {formatHkd(budgetTargets[people].noCar)}
                  <small>每人全程目標</small>
                </div>
              </header>
              <div className={styles.comparisonBody}>
                <p className={styles.comparisonSummary}>
                  市區以鐵路及巴士移動；田原與新城兩段預先包的士串連難到達位置，避免全日揸車，但時間表較緊。
                </p>
                <ul className={styles.comparisonList}>
                  <li className={styles.comparisonItem}>田原：渥美線＋Gururin 巴士；10:30 白谷起的士串江比間</li>
                  <li className={styles.comparisonItem}>新城：06:21 JR；07:45 的士 loop，10:11 前回本長篠</li>
                  <li className={styles.comparisonItem}>二川：JR 加兩段短程的士，地下資源館後步行／的士到 Nonhoi</li>
                  <li className={styles.comparisonItem}>不用司機，但兩程郊區的士必須預約及先確認報價</li>
                </ul>
                <div className={styles.comparisonTable}>
                  <div className={styles.comparisonRow}><span>郊區的士</span><strong>按咪錶／預約時報價</strong></div>
                  <div className={styles.comparisonRow}><span>主要風險</span><strong>誤車／班次疏／的士供應</strong></div>
                  <div className={styles.comparisonRow}><span>20kg 行李</span><strong>留住宿，轉場日另寄存</strong></div>
                </div>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  aria-pressed={plan === "noCar"}
                  onClick={() => setPlan("noCar")}
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  <TrainFront size={17} />於頁面顯示 B 案
                </button>
              </div>
            </article>
          </div>

          <div className={styles.notice} style={{ marginTop: "1.25rem" }}>
            <CircleDollarSign className={styles.noticeIcon} size={32} />
            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>兩案預算只差約 {formatHkd(budgetTargets[people].car - budgetTargets[people].noCar)}／人</strong>
              數字是可比較的全程 planning target，不是即時報價。機票、Airbnb、租車、的士及匯率都要在落實人數後重新查價。
            </div>
          </div>
        </section>

        <section
          id="panel-spots"
          role="tabpanel"
          aria-labelledby="tab-spots"
          className={sectionClass(activeTab, "spots")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Official 23</span>
              <h2 className={styles.sectionTitle}>完整巡禮點互動清單</h2>
            </div>
            <p className={styles.sectionLead}>
              搜尋、按地區篩選、開 Google Maps，再標記已到訪；進度只儲存在你目前的瀏覽器。
            </p>
          </div>

          <div className={styles.spotToolbar}>
            <label className={styles.searchWrap}>
              <span className={styles.visuallyHidden}>搜尋巡禮點</span>
              <span className={styles.searchIcon}><Search size={18} /></span>
              <input
                className={styles.searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜尋地名、集數、場景…"
                type="search"
              />
            </label>
            <div className={styles.filterChips} aria-label="巡禮點分類">
              {spotFilters.map((filter) => (
                <button
                  className={`${styles.filterChip} ${spotFilter === filter.id ? styles.filterChipActive : ""}`}
                  key={filter.id}
                  type="button"
                  aria-pressed={spotFilter === filter.id}
                  onClick={() => setSpotFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.progressPanel} aria-live="polite">
            <div
              className={styles.progressRing}
              data-progress={`${spotProgress}%`}
              style={{ "--progress": `${spotProgress}%` } as CSSProperties}
              aria-label={`巡禮進度 ${spotProgress}%`}
            />
            <div>
              <h3 className={styles.progressTitle}>{visitedCount} / {officialSpots.length} 個官方點已標記</h3>
              <p className={styles.progressText}>外觀拍照的 #5、#6 亦計作完成；安全及守法優先。</p>
            </div>
            <button className={styles.ghostButton} type="button" onClick={() => setVisitedSpots(new Set())} disabled={visitedCount === 0}>
              清除進度
            </button>
          </div>

          <div className={styles.spotGrid}>
            {filteredSpots.length ? filteredSpots.map((spot) => {
              const image = spotImage(spot);
              const checked = visitedSpots.has(String(spot.id));
              const limited = spot.status !== "open";
              return (
                <article
                  className={`${styles.spotCard} ${checked ? styles.spotCardChecked : ""} ${limited ? styles.spotCardClosed : ""}`}
                  key={String(spot.id)}
                >
                  <div className={styles.spotImageWrap}>
                    <Image className={styles.spotImage} src={image.src} alt={image.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1040px) 50vw, 33vw" />
                    <span className={styles.spotNumber}>#{spot.officialNo}</span>
                    <span className={`${styles.spotStatus} ${limited ? styles.spotStatusClosed : ""}`}>{spot.statusLabel}</span>
                  </div>
                  <div className={styles.spotBody}>
                    <span className={styles.spotRegion}>{spot.area} · 排定 {spot.plannedDayLabel}</span>
                    <h3 className={styles.spotTitle}>{spot.nameZh}</h3>
                    <p className={styles.spotJapanese}>{spot.nameJp}</p>
                    <p className={styles.spotScene}><strong>{spot.episode}</strong> · {spot.scene}</p>
                    <div className={styles.spotMeta}>
                      <span className={styles.tag}>{spot.category}</span>
                      {spot.currentInfo ? <span className={styles.tag}>{spot.currentInfo}</span> : null}
                    </div>
                    {spot.constraints ? <p className={styles.sourceNote}>注意：{spot.constraints}</p> : null}
                    <div className={styles.spotActions}>
                      <button className={styles.checkButton} type="button" aria-pressed={checked} onClick={() => toggleSpot(String(spot.id))}>
                        <Check size={16} />{checked ? "已到訪" : "標記到訪"}
                      </button>
                      <a className={styles.mapButton} href={spot.googleMapsUrl} target="_blank" rel="noreferrer">
                        <MapPinned size={16} />地圖
                      </a>
                    </div>
                  </div>
                </article>
              );
            }) : (
              <div className={styles.emptyState}>
                <Search size={28} aria-hidden="true" />
                <p>找不到符合條件的巡禮點，試下清除搜尋或轉其他分類。</p>
              </div>
            )}
          </div>

          {bonusSpot ? (
            <div className={styles.notice} style={{ marginTop: "1.25rem" }}>
              <Camera className={styles.noticeIcon} size={32} />
              <div className={styles.noticeBody}>
                <strong className={styles.noticeTitle}>順路 bonus：{bonusSpot.nameZh}</strong>
                不計入官方 23 點；排在 {bonusSpot.plannedDayLabel}，市區路線有時間就去。
                <a className={styles.mapButton} href={bonusSpot.googleMapsUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "0.75rem" }}>
                  開地圖 <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : null}
        </section>

        <section
          id="panel-food"
          role="tabpanel"
          aria-labelledby="tab-food"
          className={sectionClass(activeTab, "food")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Scene-to-table</span>
              <h2 className={styles.sectionTitle}>角色去過的店與劇中食物</h2>
            </div>
            <p className={styles.sectionLead}>
              以場景重現為主；餐點可能售罄或轉季，先拍店外，再按現場輪候及營業時間決定食甚麼。
            </p>
          </div>

          <div className={styles.restaurantGrid}>
            {foodStops.map((food) => {
              const spot = pilgrimageSpots.find((candidate) => candidate.id === food.spotId);
              if (!spot) return null;
              const image = spotImage(spot);
              return (
                <article className={styles.restaurantCard} key={food.spotId}>
                  <div className={styles.restaurantImageWrap}>
                    <Image className={styles.restaurantImage} src={image.src} alt={image.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1040px) 50vw, 33vw" />
                    <span className={styles.restaurantEpisode}>{food.episode}</span>
                  </div>
                  <div className={styles.restaurantBody}>
                    <h3 className={styles.restaurantName}>#{food.spotId} {food.name}</h3>
                    <p className={styles.restaurantScene}>{food.scene}</p>
                    <div className={styles.eventTags}>
                      {food.characters.map((character) => <span className={styles.sceneTag} key={character}>{character}</span>)}
                    </div>
                    <ul className={styles.foodList} aria-label="劇中及相關餐點">
                      {food.foods.map((item) => <li className={styles.foodItem} key={item}>{item}</li>)}
                    </ul>
                    <p className={styles.sourceNote}><strong>營業參考：</strong>{food.hours}<br />{food.note}</p>
                    <a className={styles.mapButton} href={spot.googleMapsUrl} target="_blank" rel="noreferrer" style={{ marginTop: "auto" }}>
                      <MapPinned size={16} />Google Maps
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <p className={styles.sourceNote}>※ 實景相片只在有合適授權圖片時顯示該店；其餘卡片使用同區巡禮參考相片，並在 alt 文字標明。</p>
        </section>

        <section
          id="panel-stay"
          role="tabpanel"
          aria-labelledby="tab-stay"
          className={sectionClass(activeTab, "stay")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Stay & luggage</span>
              <h2 className={styles.sectionTitle}>高評分 Airbnb 與 20kg 行李流</h2>
            </div>
            <p className={styles.sectionLead}>
              全部住宿選項都保留，未替大家下決定。頁面按 {people} 人即時顯示已查總價及每人約數。
            </p>
          </div>

          <div className={styles.lodgingGrid}>
            {lodgingOptions.map((stay) => {
              const price = stay.priceJPY[people];
              const perPersonHkd = price ? Math.round(price / FX_JPY_PER_HKD / people) : null;
              return (
                <article className={styles.lodgingCard} key={stay.id}>
                  <header className={styles.lodgingHeader}>
                    <span className={styles.lodgingCity}>{stay.city} · {stay.dates}</span>
                    <h3 className={styles.lodgingTitle}>{stay.label}</h3>
                    <span className={styles.ratingBadge}><Star size={15} fill="currentColor" />{stay.rating.toFixed(2)} · {stay.reviews} 則評價</span>
                  </header>
                  <div className={styles.lodgingBody}>
                    <div className={styles.lodgingStats}>
                      <div className={styles.lodgingStat}><strong>{stay.rooms}</strong>房間配置</div>
                      <div className={styles.lodgingStat}><strong>{stay.beds}</strong>睡眠配置</div>
                      <div className={styles.lodgingStat}><strong>{stay.baths}</strong>衛浴配置</div>
                    </div>
                    <div className={styles.spotMeta}>
                      {stay.badges.map((badge) => <span className={styles.tag} key={badge}>{badge}</span>)}
                      {stay.budgetBaseline ? <span className={styles.sceneTag}>預算計算基準</span> : null}
                    </div>
                    <ul className={styles.lodgingDetails}>
                      <li className={styles.lodgingDetail}><Car size={16} />泊車：{stay.parking}</li>
                      <li className={styles.lodgingDetail}><Luggage size={16} />行李：{stay.luggage}</li>
                      {stay.notes.map((note) => <li className={styles.lodgingDetail} key={note}><Check size={16} />{note}</li>)}
                    </ul>
                    <div className={styles.lodgingPrice}>
                      <div>
                        <strong>{price ? formatYen(price) : "需重新查價"}</strong>
                        <span style={{ display: "block" }}>{people} 人入住總價</span>
                      </div>
                      <span>{perPersonHkd ? `約 ${formatHkd(perPersonHkd)}／人` : "視供應"}</span>
                    </div>
                    <a className={styles.mapButton} href={stay.url} target="_blank" rel="noreferrer" style={{ marginTop: "1rem", width: "100%" }}>
                      查看 Airbnb <ExternalLink size={15} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <h3 className={styles.sectionTitle} style={{ fontSize: "clamp(1.55rem, 3vw, 2.2rem)", marginTop: "2.5rem" }}>28/8 轉場行李 rundown</h3>
          <div className={styles.baggageFlow}>
            {[
              ["1", "豐橋退房", "每人一件約 20kg；早上先帶到名古屋站寄存點。"],
              ["2", "10:15 寄存", "預約 ecbo cloak 3–4 件大型行李；20kg 是上限，逐件登記。"],
              ["3", "輕裝活動", "約 10:45–16:00 去博物館／補漏，不拖行李轉車。"],
              ["4", "取回再入住", "16:00 左右取回，再到岩塚 Airbnb；保留收據及最晚取件時間。"]
            ].map(([number, title, text]) => (
              <article className={styles.baggageStep} key={number}>
                <span className={styles.baggageNumber}>{number}</span>
                <strong className={styles.baggageTitle}>{title}</strong>
                <p className={styles.baggageText}>{text}</p>
              </article>
            ))}
          </div>
          <div className={styles.notice} style={{ marginTop: "1rem" }}>
            <Luggage className={styles.noticeIcon} size={32} />
            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>寄存備援</strong>
              ecbo 大型行李參考約 ¥800／件／日，必須按實際件數預約。豐橋站大型 locker 只作後備，不假設一次有 3–4 個空位；機場 3F 另有有人行李寄存櫃位。
            </div>
          </div>
          <p className={styles.sourceNote}>Airbnb 價格及評分為 2026/7/15 查價快照；未預訂前會變動。換算只用規劃匯率 HK$1 ≈ ¥20.5。</p>
        </section>

        <section
          id="panel-budget"
          role="tabpanel"
          aria-labelledby="tab-budget"
          className={sectionClass(activeTab, "budget")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Budget model</span>
              <h2 className={styles.sectionTitle}>每人預算跟方案、人數更新</h2>
            </div>
            <p className={styles.sectionLead}>
              數字是現階段投票用的 planning range；落實航班、住宿及交通後，再把真實價格換入。
            </p>
          </div>

          <div className={styles.budgetGrid}>
            <article className={styles.budgetSummary}>
              <span className={styles.budgetLabel}>目前選擇 · {people} 人 · {planLabel(plan)}</span>
              <strong className={styles.budgetAmount}>{getTargetText(people, plan)}</strong>
              <span className={styles.budgetPerPerson}>每人全程預算目標</span>
              <div className={styles.budgetChips}>
                <span className={styles.budgetChip}>7 日 6 夜</span>
                <span className={styles.budgetChip}>HK$1 ≈ ¥20.5</span>
                <span className={styles.budgetChip}>含 20kg 行李安排</span>
                <span className={styles.budgetChip}>不含大量周邊／酒精</span>
              </div>
            </article>
            <article className={styles.budgetBreakdown}>
              <h3 className={styles.budgetBreakdownTitle}>分項估算（每人）</h3>
              <div className={styles.budgetTable}>
                {budgetRows.map((category) => {
                  const range = people === 3 ? category.people3 : category.people4;
                  const width = `${Math.max(4, Math.round((range.max / largestBudgetRow) * 100))}%`;
                  return (
                    <div className={styles.budgetRow} key={category.id} title={category.note}>
                      <div>
                        <span>{category.label}{category.appliesTo === "car" ? "（A）" : category.appliesTo === "noCar" ? "（B）" : ""}</span>
                        <div className={styles.budgetBar} aria-hidden="true">
                          <div className={styles.budgetBarFill} style={{ "--width": width } as CSSProperties} />
                        </div>
                      </div>
                      <strong>{formatRange(range)}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className={styles.comparisonGrid} style={{ marginTop: "1.25rem" }}>
            <div className={styles.panel} style={{ padding: "1.2rem" }}>
              <span className={styles.comparisonLabel}>A 租車案</span>
              <strong className={styles.metricValue}>{formatHkd(budgetTargets[people].car)}</strong>
              <p className={styles.metricHint}>{people} 人時每人目標；人數愈少，車租及住宿攤分愈高。</p>
            </div>
            <div className={styles.panel} style={{ padding: "1.2rem" }}>
              <span className={styles.comparisonLabel} style={{ color: "var(--coral-deep)" }}>B 無租車案</span>
              <strong className={styles.metricValue}>{formatHkd(budgetTargets[people].noCar)}</strong>
              <p className={styles.metricHint}>包括兩段郊區的士預留；實價要按預約公司報價更新。</p>
            </div>
          </div>
          <p className={styles.sourceNote}>所有金額均為每人概算及預留 buffer；不構成即時報價。若機票或住宿升幅明顯，應先更新大項再投票。</p>
        </section>

        <section
          id="panel-checklist"
          role="tabpanel"
          aria-labelledby="tab-checklist"
          className={sectionClass(activeTab, "checklist")}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Before departure</span>
              <h2 className={styles.sectionTitle}>由投票到出發的共用清單</h2>
            </div>
            <p className={styles.sectionLead}>
              {plan === "both" ? "目前顯示兩案所有準備項目。" : `目前只顯示共用項目及${plan === "car" ? "租車" : "無車"}方案項目。`}勾選狀態會留在目前瀏覽器。
            </p>
          </div>

          <div className={styles.progressPanel} aria-live="polite">
            <div
              className={styles.progressRing}
              data-progress={`${checklistProgress}%`}
              style={{ "--progress": `${checklistProgress}%` } as CSSProperties}
              aria-label={`準備進度 ${checklistProgress}%`}
            />
            <div>
              <h3 className={styles.progressTitle}>{checkedCount} / {visibleChecklist.length} 項完成</h3>
              <p className={styles.progressText}>先處理投票、機票、住宿及交通預約，再做最後一星期複查。</p>
            </div>
            <button className={styles.ghostButton} type="button" onClick={() => setCheckedItems(new Set())} disabled={checkedCount === 0}>
              清除勾選
            </button>
          </div>

          <div className={styles.checklistGrid}>
            {visibleChecklist.map((item) => {
              const done = checkedItems.has(item.id);
              return (
                <button
                  className={`${styles.checklistItem} ${done ? styles.checklistItemDone : ""}`}
                  type="button"
                  key={item.id}
                  aria-pressed={done}
                  onClick={() => toggleChecklist(item.id)}
                >
                  <span className={styles.checkBox}><Check size={16} /></span>
                  <span style={{ textAlign: "left" }}>
                    <span className={styles.checklistTitle}>{item.title}</span>
                    <span className={styles.checklistHint}>{item.hint}</span>
                  </span>
                  <span className={styles.checklistCategory}>{item.category}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.weatherStrip}>
            <div className={styles.weatherItem}><ThermometerSun size={22} /><strong className={styles.weatherValue}>33.2°C</strong><span className={styles.weatherLabel}>名古屋 8 月平均最高溫</span></div>
            <div className={styles.weatherItem}><Sun size={22} /><strong className={styles.weatherValue}>24.7°C</strong><span className={styles.weatherLabel}>8 月平均最低溫</span></div>
            <div className={styles.weatherItem}><Droplets size={22} /><strong className={styles.weatherValue}>69%</strong><span className={styles.weatherLabel}>平均相對濕度；戶外早上行</span></div>
          </div>
          <div className={`${styles.notice} ${styles.noticeDanger}`} style={{ marginTop: "1rem" }}>
            <CloudSun className={styles.noticeIcon} size={32} />
            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>高溫、雷雨與颱風優先於打卡</strong>
              海岸、渡河點及神社山路遇強風或暴雨就跳過，Day 5 才補安全可去的市區點；不要為了「全制霸」進入封閉範圍。
            </div>
          </div>
        </section>
      </main>

      <div className={styles.floatingShare} aria-label="快速分享">
        <button className={styles.shareButton} type="button" onClick={sharePage} aria-label="分享行程">
          <Share2 size={17} />分享
        </button>
        <button className={styles.copyButton} type="button" onClick={copyUrl} aria-label="複製行程連結">
          <Copy size={17} />複製
        </button>
      </div>

      {toast ? <div className={styles.toast} role="status">{toast}</div> : null}

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop}>
            <div>
              <h2 className={styles.footerTitle}>輸咗戀愛，<br />唔好輸埋尾班車。</h2>
              <p className={styles.footerText}>
                本頁是朋友之間使用的非官方粉絲旅行指南，與《敗犬女主太多了！》作者、出版社、動畫製作委員會、景點或店舖沒有隸屬或合作關係。作品名稱、標誌及角色權利屬原權利人；行程資料會變動，出發前請再查官方公告。
              </p>
              <span className={styles.fanBadge}>非官方 · Fan-made · 不作商業用途</span>
            </div>
            <div>
              <h3 className={styles.creditTitle}>相片及標誌授權</h3>
              <div className={styles.creditGrid}>
                {imageCredits.map((credit) => (
                  <div className={styles.creditItem} key={credit.localFile}>
                    <a href={credit.sourcePage} target="_blank" rel="noreferrer">{credit.title}</a><br />
                    {credit.author} · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>
                  </div>
                ))}
              </div>
              <h3 className={styles.creditTitle} style={{ marginTop: "1.35rem" }}>行程資料來源</h3>
              <div className={styles.creditGrid}>
                {sources.map((source) => (
                  <div className={styles.creditItem} key={source.url}>
                    <span>{source.group} · </span>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>資料整理：2026/7/15 · 行程：2026/8/24–30</span>
            <span className={styles.muted}><Plane size={14} style={{ verticalAlign: "middle" }} /> HKG → NGO → HKG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
