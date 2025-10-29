"use client";
import { useEffect, useState } from "react";
import Navbar from "./_components/navbar";
import axios from "axios";

export default function Home() {
  const [hello, setHello] = useState<String>();

  useEffect(() => {
    axios.get('http://localhost:4000/').then(function (response) {
      setHello(response.data)
    });

  }, [])

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="text-black">{hello}</div>
      {/* <Link href={"/login"} className="text-amber-950" >MediGuide AI</Link> */}
    </div>
  );
}
