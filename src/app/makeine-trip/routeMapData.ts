export type RoutePlanSelection = "both" | "car" | "noCar";

export interface RoutePoint {
  label: string;
  lat: number;
  lng: number;
  query: string;
}

export interface DayMapRoute {
  id: "common" | "car" | "noCar";
  label: string;
  color: string;
  dashed?: boolean;
  points: RoutePoint[];
}

interface DayMapDefinition {
  common?: Omit<DayMapRoute, "id" | "color">;
  car?: Omit<DayMapRoute, "id" | "color">;
  noCar?: Omit<DayMapRoute, "id" | "color">;
}

const p = (label: string, lat: number, lng: number, query: string): RoutePoint => ({
  label,
  lat,
  lng,
  query
});

const places = {
  centrair: p("中部國際機場", 34.85872, 136.81136, "中部国際空港セントレア"),
  toyohashi: p("豐橋站", 34.76306, 137.38218, "豊橋駅"),
  usa: p("USA 舊址", 34.76361, 137.38396, "USA豊橋駅前店"),
  suijo: p("水上ビル", 34.76192, 137.38739, "水上ビル 豊橋"),
  uno: p("UNO-UNO／Kalmia", 34.76343, 137.38255, "駅ビルカフェ UNO-UNO 豊橋"),
  yamasa: p("Yamasa 西駅店", 34.76204, 137.38069, "ヤマサちくわ 西駅店"),
  library: p("まちなか圖書館", 34.76248, 137.38724, "豊橋市まちなか図書館"),
  canele: p("珈琲とカヌレ", 34.76215, 137.38695, "珈琲とカヌレ 豊橋"),
  bon: p("Bon 千賀", 34.76345, 137.38514, "ボン千賀 豊橋"),
  seibunkan: p("精文館本店", 34.76465, 137.38367, "精文館書店 豊橋本店"),
  yoshida: p("吉田神社", 34.76998, 137.38988, "吉田神社 豊橋"),
  miyako: p("みやこ", 34.73819, 137.38441, "みやこ うどん 豊橋市南栄町蟹原16-8"),
  gusto: p("Gusto 橋良店", 34.74808, 137.38085, "ガスト 豊橋橋良店"),
  mikawaTahara: p("三河田原站", 34.66686, 137.26904, "三河田原駅"),
  shiroya: p("白谷海岸", 34.68608, 137.23195, "白谷海水浴場 田原市"),
  ehimano: p("江比間外觀", 34.6639, 137.18295, "江比間野外活動センター"),
  roadsideToyohashi: p("道の駅とよはし", 34.69569, 137.4164, "道の駅 とよはし"),
  honNagashino: p("本長篠站", 34.93256, 137.57619, "本長篠駅"),
  naraze: p("双瀬川渡口", 35.01669, 137.55736, "35.016686,137.557361"),
  suwa: p("副川諏訪神社", 35.01686, 137.55605, "副川諏訪神社"),
  mokkulu: p("Mokkuru 新城", 34.91794, 137.53388, "道の駅 もっくる新城"),
  museum: p("地下資源館", 34.72935, 137.43205, "豊橋市地下資源館"),
  nonhoi: p("Nonhoi Park", 34.72, 137.43244, "のんほいパーク"),
  nagoya: p("名古屋站／寄存", 35.17058, 136.88098, "名古屋駅"),
  toyotaMuseum: p("Toyota 產業技術紀念館", 35.18251, 136.87652, "トヨタ産業技術記念館"),
  noritake: p("Noritake Garden", 35.1783, 136.88176, "ノリタケの森"),
  iwatsuka: p("岩塚站／Airbnb", 35.15784, 136.85438, "岩塚駅"),
  nagoyaCastle: p("名古屋城", 35.1844, 136.9001, "名古屋城"),
  osu: p("大須觀音／商店街", 35.15967, 136.89931, "大須観音"),
  atsuta: p("熱田神宮", 35.12543, 136.90925, "熱田神宮"),
  sakae: p("榮／MIRAI TOWER", 35.1723, 136.9084, "中部電力 MIRAI TOWER")
};

const dayMapDefinitions: Record<number, DayMapDefinition> = {
  1: {
    common: {
      label: "抵達＋豐橋夜行",
      points: [places.centrair, places.toyohashi, places.usa, places.suijo, places.uno]
    }
  },
  2: {
    common: {
      label: "豐橋市區巡禮",
      points: [
        places.uno,
        places.usa,
        places.yamasa,
        places.library,
        places.canele,
        places.suijo,
        places.bon,
        places.seibunkan,
        places.uno,
        places.yoshida,
        places.miyako
      ]
    }
  },
  3: {
    car: {
      label: "A 租車",
      points: [places.gusto, places.toyohashi, places.shiroya, places.ehimano, places.roadsideToyohashi, places.toyohashi]
    },
    noCar: {
      label: "B 無車",
      dashed: true,
      points: [
        places.gusto,
        places.toyohashi,
        places.mikawaTahara,
        places.shiroya,
        places.ehimano,
        places.mikawaTahara,
        places.roadsideToyohashi,
        places.toyohashi
      ]
    }
  },
  4: {
    car: {
      label: "A 租車",
      points: [places.toyohashi, places.honNagashino, places.naraze, places.suwa, places.mokkulu, places.museum, places.nonhoi, places.toyohashi]
    },
    noCar: {
      label: "B 無車",
      dashed: true,
      points: [
        places.toyohashi,
        places.honNagashino,
        places.naraze,
        places.suwa,
        places.mokkulu,
        places.honNagashino,
        places.toyohashi,
        places.museum,
        places.nonhoi,
        places.toyohashi
      ]
    }
  },
  5: {
    common: {
      label: "豐橋 → 名古屋轉場",
      points: [places.toyohashi, places.nagoya, places.toyotaMuseum, places.noritake, places.nagoya, places.iwatsuka, places.sakae]
    }
  },
  6: {
    common: {
      label: "名古屋市內一日",
      points: [places.iwatsuka, places.nagoyaCastle, places.osu, places.atsuta, places.sakae, places.iwatsuka]
    }
  },
  7: {
    common: {
      label: "岩塚 → 中部機場",
      points: [places.iwatsuka, places.nagoya, places.centrair]
    }
  }
};

export function getDayMapRoutes(day: number, plan: RoutePlanSelection): DayMapRoute[] {
  const definition = dayMapDefinitions[day];
  if (!definition) return [];

  if (definition.common) {
    return [{ ...definition.common, id: "common", color: "#3989d6" }];
  }

  if (plan === "both") {
    return [
      definition.car ? { ...definition.car, id: "car", color: "#3989d6" } : null,
      definition.noCar ? { ...definition.noCar, id: "noCar", color: "#ed6d7f" } : null
    ].filter((route): route is DayMapRoute => route !== null);
  }

  const route = definition[plan];
  return route
    ? [{ ...route, id: plan, color: plan === "car" ? "#3989d6" : "#ed6d7f" }]
    : [];
}

export function buildGoogleDirectionsUrl(route: DayMapRoute): string {
  const [origin, ...rest] = route.points;
  const destination = rest.at(-1);
  if (!origin || !destination) return "https://www.google.com/maps";

  const waypoints = rest.slice(0, -1);
  const params = new URLSearchParams({
    api: "1",
    origin: origin.query,
    destination: destination.query
  });

  if (waypoints.length) {
    params.set("waypoints", waypoints.map((point) => point.query).join("|"));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
