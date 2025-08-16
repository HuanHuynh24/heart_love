"use client";
import a1 from "@/images/a1.jpeg";
import a2 from "@/images/a2.jpg";
import a3 from "@/images/a3.jpg";
import a4 from "@/images/a4.jpg";
import a5 from "@/images/a5.jpg";
import a6 from "@/images/a6.jpg";
import a7 from "@/images/a7.jpg";

import React from "react";
import HTMLFlipBook from "react-pageflip";

export default function BookFlip() {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <HTMLFlipBook
        width={200} // rộng 1 trang
        height={300} // cao 1 trang
        size="fixed" // giữ nguyên kích thước, không tự co giãn
        minWidth={200}
        maxWidth={200}
        minHeight={250}
        maxHeight={300}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
         usePortrait={true} 
        className="shadow-lg"
      >
        <div className="bg-pink-800 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-2xl font-bold text-white">Ngô Thị Thu Nguyệt</h1>
          <p className="text-white mt-2 text-sm">Bấm vô đây</p>
        </div>
        <div className="bg-white flex justify-center items-center h-full text-xl font-bold">
          <img alt="" className="h-full" src={a1.src} />
        </div>
        <div className="bg-yellow-100 flex justify-center items-center h-full">
          <img alt="" className="h-full" src={a2.src} />
        </div>
        <div className="bg-pink-100 flex justify-center items-center h-full">
          <img alt="" className="h-full" src={a3.src} />
        </div>
        <div className="bg-pink-100 flex justify-center items-center h-full">
            Hi Thu Nguyệt
        </div>
        <div className="bg-pink-100 flex justify-center items-center h-full">
          <img alt="" className="h-full" src={a3.src} />
        </div>
        <div className="bg-pink-100 flex justify-center items-center h-full">
            Quýnh lộn không?
        </div>
        <div className="bg-green-100 flex justify-center items-center h-full">
          <img alt="" className="h-full" src={a4.src} />
        </div>
        <div className="bg-pink-100 flex justify-center items-center h-full">
            Chấp kkk
        </div>
        <div className="bg-blue-100 flex justify-center items-center h-full">
          <img alt="" className="h-full" src={a5.src} />
        </div>
        <div className="bg-white flex justify-center items-center h-full text-xl font-bold">
          <img alt="" className="h-full" src={a6.src} />
        </div>
        <div className="bg-white flex justify-center items-center h-full text-xl font-bold">
          <img alt="" className="h-full" src={a7.src} />
        </div>
      </HTMLFlipBook>
    </div>
  );
}
