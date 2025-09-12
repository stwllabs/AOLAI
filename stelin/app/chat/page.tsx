import Image from "next/image";
import Link from "next/link";
import Navbar from "../_components/navbar";

export default function Chat() {
  return (
    <div className="min-h-screen bg-blue-50">

      <Navbar />
      <div className="flex items-center">
        <Link href={"/"} className="text-black" >Medi Chat</Link>

      </div>

    </div>
  );
}
