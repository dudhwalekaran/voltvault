import { FaSearch } from "react-icons/fa";

export default function User () {
    return (
        <>
        <h1 className="font-bold text-4xl mb-4">User's Requests for changes in data</h1>

        <div className="flex items-center space-x-10 mb-2">
          <div className="relative w-[77%]">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch className="w-4 h-4 ml-5" />
            </span>
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium"
            />
          </div>

          {/* Operation Type and Dropdown */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <p className="font-normal text-lg">Status:</p>
              <select className="border border-[#3B82F6] text-sm font-normal rounded-md bg-[#Fff] px-4 py-2">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        </>
    );
}