"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRegThumbsUp,
  FaCamera,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaUser,
  FaSort,
  FaThumbsUp,
  FaUtensils,
  FaCheck,
  // FaChevronRight,
} from "react-icons/fa";

// ประเภทข้อมูลรีวิว
type Review = {
  id: string;
  author: {
    name: string;
    image: string;
    reviewCount: number;
    isVerified: boolean;
  };
  rating: number;
  date: string;
  content: string;
  images: string[];
  dishes: {
    id: string;
    name: string;
    rating: number;
  }[];
  likes: number;
  isLiked: boolean;
  isFavorite: boolean;
  tags: string[];
};

// ประเภทข้อมูลเมนู
type MenuItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  description?: string;
  tags: string[];
};

const ReviewsPage = () => {
  const router = useRouter();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const dish = searchParams.get("dish");
  // สถานะสำหรับการค้นหาและกรอง
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "likes">("recent");
  const [showImageOnly, setShowImageOnly] = useState(false);

  // สถานะสำหรับการแสดงผล
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState<{
    name: string;
    rating: number;
    reviewCount: number;
    ratingBreakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [popularDishes, setPopularDishes] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  // สถานะสำหรับการแสดงรายละเอียดรีวิว
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // โหลดข้อมูล
  useEffect(() => {
    const loadReviewsData = async () => {
      setIsLoading(true);
      try {
        // จำลองการเรียก API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ข้อมูลร้านอาหารตัวอย่าง
        const dummyRestaurantInfo = {
          name: "ร้านอาหารกรุงเทพ",
          rating: 4.7,
          reviewCount: 458,
          ratingBreakdown: {
            5: 312,
            4: 102,
            3: 28,
            2: 10,
            1: 6,
          },
        };

        // ข้อมูลหมวดหมู่อาหาร
        const dummyCategories = [
          { id: "appetizers", name: "อาหารเรียกน้ำย่อย" },
          { id: "main-dishes", name: "อาหารจานหลัก" },
          { id: "pasta", name: "พาสต้า" },
          { id: "grilled", name: "อาหารย่าง" },
          { id: "seafood", name: "อาหารทะเล" },
          { id: "soups", name: "ซุป" },
          { id: "salads", name: "สลัด" },
          { id: "desserts", name: "ของหวาน" },
          { id: "beverages", name: "เครื่องดื่ม" },
        ];

        // ข้อมูลเมนูยอดนิยม
        const dummyPopularDishes = [
          {
            id: "dish-1",
            name: "สเต็กเนื้อวากิว",
            category: "grilled",
            image: "/images/menu/wagyu-steak.jpg",
            rating: 4.9,
            reviewCount: 128,
            price: 1290,
            tags: ["premium", "signature", "beef"],
          },
          {
            id: "dish-2",
            name: "พาสต้าทรัฟเฟิล",
            category: "pasta",
            image: "/images/menu/truffle-pasta.jpg",
            rating: 4.8,
            reviewCount: 76,
            price: 320,
            tags: ["vegetarian", "truffle"],
          },
          {
            id: "dish-3",
            name: "ต้มยำกุ้ง",
            category: "soups",
            image: "/images/menu/tom-yum-goong.jpg",
            rating: 4.8,
            reviewCount: 112,
            price: 350,
            tags: ["spicy", "thai", "signature", "soup"],
          },
          {
            id: "dish-4",
            name: "ซีซาร์สลัด",
            category: "salads",
            image: "/images/menu/caesar-salad.jpg",
            rating: 4.7,
            reviewCount: 95,
            price: 350,
            tags: ["popular", "healthy"],
          },
        ];

        // ข้อมูลรีวิวตัวอย่าง
        const dummyReviews = [
          {
            id: "review-1",
            author: {
              name: "คุณสมชาย",
              image: "/images/avatars/user-1.jpg",
              reviewCount: 15,
              isVerified: true,
            },
            rating: 5,
            date: "2025-03-15",
            content:
              "อาหารอร่อยมาก บริการดีเยี่ยม โดยเฉพาะสเต็กเนื้อวากิว เนื้อนุ่มมากๆ ละลายในปาก ซอสสูตรพิเศษเข้ากันดีกับเนื้อ บรรยากาศของร้านก็ดี เหมาะกับการไปทานกับครอบครัวหรือคนพิเศษ แนะนำให้มาลองครับ",
            images: [
              "/images/reviews/review-1-1.jpg",
              "/images/reviews/review-1-2.jpg",
            ],
            dishes: [
              { id: "dish-1", name: "สเต็กเนื้อวากิว", rating: 5 },
              { id: "dish-7", name: "ช็อกโกแลตลาวา", rating: 4 },
            ],
            likes: 42,
            isLiked: false,
            isFavorite: true,
            tags: ["dinner", "special occasion"],
          },
          {
            id: "review-2",
            author: {
              name: "คุณนภา",
              image: "/images/avatars/user-2.jpg",
              reviewCount: 28,
              isVerified: true,
            },
            rating: 4.5,
            date: "2025-03-10",
            content:
              "พาสต้าทรัฟเฟิลเห็ดรวมอร่อยมาก กลิ่นหอมของทรัฟเฟิลชัดเจน ครีมซอสไม่เลี่ยนเกินไป แต่ว่าราคาค่อนข้างสูงนิดนึงสำหรับพาสต้า แต่โดยรวมก็คุ้มค่า บรรยากาศร้านดี พนักงานบริการดี จะกลับมาอีกครั้งแน่นอน",
            images: ["/images/reviews/review-2-1.jpg"],
            dishes: [
              { id: "dish-2", name: "พาสต้าทรัฟเฟิล", rating: 5 },
              { id: "dish-10", name: "มอคเทลผลไม้รวม", rating: 4 },
            ],
            likes: 35,
            isLiked: true,
            isFavorite: false,
            tags: ["lunch", "pasta"],
          },
          {
            id: "review-3",
            author: {
              name: "คุณวิชัย",
              image: "/images/avatars/user-3.jpg",
              reviewCount: 7,
              isVerified: false,
            },
            rating: 3,
            date: "2025-03-05",
            content:
              "อาหารรสชาติดี แต่รอนานมาก เกือบชั่วโมงกว่าอาหารจะมา บริการยังต้องปรับปรุง พนักงานดูวุ่นวาย โต๊ะข้างๆ สั่งทีหลังแต่ได้อาหารก่อน สเต็กที่สั่งเป็น Medium แต่ได้มาเป็น Well done ไม่เป็นไปตามที่สั่ง",
            images: [],
            dishes: [
              { id: "dish-1", name: "สเต็กเนื้อวากิว", rating: 3 },
              { id: "dish-9", name: "สปาเกตตี้ซีฟู้ด", rating: 4 },
            ],
            likes: 12,
            isLiked: false,
            isFavorite: false,
            tags: ["dinner", "service issues"],
          },
          {
            id: "review-4",
            author: {
              name: "คุณพิมพ์",
              image: "/images/avatars/user-4.jpg",
              reviewCount: 32,
              isVerified: true,
            },
            rating: 5,
            date: "2025-03-01",
            content:
              "ต้มยำกุ้งที่นี่อร่อยมาก รสชาติจัดจ้าน เปรี้ยว หวาน เผ็ด กลมกล่อม กุ้งแม่น้ำตัวใหญ่สดมาก เห็ดและผักในต้มยำก็กรอบอร่อย น้ำซุปหอมสมุนไพร ทานคู่กับข้าวสวยร้อนๆ ฟินมาก ต้องกลับมาลองเมนูอื่นอีกแน่นอน",
            images: [
              "/images/reviews/review-4-1.jpg",
              "/images/reviews/review-4-2.jpg",
              "/images/reviews/review-4-3.jpg",
            ],
            dishes: [{ id: "dish-3", name: "ต้มยำกุ้ง", rating: 5 }],
            likes: 56,
            isLiked: true,
            isFavorite: true,
            tags: ["lunch", "thai food", "spicy"],
          },
          {
            id: "review-5",
            author: {
              name: "คุณประเสริฐ",
              image: "/images/avatars/user-5.jpg",
              reviewCount: 4,
              isVerified: false,
            },
            rating: 4,
            date: "2025-02-25",
            content:
              "ซีซาร์สลัดกุ้งย่างอร่อย กุ้งสดใหม่ สลัดกรอบ น้ำสลัดรสชาติดี ทานเป็นของทานเล่นก่อนมื้ออาหารได้ดีมาก แต่ราคาค่อนข้างสูงสำหรับสลัดจานเดียว",
            images: ["/images/reviews/review-5-1.jpg"],
            dishes: [{ id: "dish-4", name: "ซีซาร์สลัด", rating: 4 }],
            likes: 19,
            isLiked: false,
            isFavorite: false,
            tags: ["appetizer", "salad"],
          },
        ];

        // กำหนดข้อมูลตามพารามิเตอร์ URL ถ้ามี
        if (category) {
          setSelectedCategories([category as string]);
        }

        setRestaurantInfo(dummyRestaurantInfo);
        setCategories(dummyCategories);
        setPopularDishes(dummyPopularDishes);
        setReviews(dummyReviews);
      } catch (error) {
        console.error("Error loading reviews data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewsData();
  }, [category, dish]);

  // ฟังก์ชันสำหรับกรองรีวิว
  const filteredReviews = reviews.filter((review) => {
    // กรองตามคำค้นหา
    const matchesSearch =
      searchTerm === "" ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.dishes.some((dish) =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      review.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // กรองตามคะแนน
    const matchesRating =
      selectedRating === null || Math.floor(review.rating) === selectedRating;

    // กรองตามหมวดหมู่
    const matchesCategory =
      selectedCategories.length === 0 ||
      review.dishes.some((dish) => {
        const matchedDish = popularDishes.find((pd) => pd.id === dish.id);
        return matchedDish && selectedCategories.includes(matchedDish.category);
      });

    // กรองตามรูปภาพ
    const matchesImage = !showImageOnly || review.images.length > 0;

    return matchesSearch && matchesRating && matchesCategory && matchesImage;
  });

  // เรียงลำดับรีวิว
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return b.likes - a.likes;
    }
  });

  // ฟังก์ชันสำหรับจัดการการกดถูกใจรีวิว
  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            isLiked: !review.isLiked,
          };
        }
        return review;
      })
    );
  };

  // ฟังก์ชันสำหรับจัดการการบันทึกรีวิว
  const handleFavoriteReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            isFavorite: !review.isFavorite,
          };
        }
        return review;
      })
    );
  };

  // ฟังก์ชันสำหรับแสดงดาวตามคะแนน
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-500" />);
    }

    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-500" />);
    }

    return stars;
  };

  // แสดงเปอร์เซ็นต์ของคะแนนรีวิวแต่ละระดับ
  const calculateRatingPercentage = (rating: number) => {
    if (!restaurantInfo) return 0;
    return Math.round(
      (restaurantInfo.ratingBreakdown[
        rating as keyof typeof restaurantInfo.ratingBreakdown
      ] /
        restaurantInfo.reviewCount) *
        100
    );
  };

  // ฟอร์แมตวันที่
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  // สลับหมวดหมู่การกรอง
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดรีวิว...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header/Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-amber-600 hover:text-amber-700 flex items-center"
                >
                  <FaChevronLeft className="mr-2" /> กลับไปหน้าหลัก
                </Link>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                รีวิวจากลูกค้า
              </h1>
              <div className="w-20"></div> {/* สำหรับการจัดตำแหน่งกลาง */}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ส่วนภาพรวมร้านและคะแนน */}
          {restaurantInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {restaurantInfo.name}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-amber-600 mr-2">
                        {restaurantInfo.rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {renderStars(restaurantInfo.rating)}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-600">
                      ({restaurantInfo.reviewCount} รีวิว)
                    </span>
                  </div>
                  <Link
                    href="/write-review"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                  >
                    <FaCamera className="mr-2" /> เขียนรีวิว
                  </Link>
                </div>

                <div className="w-full md:w-auto md:min-w-[280px]">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    คะแนนรีวิวทั้งหมด
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setSelectedRating(
                            selectedRating === rating ? null : rating
                          )
                        }
                        className="w-full flex items-center hover:bg-gray-50 py-1 rounded"
                      >
                        <div className="flex items-center w-20">
                          <span className="mr-1">{rating}</span>
                          <FaStar className="text-amber-500" />
                        </div>
                        <div className="flex-grow mx-2">
                          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{
                                width: `${calculateRatingPercentage(rating)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-600">
                          {calculateRatingPercentage(rating)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ส่วนกรองและค้นหา */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหารีวิวหรือเมนู..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="mr-2 text-gray-500" />
                  <span>ตัวกรอง</span>
                  <FaChevronDown
                    className={`ml-2 transition-transform ${
                      showFilters ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      document
                        .getElementById("sortDropdown")
                        ?.classList.toggle("hidden")
                    }
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaSort className="mr-2 text-gray-500" />
                    <span>เรียงตาม</span>
                    <FaChevronDown className="ml-2" />
                  </button>

                  <div
                    id="sortDropdown"
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <button
                      onClick={() => {
                        setSortBy("recent");
                        document
                          .getElementById("sortDropdown")
                          ?.classList.add("hidden");
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "recent"
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      ล่าสุด
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("rating");
                        document
                          .getElementById("sortDropdown")
                          ?.classList.add("hidden");
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "rating"
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      คะแนนสูงสุด
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("likes");
                        document
                          .getElementById("sortDropdown")
                          ?.classList.add("hidden");
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "likes"
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      ยอดนิยม
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      หมวดหมู่อาหาร
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            selectedCategories.includes(category.id)
                              ? "bg-amber-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      ตัวกรองเพิ่มเติม
                    </h4>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showImageOnly}
                          onChange={() => setShowImageOnly(!showImageOnly)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          แสดงเฉพาะรีวิวที่มีรูปภาพ
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRating(null);
                      setSelectedCategories([]);
                      setShowImageOnly(false);
                      setSortBy("recent");
                    }}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* เมนูยอดนิยม */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              เมนูยอดนิยม
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/reviews?dish=${dish.id}`)}
                >
                  <div className="relative h-40 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 truncate">
                    {dish.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">{renderStars(dish.rating)}</div>
                    <span className="ml-1 text-xs text-gray-600">
                      ({dish.reviewCount})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* รายการรีวิว */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                รีวิวทั้งหมด ({sortedReviews.length})
              </h3>
            </div>

            {sortedReviews.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <FaUtensils className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ไม่พบรีวิว
                </h3>
                <p className="text-gray-600 mb-4">
                  ไม่พบรีวิวตามเงื่อนไขที่คุณเลือก
                  ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRating(null);
                    setSelectedCategories([]);
                    setShowImageOnly(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedReviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-6 ${
                      expandedReview === review.id
                        ? "bg-amber-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* ส่วนหัวของรีวิว */}
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <Image
                            src={review.author.image}
                            alt={review.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">
                              {review.author.name}
                            </h4>
                            {review.author.isVerified && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <FaCheck className="h-2.5 w-2.5 mr-1" />{" "}
                                ลูกค้าที่ยืนยันแล้ว
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFavoriteReview(review.id)}
                          className="text-gray-400 hover:text-amber-500"
                        >
                          {review.isFavorite ? (
                            <FaHeart className="h-5 w-5 text-red-500" />
                          ) : (
                            <FaRegHeart className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            setExpandedReview(
                              expandedReview === review.id ? null : review.id
                            )
                          }
                        >
                          <FaEllipsisH className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* เนื้อหารีวิว */}
                    <div className="mt-4">
                      <p
                        className={`text-gray-700 ${
                          expandedReview === review.id ? "" : "line-clamp-3"
                        }`}
                      >
                        {review.content}
                      </p>
                      {!expandedReview && review.content.length > 250 && (
                        <button
                          onClick={() => setExpandedReview(review.id)}
                          className="mt-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          อ่านเพิ่มเติม
                        </button>
                      )}
                    </div>

                    {/* รูปภาพประกอบรีวิว */}
                    {review.images.length > 0 && (
                      <div className="mt-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden relative"
                            >
                              <Image
                                src={image}
                                alt={`รีวิวภาพที่ ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* รายการเมนูที่รีวิว */}
                    {review.dishes.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          เมนูที่รีวิว
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {review.dishes.map((dish) => (
                            <div
                              key={dish.id}
                              className="bg-gray-100 px-3 py-1.5 rounded-full"
                            >
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">
                                  {dish.name}
                                </span>
                                <div className="ml-1.5 flex items-center">
                                  <FaStar className="h-3 w-3 text-amber-500" />
                                  <span className="ml-0.5 text-xs">
                                    {dish.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* แท็กและการตอบสนอง */}
                    <div className="mt-4 flex flex-wrap justify-between items-center">
                      {review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {review.tags.map((tag, index) => (
                            <span key={index} className="text-xs text-gray-500">
                              #{tag}
                              {index < review.tags.length - 1 ? " " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center ${
                          review.isLiked
                            ? "text-amber-600"
                            : "text-gray-600 hover:text-amber-600"
                        }`}
                      >
                        {review.isLiked ? (
                          <FaThumbsUp className="h-4 w-4 mr-1.5" />
                        ) : (
                          <FaRegThumbsUp className="h-4 w-4 mr-1.5" />
                        )}
                        <span>{review.likes} คนชอบรีวิวนี้</span>
                      </button>
                    </div>

                    {/* เมนูที่ขยายเพิ่มเติม */}
                    {expandedReview === review.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Link
                              href="/user-profile"
                              className="flex items-center text-amber-600 hover:text-amber-700"
                            >
                              <FaUser className="mr-1.5 h-4 w-4" />
                              ดูโปรไฟล์ {review.author.name}
                            </Link>
                          </div>
                          <div>
                            <button
                              className="text-gray-600 hover:text-gray-800"
                              onClick={() => setExpandedReview(null)}
                            >
                              ย่อรีวิว
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ปุ่มเขียนรีวิวด้านล่าง */}
          <div className="fixed bottom-6 right-6">
            <Link
              href="/write-review"
              className="bg-amber-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors"
            >
              <FaCamera className="h-6 w-6" />
            </Link>
          </div>
        </main>

        {/* เชิญชวนให้ล็อกอินเพื่อเขียนรีวิว - แสดงสำหรับผู้ใช้ที่ไม่ได้ล็อกอิน */}
        <div className="bg-amber-50 border-t border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900">
                  คุณเคยมาที่ร้านอาหารกรุงเทพหรือไม่?
                </h3>
                <p className="text-gray-600">
                  เข้าสู่ระบบเพื่อเขียนรีวิวและแบ่งปันประสบการณ์ของคุณ
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
