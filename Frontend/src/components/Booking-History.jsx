//import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import Swal from "sweetalert2";

const BookingHistory = () => {
  const empID = localStorage.getItem("emp_id");
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
    const matchesRoomBooking = empID ? booking.EMP_ID === empID : true;

    return matchesRoomBooking;
  });

  const handleQrCode = async (e, booking) => {
    e.preventDefault();

    // ตรวจสอบว่า booking.NUM เป็น null หรือไม่
    if (booking.NUM === null) {
      Swal.fire({
        icon: "info",
        title: "รอการอนุมัติ",
        text: "การจองนี้ยังไม่ได้รับการอนุมัติ กรุณารอการอนุมัติเพื่อให้สามารถเข้าห้องได้",
      });
      return; // ออกจากฟังก์ชันหากยังไม่ได้รับการอนุมัติ
    }

    // ใช้ booking.NUM ของ booking ที่คลิก
    const qrCodeDataURL = await QRCode.toDataURL(booking.NUM.toString());

    Swal.fire({
      icon: "success",
      title: "QR Code",
      html: `
        <p>QR Code และรหัสสำหรับการเข้าห้อง ${booking.ROOM_NAME}</p>
        <p>กรุณาใช้ QR Code ด้านล่างสำหรับการเข้าห้อง</p>
        <div style="display: flex; justify-content: center;">
          <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 100%; height: auto;"/>
        </div>
        <p>รหัสสำหรับการเข้าห้อง: <strong>${booking.NUM}</strong></p>
      `,
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">ประวัติการจองห้องประชุม</h1>
      </div>

      <div className="overflow-x-auto h-[calc(100vh-150px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-800 text-lg text-center">
            <tr>
              <th></th>
              <th>Room Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time</th>
              <th>QR Code</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooking.length > 0 ? (
              filteredBooking.map((booking, index) => (
                <tr key={booking.BOOK_ID} className="text-center text-lg">
                  <td>{index + 1}</td>
                  <td>{booking.ROOM_NAME}</td>
                  <td>{booking.APP_NAME}</td>
                  <td>{booking.STARTDATE.split(" ")[0]}</td>
                  <td>{booking.ENDDATE.split(" ")[0]}</td>
                  <td>
                    {booking.STARTDATE.split(" ")[1]} -{" "}
                    {booking.ENDDATE.split(" ")[1]}
                  </td>
                  <td>
                    {booking.APP_ID === "SA002" ? (
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-2xl hover:bg-yellow-800"
                        onClick={(e) => handleQrCode(e, booking)}
                      >
                        รอการอนุมัติ
                      </button>
                    ) : booking.APP_ID === "SA005" ? (
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-2xl"
                        disabled
                      >
                        โดนยกเลิก
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded-2xl hover:bg-green-800"
                        onClick={(e) => handleQrCode(e, booking)} // ส่ง booking เข้าไป
                      >
                        QR Code
                      </button>
                    )}
                  </td>

                  <td className="flex justify-center items-center">
                    <Link to={`cancel-booking/${booking.ROOM_NAME}`}>
                      <button
                        className="bg-red-800 text-white py-2 px-4 rounded-2xl hover:bg-red-950 flex items-center gap-2"
                        onClick={() => {
                          localStorage.setItem(
                            "selectedRoomBooking",
                            JSON.stringify(booking)
                          );
                        }}
                      >
                        <MdCancel />
                        <span>ยกเลิก</span>
                      </button>
                    </Link>
                  </td>
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
    </div>
  );
};

export default BookingHistory;
