"use client"
import BookFlip from "@/components/BookFlip";
import Heart from "@/components/Heart";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(0)
  return (
      <>
      <Heart setOpen={setOpen} open={open}/>
      {open? <BookFlip/> : ""}
      </>
  );
}
