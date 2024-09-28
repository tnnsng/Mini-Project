import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import axios from "axios";

const AddRoom = () => {
  // ประกาศตัวแปรสถานะต่าง ๆ
  const [roomType, setRoomType] = useState('');  // ประเภทห้อง
  const [roomCapacity, setRoomCapacity] = useState('');  // จำนวนคน
  const [building, setBuilding] = useState('');  // ตึก
  const [floor, setFloor] = useState('');  // ชั้น
  
  const [type, setType] = useState([]);  // รายการประเภทห้องจาก API
  const [build, setBuild] = useState([]);  // รายการตึกจาก API
  const [floors, setFloors] = useState([]);  // รายการชั้นจาก API
  const [rooms, setRooms] = useState([]);  // รายการห้องจาก API
  
  const [selectedType, setSelectedType] = useState("");  // ประเภทห้องที่ถูกเลือก
  const [selectedBuild, setSelectedBuild] = useState("");  // ตึกที่ถูกเลือก
  const [selectedFloor, setSelectedFloor] = useState("");  // ชั้นที่ถูกเลือก
  const [selectedAmount, setSelectedAmount] = useState("");  // จำนวนคนที่ถูกเลือก

  // เรียกข้อมูลจาก API เมื่อคอมโพเนนต์ถูกสร้างขึ้น
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/room");
        setRooms(response.data);  // เก็บข้อมูลห้องจาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    
    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:5000/type");
        setType(response.data);  // เก็บข้อมูลประเภทห้องจาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    
    const fetchBuild = async () => {
      try {
        const response = await axios.get("http://localhost:5000/build");
        setBuild(response.data);  // เก็บข้อมูลตึกจาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    
    const fetchFloor = async () => {
      try {
        const response = await axios.get("http://localhost:5000/floor");
        setFloors(response.data);  // เก็บข้อมูลชั้นจาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล
    fetchBuild();
    fetchFloor();
    fetchType();
    fetchRooms();
  }, []);

  // ฟังก์ชันกรองข้อมูลชั้นตามตึกที่เลือก
  const uniqueFloors = selectedBuild
    ? floors.filter((floor) => floor.BUILD_ID === selectedBuild)
    : Array.from(new Map(floors.map((f) => [f.FLOOR_NAME, f])).values());

  // ฟังก์ชันกรองข้อมูลห้อง

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="flex items-center gap-10 mb-6">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl">เพิ่มห้อง</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block">
              <input type="text" placeholder="ชื่อ" className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
            </label>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">เลือกประเภทห้อง</option>
              {type.map((type, index) => (
                <option key={index} value={type.TYPE_ID}>
                  {type.TYPE_NAME}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
            >
              <option value="">เลือกจำนวนคน</option>
              <option value="">เลือกจำนวนการบรรจุ</option>
              {rooms.map((amount, index) => (
                <option key={index} value={amount.AMOUNT}>
                  {amount.AMOUNT} คน
                </option>
              ))}
            </select>
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

          
          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">เลือกชั้น</option>
              {uniqueFloors.map((floor, index) => (
                <option key={index} value={floor.FLOOR_NAME}>
                  {floor.FLOOR_NAME}
                </option>
              ))}
            </select>
          </div>



          <label className="block">
            <input type="text" placeholder="รายละเอียด" className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
          </label>
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

export default AddRoom;
