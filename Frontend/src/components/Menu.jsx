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
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Menu = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [positionName, setPositionName] = useState("");

  const location = useLocation(); // ใช้ location เพื่อตรวจสอบ path ปัจจุบัน

  const [selectedMenu, setSelectedMenu] = useState("");
  const handleMenuSelect = (selectedMenu) => {
    setSelectedMenu(selectedMenu);
  };

  useEffect(() => {
    const storedFname = localStorage.getItem("fname");
    const storedLname = localStorage.getItem("lname");
    const storedPositionName = localStorage.getItem("posi_name");

    if (storedFname) {
      setFname(storedFname);
    }
    if (storedLname) {
      setLname(storedLname);
    }
    if (storedPositionName) {
      setPositionName(storedPositionName);
    }
  }, []);

  return (
    <div className="menu w-52 h-screen bg-red-900 text-white flex flex-col overflow-y-auto">
      <div className="user-info p-4 flex items-center border-b border-white">
        <div className="icon-container flex items-center justify-center mr-4">
          <FaUser className="text-3xl text-red-900" />
        </div>
        <div className="user-details flex flex-col">
          <h2 className="text-xl">
            {fname} {lname}
          </h2>
          <p className="text-md text-white">{positionName}</p>
        </div>
      </div>

      <div className="controls flex flex-col flex-grow">
        <ul className="menu flex-grow">
          <Link
            to={"/main/home"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              location.pathname === "/main/home" || selectedMenu === "home"
                ? "bg-red-700"
                : ""
            }`} // เช็ค path ด้วย location.pathname
            onClick={() => handleMenuSelect("home")}
          >
            <IoHome className="mr-2 text-lg" /> Home
          </Link>

          <Link
            to={"/main/booking-history"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "booking-history" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("booking-history")}
          >
            <FaClipboardList className="mr-2 text-lg" /> Booking History
          </Link>

          <Link
            to={"/main/manage-room"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-room" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-room")}
          >
            <FaDoorClosed className="mr-2 text-lg" /> Manage Room
          </Link>

          <Link
            to={"/main/manage-building"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-building" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-building")}
          >
            <FaBuilding className="mr-2 text-lg" /> Manage Building
          </Link>

          <Link
            to={"/main/manage-floor"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-floor" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-floor")}
          >
            <FaBuilding className="mr-2 text-lg" /> Manage Floor
          </Link>

          <Link
            to={"/main/manage-user"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-user" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-user")}
          >
            <FaUsersCog className="mr-2 text-lg" /> Manage User
          </Link>

          <Link
            to={"/main/unlock-user"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "unlock-user" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("unlock-user")}
          >
            <FaUserLock className="mr-2 text-lg" /> Unlock User
          </Link>

          <Link
            to={"/main/approve-booking"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "approve-booking" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("approve-booking")}
          >
            <FaCheck className="mr-2 text-lg" /> Approve Booking
          </Link>

          <Link
            to={"/main/manage-permission"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-permission" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-permission")}
          >
            <FaUserShield className="mr-2 text-lg" /> Manage Permission
          </Link>

          <Link
            to={"/main/manage-department"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-department" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-department")}
          >
            <FaUsersCog className="mr-2 text-lg" /> Manage Department
          </Link>

          <Link
            to={"/main/manage-position"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "manage-position" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("manage-position")}
          >
            <FaUserTag className="mr-2 text-lg" /> Manage Position
          </Link>

          <Link
            to={"/main/report"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "report" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("report")}
          >
            <BiSolidReport className="mr-2 text-lg" /> Report
          </Link>
        </ul>
        <button className="logout-btn flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-lg w-full mt-auto">
          <FaSignOutAlt className="mr-2 text-lg" />
          <Link to={"/"}> Logout</Link>
        </button>
      </div>
    </div>
  );
};

export default Menu;
