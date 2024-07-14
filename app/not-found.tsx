import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { Navbar } from "@/components";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center justify-center text-blue-500 text-[10vw] md:text-[5rem] lg:text-[8rem]">
          404 Not Found
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-row justify-center items-center gap-2 text-lg">
            Ask Question{" "}
            <Link href="/questions/add">
              <FaPlus className="text-blue-400 text-xl hover:text-blue-600 hover:scale-125" />
            </Link>
          </div>
          <div className="mx-3 scale-[2.0]">|</div>
          <div className="flex flex-row justify-center items-center gap-2 text-lg">
            Contribute to Question{" "}
            <Link href="/">
              <FaHome className="text-blue-400 text-xl hover:text-blue-600 hover:scale-125" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
