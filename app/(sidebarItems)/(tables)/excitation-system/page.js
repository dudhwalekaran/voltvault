import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from 'next/link';

export default function Excitation() {
  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Excitation System</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[77%]">
          <span className="absolute left-2 top-1/3 transform  text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/excitation-system/create"><button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
          <span>Create Excitation System</span>
          <FaPlus />
        </button>
        </Link>
      </div>
    </div>
  );
}
