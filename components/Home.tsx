// src/pages/index.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaUtensils,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaUserCircle,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import axiosInstance from "@/lib/axios";
import { Footer } from "./Footer";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
}

interface ReviewedMenu {
  _id: string;
  menuId: string;
  rating: number;
  comment: string;
}

interface ReviewUser {
  _id: string;
  firstname: string;
  lastname: string;
  image: string;
}

interface Review {
  _id: string;
  userId: ReviewUser;
  overallRating: number;
  comment: string;
  images: string[];
  reviewedMenus: ReviewedMenu[];
  createdAt: string;
  updatedAt: string;
}

const timeSlots = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];
const HomePage = () => {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  // สถานะสำหรับการล็อกอิน (จำลอง)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    // นำทางไปยังหน้าจองพร้อมส่งพารามิเตอร์
    router.push(`/reservation?date=${date}&time=${time}&guests=${guests}`);
  };

  const getMenu = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/menu");

      const data = response.data;
      if (data.status === "success") {
        setMenu(response.data.data.menus);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const getReview = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/reviews", {
        params: {
          page: 1,
          limit: 3,
        },
      });

      const data = response.data;
      if (data.status === "success") {
        setReviews(response.data.data.reviews);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  // ตรวจสอบการเลื่อนเพื่อเปลี่ยนสีพื้นหลัง Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getReview();
    getMenu();
  }, [getReview, getMenu]);

  useEffect(() => {
    if (userProfile) setIsLoggedIn(!!userProfile);
  }, [userProfile]);

  return (
    <>
      {/* Header/Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md text-gray-900"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={isScrolled ? "/images/logo.png" : "/images/logo.png"}
                  alt="Restaurant Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className={`font-medium hover:text-amber-500 transition ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                หน้าหลัก
              </Link>
              <Link
                href="#about"
                className={`font-medium hover:text-amber-500 transition ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                เกี่ยวกับเรา
              </Link>
              <Link
                href="#menu"
                className={`font-medium hover:text-amber-500 transition ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                เมนู
              </Link>
              <Link
                href="#reservation"
                className={`font-medium hover:text-amber-500 transition ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                จองโต๊ะ
              </Link>
              <Link
                href="#contact"
                className={`font-medium hover:text-amber-500 transition ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                ติดต่อ
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className={`hover:text-amber-500 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <FaSearch className="h-5 w-5" />
              </button>

              {userProfile ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <FaUserCircle
                      className={`h-6 w-6 ${
                        isScrolled ? "text-amber-600" : "text-amber-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isScrolled ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {userProfile?.firstname}
                    </span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      href="/myreservations"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      การจองของฉัน
                    </Link>
                    <Link
                      href="/write-review"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      เขียนรีวิว
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      โปรไฟล์
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => logout()}
                      className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className={`font-medium hover:text-amber-500 transition ${
                      isScrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isScrolled
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-white text-amber-700 hover:bg-gray-100"
                    }`}
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${isScrolled ? "text-gray-900" : "text-white"}`}
              >
                {mobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 shadow-lg">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
            >
              หน้าหลัก
            </Link>
            <Link
              href="#about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              href="#menu"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              เมนู
            </Link>
            <Link
              href="#reservation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              จองโต๊ะ
            </Link>
            <Link
              href="#contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ติดต่อ
            </Link>
            <div className="border-t border-gray-200 my-2 pt-2">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 font-medium text-gray-900 flex items-center">
                    <FaUserCircle className="mr-2 h-5 w-5 text-amber-600" />{" "}
                    {userProfile?.firstname} {userProfile?.lastname}
                  </div>
                  <Link
                    href="/myreservations"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
                  >
                    การจองของฉัน
                  </Link>
                  <Link
                    href="/write-review"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
                  >
                    เขียนรีวิว
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-600"
                  >
                    โปรไฟล์
                  </Link>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Link
                    href="/login"
                    className="w-full py-2 text-center rounded-lg font-medium text-amber-600 border border-amber-600 hover:bg-amber-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className="w-full py-2 text-center rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/hero-bg.jpg"
            alt="ร้านอาหารบรรยากาศดี"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl pt-20">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              ประสบการณ์อาหารที่พิเศษ
              <br />ณ <span className="text-amber-400">กรุงเทพ</span>
            </h1>
            <p className="mt-6 text-xl text-white">
              สัมผัสรสชาติอาหารนานาชาติในบรรยากาศสุดพิเศษ
              พร้อมการบริการระดับพรีเมียม
            </p>
            <div className="mt-8 flex space-x-4">
              <button
                className="inline-block cursor-pointer bg-amber-600 py-3 px-6 rounded-lg font-medium text-white hover:bg-amber-700 transition duration-300"
                onClick={() => {
                  const reservationSection =
                    document.getElementById("reservation");
                  reservationSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                จองโต๊ะเลย
              </button>
              <button
                className="inline-block cursor-pointer bg-transparent border-2 border-white py-3 px-6 rounded-lg font-medium text-white hover:bg-white hover:text-amber-700 transition duration-300"
                onClick={() => {
                  const menuSection = document.getElementById("menu");
                  menuSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ดูเมนู
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนจองด่วน */}
      <section id="reservation" className="py-12 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">จองโต๊ะออนไลน์</h2>
            <p className="mt-2 text-lg text-gray-600">
              จองโต๊ะง่ายๆ เพียงไม่กี่คลิก
            </p>
          </div>

          <form
            onSubmit={handleReservation}
            className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className=" text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <FaCalendarAlt className="mr-2 text-amber-600" /> วันที่
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className=" text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <FaClock className="mr-2 text-amber-600" /> เวลา
                </label>
                <select
                  id="time"
                  name="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  <option value="">เลือกเวลา</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} น.
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className=" text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <FaUsers className="mr-2 text-amber-600" /> จำนวนคน
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "คน" : "คน"}
                    </option>
                  ))}
                  <option value="11">มากกว่า 10 คน</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="cursor-pointer w-full bg-amber-600 py-3 px-6 rounded-lg font-medium text-white hover:bg-amber-700 transition duration-300 flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" /> จองโต๊ะเลย
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* เกี่ยวกับร้าน */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">เกี่ยวกับเรา</h2>
              <div className="mt-3 h-1 w-20 bg-amber-500"></div>
              <p className="mt-6 text-lg text-gray-600">
                ตั้งอยู่ใจกลางกรุงเทพมหานคร
                ร้านอาหารของเรานำเสนอประสบการณ์การรับประทานอาหารที่ไม่เหมือนใคร
                ด้วยเมนูที่ผสมผสานระหว่างรสชาติดั้งเดิมและความคิดสร้างสรรค์
              </p>
              <p className="mt-4 text-lg text-gray-600">
                เชฟผู้เชี่ยวชาญของเราคัดสรรวัตถุดิบคุณภาพสูงและสดใหม่ทุกวัน
                เพื่อสร้างสรรค์อาหารที่ทั้งรสชาติดีและนำเสนออย่างสวยงาม
                ในบรรยากาศที่อบอุ่นและผ่อนคลาย
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <FaUtensils className="text-amber-600 text-2xl mb-2" />
                  <h3 className="font-bold text-gray-900">อาหารชั้นเลิศ</h3>
                  <p className="text-gray-600 mt-1">
                    รสชาตินานาชาติที่ปรุงด้วยวัตถุดิบชั้นดี
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <FaMapMarkerAlt className="text-amber-600 text-2xl mb-2" />
                  <h3 className="font-bold text-gray-900">ทำเลสะดวก</h3>
                  <p className="text-gray-600 mt-1">
                    ใจกลางเมือง เดินทางสะดวกด้วย BTS
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 relative h-96 overflow-hidden rounded-lg">
              <Image
                src="/images/restaurant/hero-bg.jpg"
                alt="บรรยากาศภายในร้าน"
                fill
                // sizes="(max-width: 768px) 100vw, (min-width: 768px) 0vw"
                sizes="(100vw)"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* เมนูแนะนำ */}
      <section id="menu" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">เมนูแนะนำ</h2>
            <p className="mt-2 text-lg text-gray-600">
              เมนูยอดนิยมที่ลูกค้าชื่นชอบ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menu.map((dish) => (
              <div
                key={dish._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{dish.name}</h3>
                    {/* <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <FaStar className="mr-1 text-amber-500" /> {dish.rating}
                    </span> */}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {dish.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-600">
                      ฿{dish.price}
                    </span>
                    {/* <button className="text-amber-600 hover:text-amber-800 font-medium text-sm cursor-pointer">
                      ดูรายละเอียด
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-block bg-amber-600 py-3 px-6 rounded-lg font-medium text-white hover:bg-amber-700 transition duration-300"
            >
              ดูเมนูทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* รีวิวจากลูกค้า */}
      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              ลูกค้าของเรากล่าวว่า
            </h2>
            <p className="mt-2 text-lg text-gray-600">รีวิวจากผู้มาใช้บริการ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-amber-50 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={review.userId.image}
                        alt={review.userId.firstname}
                        fill
                        // sizes=""
                        sizes="(100px)"
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">
                      {review.userId.firstname} {review.userId.lastname}
                    </h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < review.overallRating
                              ? "text-amber-400"
                              : "text-gray-300"
                          } h-4 w-4`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {/* {review.createdAt} */}
                        {format(review.createdAt, "yyyy-MM-dd")}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ข้อมูลติดต่อ */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 content-between">
            <div>
              <h2 className="text-2xl font-bold">ติดต่อเรา</h2>
              <div className="mt-3 h-1 w-20 bg-amber-500"></div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-5 w-5 text-amber-500" />
                  <span className="ml-3">
                    123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพมหานคร 10110
                  </span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-amber-500" />
                  <span className="ml-3">02-123-4567</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="h-5 w-5 text-amber-500" />
                  <div className="ml-3">
                    <p>จันทร์ - ศุกร์: 11:00 - 22:00 น.</p>
                    <p>เสาร์ - อาทิตย์: 10:00 - 23:00 น.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaTwitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <h2 className="text-2xl font-bold">แผนที่</h2>
              <div className="mt-3 h-1 w-20 bg-amber-500"></div>
              <div className="mt-6 bg-gray-800 rounded-lg overflow-hidden h-64 relative">
                {/* <Image
                  src="/images/restaurant/map.jpg"
                  alt="แผนที่ร้านอาหาร"
                  fill
                  className="object-cover"
                /> */}
              </div>
            </div>

            {/* <div className="mt-10 lg:mt-0">
              <h2 className="text-2xl font-bold">ส่งข้อความถึงเรา</h2>
              <div className="mt-3 h-1 w-20 bg-amber-500"></div>
              <form className="mt-6 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="ชื่อ"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="อีเมล"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="ข้อความ"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 py-2 px-4 rounded-lg font-medium text-white hover:bg-amber-700 transition duration-300"
                >
                  ส่งข้อความ
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
