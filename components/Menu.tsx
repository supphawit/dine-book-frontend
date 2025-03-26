"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  FaChevronLeft,
  FaSearch,
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaLeaf,
  FaFire,
  FaTimes,
  FaAngleDown,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";

// ประเภทข้อมูลเมนู
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subCategory?: string;
  tags: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isRecommended: boolean;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

// ประเภทข้อมูลหมวดหมู่
type Category = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

const MenuPage = () => {
  const searchParams = useSearchParams();
  const queryCategoryId = searchParams.get("categoryId");

  // สถานะสำหรับการค้นหาและกรอง
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<{
    vegetarian: boolean;
    spicy: boolean;
  }>({
    vegetarian: false,
    spicy: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ข้อมูลหมวดหมู่ (ในระบบจริงจะดึงจาก API)
  const [categories] = useState<Category[]>([
    {
      id: "appetizers",
      name: "อาหารเรียกน้ำย่อย",
      image: "/images/menu/categories/appetizers.jpg",
    },
    {
      id: "main-dishes",
      name: "อาหารจานหลัก",
      image: "/images/menu/categories/main-dishes.jpg",
    },
    { id: "pasta", name: "พาสต้า", image: "/images/menu/categories/pasta.jpg" },
    {
      id: "grilled",
      name: "อาหารย่าง",
      image: "/images/menu/categories/grilled.jpg",
    },
    {
      id: "seafood",
      name: "อาหารทะเล",
      image: "/images/menu/categories/seafood.jpg",
    },
    { id: "soups", name: "ซุป", image: "/images/menu/categories/soups.jpg" },
    { id: "salads", name: "สลัด", image: "/images/menu/categories/salads.jpg" },
    {
      id: "desserts",
      name: "ของหวาน",
      image: "/images/menu/categories/desserts.jpg",
    },
    {
      id: "beverages",
      name: "เครื่องดื่ม",
      image: "/images/menu/categories/beverages.jpg",
    },
  ]);

  // ข้อมูลเมนู (ในระบบจริงจะดึงจาก API)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // โหลดข้อมูลเมนู
  useEffect(() => {
    const loadMenuItems = async () => {
      setIsLoading(true);
      try {
        // จำลองการเรียก API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ข้อมูลเมนูตัวอย่าง
        const dummyMenuItems: MenuItem[] = [
          {
            id: "item-1",
            name: "สเต็กเนื้อวากิว A5",
            description:
              "เนื้อวากิวระดับพรีเมียมจากญี่ปุ่น ย่างระดับมีเดียม-แรร์ เสิร์ฟพร้อมซอสย่างสูตรพิเศษและผักย่าง",
            price: 1290,
            image: "/images/menu/wagyu-steak.jpg",
            category: "grilled",
            tags: ["premium", "signature", "beef"],
            isVegetarian: false,
            isSpicy: false,
            isRecommended: true,
            rating: 4.9,
            reviewCount: 128,
            isFavorite: false,
            allergens: ["beef"],
          },
          {
            id: "item-2",
            name: "ซีซาร์สลัดกุ้งย่าง",
            description:
              "สลัดซีซาร์สูตรดั้งเดิม โรยด้วยพาร์เมซานชีสและเบคอนกรอบ เสิร์ฟพร้อมกุ้งย่างขนาดใหญ่",
            price: 350,
            image: "/images/menu/caesar-salad.jpg",
            category: "salads",
            tags: ["popular", "shrimp"],
            isVegetarian: false,
            isSpicy: false,
            isRecommended: true,
            rating: 4.7,
            reviewCount: 95,
            isFavorite: true,
            allergens: ["gluten", "seafood", "dairy", "egg"],
          },
          {
            id: "item-3",
            name: "พาสต้าทรัฟเฟิลเห็ดรวม",
            description:
              "พาสต้าเส้นสด ผัดกับเห็ดหอมและเห็ดทรัฟเฟิล ในครีมซอสรสชาติเข้มข้น โรยด้วยพาร์เมซานชีส",
            price: 320,
            image: "/images/menu/truffle-pasta.jpg",
            category: "pasta",
            tags: ["vegetarian", "truffle"],
            isVegetarian: true,
            isSpicy: false,
            isRecommended: false,
            rating: 4.8,
            reviewCount: 76,
            isFavorite: false,
            allergens: ["gluten", "dairy", "egg"],
          },
          {
            id: "item-4",
            name: "ทาร์ตาร์ทูน่า",
            description:
              "ทูน่าสดชิ้นหนาคลุกกับซอสทาร์ทาร์ อโวคาโด และเครื่องเทศ เสิร์ฟพร้อมขนมปังกรอบ",
            price: 290,
            image: "/images/menu/tuna-tartar.jpg",
            category: "appetizers",
            tags: ["raw", "seafood"],
            isVegetarian: false,
            isSpicy: false,
            isRecommended: false,
            rating: 4.6,
            reviewCount: 52,
            isFavorite: false,
            allergens: ["seafood", "gluten"],
          },
          {
            id: "item-5",
            name: "พิซซ่ามาร์เกริต้า",
            description:
              "พิซซ่าสไตล์นาโปลีแท้ แป้งบางกรอบ ซอสมะเขือเทศสด มอซซาเรลล่าชีส และใบโหระพาสด",
            price: 280,
            image: "/images/menu/margherita-pizza.jpg",
            category: "main-dishes",
            tags: ["vegetarian", "classic", "pizza"],
            isVegetarian: true,
            isSpicy: false,
            isRecommended: true,
            rating: 4.7,
            reviewCount: 104,
            isFavorite: true,
            allergens: ["gluten", "dairy"],
          },
          {
            id: "item-6",
            name: "ลาบปลาแซลมอน",
            description:
              "ปลาแซลมอนสดหั่นชิ้นคลุกเคล้ากับเครื่องลาบรสจัด เสิร์ฟพร้อมผักสดและข้าวเหนียว",
            price: 260,
            image: "/images/menu/salmon-larb.jpg",
            category: "appetizers",
            subCategory: "thai-fusion",
            tags: ["spicy", "thai", "fusion", "raw"],
            isVegetarian: false,
            isSpicy: true,
            isRecommended: false,
            rating: 4.5,
            reviewCount: 48,
            isFavorite: false,
            allergens: ["seafood"],
          },
          {
            id: "item-7",
            name: "ช็อกโกแลตลาวา",
            description:
              "เค้กช็อกโกแลตเนื้อนุ่ม สอดไส้ช็อกโกแลตลาวาที่เมื่อตักจะไหลออกมา เสิร์ฟพร้อมไอศครีมวานิลลา",
            price: 220,
            image: "/images/menu/chocolate-lava.jpg",
            category: "desserts",
            tags: ["chocolate", "hot", "sweet"],
            isVegetarian: true,
            isSpicy: false,
            isRecommended: true,
            rating: 4.9,
            reviewCount: 135,
            isFavorite: false,
            allergens: ["dairy", "egg", "gluten"],
          },
          {
            id: "item-8",
            name: "ต้มยำกุ้ง",
            description:
              "ต้มยำกุ้งน้ำใส รสชาติเข้มข้น เปรี้ยวหวาน เผ็ดกำลังดี ใส่กุ้งแม่น้ำตัวโต เห็ดและสมุนไพรไทย",
            price: 350,
            image: "/images/menu/tom-yum-goong.jpg",
            category: "soups",
            subCategory: "thai",
            tags: ["spicy", "thai", "signature", "soup"],
            isVegetarian: false,
            isSpicy: true,
            isRecommended: true,
            rating: 4.8,
            reviewCount: 112,
            isFavorite: true,
            allergens: ["seafood"],
          },
          {
            id: "item-9",
            name: "สปาเกตตี้ซีฟู้ด",
            description:
              "สปาเกตตี้ผัดกับซีฟู้ดรวม กุ้ง หอยแมลงภู่ ปลาหมึก ในซอสมะเขือเทศรสจัด",
            price: 350,
            image: "/images/menu/seafood-spaghetti.jpg",
            category: "pasta",
            tags: ["seafood", "spicy"],
            isVegetarian: false,
            isSpicy: true,
            isRecommended: false,
            rating: 4.6,
            reviewCount: 83,
            isFavorite: false,
            allergens: ["gluten", "seafood"],
          },
          {
            id: "item-10",
            name: "มอคเทลผลไม้รวม",
            description:
              "เครื่องดื่มเย็นจากน้ำผลไม้สดคั้น ผสมน้ำเชื่อมและโซดา ตกแต่งด้วยผลไม้ตามฤดูกาล",
            price: 150,
            image: "/images/menu/fruit-mocktail.jpg",
            category: "beverages",
            tags: ["non-alcoholic", "refreshing", "sweet"],
            isVegetarian: true,
            isSpicy: false,
            isRecommended: false,
            rating: 4.5,
            reviewCount: 67,
            isFavorite: false,
            allergens: [],
          },
        ];

        setMenuItems(dummyMenuItems);

        // ตั้งค่าหมวดหมู่จาก URL ถ้ามี
        if (queryCategoryId && typeof queryCategoryId === "string") {
          setSelectedCategory(queryCategoryId);
        }
      } catch (error) {
        console.error("Error loading menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, [queryCategoryId]);

  // กรองเมนูตามเงื่อนไข
  const filteredMenuItems = menuItems.filter((item) => {
    // กรองตามคำค้นหา
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // กรองตามหมวดหมู่
    const matchesCategory =
      selectedCategory === null || item.category === selectedCategory;

    // กรองตามตัวกรองอาหาร
    const matchesDietary =
      (!dietaryFilter.vegetarian || item.isVegetarian) &&
      (!dietaryFilter.spicy || item.isSpicy);

    return matchesSearch && matchesCategory && matchesDietary;
  });

  // จัดเมนูตามหมวดหมู่
  const menuItemsByCategory = categories
    .map((category) => {
      const items = filteredMenuItems.filter(
        (item) => item.category === category.id
      );
      return {
        category,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  // สลับรายการโปรด
  const toggleFavorite = (itemId: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // สลับรายละเอียดรายการ
  const toggleItemDetails = (itemId: string) => {
    setActiveMenuItem(activeMenuItem === itemId ? null : itemId);
  };

  // แปลงข้อความแพ้อาหารเป็นภาษาไทย
  const getAllergenText = (allergen: string) => {
    switch (allergen) {
      case "gluten":
        return "กลูเตน";
      case "dairy":
        return "นม";
      case "egg":
        return "ไข่";
      case "seafood":
        return "อาหารทะเล";
      case "nuts":
        return "ถั่ว";
      case "soy":
        return "ถั่วเหลือง";
      case "beef":
        return "เนื้อวัว";
      default:
        return allergen;
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header พร้อมลิงก์กลับ */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center text-amber-600 hover:text-amber-700"
              >
                <FaChevronLeft className="mr-2" /> กลับไปหน้าหลัก
              </Link>
              <div className="text-xl font-semibold text-gray-800">
                เมนูอาหาร
              </div>
              <div className="w-24"></div>{" "}
              {/* สร้างช่องว่างเพื่อ center ข้อความกลาง */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          {/* ส่วนค้นหาและกรอง */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาเมนู..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="mr-2 text-gray-500" />
                <span>ตัวกรอง</span>
                <FaAngleDown
                  className={`ml-2 transition-transform ${
                    showFilters ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    หมวดหมู่
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        selectedCategory === null
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ทั้งหมด
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          selectedCategory === category.id
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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    ตัวเลือกพิเศษ
                  </h3>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dietaryFilter.vegetarian}
                        onChange={() =>
                          setDietaryFilter((prev) => ({
                            ...prev,
                            vegetarian: !prev.vegetarian,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      <span className="ml-2 flex items-center">
                        <FaLeaf className="text-green-500 mr-1" /> มังสวิรัติ
                      </span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dietaryFilter.spicy}
                        onChange={() =>
                          setDietaryFilter((prev) => ({
                            ...prev,
                            spicy: !prev.spicy,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      <span className="ml-2 flex items-center">
                        <FaFire className="text-red-500 mr-1" /> รสเผ็ด
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* หมวดหมู่เมนูด้านบน */}
          <div className="mb-8 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-4 pb-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex-shrink-0 cursor-pointer transition-transform transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? "ring-2 ring-amber-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.id === selectedCategory ? null : category.id
                    )
                  }
                >
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                    <Image
                      src={
                        category.image || "/images/menu/default-category.jpg"
                      }
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2">
                      <div className="text-white text-xs font-medium text-center w-full">
                        {category.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* รายการเมนู */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-gray-600">กำลังโหลดเมนู...</p>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <FaUtensils className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่พบเมนูที่ค้นหา
              </h3>
              <p className="text-gray-600 mb-6">
                ลองใช้คำค้นหาอื่น หรือเปลี่ยนตัวกรอง
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                  setDietaryFilter({ vegetarian: false, spicy: false });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaTimes className="mr-2" />
                ล้างตัวกรอง
              </button>
            </div>
          ) : selectedCategory === null ? (
            // แสดงตามหมวดหมู่
            <div className="space-y-8">
              {menuItemsByCategory.map(({ category, items }) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {category.name}
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col md:flex-row">
                          {/* รูปภาพ */}
                          <div className="md:w-40 md:h-40 h-60 rounded-lg overflow-hidden relative mb-4 md:mb-0 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.isRecommended && (
                              <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                                แนะนำ
                              </div>
                            )}
                          </div>

                          {/* ข้อมูลเมนู */}
                          <div className="md:ml-6 flex-grow">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                              >
                                {item.isFavorite ? (
                                  <FaHeart className="h-5 w-5 text-red-500" />
                                ) : (
                                  <FaRegHeart className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            <div className="flex items-center mt-1 mb-2">
                              <div className="flex items-center">
                                <FaStar className="h-4 w-4 text-amber-500" />
                                <span className="ml-1 text-sm text-gray-600">
                                  {item.rating}
                                </span>
                              </div>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-600">
                                {item.reviewCount} รีวิว
                              </span>

                              {item.isVegetarian && (
                                <>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <FaLeaf
                                    className="h-4 w-4 text-green-500"
                                    title="มังสวิรัติ"
                                  />
                                </>
                              )}

                              {item.isSpicy && (
                                <>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <FaFire
                                    className="h-4 w-4 text-red-500"
                                    title="เผ็ด"
                                  />
                                </>
                              )}
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="mt-auto flex justify-between items-center">
                              <span className="text-lg font-semibold text-amber-600">
                                {item.price.toLocaleString()} ฿
                              </span>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toggleItemDetails(item.id)}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                  รายละเอียด
                                </button>
                                <Link
                                  href={`/reservation?menuItem=${item.id}`}
                                  className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                                >
                                  จองโต๊ะ
                                </Link>
                              </div>
                            </div>

                            {/* รายละเอียดเพิ่มเติม */}
                            {activeMenuItem === item.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      ส่วนประกอบและรายละเอียด
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                      {item.description}
                                    </p>

                                    {item.tags.length > 0 && (
                                      <div className="mt-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                                          แท็ก
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                          {item.tags.map((tag) => (
                                            <span
                                              key={tag}
                                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    {item.allergens.length > 0 && (
                                      <div className="mb-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                                          ข้อควรระวังสำหรับผู้แพ้
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                          {item.allergens.map((allergen) => (
                                            <span
                                              key={allergen}
                                              className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full"
                                            >
                                              {getAllergenText(allergen)}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {item.nutritionalInfo && (
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                                          ข้อมูลโภชนาการ (โดยประมาณ)
                                        </h4>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="font-medium">
                                              {item.nutritionalInfo.calories}
                                            </div>
                                            <div className="text-gray-500">
                                              แคลอรี่
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="font-medium">
                                              {item.nutritionalInfo.protein}g
                                            </div>
                                            <div className="text-gray-500">
                                              โปรตีน
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="font-medium">
                                              {item.nutritionalInfo.carbs}g
                                            </div>
                                            <div className="text-gray-500">
                                              คาร์บ
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="font-medium">
                                              {item.nutritionalInfo.fat}g
                                            </div>
                                            <div className="text-gray-500">
                                              ไขมัน
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // แสดงเฉพาะหมวดหมู่ที่เลือก
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "เมนู"}
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row">
                      {/* รูปภาพ */}
                      <div className="md:w-40 md:h-40 h-60 rounded-lg overflow-hidden relative mb-4 md:mb-0 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isRecommended && (
                          <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                            แนะนำ
                          </div>
                        )}
                      </div>

                      {/* ข้อมูลเมนู */}
                      <div className="md:ml-6 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                          >
                            {item.isFavorite ? (
                              <FaHeart className="h-5 w-5 text-red-500" />
                            ) : (
                              <FaRegHeart className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center mt-1 mb-2">
                          <div className="flex items-center">
                            <FaStar className="h-4 w-4 text-amber-500" />
                            <span className="ml-1 text-sm text-gray-600">
                              {item.rating}
                            </span>
                          </div>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-600">
                            {item.reviewCount} รีวิว
                          </span>

                          {item.isVegetarian && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <FaLeaf
                                className="h-4 w-4 text-green-500"
                                title="มังสวิรัติ"
                              />
                            </>
                          )}

                          {item.isSpicy && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <FaFire
                                className="h-4 w-4 text-red-500"
                                title="เผ็ด"
                              />
                            </>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-lg font-semibold text-amber-600">
                            {item.price.toLocaleString()} ฿
                          </span>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleItemDetails(item.id)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              รายละเอียด
                            </button>
                            <Link
                              href={`/reservation?menuItem=${item.id}`}
                              className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                            >
                              จองโต๊ะ
                            </Link>
                          </div>
                        </div>

                        {/* รายละเอียดเพิ่มเติม */}
                        {activeMenuItem === item.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  ส่วนประกอบและรายละเอียด
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {item.description}
                                </p>

                                {item.tags.length > 0 && (
                                  <div className="mt-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      แท็ก
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {item.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                {item.allergens.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      ข้อควรระวังสำหรับผู้แพ้
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {item.allergens.map((allergen) => (
                                        <span
                                          key={allergen}
                                          className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full"
                                        >
                                          {getAllergenText(allergen)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.nutritionalInfo && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      ข้อมูลโภชนาการ (โดยประมาณ)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 text-xs">
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="font-medium">
                                          {item.nutritionalInfo.calories}
                                        </div>
                                        <div className="text-gray-500">
                                          แคลอรี่
                                        </div>
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="font-medium">
                                          {item.nutritionalInfo.protein}g
                                        </div>
                                        <div className="text-gray-500">
                                          โปรตีน
                                        </div>
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="font-medium">
                                          {item.nutritionalInfo.carbs}g
                                        </div>
                                        <div className="text-gray-500">
                                          คาร์บ
                                        </div>
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="font-medium">
                                          {item.nutritionalInfo.fat}g
                                        </div>
                                        <div className="text-gray-500">
                                          ไขมัน
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มจองโต๊ะด้านล่าง */}
        <div className="fixed bottom-6 right-6">
          <Link
            href="/reservation"
            className="bg-amber-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors"
          >
            <FaCalendarAlt className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default MenuPage;
