import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UseRoom = () => {
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();

  const fetchQr = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5000/use-room/${code}`);
  
      const dateUse = new Date(response.data[0].DATE_USE); // แปลงเป็น Date object
      const formattedDate = `${dateUse.getDate().toString().padStart(2, "0")}-${(dateUse.getMonth() + 1).toString().padStart(2, "0")}-${dateUse.getFullYear()}`;
      const formattedTime = `${dateUse.getHours().toString().padStart(2, "0")}:${dateUse.getMinutes().toString().padStart(2, "0")}`;
  
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Successfully entered the room",
          text: `ROOM: ${response.data[0].ROOM_NAME} DATE: ${formattedDate} Time: ${formattedTime}`,
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/main/home");
        });
      }
    } catch (error) {
      console.error("Error fetching QR Code:", error);
  
      let errorMessage = "ไม่พบห้องที่ระบุหรือเกิดข้อผิดพลาดในการเชื่อมต่อ";
  
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "ไม่พบห้องตาม QR Code ที่ระบุ";
        } else if (error.response.status === 500) {
          errorMessage = "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
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
      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="flex items-center gap-10 mb-6">
          <h1 className="text-3xl">ใช้ห้อง</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="หมายเลข QR Code"
          className="input input-bordered w-full max-w-xs"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="btn btn-outline btn-error mt-4 px-4 w-full max-w-xs"
        >
          เข้าถึง
        </button>
      </form>
    </div>
  );
};

export default UseRoom;
