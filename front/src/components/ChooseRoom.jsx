import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // ไอคอนค้นหา

const ChooseRoom = () => {
  const [roomType, setRoomType] = useState("");

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">จองห้องประชุม</h1>

      <div className="grid md:gid-cols-1 lg:grid-cols-[30%,70%] gap-8">
        {/* ฝั่งซ้าย - Dropdown ต่างๆ */}
        <div className="space-y-6">
          {/* ประเภทห้อง - เปลี่ยนเป็นปุ่ม */}
          <div>
            <label className="block text-lg font-medium mb-2">ประเภทห้อง</label>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 border-2 rounded-xl text-lg ${
                  roomType === "ทั่วไป"
                    ? "bg-red-900 text-white"
                    : "text-red-900 border-red-900"
                }`}
                onClick={() => setRoomType("ทั่วไป")}
              >
                ห้องทั่วไป
              </button>
              <button
                className={`px-4 py-2 border-2 rounded-xl text-lg ${
                  roomType === "VIP"
                    ? "bg-red-900 text-white"
                    : "text-red-900 border-red-900"
                }`}
                onClick={() => setRoomType("VIP")}
              >
                ห้อง VIP
              </button>
            </div>
          </div>

          {/* ตึก */}
          <div>
            <label className="block text-lg font-medium mb-2">ตึก</label>
            <select className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900">
              <option disabled value="">
                เลือกตึก
              </option>
              <option value="A">ตึก A</option>
              <option value="B">ตึก B</option>
              <option value="C">ตึก C</option>
            </select>
          </div>

          {/* ชั้น */}
          <div>
            <label className="block text-lg font-medium mb-2">ชั้น</label>
            <select className="select select-bordered rounded-2xl w-full bg-white border-2 border-red-900 ">
              <option disabled value="">
                เลือกชั้น
              </option>
              <option value="1">ชั้น 1</option>
              <option value="2">ชั้น 2</option>
              <option value="3">ชั้น 3</option>
            </select>
          </div>

          {/* ปุ่มเลือกห้อง */}
          <div className="flex justify-end">
            <button className="bg-red-900 rounded-2xl px-6 py-3 text-white text-lg hover:bg-red-700">
              เลือกห้อง
            </button>
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
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* ตารางแสดงห้อง */}
          <div className="overflow-x-auto h-[calc(100vh-300px)] border-2 border-red-900">
            <table className="table w-full">
              <thead className="text-gray-800 text-lg text-center">
                <tr>
                  <th>No.</th>
                  <th>ชื่อห้อง</th>
                  <th>ชั้น</th>
                  <th>ตึก</th>
                  <th>ประเภทห้อง</th>
                  <th>สถานะการจอง</th>
                  <th>เวลา</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="text-center text-md">
                {/* ตัวอย่างข้อมูล */}
                <tr>
                  <td>1</td>
                  <td>ห้องประชุม A</td>
                  <td>ชั้น 2</td>
                  <td>ตึก A</td>
                  <td>VIP</td>
                  <td>จองแล้ว</td>
                  <td>
                    09:00 - 14:30
                    <br />
                    15:00 - 18:00
                  </td>
                  <td>
                    <button className="px-2 py-2 bg-red-900 text-sm text-white text-center rounded-2xl hover:bg-red-700">
                      รายละเอียด
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>ห้องประชุม B</td>
                  <td>ชั้น 1</td>
                  <td>ตึก B</td>
                  <td>ทั่วไป</td>
                  <td>ว่าง</td>
                  <td>-</td>
                  <td>
                    <button className="px-2 py-2 bg-red-900 text-sm text-white text-center rounded-2xl hover:bg-red-700">
                      รายละเอียด
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoom;
