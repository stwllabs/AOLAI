"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCamera, FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoFastFoodSharp } from "react-icons/io5";

const navItems = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/chat", label: "Chat", icon: FaMessage },
  { href: "/lifestyle", label: "Lifestyle Predictor", icon: IoFastFoodSharp },
  { href: "/scan", label: "Food Scanner", icon: FaCamera },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-[#081633] sticky top-0 z-50 h-16 shadow-lg flex justify-center items-center px-6">
      <div className="flex gap-6 md:gap-10">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="group flex flex-col items-center text-white relative"
            >
              <Icon
                className={`text-xl transition-colors duration-200 ${
                  isActive
                    ? "text-[#FBF0DF]"
                    : "text-gray-200 group-hover:text-[#FBF0DF]"
                }`}
              />
              <span
                className={`text-sm font-bold transition-colors duration-200 ${
                  isActive
                    ? "text-[#FBF0DF]"
                    : "text-gray-200 group-hover:text-[#FBF0DF]"
                }`}
              >
                {label}
              </span>

              {/*underline active*/}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FBF0DF] rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
