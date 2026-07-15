export type PlanKey = "car" | "noCar";
export type SpotStatus = "open" | "exterior" | "season-ended";
export type SpotId = number | "bonus";
export type ScheduleKind =
  | "flight"
  | "travel"
  | "pilgrimage"
  | "food"
  | "stay"
  | "flex"
  | "city";

export interface ScheduleItem {
  time: string;
  title: string;
  detail: string;
  spots?: SpotId[];
  kind?: ScheduleKind;
}

export interface DayPlan {
  day: number;
  date: string;
  weekday: string;
  base: string;
  title: string;
  subtitle: string;
  imageKey: string;
  common: ScheduleItem[];
  variants?: Record<PlanKey, ScheduleItem[]>;
  notes?: string[];
}

export interface PilgrimageSpot {
  id: SpotId;
  officialNo: number | null;
  official: boolean;
  nameJp: string;
  nameZh: string;
  area: string;
  category: string;
  address: string;
  googleMapsUrl: string;
  episode: string;
  scene: string;
  status: SpotStatus;
  statusLabel: string;
  currentInfo: string;
  constraints: string;
  plannedDays: number[];
  plannedDayLabel: string;
}

export interface FoodStop {
  spotId: number;
  name: string;
  episode: string;
  characters: string[];
  scene: string;
  foods: string[];
  hours: string;
  note: string;
}

export interface LodgingOption {
  id: string;
  city: "豐橋" | "名古屋";
  label: string;
  dates: string;
  nights: number;
  rating: number;
  reviews: number;
  badges: string[];
  rooms: string;
  beds: string;
  baths: string;
  parking: string;
  luggage: string;
  priceJPY: Record<3 | 4, number | null>;
  url: string;
  notes: string[];
  budgetBaseline: boolean;
}

export interface MoneyRange {
  min: number;
  max: number;
}

export interface BudgetCategory {
  id: string;
  label: string;
  appliesTo: "all" | PlanKey;
  people3: MoneyRange;
  people4: MoneyRange;
  note: string;
}

export interface SourceLink {
  label: string;
  url: string;
  group: string;
}

export const siteTabs = [
  { id: "overview", label: "一眼睇晒", shortLabel: "總覽" },
  { id: "rundown", label: "逐日行程", shortLabel: "行程" },
  { id: "compare", label: "兩案比較", shortLabel: "比較" },
  { id: "spots", label: "23 點打卡", shortLabel: "23 點" },
  { id: "food", label: "劇中美食", shortLabel: "美食" },
  { id: "stay", label: "住宿・行李", shortLabel: "住宿" },
  { id: "budget", label: "每人預算", shortLabel: "預算" },
  { id: "checklist", label: "出發清單", shortLabel: "清單" }
] as const;

export const tripMeta = {
  dates: "2026.08.24 — 08.30",
  dateLabel: "2026 年 8 月 24 日（一）至 30 日（日）",
  duration: "7 日 6 夜",
  group: "3–4 名朋友",
  luggage: "每人約 20 kg",
  route: ["香港", "中部國際機場", "豐橋 4 晚", "名古屋 2 晚", "香港"],
  officialSpots: 23,
  bonusSpots: 1,
  definition: "21 個正常到訪＋2 個已結業地點在合法公共位置拍外觀",
  researchDate: "2026-07-15",
  planningFx: "HK$1 ≈ ¥20.5"
};

export const transportPlans = {
  car: {
    key: "car" as const,
    code: "A",
    label: "租車版",
    headline: "8/26–27 自駕兩日，其餘鐵路／步行",
    summary: "鄉郊四點可按天氣微調；行李留在 Airbnb，不帶上車。",
    cost3: 9200,
    cost4: 8900,
    requirements: ["最少一位司機", "1949 日內瓦公約 IDP＋香港駕照＋護照", "全保障、NOC、ETC"],
    strengths: ["時間最有彈性", "高溫或下雨時較舒服", "鄉郊點之間接駁直接"],
    tradeoffs: ["駕駛日不能飲酒", "要處理取還車及泊車", "兩日全車約 ¥30,000–38,000"]
  },
  noCar: {
    key: "noCar" as const,
    code: "B",
    label: "無租車版",
    headline: "鐵路／巴士＋田原、新城兩段預約的士",
    summary: "無人需要駕駛；兩段鄉郊的士要先取得時間及價錢確認。",
    cost3: 8900,
    cost4: 8700,
    requirements: ["預約田原 75–90 分鐘的士", "預約新城約 2 小時 15 分鐘的士", "前一晚重查班次"],
    strengths: ["全員晚上都可飲酒", "不用申請 IDP", "不用處理泊車／還車"],
    tradeoffs: ["時間表較硬", "錯過疏落班次會壓縮行程", "純巴士版本不適合當主方案"]
  }
};

export const days: DayPlan[] = [
  {
    day: 1,
    date: "8 月 24 日",
    weekday: "星期一",
    base: "豐橋",
    title: "香港 → 中部機場 → 豐橋",
    subtitle: "先安頓行李，再以市中心夜行作巡禮熱身。",
    imageKey: "tram",
    common: [
      { time: "10:10–15:05", title: "香港飛名古屋", detail: "以 CX536 作時間基準；訂票時再比較連 20 kg 行李的總價。", kind: "flight" },
      { time: "15:50–18:00", title: "中部機場 → 豐橋", detail: "入境後乘名鐵往豐橋；預留轉車與買水時間。", kind: "travel" },
      { time: "18:00", title: "入住豐橋 Airbnb", detail: "四件大行李留在住宿；便利店補水、早餐與現金。", kind: "stay" },
      { time: "19:00–21:00", title: "市中心輕量巡禮", detail: "駅前電停、USA 舊址、水上ビル；精神夠才到 UNO-UNO。", spots: [2, 6, 19, 7], kind: "pilgrimage" }
    ],
    notes: ["星期一 #14、#20、#22 休館／休店，不押任何限時室內點。"]
  },
  {
    day: 2,
    date: "8 月 25 日",
    weekday: "星期二",
    base: "豐橋",
    title: "豐橋市區 12 點＋みやこ＋Bonus",
    subtitle: "由 07:00 食到 17:00，步行、電車與短程的士串連市區場景。",
    imageKey: "bon",
    common: [
      { time: "06:55–07:40", title: "UNO-UNO 早餐", detail: "第 5 集檸檬與綾野會面；Morning 07:00–11:00。", spots: [7], kind: "food" },
      { time: "07:45–08:40", title: "駅前、USA 舊址、Yamasa", detail: "公共位置拍外觀，再到西駅店買竹輪。", spots: [2, 6, 13], kind: "pilgrimage" },
      { time: "09:00–10:45", title: "圖書館＋珈琲とカヌレ", detail: "圖書館不能留到 8/28；可麗露接近開門食，避免售罄。", spots: [9, 20], kind: "pilgrimage" },
      { time: "10:50–12:50", title: "水上ビル、Bon 千賀、精文館", detail: "Bon 千賀只收現金；書店內拍攝先問職員。", spots: [19, 8, 1], kind: "pilgrimage" },
      { time: "13:00–14:20", title: "Kalmia 三點連打", detail: "商場本體、Murata 三粒章魚燒及豊川堂書店。", spots: [10, 11, 12], kind: "pilgrimage" },
      { time: "14:35–15:20", title: "吉田神社 Bonus", detail: "官方製作／聲優曾參拜及留下繪馬；不計入 23 點。", spots: ["bonus"], kind: "pilgrimage" },
      { time: "16:00–17:00", title: "みやこ", detail: "第 11 集小店，平日 16:00–20:00；現金，臨休則三／四／五再試。", spots: [23], kind: "food" },
      { time: "17:15 後", title: "自由晚餐／洗衫／早睡", detail: "翌日早起，晚上不再塞景點。", kind: "flex" }
    ]
  },
  {
    day: 3,
    date: "8 月 26 日",
    weekday: "星期三",
    base: "豐橋",
    title: "Gusto＋田原半島＋道の駅とよはし",
    subtitle: "同一批巡禮點，兩案只在交通接駁方式不同。",
    imageKey: "beach",
    common: [
      { time: "06:15–07:05", title: "Gusto 早餐", detail: "第 1 集八奈見被甩、溫水陪食及埋單的代表餐廳。", spots: [3], kind: "food" }
    ],
    variants: {
      car: [
        { time: "08:00", title: "豐橋站取車", detail: "檢查車身、油量、ETC、保障及所有司機登記。", kind: "travel" },
        { time: "08:50–09:30", title: "白谷海岸", detail: "2026 泳季已於 8/23 結束，只拍海岸，不假設可游泳。", spots: [4], kind: "pilgrimage" },
        { time: "09:50–10:20", title: "江比間外觀", detail: "2025 年永久閉館；只在合法公共道路遠觀，絕不入內。", spots: [5], kind: "pilgrimage" },
        { time: "11:05–12:30", title: "道の駅とよはし", detail: "試鵪鶉雪糕及「大人の初恋レモン」，以當日供應為準。", spots: [21], kind: "food" },
        { time: "13:00 後", title: "回豐橋休息／補漏", detail: "保留高溫、塞車及小店延誤緩衝。", kind: "flex" }
      ],
      noCar: [
        { time: "約 07:45–08:20", title: "新豊橋 → 三河田原", detail: "前一晚用豊鉄官方時間表再核對。", kind: "travel" },
        { time: "09:15–09:36", title: "ぐるりんバス往白谷", detail: "現行例：¥200 現金，車上無找續。", kind: "travel" },
        { time: "09:36–10:25", title: "白谷海岸", detail: "泳季已完，只作海岸拍攝。", spots: [4], kind: "pilgrimage" },
        { time: "10:30–約 11:45", title: "預約田原的士", detail: "白谷 → 江比間公共道路外觀 → 三河田原；預留 75–90 分鐘。", spots: [5], kind: "travel" },
        { time: "約 12:00–12:45", title: "三河田原 → 新豊橋", detail: "回程班次出發前再查。", kind: "travel" },
        { time: "約 13:35–15:55", title: "巴士往返道の駅とよはし", detail: "班次有限，前一晚必須核對回程。", spots: [21], kind: "pilgrimage" }
      ]
    },
    notes: ["豊鉄タクシー田原営業所：0531-22-1171。"]
  },
  {
    day: 4,
    date: "8 月 27 日",
    weekday: "星期四",
    base: "豐橋",
    title: "新城山區＋二川兩館",
    subtitle: "完成鄉郊四點，再把下午留給地下資源館及 Nonhoi Park。",
    imageKey: "nonhoi",
    common: [],
    variants: {
      car: [
        { time: "05:50", title: "Airbnb 出發", detail: "天光後到河道；車上備水及早餐。", kind: "travel" },
        { time: "06:50–07:15", title: "本長篠駅", detail: "只在正常乘客範圍拍攝。", spots: [18], kind: "pilgrimage" },
        { time: "07:35–08:30", title: "双瀬川渡り＋副川諏訪神社", detail: "雨後不涉水、不阻路；神社尊重居民。", spots: [16, 17], kind: "pilgrimage" },
        { time: "09:00–10:00", title: "Mokkuru 新城", detail: "石燒香腸及其他場景食物以當日櫃位為準。", spots: [15], kind: "food" },
        { time: "10:45–11:40", title: "地下資源館", detail: "第 6 集 double date；免費入館，天象館另計。", spots: [14], kind: "pilgrimage" },
        { time: "12:00–16:10", title: "Nonhoi Park", detail: "第 11–12 集大型場景；成人 ¥600，16:00 最後入場。", spots: [22], kind: "pilgrimage" },
        { time: "16:15–18:00", title: "加油、回豐橋還車", detail: "預留塞車；不要壓到門店 20:00 關門。", kind: "travel" }
      ],
      noCar: [
        { time: "06:21–07:21", title: "JR 豐橋 → 本長篠", detail: "8 月中再核對飯田線班次。", kind: "travel" },
        { time: "07:21–07:40", title: "本長篠駅", detail: "拍攝後準時到預約上車點。", spots: [18], kind: "pilgrimage" },
        { time: "07:45–10:00", title: "預約新城的士", detail: "本長篠 → 双瀬 → 副川諏訪神社 → Mokkuru → 本長篠。", spots: [16, 17, 15], kind: "travel" },
        { time: "10:11–11:16", title: "JR 本長篠 → 豐橋", detail: "錯過會壓縮動物園時間。", kind: "travel" },
        { time: "11:20–12:35", title: "二川＋地下資源館", detail: "由二川站接短程的士，約 45–50 分鐘重點巡禮。", spots: [14], kind: "pilgrimage" },
        { time: "12:35–16:20", title: "短程的士＋Nonhoi Park", detail: "預留約 3 小時 20 分鐘；16:30 關門。", spots: [22], kind: "pilgrimage" }
      ]
    },
    notes: ["新城的士：豊鉄 0536-23-5811；後備辻村 0536-22-1115。", "有雨、颱風或水漲，只在安全岸邊拍 #16。"]
  },
  {
    day: 5,
    date: "8 月 28 日",
    weekday: "星期五",
    base: "名古屋",
    title: "補漏緩衝＋豐橋 → 名古屋",
    subtitle: "上午留有補漏空間；四件 20 kg 行李預約寄存後再入城。",
    imageKey: "castle",
    common: [
      { time: "08:30–10:10", title: "退房、前往名古屋", detail: "正常情況 23 點已完成；如需補漏，中午才轉名古屋。", kind: "travel" },
      { time: "10:15–16:00", title: "ecbo 寄存 3–4 件行李", detail: "名古屋站預約大型件，約 ¥800／件，單件上限 20 kg。", kind: "stay" },
      { time: "10:45–14:00", title: "Toyota 產業技術紀念館", detail: "汽車館與機械示範；星期一休館。", kind: "city" },
      { time: "14:10–15:30", title: "Noritake／名古屋站午餐", detail: "按體力及補漏情況縮短。", kind: "city" },
      { time: "16:00", title: "取行李、入住岩塚", detail: "若屋主書面確認可早存四件行李，才取消 ecbo。", kind: "stay" },
      { time: "18:00–深夜", title: "名古屋站／榮晚餐", detail: "手羽先、味噌串カツ、居酒屋。", kind: "city" }
    ],
    notes: ["#9 圖書館今日因第四個星期五休館；不能留待今日。"]
  },
  {
    day: 6,
    date: "8 月 29 日",
    weekday: "星期六",
    base: "名古屋",
    title: "城、動漫街、神社與夜景",
    subtitle: "名古屋全日自由行；可按前一天補漏情況互換 Toyota 館。",
    imageKey: "osu",
    common: [
      { time: "07:45", title: "Komeda／喫茶店早餐", detail: "早起出發，避開中午最熱時段。", kind: "food" },
      { time: "09:00–11:00", title: "名古屋城＋本丸御殿", detail: "天守閣仍不可進入；現行成人 ¥500。", kind: "city" },
      { time: "11:30–15:00", title: "大須觀音＋商店街", detail: "午餐、動漫／模型及二手店自由活動。", kind: "city" },
      { time: "15:30–17:00", title: "熱田神宮", detail: "太熱或累可回住宿休息。", kind: "city" },
      { time: "17:30–深夜", title: "榮、MIRAI TOWER、名古屋飯", detail: "日落夜景後食 hitsumabushi、味噌カツ或手羽先。", kind: "city" }
    ]
  },
  {
    day: 7,
    date: "8 月 30 日",
    weekday: "星期日",
    base: "香港",
    title: "名古屋 → 中部機場 → 香港",
    subtitle: "行李與安檢優先，最後採購只放在有餘裕時。",
    imageKey: "sakae",
    common: [
      { time: "09:00–10:00", title: "早餐、退房", detail: "確認護照、行李重量及房內沒有遺留物。", kind: "stay" },
      { time: "11:30–12:30", title: "名鐵前往中部機場", detail: "不因寄存或購物壓縮機場時間。", kind: "travel" },
      { time: "12:30–14:00", title: "寄艙、午餐、安檢", detail: "如需機場人工寄存，T1 3F 06:30–21:30。", kind: "flight" },
      { time: "16:10–19:30", title: "名古屋飛香港", detail: "以 CX539 作時間基準；落訂後以航空公司為準。", kind: "flight" }
    ]
  }
];

export const pilgrimageSpots: PilgrimageSpot[] = [
  { id: 1, officialNo: 1, official: true, nameJp: "精文館書店 豊橋本店", nameZh: "精文館書店 豐橋本店", area: "豐橋市區", category: "書店", address: "愛知県豊橋市広小路1-6", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=精文館書店+豊橋本店", episode: "第 3 集", scene: "溫水與小鞠在輕小說區交談，也是作品應援書店。", status: "open", statusLabel: "正常到訪", currentInfo: "10:00–20:00", constraints: "店內及陳列拍攝先問職員。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 2, officialNo: 2, official: true, nameJp: "豊鉄市内線 駅前停留所", nameZh: "豐鐵市內線站前電停", area: "豐橋市區", category: "交通", address: "豊橋駅東口", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=豊鉄市内線+駅前停留所", episode: "ED／第 2 集", scene: "多次出現的電車與市中心背景。", status: "open", statusLabel: "正常到訪", currentInfo: "公共電車站，按營運時間使用", constraints: "勿阻礙乘客或月台動線。", plannedDays: [1, 2], plannedDayLabel: "8/24 或 25" },
  { id: 3, officialNo: 3, official: true, nameJp: "ガスト豊橋橋良店", nameZh: "Gusto 豐橋橋良店", area: "豐橋南", category: "餐廳", address: "愛知県豊橋市中橋良町70-1", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=ガスト+豊橋橋良店", episode: "第 1 集", scene: "八奈見被甩、溫水陪食兼埋單的代表場景。", status: "open", statusLabel: "正常到訪", currentInfo: "06:00–02:00", constraints: "繁忙時不要長時間佔枱重拍。", plannedDays: [3], plannedDayLabel: "8/26" },
  { id: 4, officialNo: 4, official: true, nameJp: "白谷海水浴場", nameZh: "白谷海水浴場", area: "田原", category: "戶外", address: "愛知県田原市白磯10", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=白谷海水浴場+田原市", episode: "第 3–4 集／OP", scene: "文藝部合宿海邊及八奈見的代表海岸畫面。", status: "season-ended", statusLabel: "泳季已完", currentInfo: "2026 泳季至 8/23；旅程翌日開始", constraints: "只作海岸拍攝，不假設有救生員、淋浴或可安全游泳。", plannedDays: [3], plannedDayLabel: "8/26" },
  { id: 5, officialNo: 5, official: true, nameJp: "江比間野外活動センター", nameZh: "江比間野外活動中心", area: "田原", category: "已閉館", address: "愛知県田原市江比間町長尾1-1", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=江比間野外活動センター", episode: "第 3–4 集", scene: "合宿、告白及後續事件的主要舞台。", status: "exterior", statusLabel: "外觀限定", currentInfo: "2025-03-31 永久閉館", constraints: "只在合法公共道路遠觀；不越門、不入內、不飛無人機。", plannedDays: [3], plannedDayLabel: "8/26" },
  { id: 6, officialNo: 6, official: true, nameJp: "USA豊橋駅前店 舊址", nameZh: "USA 豐橋站前店舊址", area: "豐橋市區", category: "已閉店", address: "愛知県豊橋市駅前大通1丁目5-1", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=USA豊橋駅前店", episode: "ED", scene: "小鞠相關 ED 與火箭形外牆地標。", status: "exterior", statusLabel: "外觀限定", currentInfo: "已閉店；出發前再查重建／拆卸情況", constraints: "只在公共位置拍原址，不進封閉範圍。", plannedDays: [1, 2], plannedDayLabel: "8/24 或 25" },
  { id: 7, officialNo: 7, official: true, nameJp: "駅ビルカフェ UNO-UNO", nameZh: "站樓 Café UNO-UNO", area: "豐橋市區", category: "餐廳", address: "豊橋駅カルミア2F", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=駅ビルカフェ+UNO-UNO+豊橋", episode: "第 5 集", scene: "檸檬與綾野會面／等候，令溫水與八奈見開始跟蹤。", status: "open", statusLabel: "正常到訪", currentInfo: "07:00–21:30；Morning 至 11:00", constraints: "繁忙時間以正常用餐為先。", plannedDays: [1, 2], plannedDayLabel: "8/25（首晚可後備）" },
  { id: 8, officialNo: 8, official: true, nameJp: "ボン.千賀", nameZh: "Bon 千賀", area: "豐橋市區", category: "餐廳", address: "愛知県豊橋市駅前大通1-28", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=ボン千賀+豊橋", episode: "第 5 集", scene: "溫水與八奈見茶聚，八奈見判斷情況屬於『出軌』。", status: "open", statusLabel: "正常到訪", currentInfo: "10:00–20:30；星期日休", constraints: "只收現金；留意不定休。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 9, officialNo: 9, official: true, nameJp: "豊橋市まちなか図書館", nameZh: "豐橋市 Machinaka 圖書館", area: "豐橋市區", category: "室內", address: "愛知県豊橋市駅前大通2丁目81", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=豊橋市まちなか図書館", episode: "第 5／9 集", scene: "佳樹／權藤及鋼琴場景；文化祭資料搜集。", status: "open", statusLabel: "指定日到訪", currentInfo: "09:00–21:00；8/28 第四個星期五休館", constraints: "避開讀者面孔、書頁及安靜區拍攝。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 10, officialNo: 10, official: true, nameJp: "豊橋駅ビル カルミア", nameZh: "豐橋站樓 Kalmia", area: "豐橋市區", category: "商場", address: "豊橋市花田町西宿無番地", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=豊橋駅ビル+カルミア", episode: "第 5 集", scene: "溫水、八奈見、千早、檸檬與綾野的跟蹤路線。", status: "open", statusLabel: "正常到訪", currentInfo: "店舖約 10:00–20:00／21:00", constraints: "同一大樓亦有 #7、#11、#12。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 11, officialNo: 11, official: true, nameJp: "むらたのたこやき", nameZh: "Murata 章魚燒", area: "豐橋市區", category: "餐廳", address: "カルミアB1", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=むらたのたこやき+カルミア", episode: "第 5 集", scene: "八奈見在樓梯附近吃具標誌性的三粒章魚燒。", status: "open", statusLabel: "正常到訪", currentInfo: "10:00–21:00；8 月已公布休 5、19 日", constraints: "不要坐在通道／樓梯重演場景。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 12, officialNo: 12, official: true, nameJp: "豊川堂 カルミア店", nameZh: "豐川堂 Kalmia 店", area: "豐橋市區", category: "書店", address: "カルミア4F", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=豊川堂+カルミア店", episode: "第 5 集", scene: "溫水與千早一邊逛書店一邊調查。", status: "open", statusLabel: "正常到訪", currentInfo: "約 10:00–20:00", constraints: "官方地圖把カルミア誤寫為カルミヤ；拍攝先問。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 13, officialNo: 13, official: true, nameJp: "ヤマサちくわ 西駅店", nameZh: "Yamasa 竹輪西站店", area: "豐橋市區", category: "食品店", address: "愛知県豊橋市白河町22", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=ヤマサちくわ+西駅店", episode: "第 6 集", scene: "溫水與綾野在店外談檸檬；亦可買第 1 集特選竹輪。", status: "open", statusLabel: "正常到訪", currentInfo: "08:00–18:00", constraints: "不要去錯 Kalmia 分店。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 14, officialNo: 14, official: true, nameJp: "豊橋市地下資源館＆視聴覚教育センター", nameZh: "豐橋市地下資源館及視聽教育中心", area: "二川", category: "博物館", address: "愛知県豊橋市大岩町字火打坂19-16", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=豊橋市地下資源館", episode: "第 6 集", scene: "溫水、檸檬、綾野與千早的尷尬 double date。", status: "open", statusLabel: "正常到訪", currentInfo: "09:00–16:30；星期一休；入館免費", constraints: "天象館另計；按館內規則拍攝。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 15, officialNo: 15, official: true, nameJp: "道の駅 もっくる新城", nameZh: "Mokkuru 新城道路休息站", area: "新城", category: "餐廳", address: "愛知県新城市八束穂五反田329-7", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=道の駅+もっくる新城", episode: "第 6 集", scene: "尋找檸檬途中停站；八奈見研究石燒香腸的碳水。", status: "open", statusLabel: "正常到訪", currentInfo: "主要設施 08:00–18:00", constraints: "個別食檔可能較早收舖。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 16, officialNo: 16, official: true, nameJp: "双瀬（ならぜ）の川渡り", nameZh: "Naraze 河渡口", area: "新城", category: "戶外", address: "35.016686, 137.557361", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.016686,137.557361", episode: "第 6 集", scene: "溫水與小鞠沉迷看淡水蟹，忽略旁邊的八奈見。", status: "open", statusLabel: "天氣限定", currentInfo: "戶外低水位過河點；無正式停車／設施", constraints: "雨後、水漲、路滑只在安全岸邊拍；勿阻窄路。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 17, officialNo: 17, official: true, nameJp: "副川諏訪神社", nameZh: "副川諏訪神社", area: "新城", category: "神社", address: "愛知県新城市副川字寺平5", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=副川諏訪神社", episode: "第 7 集", scene: "溫水與檸檬在夜間談心的神社場景。", status: "open", statusLabel: "正常到訪", currentInfo: "神社境內；無正式觀光時間", constraints: "不要選錯門谷諏訪神社；尊重居民，不安排夜訪。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 18, officialNo: 18, official: true, nameJp: "本長篠駅", nameZh: "本長篠站", area: "新城", category: "交通", address: "愛知県新城市長篠字具津67", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=本長篠駅", episode: "第 7 集", scene: "千早等候檸檬、正式交談並一同上車。", status: "open", statusLabel: "正常到訪", currentInfo: "JR 飯田線車站", constraints: "只用正常乘客區域；留意工程後外觀。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 19, officialNo: 19, official: true, nameJp: "水上ビル／大豊商店街", nameZh: "水上大樓／大豐商店街", area: "豐橋市區", category: "街景", address: "豊橋市駅前大通3丁目118先", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=水上ビル+豊橋", episode: "第 8 集", scene: "溫水、八奈見及小鞠為文化祭搜集資料時走過的街景。", status: "open", statusLabel: "正常到訪", currentInfo: "公共街道，個別商戶時間不同", constraints: "避開拍攝居民／店員正面。", plannedDays: [1, 2], plannedDayLabel: "8/24 或 25" },
  { id: 20, officialNo: 20, official: true, nameJp: "珈琲とカヌレ", nameZh: "Coffee & Canelé", area: "豐橋市區", category: "餐廳", address: "愛知県豊橋市駅前大通1丁目114-116", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=珈琲とカヌレ+豊橋", episode: "第 8 集", scene: "溫水、八奈見與小鞠在文化祭調查期間吃可麗露。", status: "open", statusLabel: "早到優先", currentInfo: "10:00–18:00；星期一休", constraints: "可麗露可能提早售罄，盡量開門到。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: 21, officialNo: 21, official: true, nameJp: "道の駅 とよはし", nameZh: "豐橋道路休息站", area: "豐橋南", category: "餐廳", address: "愛知県豊橋市東七根町字一の沢113-2", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=道の駅+とよはし", episode: "第 8 集", scene: "佳樹與和彥的兄妹 outing；鵪鶉雪糕及初戀檸檬。", status: "open", statusLabel: "正常到訪", currentInfo: "主要店舖 09:00–18:00", constraints: "無車版巴士疏落；前一晚核對回程。", plannedDays: [3], plannedDayLabel: "8/26" },
  { id: 22, officialNo: 22, official: true, nameJp: "のんほいパーク", nameZh: "Nonhoi Park 豐橋綜合動植物公園", area: "二川", category: "公園", address: "愛知県豊橋市大岩町字大穴1-238", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=のんほいパーク", episode: "第 11–12 集／OP", scene: "溫水、八奈見、檸檬、小鞠及觀察組的大型最終段落場景。", status: "open", statusLabel: "正常到訪", currentInfo: "09:00–16:30；16:00 最後入場；星期一休；成人 ¥600", constraints: "出發前查 2026 Night Zoo 日曆有否改動日場。", plannedDays: [4], plannedDayLabel: "8/27" },
  { id: 23, officialNo: 23, official: true, nameJp: "みやこ（公式：みやこうどん）", nameZh: "Miyako 烏冬", area: "豐橋南", category: "餐廳", address: "愛知県豊橋市南栄町蟹原16-8", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=みやこ+うどん+豊橋市南栄町蟹原16-8", episode: "第 11 集", scene: "溫水與八奈見在細小平價店食烏冬。", status: "open", statusLabel: "須再確認", currentInfo: "現行平日 16:00–20:00；周末／假日休；現金", constraints: "暑假臨休風險最高；8 月中及當朝再查，三／四／五留後備。", plannedDays: [2], plannedDayLabel: "8/25" },
  { id: "bonus", officialNo: null, official: false, nameJp: "吉田神社", nameZh: "吉田神社 Bonus", area: "豐橋市區", category: "神社", address: "愛知県豊橋市関屋町2", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=吉田神社+豊橋", episode: "官方製作巡禮", scene: "製作團隊／聲優祈願並留下 Makeine 繪馬。", status: "open", statusLabel: "Bonus", currentInfo: "境內一般可到訪；社務約 09:00–16:00", constraints: "不計入官方地圖 23 點，遵守神社禮儀。", plannedDays: [2], plannedDayLabel: "8/25" }
];

export const foodStops: FoodStop[] = [
  { spotId: 3, name: "Gusto 豐橋橋良店", episode: "第 1 集", characters: ["八奈見杏菜", "溫水和彥"], scene: "八奈見被甩後不停進食，最後由溫水埋單。", foods: ["家庭餐廳早餐", "薯條／甜品以當日餐牌為準"], hours: "06:00–02:00", note: "安排 8/26 早上，人較少亦順路出發。" },
  { spotId: 7, name: "UNO-UNO", episode: "第 5 集", characters: ["燒鹽檸檬", "綾野光希"], scene: "檸檬與綾野約見，溫水和八奈見在後方觀察。", foods: ["Morning set", "咖啡"], hours: "07:00–21:30", note: "早餐時段 07:00–11:00。" },
  { spotId: 8, name: "Bon 千賀", episode: "第 5 集", characters: ["八奈見杏菜", "溫水和彥"], scene: "八奈見邊食邊分析檸檬的『出軌』疑雲。", foods: ["Papiro 麵包", "檸檬曲奇", "蛋糕", "忌廉梳打"], hours: "10:00–20:30；星期日休", note: "只收現金，實際供應以當日為準。" },
  { spotId: 11, name: "Murata 章魚燒", episode: "第 5 集", characters: ["八奈見杏菜"], scene: "八奈見拿著標誌性的三粒章魚燒。", foods: ["三粒章魚燒"], hours: "10:00–21:00", note: "在指定位置食，不要坐樓梯。" },
  { spotId: 13, name: "Yamasa 竹輪西站店", episode: "第 1／6 集", characters: ["溫水和彥", "綾野光希"], scene: "第 6 集店外對話；第 1 集亦有特選竹輪梗。", foods: ["特選 Yamasa 竹輪"], hours: "08:00–18:00", note: "本行程指定西駅店，不是 Kalmia 店。" },
  { spotId: 15, name: "Mokkuru 新城", episode: "第 6 集", characters: ["八奈見杏菜", "小鞠知花"], scene: "尋找檸檬途中停站，食物與印章均有對應。", foods: ["石燒香腸", "巨型雞扒", "五平餅／鹿咖喱以供應為準"], hours: "主要設施 08:00–18:00", note: "食檔可能早收；先影再食。" },
  { spotId: 20, name: "珈琲とカヌレ", episode: "第 8 集", characters: ["八奈見杏菜", "溫水和彥", "小鞠知花"], scene: "三人做文化祭資料搜集時吃可麗露。", foods: ["可麗露", "咖啡"], hours: "10:00–18:00；星期一休", note: "接近 10:00 到，避免可麗露售罄。" },
  { spotId: 21, name: "道の駅とよはし", episode: "第 8 集", characters: ["溫水佳樹", "溫水和彥"], scene: "兄妹 outing 與當地產品畫面。", foods: ["鵪鶉雪糕", "大人の初恋レモン"], hours: "主要店舖 09:00–18:00", note: "產品會轉季，以即日供應為準。" },
  { spotId: 23, name: "みやこ", episode: "第 11 集", characters: ["八奈見杏菜", "溫水和彥"], scene: "兩人在細小平價店食烏冬。", foods: ["烏冬／炒烏冬", "味噌蛋以當日餐牌為準"], hours: "現行平日 16:00–20:00", note: "現金；暑假可能臨休，不能押在最後一天。" }
];

export const lodgingOptions: LodgingOption[] = [
  { id: "toyohashi-primary", city: "豐橋", label: "傳統單層日式屋（近車站）", dates: "8/24 入住 → 8/28 退房", nights: 4, rating: 5, reviews: 15, badges: ["Top 10%", "整間屋", "自助入住"], rooms: "2 睡房", beds: "9 個睡眠位置／床墊", baths: "1 浴室、2 廁所", parking: "2 個免費車位", luggage: "洗衣機、廚房；落訂前確認四件 20 kg 行李及鋪床圖", priceJPY: { 3: 81049, 4: 107980 }, url: "https://www.airbnb.com/rooms/1558044175421711398?check_in=2026-08-24&check_out=2026-08-28&adults=4&currency=JPY", notes: ["4 人可 2＋2 分房，每人一個獨立睡眠面。", "只有一個沖涼位，可分夜晚／朝早兩更。"], budgetBaseline: true },
  { id: "toyohashi-backup", city: "豐橋", label: "柳生橋高評價後備屋", dates: "8/24 入住 → 8/28 退房", nights: 4, rating: 4.98, reviews: 53, badges: ["整間屋", "評價樣本較大"], rooms: "2 睡房", beds: "5 床", baths: "1 浴室", parking: "2 個免費車位", luggage: "落訂前向屋主確認", priceJPY: { 3: 114314, 4: 144162 }, url: "https://www.airbnb.com/rooms/1349679902779278511?check_in=2026-08-24&check_out=2026-08-28&adults=4&currency=JPY", notes: ["柳生橋站步行約 10 分鐘。", "價格高於同城基準屋。"], budgetBaseline: false },
  { id: "nagoya-primary", city: "名古屋", label: "岩塚站 1 分鐘 2LDK", dates: "8/28 入住 → 8/30 退房", nights: 2, rating: 5, reviews: 28, badges: ["Top 10%", "55 m²", "升降機"], rooms: "2 睡房", beds: "5 床／futon", baths: "1 浴室", parking: "以房源為準；無車版不需要", luggage: "房源標示可提供入住前／退房後寄存，須書面確認四件 20 kg", priceJPY: { 3: 50000, 4: 50000 }, url: "https://www.airbnb.com/rooms/1519942821788576362?check_in=2026-08-28&check_out=2026-08-30&adults=4&currency=JPY", notes: ["地鐵直達名古屋站約 9 分鐘。", "4 人按 2＋2 分房，確認四個獨立睡眠面。"], budgetBaseline: true },
  { id: "nagoya-space", city: "名古屋", label: "100 m²／3 房空間後備", dates: "8/28 入住 → 8/30 退房", nights: 2, rating: 5, reviews: 12, badges: ["100 m²", "免費泊車"], rooms: "3 睡房", beds: "6 床", baths: "1 浴室", parking: "免費泊車", luggage: "大空間，仍須向屋主確認提早寄存", priceJPY: { 3: 62771, 4: 62771 }, url: "https://www.airbnb.com/rooms/1664735310773831272?check_in=2026-08-28&check_out=2026-08-30&adults=4&currency=JPY", notes: ["若把車帶入名古屋才特別有用。"], budgetBaseline: false },
  { id: "nagoya-comfort", city: "名古屋", label: "107 m²／兩浴室舒適升級", dates: "8/28 入住 → 8/30 退房", nights: 2, rating: 4.98, reviews: 54, badges: ["107 m²", "兩浴室", "2 車位"], rooms: "3 睡房", beds: "6 床", baths: "2 浴室", parking: "2 車位", luggage: "空間充足；提早寄存仍要書面確認", priceJPY: { 3: 87000, 4: 87000 }, url: "https://www.airbnb.com/rooms/1506946270392748731?check_in=2026-08-28&check_out=2026-08-30&adults=4&currency=JPY", notes: ["較基準組合每組多 ¥37,000，但沖涼最方便。"], budgetBaseline: false }
];

export const lodgingTotals = {
  3: { jpy: 131049, hkdPerPerson: 2131 },
  4: { jpy: 157980, hkdPerPerson: 1927 }
};

export const budgetCategories: BudgetCategory[] = [
  { id: "flight", label: "來回直航＋20 kg", appliesTo: "all", people3: { min: 2500, max: 4200 }, people4: { min: 2500, max: 4200 }, note: "訂票時比較連行李、座位及付款費後總價。" },
  { id: "stay", label: "Airbnb 6 晚", appliesTo: "all", people3: { min: 2131, max: 2131 }, people4: { min: 1927, max: 1927 }, note: "以 7/15 兩間基準房源指定日期搜尋價。" },
  { id: "food", label: "7 日飲食", appliesTo: "all", people3: { min: 1540, max: 2220 }, people4: { min: 1540, max: 2220 }, note: "每日約 ¥4,500–6,500，含巡禮小店。" },
  { id: "car-transport", label: "一般交通＋兩日車費", appliesTo: "car", people3: { min: 780, max: 1050 }, people4: { min: 650, max: 900 }, note: "機場、城際、市內交通及租車分攤。" },
  { id: "no-car-transport", label: "一般交通＋預約的士", appliesTo: "noCar", people3: { min: 650, max: 1200 }, people4: { min: 540, max: 1020 }, note: "須取得田原及新城兩段書面報價。" },
  { id: "entry", label: "入場／咖啡／小食", appliesTo: "all", people3: { min: 245, max: 585 }, people4: { min: 245, max: 585 }, note: "Nonhoi、名古屋城、Toyota 館等；與餐費略有交疊。" },
  { id: "baggage", label: "20 kg 行李寄存", appliesTo: "all", people3: { min: 39, max: 39 }, people4: { min: 39, max: 39 }, note: "ecbo 約 ¥800／件；屋主免費收則可省回。" },
  { id: "buffer", label: "匯率／短程的士緩衝", appliesTo: "all", people3: { min: 300, max: 600 }, people4: { min: 300, max: 600 }, note: "不包括周邊、酒、手信、保險及高級餐廳。" }
];

export const budgetTargets: Record<3 | 4, Record<PlanKey, number>> = {
  3: { car: 9200, noCar: 8900 },
  4: { car: 8900, noCar: 8700 }
};

export const baggageFacts = [
  { title: "住宿移動日｜名古屋站 ecbo", detail: "8/28 約 10:15–16:00 預約 3–4 個大型行李位；約 ¥800／件，單件上限 20 kg。" },
  { title: "名古屋 Airbnb", detail: "房源標示可提早／退房後寄存，但要屋主書面確認可同時放四件大喼，確認後才取消 ecbo。" },
  { title: "豐橋站後備", detail: "大櫃約 ¥600，但不要賭現場有四個大櫃；只作天氣補漏時後備。" },
  { title: "中部機場最後後備", detail: "T1 3F 人工寄存現行 06:30–21:30；不要因寄存壓縮航空公司截關時間。" }
];

export const bookingChecklist = [
  { id: "vote", category: "先投票", title: "確認 3／4 人及 A／B", hint: "如選 A，同時確認最少一名司機及 IDP。" },
  { id: "flights", category: "投票後", title: "鎖定航班連 20 kg 行李總價", hint: "基準時刻只供排程，不等於已預訂。" },
  { id: "stays", category: "投票後", title: "同日鎖兩間 Airbnb", hint: "書面確認每人獨立睡眠面、安靜時段及四件行李。" },
  { id: "transport", category: "投票後", title: "預約租車或兩段的士", hint: "A：全保障＋ETC；B：田原、新城各取書面報價。" },
  { id: "storage", category: "投票後", title: "預約 8/28 ecbo 四個大型位", hint: "屋主確認免費收行李後才取消。" },
  { id: "shops", category: "8 月 10–20 日", title: "重查小店與 Night Zoo", hint: "Miyako、Bon 千賀、Coffee & Canelé、Nonhoi 日曆。" },
  { id: "weather", category: "8 月 23 日", title: "查田原／新城雨量與颱風", hint: "河道水漲即取消涉水，只在岸邊拍。" },
  { id: "offline", category: "8 月 23 日", title: "下載離線地圖與地址", hint: "同時截圖車票、預約確認及 23 點清單。" },
  { id: "cash", category: "出發前", title: "準備現金與零錢", hint: "Miyako、Bon 千賀及 ¥200 鄉郊巴士不能只靠電子支付。" },
  { id: "documents", category: "出發前", title: "護照、保險、駕駛文件", hint: "A 版司機：IDP、香港駕照正本及護照三樣齊。" }
];

export const riskNotes = [
  { title: "Miyako 暑假臨休", detail: "8/25 主試，8/26–28 留後備；出發前及當朝再查。", level: "high" },
  { title: "白谷泳季已完", detail: "行程是海岸拍攝，不安排游泳或依賴更衣／救生設施。", level: "medium" },
  { title: "兩個已閉點", detail: "#5、#6 只在合法公共位置拍外觀；如已拆卸，拍原址現況。", level: "medium" },
  { title: "Naraze 河道", detail: "下雨、颱風、水濁或路滑即不涉水；安全比完成打卡重要。", level: "high" },
  { title: "酷熱與濕度", detail: "8 月平年日最高約 33.2°C；戶外早去，每人帶水及補鹽。", level: "medium" }
];

export const sources: SourceLink[] = [
  { label: "OpenStreetMap 地圖資料與授權", url: "https://www.openstreetmap.org/copyright", group: "地圖" },
  { label: "動畫官方 23 點聖地巡禮地圖", url: "https://makeine-anime.com/special/map/", group: "巡禮" },
  { label: "動畫官方 Movie／吉田神社巡禮", url: "https://makeine-anime.com/movie/", group: "巡禮" },
  { label: "豊鉄公共交通巡禮指引", url: "https://www.toyotetsu.jp/news/01256.html", group: "交通" },
  { label: "田原市公共交通", url: "https://www.city.tahara.aichi.jp/kurashi/koutsu/1003154.html", group: "交通" },
  { label: "江比間永久閉館公告", url: "https://www.city.tahara.aichi.jp/shisetsu/bunka/1001257/1001258.html", group: "現況" },
  { label: "2026 白谷海水浴場資料", url: "https://www.taharakankou.gr.jp/spot/spot.php?search_category1=2&spot_id=13", group: "現況" },
  { label: "Nonhoi Park 官方資訊", url: "https://www.nonhoi.jp/information/", group: "現況" },
  { label: "豐橋市圖書館休館日", url: "https://www.library.toyohashi.aichi.jp/guidance/schedule/", group: "現況" },
  { label: "中部機場航班時間表", url: "https://www.centrair.jp/assets/doc/en/corporate/business/timetable_en.pdf", group: "航班" },
  { label: "ecbo 大型行李規則", url: "https://intercom.help/ecbocloak/ja/articles/1964495-大きな荷物も預けられますか", group: "行李" },
  { label: "香港國際駕駛許可證", url: "https://www.gov.hk/en/residents/transport/drivinglicense/osintldrivingpermit.htm", group: "駕駛" },
  { label: "JAF 海外駕照規則", url: "https://english.jaf.or.jp/driving-in-japan/drive-in-japan/switch-to-japanese-license", group: "駕駛" }
];
