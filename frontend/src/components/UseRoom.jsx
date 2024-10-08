import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UseRoom = () => {
  const [qrCode, setQrCode] = useState("");

  const fetchQr = async (code) => {
    try {
      const response = await axios.get(
        `http://203.188.54.9/~u6611850015/api/use-room/${code}`
      );

      const dateUse = new Date(response.data[0].DATE_USE);
      const formattedDate = `${dateUse
        .getDate()
        .toString()
        .padStart(2, "0")}-${(dateUse.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${dateUse.getFullYear()}`;
      const formattedTime = `${dateUse
        .getHours()
        .toString()
        .padStart(2, "0")}:${dateUse.getMinutes().toString().padStart(2, "0")}`;

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "เข้าใช้ห้องสำเร็จ!",
          html: `ห้อง : ${response.data[0].ROOM_NAME} <br> วันที่เข้าใช้ : ${formattedDate} <br> เวลาที่เข้าใช้ :  ${formattedTime}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(
        "Error fetching QR Code:",
        error.response?.data || error.message
      );

      let errorMessage = "ไม่พบห้องที่ระบุหรือเกิดข้อผิดพลาดในการเชื่อมต่อ";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            error.response.data.error || "QR Code ไม่ถูกต้อง หรือหมดเวลาใช้งาน";
          if (error.response.data.error === "Time Out") {
            errorMessage = "ไม่สามารถเข้าใช้ห้องได้เพราะเลยเวลาที่กำหนด";
          }
        } else if (error.response.status === 500) {
          errorMessage = "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }
       else if (error.response.status === 403) {
        errorMessage = error.response.data.error;
      }
      } else if (error.request) {
        errorMessage = "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qrCode) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "กรุณากรอกหมายเลข QR Code.",
      });
      return;
    }
    fetchQr(qrCode);
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <h1 className="text-3xl">เข้าใช้ห้อง</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ใส่หมายเลข QR Code"
          className="input input-bordered border-gray-500 w-full max-w-xs bg-white text-gray-800 rounded-xl shadow-lg"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="btn btn-outline btn-success mt-4 px-4 w-full max-w-xs"
        >
          เข้าใช้
        </button>
      </form>
    </div>
  );
};

export default UseRoom;
