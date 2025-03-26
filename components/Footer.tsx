import Image from "next/image";
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a
              href="#"
              className="hover:text-amber-400 transition duration-300"
            >
              หน้าหลัก
            </a>
            <a
              href="#about"
              className="hover:text-amber-400 transition duration-300"
            >
              เกี่ยวกับเรา
            </a>
            <a
              href="#menu"
              className="hover:text-amber-400 transition duration-300"
            >
              เมนู
            </a>
            <a
              href="#reservation"
              className="hover:text-amber-400 transition duration-300"
            >
              จองโต๊ะ
            </a>
            <a
              href="#contact"
              className="hover:text-amber-400 transition duration-300"
            >
              ติดต่อ
            </a>
          </div>
          <div className="mt-4 md:mt-0 text-sm">
            &copy; {new Date().getFullYear()} ร้านอาหารกรุงเทพ. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
