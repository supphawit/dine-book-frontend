"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaCamera,
  FaPlus,
  FaTrash,
  FaSearch,
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaUtensils,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

// ประเภทข้อมูลเมนู
type MenuItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
};

// ประเภทข้อมูลรายการอาหารที่รีวิว
type ReviewDish = {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment?: string;
};

// ประเภทข้อมูลการจองที่ผ่านมา
type PastReservation = {
  id: string;
  date: string;
  time: string;
  tableNumber: string;
  guestCount: number;
};

const WriteReviewPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  // สถานะสำหรับการเขียนรีวิว
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  // สถานะสำหรับการเลือกเมนูที่จะรีวิว
  const [selectedDishes, setSelectedDishes] = useState<ReviewDish[]>([]);
  const [showDishSelector, setShowDishSelector] = useState(false);
  const [dishSearch, setDishSearch] = useState("");

  // สถานะการส่งฟอร์ม
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(true);
  const [pastReservation, setPastReservation] =
    useState<PastReservation | null>(null);

  // ข้อมูลเมนูทั้งหมด (จำลอง)
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  // โหลดข้อมูล
  useEffect(() => {
    const loadReviewData = async () => {
      setIsLoading(true);
      try {
        // จำลองการเรียก API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ข้อมูลเมนูจำลอง
        const dummyMenuItems: MenuItem[] = [
          {
            id: "dish-1",
            name: "สเต็กเนื้อวากิว",
            category: "อาหารจานหลัก",
            image: "/images/menu/wagyu-steak.jpg",
            price: 1290,
          },
          {
            id: "dish-2",
            name: "พาสต้าทรัฟเฟิล",
            category: "พาสต้า",
            image: "/images/menu/truffle-pasta.jpg",
            price: 320,
          },
          {
            id: "dish-3",
            name: "ต้มยำกุ้ง",
            category: "ซุป",
            image: "/images/menu/tom-yum-goong.jpg",
            price: 350,
          },
          {
            id: "dish-4",
            name: "ซีซาร์สลัด",
            category: "สลัด",
            image: "/images/menu/caesar-salad.jpg",
            price: 350,
          },
          {
            id: "dish-5",
            name: "พิซซ่ามาร์เกริต้า",
            category: "อาหารจานหลัก",
            image: "/images/menu/margherita-pizza.jpg",
            price: 280,
          },
          {
            id: "dish-6",
            name: "ลาบปลาแซลมอน",
            category: "อาหารเรียกน้ำย่อย",
            image: "/images/menu/salmon-larb.jpg",
            price: 260,
          },
          {
            id: "dish-7",
            name: "ช็อกโกแลตลาวา",
            category: "ของหวาน",
            image: "/images/menu/chocolate-lava.jpg",
            price: 220,
          },
          {
            id: "dish-8",
            name: "มอคเทลผลไม้รวม",
            category: "เครื่องดื่ม",
            image: "/images/menu/fruit-mocktail.jpg",
            price: 150,
          },
        ];

        setAllMenuItems(dummyMenuItems);

        // ถ้ามี reservationId ให้โหลดข้อมูลการจอง
        if (reservationId) {
          // จำลองข้อมูลการจอง
          const dummyReservation: PastReservation = {
            id: reservationId as string,
            date: "2025-03-15",
            time: "18:30",
            tableNumber: "A5",
            guestCount: 4,
          };

          setPastReservation(dummyReservation);

          // ตั้งค่าเมนูที่สั่งในการจองนี้ (จำลอง)
          setSelectedDishes([
            {
              id: "dish-1",
              name: "สเต็กเนื้อวากิว",
              image: "/images/menu/wagyu-steak.jpg",
              rating: 0,
            },
            {
              id: "dish-3",
              name: "ต้มยำกุ้ง",
              image: "/images/menu/tom-yum-goong.jpg",
              rating: 0,
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setErrorMessage("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewData();
  }, [reservationId]);

  // กรองเมนูตามคำค้นหา
  const filteredMenuItems = allMenuItems.filter((item) =>
    item.name.toLowerCase().includes(dishSearch.toLowerCase())
  );

  // เพิ่มเมนูที่จะรีวิว
  const addDishToReview = (dish: MenuItem) => {
    if (!selectedDishes.find((d) => d.id === dish.id)) {
      setSelectedDishes([
        ...selectedDishes,
        {
          id: dish.id,
          name: dish.name,
          image: dish.image,
          rating: 0,
        },
      ]);
    }
    setShowDishSelector(false);
    setDishSearch("");
  };

  // ลบเมนูออกจากรีวิว
  const removeDishFromReview = (dishId: string) => {
    setSelectedDishes(selectedDishes.filter((dish) => dish.id !== dishId));
  };

  // อัปเดตคะแนนของเมนู
  const updateDishRating = (dishId: string, rating: number) => {
    setSelectedDishes(
      selectedDishes.map((dish) =>
        dish.id === dishId ? { ...dish, rating } : dish
      )
    );
  };

  // อัปเดตความคิดเห็นของเมนู
  const updateDishComment = (dishId: string, comment: string) => {
    setSelectedDishes(
      selectedDishes.map((dish) =>
        dish.id === dishId ? { ...dish, comment } : dish
      )
    );
  };

  // อัพโหลดรูปภาพ
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || reviewImages.length >= 5) return;

    // จำลองการอัพโหลดรูปภาพ
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (reviewImages.length + newImages.length >= 5) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          newImages.push(reader.result);
          if (
            newImages.length === Math.min(files.length, 5 - reviewImages.length)
          ) {
            setReviewImages([...reviewImages, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ลบรูปภาพ
  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  // ตรวจสอบฟอร์ม
  const validateForm = () => {
    if (overallRating === 0) {
      setErrorMessage("กรุณาให้คะแนนรีวิว");
      return false;
    }

    if (reviewText.trim().length < 10) {
      setErrorMessage("กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร");
      return false;
    }

    if (selectedDishes.length === 0) {
      setErrorMessage("กรุณาเลือกอย่างน้อย 1 เมนูที่คุณต้องการรีวิว");
      return false;
    }

    if (selectedDishes.some((dish) => dish.rating === 0)) {
      setErrorMessage("กรุณาให้คะแนนทุกเมนูที่คุณเลือก");
      return false;
    }

    return true;
  };

  // ส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // จำลองการส่งข้อมูล
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ส่งสำเร็จ
      setIsSuccess(true);

      // รีเซ็ตฟอร์ม
      setOverallRating(0);
      setReviewText("");
      setReviewImages([]);
      setSelectedDishes([]);

      // หลังจากส่งสำเร็จ ให้นำทางไปหน้ารีวิว
      setTimeout(() => {
        router.push("/reviews");
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการส่งรีวิว โปรดลองอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // แสดงหน้ารีวิวสำเร็จ
  if (isSuccess) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ขอบคุณสำหรับรีวิว!
            </h2>
            <p className="text-gray-600 mb-6">
              รีวิวของคุณจะช่วยให้ลูกค้าคนอื่นๆ รู้จักร้านของเรามากขึ้น
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/reviews"
                className="inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none"
              >
                ดูรีวิวทั้งหมด
              </Link>
              <Link
                href="/"
                className="inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                กลับสู่หน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header/Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link
                href="/reviews"
                className="text-amber-600 hover:text-amber-700 flex items-center"
              >
                <FaChevronLeft className="mr-2" /> กลับไปหน้ารีวิว
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">
                เขียนรีวิว
              </h1>
              <div className="w-16"></div> {/* สำหรับการจัดตำแหน่งกลาง */}
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* แสดงข้อมูลการจอง (ถ้ามี) */}
          {pastReservation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FaInfoCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-blue-800 font-medium">
                    คุณกำลังรีวิวประสบการณ์จากการจอง
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    วันที่{" "}
                    {new Date(pastReservation.date).toLocaleDateString(
                      "th-TH",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                    เวลา {pastReservation.time} น. | โต๊ะ{" "}
                    {pastReservation.tableNumber} | {pastReservation.guestCount}{" "}
                    ท่าน
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ข้อความแจ้งเตือน */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <FaExclamationCircle className="mr-2" />
              {errorMessage}
            </div>
          )}

          {/* ฟอร์มเขียนรีวิว */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* คะแนนรวม */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ให้คะแนนประสบการณ์โดยรวมของคุณ
              </h3>

              <div className="flex justify-center">
                <div
                  className="flex space-x-2"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div
                      key={rating}
                      className="cursor-pointer transform transition-transform hover:scale-110"
                      onClick={() => setOverallRating(rating)}
                      onMouseOver={() => setHoverRating(rating)}
                    >
                      {rating <= (hoverRating || overallRating) ? (
                        <FaStar className="h-10 w-10 text-amber-500" />
                      ) : (
                        <FaRegStar className="h-10 w-10 text-amber-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-2">
                <span className="text-gray-600">
                  {overallRating === 1 && "แย่มาก"}
                  {overallRating === 2 && "แย่"}
                  {overallRating === 3 && "พอใช้"}
                  {overallRating === 4 && "ดี"}
                  {overallRating === 5 && "ยอดเยี่ยม"}
                  {overallRating === 0 && "กรุณาเลือกให้คะแนน"}
                </span>
              </div>
            </div>

            {/* เลือกเมนูที่จะรีวิว */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  เมนูที่คุณต้องการรีวิว
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDishSelector(true)}
                  className="flex items-center text-amber-600 hover:text-amber-700"
                >
                  <FaPlus className="mr-1" /> เพิ่มเมนู
                </button>
              </div>

              {selectedDishes.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 mb-4">
                    <FaUtensils className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    ยังไม่ได้เลือกเมนูที่จะรีวิว
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDishSelector(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaPlus className="mr-1.5" /> เพิ่มเมนู
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedDishes.map((dish) => (
                    <div key={dish.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">
                              {dish.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeDishFromReview(dish.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center">
                              <label className="text-sm text-gray-600 mr-2">
                                คะแนน:
                              </label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() =>
                                      updateDishRating(dish.id, rating)
                                    }
                                    className="focus:outline-none"
                                  >
                                    {rating <= dish.rating ? (
                                      <FaStar className="h-5 w-5 text-amber-500" />
                                    ) : (
                                      <FaRegStar className="h-5 w-5 text-amber-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="ความคิดเห็นเพิ่มเติมเกี่ยวกับเมนูนี้ (ไม่บังคับ)"
                              value={dish.comment || ""}
                              onChange={(e) =>
                                updateDishComment(dish.id, e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ตัวเลือกเมนู - แสดงเมื่อกดปุ่มเพิ่มเมนู */}
              {showDishSelector && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-20">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        เลือกเมนูที่ต้องการรีวิว
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDishSelector(false);
                          setDishSearch("");
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="ค้นหาเมนู..."
                        value={dishSearch}
                        onChange={(e) => setDishSearch(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-2 max-h-96 overflow-y-auto">
                      {filteredMenuItems.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          ไม่พบเมนูที่ตรงกับการค้นหา
                        </p>
                      ) : (
                        filteredMenuItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-amber-50"
                            onClick={() => addDishToReview(item)}
                          >
                            <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.category} • {item.price} บาท
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* เขียนรีวิว */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                เขียนรีวิวของคุณ
              </h3>

              <textarea
                placeholder="บอกเล่าประสบการณ์ของคุณที่ร้านอาหารของเรา..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                maxLength={500}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <span
                  className={`text-xs ${
                    reviewText.length >= 450 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {reviewText.length}/500 ตัวอักษร
                </span>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อัพโหลดรูปภาพ (สูงสุด 5 รูป)
                </label>
                <div className="flex flex-wrap gap-4">
                  {reviewImages.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                        <Image
                          src={image}
                          alt={`รูปที่ ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {reviewImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50"
                    >
                      <FaCamera className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 text-xs text-gray-500">
                        เพิ่มรูปภาพ
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  รูปภาพจะช่วยให้รีวิวของคุณมีประโยชน์มากขึ้น
                </p>
              </div>

              {/* <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  แท็ก (ไม่บังคับ)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {reviewTags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 text-amber-600 hover:text-amber-800"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {reviewTags.length < 5 && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="เพิ่มแท็ก..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTag.trim()) {
                            e.preventDefault();
                            addTag(newTag);
                          }
                        }}
                        className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">แท็กแนะนำ:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={
                          reviewTags.includes(tag) || reviewTags.length >= 5
                        }
                        className={`text-xs px-3 py-1.5 rounded-full ${
                          reviewTags.includes(tag) || reviewTags.length >= 5
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>

            {/* ปุ่มส่งรีวิว */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    กำลังส่งรีวิว...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> ส่งรีวิว
                  </>
                )}
              </button>
            </div>

            {/* คำแนะนำในการเขียนรีวิว */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <h4 className="font-medium flex items-center">
                <FaInfoCircle className="mr-2" />{" "}
                เคล็ดลับการเขียนรีวิวที่มีประโยชน์
              </h4>
              <ul className="mt-2 space-y-1 list-disc list-inside ml-5">
                <li>เล่าประสบการณ์ของคุณเกี่ยวกับอาหาร บริการ และบรรยากาศ</li>
                <li>ระบุเมนูที่คุณชอบหรือไม่ชอบพร้อมเหตุผล</li>
                <li>แชร์รูปภาพที่ชัดเจนเพื่อแสดงให้เห็นอาหารจริง</li>
                <li>เขียนอย่างตรงไปตรงมาและให้รายละเอียดที่เป็นประโยชน์</li>
              </ul>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default WriteReviewPage;
