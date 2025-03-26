import HomePage from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ร้านอาหารกรุงเทพ - ระบบจองโต๊ะออนไลน์",
  description:
    "ร้านอาหารชั้นนำใจกลางกรุงเทพฯ บริการอาหารนานาชาติ บรรยากาศดี เหมาะสำหรับมื้อพิเศษ จองโต๊ะออนไลน์",
};

export default function Home() {
  return <HomePage />;
}
