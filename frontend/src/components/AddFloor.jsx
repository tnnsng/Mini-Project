import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import axios from "axios";

const AddFloor = () => {
  const [building, setBuilding] = useState('');  // ตึกที่เลือก
  const [build, setBuild] = useState([]);  // รายการตึกจาก API

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const response = await axios.get("http://localhost:5000/build");
        setBuild(response.data);  // เก็บข้อมูลตึกจาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchBuild();  // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล
  }, []);

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10 ">
        <div className="flex items-center gap-10 mb-6 ">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl">เพิ่มชั้น</h1>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-10 ">
          <div>
            <label className="block">
              <input
                type="text"
                placeholder="ชั้น"
                className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </label>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              <option value="">เลือกตึก</option>
              {build.map((build, index) => (
                <option key={index} value={build.BUILD_ID}>
                  {build.BUILD_NAME}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
          เพิ่ม
        </button>
      </div>
    </div>
  );
};

export default AddFloor;
