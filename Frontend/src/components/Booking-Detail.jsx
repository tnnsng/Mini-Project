import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const BookingDetail = () => {
  const room = JSON.parse(localStorage.getItem("selectedRoom"));

  const [date, setDate] = useState("");
  const [booking, setBooking] = useState([]);
  // useEffect สำหรับดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/booking");
        setBooking(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchBooking();
  }, []);

  const filteredBooking = booking.filter((booking) => {
    const matchesRoomBooking = room.ROOM_ID
      ? booking.ROOM_ID === room.ROOM_ID
      : true;

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
          <Link to={"/main/home"}>
            <FaAngleLeft className="text-4xl" />
          </Link>
        </button>
        <h1 className="text-3xl">รายละเอียดการจองห้องประชุม </h1>
      </div>

      <div className="flex items-center justify-between text-2xl text-gray-800 mb-4">
        <label className="relative">
          <h1 className="text-6xl">{room.ROOM_NAME}</h1>
          <h2 className="text-2xl">Detail : {room.DETAIL} </h2>
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

      <div className="overflow-x-auto h-[calc(100vh-350px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-800 text-lg text-center">
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
        <button className="bg-red-900 border border-red-900 text-center text-white text-2xl px-4 py-2 rounded-2xl hover:bg-red-950">
          <Link to={`/main/home/booking-room/${room.ROOM_NAME}`}>Reserve</Link>
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;
