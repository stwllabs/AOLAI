import Link from 'next/link'
import React from 'react'
import { FaCamera, FaHome } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import { IoFastFoodSharp } from 'react-icons/io5'

const Navbar = () => {
  return (
    <div className="bg-blue-900 h-14 shadow-lg flex justify-center items-center px-8">
        <div className="flex gap-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition"
            >
              <FaHome color="#081633"/>
              <span className="text-black font-semibold">Home</span>
            </Link>
          </div>
          <div>
            <Link
              href="/chat"
              className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition"
            >
              <FaMessage color="#081633"/>
              <span className="text-black font-semibold">Chat</span>
            </Link>
          </div>
          <div>
            <Link
              href="/lifestyle"
              className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition"
            >
              <IoFastFoodSharp color="#081633"/>
              <span className="text-black font-semibold">Lifestyle Predictor</span>
            </Link>
          </div>
          <div>
            <Link
              href="/scan"
              className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow hover:bg-blue-300 transition"
            >
              <FaCamera color="#081633"/>
              <span className="text-black font-semibold">Food Scanner</span>
            </Link>
          </div>
        </div>
      </div>
  )
}

export default Navbar