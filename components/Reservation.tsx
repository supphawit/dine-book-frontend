"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, addDays, parse } from "date-fns";
import {
  FaCalendarAlt,
  FaUsers,
  FaChevronLeft,
  FaUtensils,
  FaCheckCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaPhone,
} from "react-icons/fa";
import { th } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";

// ประเภทข้อมูลสำหรับโต๊ะ
type Table = {
  _id: string;
  name: string;
  capacity: number;
  location: "indoor" | "outdoor" | "private";
  isAvailable: boolean;
  image: string;
};

// ประเภทข้อมูลสำหรับช่วงเวลา
type TimeSlot = {
  time: string;
  isAvailable: boolean;
  tables: Table[];
};

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const queryDate = searchParams.get("date");
  const queryTime = searchParams.get("time");
  const queryGuests = searchParams.get("guests");

  const [step, setStep] = useState(1);

  // สถานะสำหรับฟอร์มการจอง
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [occasion, setOccasion] = useState("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // สถานะสำหรับการแสดงผล
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reservationId, setReservationId] = useState("");
  const { userProfile } = useAuth();

  const goToNextStep = () => {
    if (step === 1) {
      if (!date || !time) {
        setErrorMessage("กรุณาเลือกวันและเวลาให้ครบถ้วน");
        return;
      }
      setErrorMessage("");
      setStep(2);
    } else if (step === 2) {
      if (!selectedTable) {
        setErrorMessage("กรุณาเลือกโต๊ะ");
        return;
      }
      setErrorMessage("");
      setStep(3);
    } else if (step === 3) {
      if (!validateForm()) {
        return;
      }
      setStep(4);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage("");
    }
  };

  // ตรวจสอบความถูกต้องของฟอร์ม
  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("กรุณากรอกชื่อและนามสกุล");
      return false;
    }

    if (!email.trim()) {
      setErrorMessage("กรุณากรอกอีเมล");
      return false;
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    if (!phone.trim()) {
      setErrorMessage("กรุณากรอกเบอร์โทรศัพท์");
      return false;
    }

    // ตรวจสอบรูปแบบเบอร์โทร
    // const phoneRegex = /^[0-9]{9,10}$/;
    // if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    //   setErrorMessage("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง");
    //   return false;
    // }

    if (!agreedToTerms) {
      setErrorMessage("กรุณายอมรับข้อตกลงและเงื่อนไข");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  // ฟอร์แมตวันที่ให้เป็นภาษาไทย
  const formatThaiDate = (dateStr: string) => {
    try {
      const dateObj = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(dateObj, "d MMMM yyyy", { locale: th });
    } catch (error) {
      console.log("error", error);
      return dateStr;
    }
  };

  // หาชื่อของโต๊ะจาก ID
  const getTableNameById = (id: string) => {
    const table = availableTables.find((t) => t._id === id);
    return table ? table.name : "";
  };

  // แปลงตำแหน่งของโต๊ะเป็นภาษาไทย
  const getLocationText = (location: string) => {
    switch (location) {
      case "indoor":
        return "ในร้าน";
      case "outdoor":
        return "กลางแจ้ง";
      case "private":
        return "ห้องส่วนตัว";
      default:
        return location;
    }
  };

  const getReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/reservations/getAvailableBooks",
        {
          params: {
            date: date ? date : format(new Date(), "yyyy-MM-dd"),
          },
        }
      );

      const _data = response.data;
      if (_data.status === "success") {
        console.log("data", _data);

        setTimeSlots(_data.data.slots);
        let slot = _data.data.slots.find(
          (slot: TimeSlot) => slot.isAvailable && slot.time === queryTime
        );

        slot = slot
          ? slot
          : _data.data.slots.find((slot: TimeSlot) => slot.isAvailable);

        if (slot) {
          setTime(slot.time);
          setAvailableTables(slot.tables);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }, [date, queryTime]);

  const bookingTable = async () => {
    try {
      setIsLoading(true);

      const send_data = {
        userId: userProfile?._id,
        date: date,
        time: time,
        numberOfGuests: guests,
        tableId: selectedTable,
        specialOccasion: occasion,
        specialRequests: specialRequests,
      };
      console.log("send_data", send_data);
      const response = await axiosInstance.post(
        "/reservations/create",
        send_data
      );

      const _data = response.data;
      console.log("_data", _data);
      if (_data.status === "success") {
        setReservationId(_data.data.reservation._id);
        goToNextStep();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  // เมื่อคอมโพเนนต์โหลด
  // useEffect(() => {
  //   if (queryDate) {
  //     setDate(queryDate as string);
  //   } else {
  //     setDate(format(new Date(), "yyyy-MM-dd"));
  //   }
  //   if (queryTime) setTime(queryTime as string);
  //   if (queryGuests) setGuests(parseInt(queryGuests as string));
  // }, [queryDate, queryTime, queryGuests]);

  useEffect(() => {
    if (queryDate) {
      setDate(queryDate as string);
    } else {
      setDate(format(new Date(), "yyyy-MM-dd"));
    }
    if (queryTime) setTime(queryTime as string);
    if (queryGuests) setGuests(parseInt(queryGuests as string));
  }, [queryDate, queryTime, queryGuests]);

  // เมื่อเปลี่ยนวันหรือเวลา
  useEffect(() => {
    if (date) {
      getReservations();
    }
  }, [date, getReservations]);

  useEffect(() => {
    if (!userProfile) return;

    setFirstName(userProfile?.firstname);
    setLastName(userProfile?.lastname);
    setEmail(userProfile?.email);
    setPhone(userProfile?.phone);
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header พร้อมลิงก์กลับ */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center text-amber-600 hover:text-amber-700"
              >
                <FaChevronLeft className="mr-2" /> กลับไปหน้าหลัก
              </Link>
              <div className="text-xl font-semibold text-gray-800">จองโต๊ะ</div>
              <div className="w-24"></div>{" "}
              {/* สร้างช่องว่างเพื่อ center ข้อความกลาง */}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="relative flex items-center w-full max-w-3xl mx-auto">
                {/* Step 1 */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step >= 1
                        ? "bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FaCalendarAlt />
                  </div>
                  <div className="text-sm mt-2 text-center font-medium">
                    <span
                      className={step >= 1 ? "text-amber-600" : "text-gray-500"}
                    >
                      เลือกวันและเวลา
                    </span>
                  </div>
                </div>

                {/* Line between steps */}
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > 1 ? "bg-amber-600" : "bg-gray-200"
                  }`}
                ></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step >= 2
                        ? "bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FaUtensils />
                  </div>
                  <div className="text-sm mt-2 text-center font-medium">
                    <span
                      className={step >= 2 ? "text-amber-600" : "text-gray-500"}
                    >
                      เลือกโต๊ะ
                    </span>
                  </div>
                </div>

                {/* Line between steps */}
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > 2 ? "bg-amber-600" : "bg-gray-200"
                  }`}
                ></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step >= 3
                        ? "bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FaUsers />
                  </div>
                  <div className="text-sm mt-2 text-center font-medium">
                    <span
                      className={step >= 3 ? "text-amber-600" : "text-gray-500"}
                    >
                      ข้อมูลผู้จอง
                    </span>
                  </div>
                </div>

                {/* Line between steps */}
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > 3 ? "bg-amber-600" : "bg-gray-200"
                  }`}
                ></div>

                {/* Step 4 */}
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step >= 4
                        ? "bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FaCheckCircle />
                  </div>
                  <div className="text-sm mt-2 text-center font-medium">
                    <span
                      className={step >= 4 ? "text-amber-600" : "text-gray-500"}
                    >
                      ยืนยันการจอง
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* รายละเอียดการจอง */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ด้านซ้าย: ฟอร์มตามขั้นตอน */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      เลือกวัน เวลา และจำนวนคน
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          วันที่
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={format(new Date(), "yyyy-MM-dd")}
                          max={format(addDays(new Date(), 30), "yyyy-MM-dd")}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          สามารถจองล่วงหน้าได้ไม่เกิน 30 วัน
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          เวลา
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              disabled={!slot.isAvailable}
                              onClick={() => {
                                setTime(slot.time);
                                setAvailableTables(slot.tables);
                              }}
                              className={`py-2 px-3 cursor-pointer rounded-md text-center focus:outline-none transition-colors
                                ${
                                  time === slot.time
                                    ? "bg-amber-600 text-white"
                                    : slot.isAvailable
                                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-amber-50"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          เวลาที่ไม่สามารถเลือกได้คือเวลาที่มีการจองเต็มแล้ว
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="guests"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          จำนวนคน
                        </label>
                        <select
                          id="guests"
                          name="guests"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "คน" : "คน"}
                            </option>
                          ))}
                          <option value="11">มากกว่า 10 คน</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                          สำหรับการจองมากกว่า 10 คน อาจต้องมีการติดต่อเพิ่มเติม
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      เลือกโต๊ะ
                    </h2>

                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
                        <p className="text-gray-600">
                          กำลังค้นหาโต๊ะที่ว่าง...
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {availableTables
                            .filter(
                              (e) => e.capacity >= guests && e.isAvailable
                            )
                            .map((table) => (
                              <div
                                key={table._id}
                                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                  selectedTable === table._id
                                    ? "border-amber-600 ring-2 ring-amber-600 ring-opacity-50"
                                    : "border-gray-200 hover:border-amber-300"
                                }`}
                                onClick={() => setSelectedTable(table._id)}
                              >
                                <div className="relative h-48">
                                  <Image
                                    src={table.image}
                                    alt={table.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-900">
                                      {table.name}
                                    </h3>
                                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                                      {table.capacity} ที่นั่ง
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    ตำแหน่ง: {getLocationText(table.location)}
                                  </p>

                                  {selectedTable === table._id && (
                                    <div className="mt-2 text-amber-600 text-sm font-medium">
                                      เลือกโต๊ะนี้ ✓
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-600 bg-amber-50 p-4 rounded-lg">
                          <p className="flex items-center">
                            <FaInfoCircle className="mr-2 text-amber-600" />
                            หมายเหตุ:
                            การเลือกโต๊ะอาจมีการเปลี่ยนแปลงในวันที่เข้าใช้บริการ
                            ขึ้นอยู่กับความเหมาะสมของทางร้าน
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      กรอกข้อมูลผู้จอง
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          ชื่อ <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          นามสกุล <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          อีเมล <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                          disabled
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          เราจะส่งรายละเอียดการจองไปที่อีเมลนี้
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          เบอร์โทรศัพท์ <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="occasion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        โอกาสพิเศษ
                      </label>
                      <select
                        id="occasion"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">-- เลือกโอกาส --</option>
                        <option value="birthday">วันเกิด</option>
                        <option value="anniversary">วันครบรอบ</option>
                        <option value="business">ธุรกิจ</option>
                        <option value="datenight">เดท</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="specialRequests"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ความต้องการพิเศษ
                      </label>
                      <textarea
                        id="specialRequests"
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="เช่น อาหารที่แพ้, ความต้องการพิเศษ, ฯลฯ"
                        className="disabled:bg-gray-100 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="terms"
                            className="font-medium text-gray-700"
                          >
                            ยอมรับข้อตกลงและเงื่อนไข{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <p className="text-gray-500">
                            ฉันยอมรับ
                            <button
                              type="button"
                              className="text-amber-600 underline"
                            >
                              ข้อตกลงและเงื่อนไข
                            </button>
                            การจองของร้านอาหาร
                            รวมถึงนโยบายการยกเลิกและการเก็บค่ามัดจำ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="flex items-start">
                        <FaInfoCircle className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                        <span>
                          เราจะเก็บที่นั่งให้คุณเป็นเวลา 15
                          นาทีหลังจากเวลาที่จอง
                          หากเลยเวลาดังกล่าวโดยไม่มีการแจ้ง
                          การจองจะถูกยกเลิกโดยอัตโนมัติ
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <FaCheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        การจองเสร็จสมบูรณ์!
                      </h2>
                      <p className="text-gray-600">
                        ขอบคุณสำหรับการจองโต๊ะที่ร้านอาหารของเรา
                        {/* เราได้ส่งรายละเอียดการจองไปยังอีเมลของคุณแล้ว */}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        รายละเอียดการจอง
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">รหัสการจอง</p>
                          <p className="font-medium">
                            {reservationId.split("-")[0]}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">ชื่อผู้จอง</p>
                          <p className="font-medium">
                            {firstName} {lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">วันและเวลา</p>
                          <p className="font-medium">
                            {formatThaiDate(date)} เวลา {time} น.
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">จำนวนคน</p>
                          <p className="font-medium">{guests} คน</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">โต๊ะที่จอง</p>
                          <p className="font-medium">
                            {getTableNameById(selectedTable)}
                          </p>
                        </div>

                        {specialRequests && (
                          <div className="sm:col-span-2">
                            <p className="text-sm text-gray-500">
                              ความต้องการพิเศษ
                            </p>
                            <p className="font-medium">{specialRequests}</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          คุณสามารถจัดการการจองได้ผ่านอีเมลที่ได้รับ
                          หรือเข้าสู่ระบบบัญชีของคุณ
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Link
                            href="/myreservations"
                            className="bg-amber-600  text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition"
                          >
                            ดูการจองของฉัน
                          </Link>
                          <Link
                            href="/"
                            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                          >
                            กลับไปหน้าหลัก
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && step < 4 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                  <div className="mt-6 flex justify-between">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        ย้อนกลับ
                      </button>
                    ) : (
                      <div></div> // Empty div for spacing
                    )}

                    <button
                      type="button"
                      onClick={step === 3 ? bookingTable : goToNextStep}
                      disabled={!agreedToTerms && step === 3}
                      // disabled={true}
                      className={`px-6 py-2 disabled:bg-gray-100 disabled:text-black disabled:!cursor-not-allowed bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          กำลังดำเนินการ...
                        </>
                      ) : step === 3 ? (
                        "ยืนยันการจอง"
                      ) : (
                        "ถัดไป"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ด้านขวา: สรุปการจอง */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  สรุปการจอง
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">วัน:</span>
                    <span className="font-medium">
                      {date ? formatThaiDate(date) : "ยังไม่ได้เลือก"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">เวลา:</span>
                    <span className="font-medium">
                      {time ? `${time} น.` : "ยังไม่ได้เลือก"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนคน:</span>
                    <span className="font-medium">{guests} คน</span>
                  </div>

                  {step >= 2 && selectedTable && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">โต๊ะ:</span>
                      <span className="font-medium">
                        {getTableNameById(selectedTable)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="text-sm text-gray-600 mb-3">
                      <FaInfoCircle className="inline-block mr-2 text-amber-600" />
                      กรุณามาถึงร้านตรงเวลา การจองจะถูกเก็บไว้ 15
                      นาทีหลังจากเวลาที่จอง
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                    <FaQuestionCircle className="mr-2" />
                    มีคำถาม?
                  </h4>
                  <p className="text-sm text-amber-800 mb-3">
                    หากคุณมีข้อสงสัยเกี่ยวกับการจอง สามารถติดต่อเราได้ที่
                  </p>
                  <a
                    href="tel:+6621234567"
                    className="flex items-center text-amber-700 font-medium hover:text-amber-800"
                  >
                    <FaPhone className="mr-2" /> 02-123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationPage;
