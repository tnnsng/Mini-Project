import { FaStore, FaUser, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"; // Added Logout icon

const Menu = () => {
  return (
    <div className="dashboard w-52 h-screen bg-red-900 text-white flex flex-col overflow-y-auto">
      <div className="user-info p-4 flex items-center border-b border-white">
        <div className="icon-container flex items-center justify-center mr-4">
          {/* Container for the icon */}
          <FaUser className="text-3xl text-red-900" /> {/* User icon */}
        </div>
        <div className="user-details flex flex-col">
          <h2 className="text-lg">User</h2>
          <p className="text-md text-gray-400">User</p>
        </div>
      </div>

      <div className="controls flex flex-col flex-grow">
        <ul className="menu flex-grow">
          <div className="menu-item flex items-center justify-start pl-4 p-3 cursor-pointer hover:bg-red-800 text-md">
            <FaStore className="mr-2" /> หน้าหลัก
          </div>

          <div className="menu-item flex items-center justify-start pl-4 p-3 cursor-pointer hover:bg-red-800 text-md">
            <FaCalendarAlt className="mr-2" /> จองห้อง
            {/* Changed icon and label */}
          </div>
        </ul>
        <button className="logout-btn flex items-center justify-start pl-4 p-3 cursor-pointer hover:bg-red-800 text-md w-full  mt-auto">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
