import {
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaBuilding,
  FaUserLock,
  FaCheck,
  FaUserShield,
  FaUsersCog,
  FaUserTag,
  FaDoorClosed,
} from "react-icons/fa"; // Added new icons
import { IoHome } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="menu w-52 h-screen bg-red-900 text-white flex flex-col overflow-y-auto">
      <div className="user-info p-4 flex items-center border-b border-white">
        <div className="icon-container flex items-center justify-center mr-4">
          <FaUser className="text-3xl text-red-900" />
        </div>
        <div className="user-details flex flex-col">
          <h2 className="text-lg">User</h2>
          <p className="text-md text-gray-400">User</p>
        </div>
      </div>

      <div className="controls flex flex-col flex-grow">
        <ul className="menu flex-grow">
          <Link
            to={"/main/choose-room"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <IoHome className="mr-2 text-lg" /> Home
          </Link>

          <Link
            to={"/main/booking-history"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaClipboardList className="mr-2 text-lg" /> Booking History
          </Link>

          <Link
            to={"/main/manage-room"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaDoorClosed className="mr-2 text-lg" /> Manage Room
          </Link>

          <Link
            to={"/main/manage-building"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaBuilding className="mr-2 text-lg" /> Manage Building
          </Link>

          <Link
            to={"/main/manage-floor"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaBuilding className="mr-2 text-lg" /> Manage Floor
          </Link>

          <Link
            to={"/main/manage-user"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaUsersCog className="mr-2 text-lg" /> Manage User
          </Link>

          <Link
            to={"/main/unlock-user"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaUserLock className="mr-2 text-lg" /> Unlock User
          </Link>

          <Link
            to={"/main/approve-booking"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaCheck className="mr-2 text-lg" /> Approve Booking
          </Link>

          <Link
            to={"/main/manage-permission"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaUserShield className="mr-2 text-lg" /> Manage Permission
          </Link>

          <Link
            to={"/main/manage-department"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaUsersCog className="mr-2 text-lg" /> Manage Department
          </Link>

          <Link
            to={"/main/manage-position"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <FaUserTag className="mr-2 text-lg" /> Manage Position
          </Link>

          <Link
            to={"/main/report"}
            className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-md"
          >
            <BiSolidReport className="mr-2 text-lg" /> Report
          </Link>
        </ul>
        <button className="logout-btn flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-950 text-lg w-full mt-auto">
          <FaSignOutAlt className="mr-2 text-lg" />
          <Link to={"/"}> Logout</Link>
        </button>
      </div>
    </div>
  );
};

export default Menu;
