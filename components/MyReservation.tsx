"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { format, isPast, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaUtensils,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronLeft,
  FaHistory,
  FaRegSave,
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";

// ประเภทข้อมูลการจอง

type Reservation = {
  _id: string;
  userId: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableId: string;
  specialOccasion: string;
  specialRequests: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tableDetails: {
    name: string;
    capacity: number;
    location: string;
    image: string;
  };
};

const MyReservationsPage = () => {
  const [filter, setFilter] = useState<"all" | "today">("today");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // แปลงสถานะเป็นภาษาไทย
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "ยืนยันแล้ว";
      case "pending":
        return "รอการยืนยัน";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  };

  // สีตามสถานะ
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ไอคอนตามสถานะ
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="mr-1.5" />;
      case "pending":
        return <FaExclamationTriangle className="mr-1.5" />;
      case "cancelled":
        return <FaTimesCircle className="mr-1.5" />;
      case "completed":
        return <FaHistory className="mr-1.5" />;
      default:
        return null;
    }
  };

  // แปลงตำแหน่งโต๊ะเป็นภาษาไทย
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

  // ฟอร์แมตวันที่เป็นภาษาไทย
  const formatThaiDate = (dateStr: string) => {
    try {
      const dateObj = parseISO(dateStr);
      return format(dateObj, "d MMMM yyyy", { locale: th });
    } catch (error) {
      console.log("error", error);
      return dateStr;
    }
  };

  // ตรวจสอบว่าสามารถแก้ไขหรือยกเลิกการจองได้หรือไม่
  const canModify = (reservation: Reservation) => {
    const reservationDate = parseISO(`${reservation.date}T${reservation.time}`);
    return reservation.status === "pending" && !isPast(reservationDate);
  };

  const getReservations = useCallback(async () => {
    console.log("getReservations", filter);
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/reservations", {
        params: {
          filter,
        },
      });

      const _data = response.data;
      if (_data.status === "success") {
        setReservations(_data.data.reservations);
      }
    } catch (error) {
      console.log("error", error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    getReservations();
  }, [filter, getReservations]);

  const changeStatus = async (reservationId: string, _status: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/reservations/${reservationId}/status`,
        {
          status: _status,
        }
      );

      const _data = response.data;
      if (_data.status === "success") {
        getReservations();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="text-xl font-semibold text-gray-800">
                การจองของฉัน
              </div>
              <div className="w-24"></div>{" "}
              {/* สร้างช่องว่างเพื่อ center ข้อความกลาง */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {/* Panel การค้นหาและกรอง */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                {/* <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "upcoming"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ที่จะถึง
                </button> */}
                <button
                  onClick={() => setFilter("today")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "today"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  วันนี้
                </button>
                {/* <button
                  onClick={() => setFilter("past")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "past"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ที่ผ่านมา
                </button> */}
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "all"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ทั้งหมด
                </button>
              </div>

              {/* <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาการจอง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div> */}
            </div>
          </div>

          {/* รายการการจอง */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
                <p className="text-gray-600">กำลังโหลดข้อมูลการจอง...</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <FaCalendarAlt className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ไม่พบการจอง
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter !== "all"
                    ? `คุณไม่มีการจอง${
                        filter === "today" ? "วันนี้" : "ที่ผ่านมา"
                      }`
                    : "คุณไม่มีประวัติการจอง"}
                </p>
                <Link
                  href="/reservation"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
                >
                  จองโต๊ะใหม่
                </Link>
              </div>
            ) : (
              <div>
                <div className="border-b border-gray-200">
                  <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                    <div className="col-span-3">วัน/เวลา</div>
                    <div className="col-span-2">จำนวนคน</div>
                    <div className="col-span-3">โต๊ะ</div>
                    <div className="col-span-2">สถานะ</div>
                    <div className="col-span-2 text-right">ดำเนินการ</div>
                  </div>
                </div>

                <ul className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <li key={reservation._id} className="relative">
                      <div
                        className={`px-6 py-4 ${
                          selectedReservation === reservation._id
                            ? "bg-amber-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className="grid grid-cols-12 items-center"
                          onClick={() =>
                            setSelectedReservation(
                              selectedReservation === reservation._id
                                ? null
                                : reservation._id
                            )
                          }
                        >
                          <div className="col-span-3">
                            <p className="font-medium text-gray-900">
                              {formatThaiDate(reservation.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              เวลา {reservation.time} น.
                            </p>
                          </div>

                          <div className="col-span-2 flex items-center">
                            <FaUsers className="text-gray-400 mr-2" />
                            <span>{reservation.numberOfGuests} คน</span>
                          </div>

                          <div className="col-span-3">
                            <p className="font-medium text-gray-900">
                              {reservation.tableDetails.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getLocationText(
                                reservation.tableDetails.location
                              )}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {getStatusIcon(reservation.status)}
                              {getStatusText(reservation.status)}
                            </span>
                          </div>

                          <div className="col-span-2 flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReservation(
                                  selectedReservation === reservation._id
                                    ? null
                                    : reservation._id
                                );
                              }}
                              className="p-2 text-gray-600 hover:text-amber-600 rounded-full hover:bg-amber-50"
                              title="ดูรายละเอียด"
                            >
                              <FaChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  selectedReservation === reservation._id
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* รายละเอียดเพิ่มเติม */}
                        {selectedReservation === reservation._id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  รายละเอียดการจอง
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="space-y-3">
                                    <div className="flex">
                                      <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          วันที่
                                        </p>
                                        <p className="font-medium">
                                          {formatThaiDate(reservation.date)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <FaClock className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          เวลา
                                        </p>
                                        <p className="font-medium">
                                          {reservation.time} น.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <FaUsers className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          จำนวนคน
                                        </p>
                                        <p className="font-medium">
                                          {reservation.numberOfGuests} คน
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <FaUtensils className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          โต๊ะ
                                        </p>
                                        <p className="font-medium">
                                          {reservation.tableDetails.name} (
                                          {getLocationText(
                                            reservation.tableDetails.location
                                          )}
                                          )
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  ข้อมูลเพิ่มเติม
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        รหัสการจอง
                                      </p>
                                      <p className="font-medium">
                                        {reservation._id.split("-")[0]}
                                      </p>
                                    </div>

                                    {reservation.specialRequests && (
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          ความต้องการพิเศษ
                                        </p>
                                        <p className="font-medium">
                                          {reservation.specialRequests}
                                        </p>
                                      </div>
                                    )}

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        วันที่ทำรายการ
                                      </p>
                                      <p className="font-medium">
                                        {format(
                                          parseISO(reservation.createdAt),
                                          "d MMM yyyy, HH:mm",
                                          { locale: th }
                                        )}{" "}
                                        น.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                  {canModify(reservation) ? (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          changeStatus(
                                            reservation._id,
                                            "confirmed"
                                          )
                                        }
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-emerald-700"
                                      >
                                        <FaRegSave className="mr-2 h-4 w-4" />
                                        ยืนยันการจอง
                                      </button>
                                      <button
                                        onClick={() =>
                                          changeStatus(
                                            reservation._id,
                                            "cancelled"
                                          )
                                        }
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                      >
                                        <FaTrashAlt className="mr-2 h-4 w-4" />
                                        ยกเลิกการจอง
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-center py-2 text-sm text-gray-500">
                                      {reservation.status === "cancelled"
                                        ? "การจองนี้ถูกยกเลิกไปแล้ว"
                                        : "ไม่สามารถแก้ไขหรือยกเลิกได้"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ปุ่มสำหรับจองใหม่ */}
          <div className="mt-6 text-center">
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
            >
              <FaCalendarAlt className="mr-2" />
              จองโต๊ะใหม่
            </Link>
          </div>
        </div>
      </div>

      {/* Modal ยืนยันการยกเลิก */}
      {/* {showCancelModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      ยืนยันการยกเลิกการจอง
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?
                        การดำเนินการนี้ไม่สามารถย้อนกลับได้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={changeStatus()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    isCancelling ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      กำลังยกเลิก...
                    </>
                  ) : (
                    "ยืนยันการยกเลิก"
                  )}
                </button>
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => {
                    setShowCancelModal(false);
                    setReservationToCancel(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default MyReservationsPage;
