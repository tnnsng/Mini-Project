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
  FaWalking,
} from "react-icons/fa"; // Added new icons
import { GoTriangleRight } from "react-icons/go";
import { IoHome } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Menu = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [positionName, setPositionName] = useState("");
  const [permissions, setPermissions] = useState([]);

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
    const storedPositionID = localStorage.getItem("posi_id");
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

    // ดึงข้อมูลสิทธิ์ของผู้ใช้ที่เกี่ยวข้องกับตำแหน่ง
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `http://203.188.54.9/~u6611850015/api/perposition/${storedPositionID}`
        );
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  // ตรวจสอบสิทธิ์ว่าผู้ใช้งานมีสิทธิ์ในเมนูนั้นๆ หรือไม่
  const hasPermission = (permID) => {
    return permissions.some((perm) => perm.PER_ID === permID);
  };

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    // แสดง popup ยืนยันการ Logout
    const result = await Swal.fire({
      title: "คุณแน่ใจ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      navigate("/");

      localStorage.removeItem("fname");
      localStorage.removeItem("lname");
      localStorage.removeItem("posi_id");
      localStorage.removeItem("posi_name");

      // แสดงการแจ้งเตือนว่าออกจากระบบเรียบร้อยแล้ว
      Swal.fire("ออกจากระบบ!", "คุณได้ออกจากระบบเรียบร้อยแล้ว", "success");
    }
  };

  return (
    <div className="menu w-52 h-screen bg-red-900 text-white flex flex-col">
      {/* User Info ส่วนบนสุด ตรึงอยู่กับที่ */}
      <div className="user-info p-4 flex items-center border-b border-white sticky top-0 bg-red-900 z-10">
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

      {/* เมนูที่สามารถเลื่อนขึ้นลงได้ */}
      <div className="controls flex-grow overflow-y-auto">
        <ul className="menu flex-grow">
          {hasPermission("PER01") && (
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
          )}

          {hasPermission("PER01") && (
            <Link
              to={"/main/booking-history"}
              className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
                selectedMenu === "booking-history" ? "bg-red-700" : ""
              }`}
              onClick={() => handleMenuSelect("booking-history")}
            >
              <FaClipboardList className="mr-2 text-lg" /> Booking History
            </Link>
          )}

          <Link
            to={"/main/use-room"}
            className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
              selectedMenu === "use-room" ? "bg-red-700" : ""
            }`}
            onClick={() => handleMenuSelect("use-room")}
          >
            <FaWalking className="mr-2 text-lg" /> Use Room
          </Link>

          {hasPermission("PER02") && (
            <Link
              to={"/main/manage-room"}
              className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
                selectedMenu === "manage-room" ? "bg-red-700" : ""
              }`}
              onClick={() => handleMenuSelect("manage-room")}
            >
              <FaDoorClosed className="mr-2 text-lg" /> Manage Room
            </Link>
          )}

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

          {hasPermission("PER04") && (
            <Link
              to={"/main/manage-user"}
              className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
                selectedMenu === "manage-user" ? "bg-red-700" : ""
              }`}
              onClick={() => handleMenuSelect("manage-user")}
            >
              <FaUsersCog className="mr-2 text-lg" /> Manage User
            </Link>
          )}

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

          {hasPermission("PER03") && (
            <Link
              to={"/main/manage-permission"}
              className={`menu-item flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-md ${
                selectedMenu === "manage-permission" ? "bg-red-700" : ""
              }`}
              onClick={() => handleMenuSelect("manage-permission")}
            >
              <FaUserShield className="mr-2 text-lg" /> Manage Permission
            </Link>
          )}

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

          {hasPermission("PER05") && (
            <li
              className={`menu-item flex justify-start pl-2 p-1 cursor-pointer hover:bg-red-700 text-md relative
                ${selectedMenu === "report" ? "bg-red-700" : ""}`}
              onMouseEnter={toggleReportDropdown}
              onMouseLeave={toggleReportDropdown}
            >
              <div className={`flex items-center pl-0 `}>
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
                      onClick={() => handleMenuSelect("report")}
                    >
                      <GoTriangleRight className="mr-2 text-lg" /> Report 2
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
      {/* ปุ่ม Logout ส่วนล่างสุด ตรึงอยู่กับที่ */}
      <button
        className="logout-btn flex items-center justify-start pl-2 p-3 cursor-pointer hover:bg-red-700 text-lg w-full bg-red-900 sticky bottom-0"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2 text-lg" />
        Logout
      </button>
    </div>
  );
};

export default Menu;
