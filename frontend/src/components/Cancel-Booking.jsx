import {
  FaAngleLeft,
  FaBuilding,
  FaDoorOpen,
  FaDoorClosed,
  FaClock,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const formatDateToUniversal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนต้องบวก 1 เนื่องจาก getMonth() นับจาก 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const CancelBooking = () => {
  const booking = JSON.parse(localStorage.getItem("selectedRoomBooking"));
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      const now = new Date();
      const bookDate = formatDateToUniversal(now);

      const response = await fetch(
        `http://localhost:5000/cancle/${booking.BOOK_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cancle_date: bookDate,
            reason: reason,
            emp_id: booking.EMP_ID,
          }),
        }
      );

      const result = await response.json();
      console.log(result.reason);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "เสร็จสิ้น",
          text: "ยกเลิกการจองสำเร็จ",
        });

        navigate("/main/booking-history");
      }
    } catch (error) {
      console.error("Error booking room:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะยกเลิกการจองห้องประชุม กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const confirmCancel = () => {
    Swal.fire({
      title: "คุณต้องยกเลิกการจองห้องประชุมใช่หรือไม่?",
      html: `ห้อง: ${booking.ROOM_NAME} ตึก: ${booking.BUILD_NAME} ชั้น: ${booking.FLOOR_NAME}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancel();
      }
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <Link to={"/main/booking-history"}>
              <FaAngleLeft className="text-4xl" />
            </Link>
          </button>
          <h1 className="text-3xl">ยกเลิกการจองห้องประชุม</h1>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input rounded-xl w-full bg-white text-xl text-gray-800 pl-14"
              value={`: ${booking.TYPE_NAME}`}
              readOnly
            />
            <FaDoorClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input rounded-xl w-full bg-white text-xl text-gray-800 pl-14"
              value={`: ${booking.BUILD_NAME}`}
              readOnly
            />
            <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-3xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input rounded-xl w-full bg-white text-xl text-gray-800 pl-14"
              value={`: ${booking.ROOM_NAME}`}
              readOnly
            />
            <FaDoorOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input rounded-xl w-full bg-white text-xl text-gray-800 pl-14"
              value={`: ${booking.STARTDATE.split(" ")[1]} - ${
                booking.ENDDATE.split(" ")[1]
              }`}
              readOnly
            />
            <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>

        <div className="flex items-center mb-6">
          <label className="relative w-full">
            <h2 className="text-lg mb-2">เหตุผลในการยกเลิก</h2>
            <input
              type="text"
              className="input input-bordered border-gray-400 rounded-xl w-1/3 bg-white drop-shadow-lg text-xl text-gray-800 pl-4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-red-900 text-xl text-center text-white py-3 px-6 rounded-xl hover:bg-red-950 drop-shadow-xl"
            onClick={confirmCancel}
          >
            ยกเลิกการจอง
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking;
