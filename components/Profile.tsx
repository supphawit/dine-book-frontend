"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaChevronLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaLock,
  FaCamera,
  FaPencilAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import axiosInstance from "@/lib/axios";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  image: string;
  birthdate: string;
  email_noti: boolean;
  sms_noti: boolean;
}

const ProfilePage = () => {
  //   const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // สถานะสำหรับการแก้ไข
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security">(
    "personal"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // สถานะข้อมูลผู้ใช้
  const [formData, setFormData] = useState<Partial<User>>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    image: "",
    birthdate: "",
    email_noti: false,
    sms_noti: false,
  });
  // สถานะสำหรับการเปลี่ยนรหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { userProfile, saveProfile } = useAuth();

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return format(parseISO(dateString), "yyyy-MM-dd");
  };

  // เริ่มการแก้ไขข้อมูล
  const handleEdit = () => {
    setIsEditing(true);
  };

  // ยกเลิกการแก้ไข
  const handleCancel = () => {
    if (!userProfile) return;
    setFormData({
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      phone: userProfile.phone,
      image: userProfile.image,
      birthdate: userProfile.birthdate,
      email_noti: userProfile.email_noti,
      sms_noti: userProfile.sms_noti,
    });
    setIsEditing(false);
    setSaveSuccess(false);
    setErrorMessage("");
  };

  // บันทึกการเปลี่ยนแปลง
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const response = await axiosInstance.patch("/user/update", {
        ...formData,
      });

      const _data = response.data;
      if (_data.status === "success") {
        saveProfile(_data.data.user);
        setSaveSuccess(true);

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setErrorMessage("ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง");
    } finally {
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  // จัดการการเปลี่ยนค่าในฟอร์ม
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // เปลี่ยนรูปโปรไฟล์
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // จำลองการอัปโหลดรูปภาพ
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            image: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // เปลี่ยนรหัสผ่าน
  const handleChangePassword = async () => {
    setPasswordError("");

    // ตรวจสอบความถูกต้อง
    if (!currentPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านปัจจุบัน");
      return;
    }

    if (!newPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsSaving(true);

    try {
      const response = await axiosInstance.patch("/user/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      const _data = response.data;
      if (_data.status === "success") {
        setSaveSuccess(true);

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setErrorMessage("ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง");
    } finally {
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!userProfile) return;

    setFormData({
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      phone: userProfile.phone,
      image: userProfile.image,
      birthdate: userProfile.birthdate,
      email_noti: userProfile.email_noti,
      sms_noti: userProfile.sms_noti,
    });
  }, [userProfile]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-12">
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
                โปรไฟล์ของฉัน
              </div>
              <div className="w-24"></div>{" "}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {/* ข้อความแจ้งเตือน */}
          {saveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <FaCheckCircle className="mr-2" />
              บันทึกข้อมูลเรียบร้อยแล้ว
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <FaExclamationCircle className="mr-2" />
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - ส่วนซ้าย */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* รูปโปรไฟล์ */}
                <div className="relative bg-gradient-to-r from-amber-500 to-amber-700 p-6 text-center">
                  <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image
                      src={
                        formData.image || "/images/avatars/profile-default.jpg"
                      }
                      alt="รูปโปรไฟล์"
                      fill
                      className="object-cover"
                    />

                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black opacity-50 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FaCamera className="h-8 w-8 text-white" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProfileImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {userProfile?.firstname} {userProfile?.lastname}
                  </h2>
                  <p className="text-amber-100">
                    สมาชิกตั้งแต่{" "}
                    {formData?.birthdate
                      ? format(parseISO(formData.birthdate), "MMMM yyyy", {
                          locale: th,
                        })
                      : ""}
                  </p>
                </div>

                {/* เมนูแท็บ */}
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab("personal")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center cursor-pointer ${
                          activeTab === "personal"
                            ? "bg-amber-50 text-amber-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FaUser className="mr-3" />
                        ข้อมูลส่วนตัว
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center cursor-pointer ${
                          activeTab === "security"
                            ? "bg-amber-50 text-amber-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FaLock className="mr-3" />
                        ความปลอดภัย
                      </button>
                    </li>
                  </ul>
                </nav>

                {/* ลิงก์ไปหน้าอื่น */}
                <div className="p-4 border-t border-gray-200">
                  <Link
                    href="/myreservations"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <FaCalendarAlt className="inline-block mr-3" />
                    การจองของฉัน
                  </Link>
                </div>
              </div>
            </div>

            {/* ส่วนเนื้อหาหลัก - ส่วนขวา */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* ปุ่มแก้ไข/บันทึก */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeTab === "personal" && "ข้อมูลส่วนตัว"}
                    {/* {activeTab === "preferences" && "ความชอบและข้อจำกัด"} */}
                    {activeTab === "security" && "ความปลอดภัย"}
                  </h3>

                  {activeTab !== "security" && (
                    <div>
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <FaTimes className="mr-1.5" /> ยกเลิก
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center ${
                              isSaving ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                บันทึก...
                              </>
                            ) : (
                              <>
                                <FaSave className="mr-1.5" /> บันทึก
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 cursor-pointer border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 flex items-center"
                        >
                          <FaPencilAlt className="mr-1.5" /> แก้ไข
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ข้อมูลส่วนตัว */}
                {activeTab === "personal" && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstname"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          ชื่อ
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname || ""}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        ) : (
                          <p className="py-2.5 text-gray-900">
                            {formData.firstname}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lastname"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          นามสกุล
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname || ""}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        ) : (
                          <p className="py-2.5 text-gray-900">
                            {formData.lastname}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          อีเมล
                        </label>
                        <div className="flex items-center">
                          <FaEnvelope className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditing ? (
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email || ""}
                              onChange={handleInputChange}
                              disabled
                              className="block w-full disabled:bg-gray-100 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              required
                            />
                          ) : (
                            <p className="py-2.5 text-gray-900">
                              {formData.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          เบอร์โทรศัพท์
                        </label>
                        <div className="flex items-center">
                          <FaPhone className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditing ? (
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone || ""}
                              onChange={handleInputChange}
                              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              required
                            />
                          ) : (
                            <p className="py-2.5 text-gray-900">
                              {formData.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="birthdate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          วันเกิด
                        </label>
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditing ? (
                            <input
                              type="date"
                              id="birthdate"
                              name="birthdate"
                              value={
                                formData.birthdate
                                  ? formatDateForInput(formData.birthdate)
                                  : ""
                              }
                              onChange={handleInputChange}
                              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          ) : (
                            <p className="py-2.5 text-gray-900">
                              {formData.birthdate
                                ? format(
                                    parseISO(formData.birthdate),
                                    "d MMMM yyyy",
                                    {
                                      locale: th,
                                    }
                                  )
                                : "-"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">
                            วิธีการรับการแจ้งเตือน
                          </h4>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                                <span>อีเมล</span>
                              </div>

                              <div>
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    name="email_noti"
                                    checked={formData.email_noti}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="sr-only peer"
                                  />
                                  <div
                                    className={`relative w-11 h-6 disabled:!cursor-not-allowed bg-gray-200 rounded-full peer peer-checked:bg-amber-600 ${
                                      isEditing
                                        ? "peer-focus:ring-4 peer-focus:ring-amber-300"
                                        : ""
                                    } after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
                                  ></div>
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <FaPhone className="h-5 w-5 text-gray-400 mr-3" />
                                <span>SMS</span>
                              </div>

                              <div>
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    name="sms_noti"
                                    checked={formData.sms_noti}
                                    disabled={!isEditing}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                  />
                                  <div
                                    className={`relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-600 ${
                                      isEditing
                                        ? "peer-focus:ring-4 peer-focus:ring-amber-300"
                                        : ""
                                    } after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
                                  ></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ความปลอดภัย */}
                {activeTab === "security" && (
                  <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      เปลี่ยนรหัสผ่าน
                    </h4>

                    {passwordError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <FaExclamationCircle className="mr-2" />
                        {passwordError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          รหัสผ่านปัจจุบัน
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          รหัสผ่านใหม่
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          ยืนยันรหัสผ่านใหม่
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          disabled={isSaving}
                          className={`w-full sm:w-auto px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center ${
                            isSaving ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              กำลังบันทึก...
                            </>
                          ) : (
                            "เปลี่ยนรหัสผ่าน"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
