import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaBuilding,
  FaDoorOpen,
  FaDoorClosed,
  FaAngleLeft,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const formatDateToUniversal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนต้องบวก 1 เนื่องจาก getMonth() นับจาก 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const BookingRoom = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const room = JSON.parse(localStorage.getItem("selectedRoom"));
  const empID = localStorage.getItem("emp_id");

  const navigate = useNavigate();

  const handleBooking = async () => {
    try {
      if (!startDate || !startTime || !endDate || !endTime) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณาเลือกวันที่และเวลาที่ต้องการก่อนทำการจอง",
        });
        return;
      }

      const now = new Date();
      const bookDate = formatDateToUniversal(now);

      const startDateTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      );

      const endDateTime = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      );

      const formattedStartDate = formatDateToUniversal(startDateTime);
      const formattedEndDate = formatDateToUniversal(endDateTime);

      const response = await fetch("http://localhost:5000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_date: bookDate,
          startdate: formattedStartDate,
          enddate: formattedEndDate,
          room_id: room.ROOM_ID,
          emp_id: empID,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        if (room.TYPE_ID === "VIP") {
          Swal.fire({
            icon: "info",
            title: "รอการอนุมัติ",
            text: "การจองห้อง VIP ของคุณจะต้องรอการอนุมัติก่อน",
          });
        } else {
          const qrCodeDataURL = await QRCode.toDataURL(
            result.qr_code.toString()
          );

          Swal.fire({
            icon: "success",
            title: "อนุมัติ",
            html: `
              <p>การจองห้องประชุมของคุณเสร็จสมบูรณ์แล้ว!</p>
              <p>กรุณาใช้ QR Code ด้านล่างสำหรับการเข้าห้อง</p>
              <div style="display: flex; justify-content: center;">
                <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 100%; height: auto;"/>
              </div>
              <p>รหัสสำหรับการเข้าห้อง: <strong>${result.qr_code}</strong></p>
            `,
          });

          navigate("/main/booking-history");
        }
      }
    } catch (error) {
      console.error("Error booking room:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะจองห้องประชุม กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const confirmBooking = () => {
    // ตรวจสอบว่ามีการเลือกวันที่และเวลาแล้วหรือยัง
    if (!startDate || !startTime || !endDate || !endTime) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกวันที่และเวลาที่ต้องการก่อนทำการจอง",
      });
      return;
    }
    // รวมวันที่และเวลาเข้าด้วยกัน
    const startDateTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    const endDateTime = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    );

    // ใช้ Swal เพื่อยืนยันก่อนทำการจอง
    Swal.fire({
      title: "คุณต้องการจองห้องประชุมใช่หรือไม่?",
      html: `ห้อง: ${room.ROOM_NAME} ตึก: ${room.BUILD_NAME} ชั้น: ${
        room.FLOOR_NAME
      }
      <br> วันเวลาเริ่มต้น: ${formatDateToUniversal(
        startDateTime
      )} <br> วันเวลาสิ้นสุด: ${formatDateToUniversal(endDateTime)}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, จองเลย!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleBooking(); // ถ้าผู้ใช้กดยืนยัน จะเรียกฟังก์ชันทำการจอง
      }
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <Link to={"/main/home"}>
              <FaAngleLeft className="text-4xl" />
            </Link>
          </button>
          <h1 className="text-3xl">จองห้องประชุม</h1>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input rounded-xl w-full bg-white text-xl text-gray-800 pl-14"
              value={` : ${room.TYPE_NAME}`}
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
              value={` : ${room.FLOOR_NAME}-${room.BUILD_NAME}`}
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
              value={` : ${room.ROOM_NAME}`}
              readOnly
            />
            <FaDoorOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่เริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่เริ่มต้น
          </label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="input input-bordered rounded-2xl w-full bg-white drop-shadow-xl border-gray-300 custom-datepicker pr-10"
              dateFormat="yyyy-MM-dd"
              placeholderText="เลือกวันที่เริ่มต้น"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
        </div>

        {/* เวลาเริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาเริ่มต้น</label>
          <div className="relative">
            <DatePicker
              selected={startTime}
              onChange={(time) => setStartTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="HH:mm"
              className="input input-bordered rounded-2xl w-full bg-white drop-shadow-xl border-gray-300 custom-datepicker pr-10"
              placeholderText="เลือกเวลาเริ่มต้น"
            />
            <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
        </div>

        {/* วันที่สิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่สิ้นสุด
          </label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="input input-bordered rounded-2xl w-full bg-white drop-shadow-xl border-gray-300 custom-datepicker pr-10"
              dateFormat="yyyy-MM-dd"
              placeholderText="เลือกวันที่สิ้นสุด"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
        </div>

        {/* เวลาสิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาสิ้นสุด</label>
          <div className="relative">
            <DatePicker
              selected={endTime}
              onChange={(time) => setEndTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="HH:mm"
              className="input input-bordered rounded-2xl w-full bg-white drop-shadow-xl border-gray-300 custom-datepicker pr-10"
              placeholderText="เลือกเวลาสิ้นสุด"
            />
            <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-red-900 text-xl text-center text-white py-3 px-6 rounded-xl hover:bg-red-950 drop-shadow-xl"
          onClick={confirmBooking}
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
};

export default BookingRoom;
