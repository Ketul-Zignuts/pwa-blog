'use client'
import Navbar from "@/@layouts/components/horizontal/Navbar";
import NavbarContent from "@/components/layout/horizontal/NavbarContent";
import { useAppSelector } from "@/store"
import React from "react";

export default function Page() {
  const user = useAppSelector((state) => state.auth)
  console.log('user: ', user);

  return (
    <div className="px-2">
      <Navbar>
        <NavbarContent />
      </Navbar>
      {Array.from({ length: 200 }).map((_, index) => (
  <h1 key={index}>Scroll Test</h1>
))}
    </div>
  )
}
