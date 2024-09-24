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
import { GoTriangleRight } from "react-icons/go";
import { IoHome } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Menu = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [positionName, setPositionName] = useState("");

  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const toggleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown);
  };

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

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    // แสดง popup ยืนยันการ Logout
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      navigate("/");

      localStorage.removeItem("fname");
      localStorage.removeItem("lname");
      localStorage.removeItem("posi_name");

      // แสดงการแจ้งเตือนว่าออกจากระบบเรียบร้อยแล้ว
      Swal.fire(
        "Logged out!",
        "You have been logged out successfully.",
        "success"
      );
    }
  };

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
            to={"/main/waiting-approve"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "waiting-approve" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("waiting-approve")}
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

          <li
            className="menu-item flex justify-start pl-2 p-1 cursor-pointer hover:bg-red-700 text-md relative"
            onMouseEnter={toggleReportDropdown}
            onMouseLeave={toggleReportDropdown}
          >
            <div className="flex items-center pl-0">
              <BiSolidReport className="text-lg" /> Report
            </div>
            {showReportDropdown && (
              <ul className="absolute top-full left-0 w-47 bg-red-800 text-white">
                <li>
                  <Link
                    to={"/main/report-meeting"}
                    className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md"
                    onClick={() => handleMenuSelect("report")}
                  >
                    <GoTriangleRight className="mr-2 text-lg" /> Report 1
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/main/report"}
                    className="menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md"
                  >
                    <GoTriangleRight className="mr-2 text-lg" /> Report 2
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <button
          className="logout-btn flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-lg w-full mt-auto"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
