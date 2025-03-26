"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { Footer } from "./Footer";
import axiosInstance from "@/lib/axios";

const RegisterPage = () => {
  const router = useRouter();

  // สถานะสำหรับฟอร์ม
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // const [agreedToNewsletter, setAgreedToNewsletter] = useState(false);

  // สถานะการตรวจสอบ
  // const [emailTouched, setEmailTouched] = useState(false);
  //   const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // การตรวจสอบฟอร์ม
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const isPhoneValid = /^[0-9]{9,10}$/.test(phone.replace(/\s/g, ""));
  const isPhoneValid = phone.length >= 9 && phone.length <= 10;

  // การตรวจสอบความซับซ้อนของรหัสผ่าน
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const isLongEnough = password.length >= 8;

  const isStrongPassword =
    hasUpperCase && hasLowerCase && hasNumbers && isLongEnough;

  // คำนวณความแข็งแรงของรหัสผ่าน
  const calculatePasswordStrength = () => {
    if (password.length === 0) return 0;

    let strength = 0;
    if (hasUpperCase) strength += 1;
    if (hasLowerCase) strength += 1;
    if (hasNumbers) strength += 1;
    if (isLongEnough) strength += 1;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength();

  // คำอธิบายความแข็งแรงของรหัสผ่าน
  const getPasswordStrengthText = () => {
    if (password.length === 0) return "";
    if (passwordStrength <= 2) return "อ่อน";
    if (passwordStrength <= 3) return "ปานกลาง";
    return "แข็งแรง";
  };

  // สีแถบความแข็งแรงของรหัสผ่าน
  const getPasswordStrengthColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  // ตรวจสอบฟอร์มทั้งหมด
  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("กรุณากรอกชื่อและนามสกุล");
      return false;
    }

    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return false;
    }

    if (!isEmailValid) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    if (!phone.trim()) {
      setError("กรุณากรอกเบอร์โทรศัพท์");
      return false;
    }

    if (!isPhoneValid) {
      setError("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง");
      return false;
    }

    if (!password) {
      setError("กรุณากรอกรหัสผ่าน");
      return false;
    }

    if (passwordStrength < 3) {
      setError("รหัสผ่านไม่ปลอดภัยเพียงพอ");
      return false;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (!agreedToTerms) {
      setError("กรุณายอมรับข้อตกลงและเงื่อนไข");
      return false;
    }

    return true;
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OK");
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/register", {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        password: password,
      });
      console.log("response", response);

      if (response.data.status === "success") {
        setRegisterSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      }
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // แสดงผลหน้าลงทะเบียนสำเร็จ
  if (registerSuccess) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ลงทะเบียนสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-6">
              ขอบคุณสำหรับการลงทะเบียน
              เราจะนำคุณไปยังหน้าเข้าสู่ระบบในอีกไม่กี่วินาที
            </p>

            <div className="flex justify-center">
              <Link
                href="/login"
                className="inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none"
              >
                ไปที่หน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>สมัครสมาชิก | ร้านอาหารกรุงเทพ</title>
        <meta
          name="description"
          content="ลงทะเบียนเพื่อจองโต๊ะและรับสิทธิพิเศษจากร้านอาหารกรุงเทพ"
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header/Navbar อย่างง่าย */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Restaurant Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </Link>

              <Link
                href="/login"
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">สมัครสมาชิก</h1>
              <p className="mt-2 text-gray-600">
                สมัครสมาชิกเพื่อจองโต๊ะและรับสิทธิพิเศษจากร้านอาหารของเรา
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <FaExclamationCircle className="mr-2" />
                {error}
              </div>
            )}

            {/* ฟอร์ม */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ชื่อและนามสกุล */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ชื่อ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 block w-full border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 py-2.5"
                      placeholder="ชื่อจริง"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    นามสกุล <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 py-2.5 px-3"
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              {/* อีเมลและเบอร์โทร */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    อีเมล <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 block w-full border ${
                        !isEmailValid
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      } rounded-lg py-2.5`}
                      placeholder="your@email.com"
                    />
                    {!isEmailValid && email.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {!isEmailValid && email.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      กรุณากรอกอีเมลที่ถูกต้อง
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    เบอร์โทรศัพท์ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 py-2.5"
                      placeholder="0812345678"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    เราจะใช้เบอร์โทรเพื่อแจ้งเตือนการจอง
                  </p>
                </div>
              </div>

              {/* รหัสผ่านและยืนยันรหัสผ่าน */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    รหัสผ่าน <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      //   onBlur={() => setPasswordTouched(true)}
                      className="pl-10 pr-12 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 py-2.5"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* แถบความแข็งแรงของรหัสผ่าน */}
                  {password.length > 0 && (
                    <div className="mt-1.5">
                      <div className="flex justify-between mb-1">
                        <div className="flex space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-5 rounded-full ${
                                i < passwordStrength
                                  ? getPasswordStrengthColor()
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-xs ${
                            passwordStrength <= 2
                              ? "text-red-500"
                              : passwordStrength <= 4
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>

                      {/* ข้อกำหนดรหัสผ่าน */}
                      <div className="mt-2 text-xs grid grid-cols-1 gap-1 sm:grid-cols-2">
                        <div className="flex items-center">
                          <span
                            className={`flex-shrink-0 h-4 w-4 flex items-center justify-center rounded-full ${
                              isLongEnough
                                ? "bg-green-100 text-green-500"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isLongEnough ? (
                              <FaCheck className="h-2.5 w-2.5" />
                            ) : (
                              <FaTimes className="h-2.5 w-2.5" />
                            )}
                          </span>
                          <span className="ml-1.5 text-gray-500">
                            อย่างน้อย 8 ตัวอักษร
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`flex-shrink-0 h-4 w-4 flex items-center justify-center rounded-full ${
                              hasUpperCase
                                ? "bg-green-100 text-green-500"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {hasUpperCase ? (
                              <FaCheck className="h-2.5 w-2.5" />
                            ) : (
                              <FaTimes className="h-2.5 w-2.5" />
                            )}
                          </span>
                          <span className="ml-1.5 text-gray-500">
                            ตัวอักษรพิมพ์ใหญ่
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`flex-shrink-0 h-4 w-4 flex items-center justify-center rounded-full ${
                              hasLowerCase
                                ? "bg-green-100 text-green-500"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {hasLowerCase ? (
                              <FaCheck className="h-2.5 w-2.5" />
                            ) : (
                              <FaTimes className="h-2.5 w-2.5" />
                            )}
                          </span>
                          <span className="ml-1.5 text-gray-500">
                            ตัวอักษรพิมพ์เล็ก
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`flex-shrink-0 h-4 w-4 flex items-center justify-center rounded-full ${
                              hasNumbers
                                ? "bg-green-100 text-green-500"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {hasNumbers ? (
                              <FaCheck className="h-2.5 w-2.5" />
                            ) : (
                              <FaTimes className="h-2.5 w-2.5" />
                            )}
                          </span>
                          <span className="ml-1.5 text-gray-500">ตัวเลข</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ยืนยันรหัสผ่าน <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 pr-12 block w-full border ${
                        confirmPassword && confirmPassword !== password
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      } rounded-lg py-2.5`}
                      placeholder="••••••••"
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
                  {confirmPassword && confirmPassword !== password && (
                    <p className="mt-1 text-sm text-red-600">
                      รหัสผ่านไม่ตรงกัน
                    </p>
                  )}
                </div>
              </div>

              {/* การยอมรับข้อตกลง */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      required
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
                      ฉันได้อ่านและยอมรับ{" "}
                      <Link
                        href="/terms-of-service"
                        className="text-amber-600 hover:text-amber-500"
                      >
                        ข้อตกลงการใช้บริการ
                      </Link>{" "}
                      และ{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-amber-600 hover:text-amber-500"
                      >
                        นโยบายความเป็นส่วนตัว
                      </Link>
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      checked={agreedToNewsletter}
                      onChange={(e) => setAgreedToNewsletter(e.target.checked)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="newsletter"
                      className="font-medium text-gray-700"
                    >
                      รับข่าวสารและโปรโมชัน
                    </label>
                    <p className="text-gray-500">
                      ฉันต้องการรับข่าวสารและโปรโมชันพิเศษทางอีเมล
                    </p>
                  </div>
                </div> */}
              </div>

              {/* ปุ่มสมัคร */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting && isStrongPassword}
                  className={`w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                    isSubmitting && isStrongPassword
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    "สมัครสมาชิก"
                  )}
                </button>
              </div>

              {/* ลิงก์ไปยังหน้าเข้าสู่ระบบ */}
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-amber-600 hover:text-amber-500"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer อย่างง่าย */}
        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
