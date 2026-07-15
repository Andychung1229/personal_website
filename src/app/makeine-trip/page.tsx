import type { Metadata } from "next";
import { TripPlanner } from "./TripPlanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://chungkawai.com"),
  title: "敗犬女主太多了！名古屋・豐橋聖地巡禮 2026",
  description:
    "2026 年 8 月 24–30 日《敗犬女主太多了！》名古屋・豐橋 7 日 6 夜互動行程：租車與無租車兩案、23 個巡禮點、劇中美食、住宿、行李及預算。",
  openGraph: {
    title: "敗犬女主太多了！名古屋・豐橋聖地巡禮",
    description: "7 日 6 夜朋友旅行投票版｜租車、無租車兩案並列",
    type: "website",
    images: [
      {
        url: "/images/makeine-trip/shiroya-beach.jpg",
        width: 1280,
        height: 853,
        alt: "白谷海岸，敗犬女主太多了聖地巡禮地點"
      }
    ]
  }
};

export default function MakeineTripPage() {
  return <TripPlanner />;
}
