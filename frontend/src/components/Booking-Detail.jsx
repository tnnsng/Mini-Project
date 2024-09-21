import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const BookingDetail = () => {
  const { roomName } = useParams(); // รับ ROOM_ID จาก URL

  const [date, setDate] = useState("");
  const [booking, setBooking] = useState([]);
  // useEffect สำหรับดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get("http://localhost:5000/booking");
        setBooking(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchBooking();
  }, []);

  const filteredBooking = booking.filter((booking) => {
    // ตรวจสอบค่าของ dropdown ที่ผู้ใช้เลือกทีละตัว
    const matchesRoomBooking = roomName ? booking.ROOM_NAME === roomName : true;

    // แปลง date ให้เป็นรูปแบบ DD-MM-YYYY
    const formattedDate = date
      ? `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`
      : null;

    // ดึงเฉพาะวันที่จาก STARTDATE
    const bookingDate = booking.STARTDATE.split(" ")[0]; // หรือใช้ substring(0, 10) ถ้าเป็นรูปแบบ YYYY-MM-DD

    const matchesDateBooking = formattedDate
      ? bookingDate === formattedDate // เปรียบเทียบแค่วันที่
      : true;

    // Return เงื่อนไขการกรอง
    return matchesRoomBooking && matchesDateBooking;
  });

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
          <Link to={"/main/choose-room"}>
            <FaAngleLeft className="text-4xl" />
          </Link>
        </button>
        <h1 className="text-3xl">รายละเอียดการจองห้องประชุม </h1>
      </div>

      <div className="flex items-center justify-between text-2xl text-gray-800 mb-4">
        <label className="relative">
          <h1 className="text-6xl">{roomName}</h1>
        </label>

        <div className="flex items-center justify-end relative w-1/3">
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="input input-bordered rounded-2xl bg-white border border-gray-200 drop-shadow-md custom-datepicker"
            dateFormat="dd-MM-yyyy"
            placeholderText="เลือกวันที่"
          />
          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />{" "}
          {/* ไอคอนปฏิทิน */}
        </div>
      </div>

      <div className="overflow-x-auto h-[calc(100vh-300px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-600 text-lg text-center">
            <tr>
              <th></th>
              <th>Start Date Time</th>
              <th>End Date Time</th>
              <th>Status</th>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooking.length > 0 ? (
              filteredBooking.map((booking, index) => (
                <tr
                  key={booking.BOOK_ID}
                  className="text-center hover:bg-gray-200 text-lg"
                >
                  <td>{index + 1}</td>
                  <td>{booking.STARTDATE}</td>
                  <td>{booking.ENDDATE}</td>
                  <td>{booking.APP_NAME}</td>
                  <td>{booking.FNAME}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No rooms found!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end p-4">
        <button className="bg-red-900 border border-red-900 text-center text-white text-xl px-4 py-2 rounded-xl hover:bg-red-950">
          Reserve
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;