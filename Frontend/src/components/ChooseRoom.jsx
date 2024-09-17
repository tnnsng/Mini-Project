import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // ไอคอนค้นหา
import axios from "axios";

const ChooseRoom = () => {
  // useState สำหรับจัดการค่าที่ผู้ใช้เลือกเพื่อกรองห้อง
  const [roomType, setRoomType] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State สำหรับจัดเก็บข้อมูลห้องที่ดึงมาจาก API
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  // useEffect สำหรับดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8000/room");
        setRooms(response.data); // เก็บข้อมูลห้องที่ได้จาก API
        setLoading(false); // เปลี่ยนสถานะเป็นหยุดโหลด
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setLoading(false); // กรณีเกิดข้อผิดพลาดก็ให้หยุดโหลด
      }
    };

    fetchRooms(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  // ฟังก์ชันกรองห้องตามค่าที่เลือกจาก dropdown และช่องค้นหา
  const filteredRooms = rooms.filter((room) => {
    // ตรวจสอบค่าของ dropdown ที่ผู้ใช้เลือก
    const matchesRoomType = roomType ? room.type === roomType : true;
    const matchesBuilding = building ? room.building === building : true;
    const matchesFloor = floor ? room.floor === floor : true;

    // ตรวจสอบค่าช่องค้นหา
    const matchesSearch = searchQuery
      ? room.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesRoomType && matchesBuilding && matchesFloor && matchesSearch;
  });

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">ห้องประชุม</h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-[30%,70%] gap-8">
        {/* ฝั่งซ้าย - Dropdown ต่างๆ */}
        <div className="space-y-6">
          {/* จำนวนคน */}
          <div>
            <label className="block text-lg font-medium mb-2">จำนวนการบรรจุ</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">เลือกจำนวนการบรรจุ</option>
              <option value="5">4-5 คน</option>
              <option value="6">6-10 คน</option>
              <option value="5">10-20 คน</option>
            </select>
          </div>

          {/* ประเภทห้อง */}
          <div>
            <label className="block text-lg font-medium mb-2">ประเภทห้อง</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">เลือกประเภทห้อง</option>
              <option value="ทั่วไป">ห้องทั่วไป</option>
              <option value="VIP">ห้อง VIP</option>
            </select>
          </div>

          {/* ตึก */}
          <div>
            <label className="block text-lg font-medium mb-2">ตึก</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              <option value="">เลือกตึก</option>
              <option value="A">ตึก A</option>
              <option value="B">ตึก B</option>
              <option value="C">ตึก C</option>
            </select>
          </div>

          {/* ชั้น */}
          <div>
            <label className="block text-lg font-medium mb-2">ชั้น</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">เลือกชั้น</option>
              <option value="1">ชั้น 1</option>
              <option value="2">ชั้น 2</option>
              <option value="3">ชั้น 3</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button className="bg-red-900 text-xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">เลือกห้อง</button>
          </div>

        </div>

        {/* ฝั่งขวา - ตารางแสดงห้องที่ตรงกับตัวเลือก */}
        <div className="flex flex-col space-y-6 pr-6">
          {/* ค้นหาห้อง */}
          <div className="relative">
            <input
              type="text"
              className="input input-bordered rounded-2xl w-full pl-10 text-gray-800 bg-white border-2 border-red-900"
              placeholder="ค้นหาห้อง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* ตารางแสดงห้อง */}
          <div className="overflow-x-auto h-[calc(100vh-300px)] border-2 border-red-900">
            {loading ? (
              <div className="text-center">กำลังโหลดข้อมูล...</div>
            ) : (
              <table className="table w-full">
                <thead className="text-gray-800 text-lg text-center">
                  <tr>
                    <th>No.</th>
                    <th>ชื่อห้อง</th>
                    <th>ชั้น</th>
                    <th>ตึก</th>
                    <th>ประเภทห้อง</th>
                    <th>สถานะห้อง</th>
                    <th>รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="text-center text-md">
                  {(filteredRooms.length > 0 || searchQuery || roomType || building || floor) ? (
                    filteredRooms.length > 0 ? (
                      filteredRooms.map((room, index) => (
                        <tr key={room.id}>
                          <td>{index + 1}</td>
                          <td>{room.name}</td>
                          <td>{room.floor}</td>
                          <td>{room.building}</td>
                          <td>{room.type}</td>
                          <td>{room.status}</td>
                          <td>{room.time}</td>
                          <td>
                            <button className="px-2 py-2 bg-red-900 text-sm text-white text-center rounded-2xl hover:bg-red-700">
                              รายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          ไม่พบข้อมูลห้องที่ตรงกับการค้นหา
                        </td>
                      </tr>
                    )
                  ) : (
                    rooms.map((room, index) => (
                      <tr key={room.id}>
                        <td>{index + 1}</td>
                        <td>{room.name}</td>
                        <td>{room.floor}</td>
                        <td>{room.building}</td>
                        <td>{room.type}</td>
                        <td>{room.status}</td>
                        <td>{room.time}</td>
                        <td>
                          <button className="px-2 py-2 bg-red-900 text-sm text-white text-center rounded-2xl hover:bg-red-700">
                            รายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoom;
