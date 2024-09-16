import { useState } from "react";

const BookRoom = () => {
  const [roomType, setRoomType] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleBookRoom = () => {
    console.log("Booking room...");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">จองห้องประชุม</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ประเภทห้อง */}
        <div>
          <label className="block text-lg font-medium mb-2">ประเภทห้อง</label>
          <select
            className="select select-bordered w-full"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option disabled value="">
              เลือกประเภทห้อง
            </option>
            <option value="ทั่วไป">ห้องทั่วไป</option>
            <option value="VIP">ห้อง VIP</option>
          </select>
        </div>

        {/* ตึก */}
        <div>
          <label className="block text-lg font-medium mb-2">ตึก</label>
          <select
            className="select select-bordered w-full"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
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
          <select
            className="select select-bordered w-full"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          >
            <option disabled value="">
              เลือกชั้น
            </option>
            <option value="1">ชั้น 1</option>
            <option value="2">ชั้น 2</option>
            <option value="3">ชั้น 3</option>
          </select>
        </div>
      </div>

      {/* ค้นหาห้อง */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">ค้นหาห้อง</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
        />
      </div>

      {/* เลือกวันที่ เวลา */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* วันที่ */}
        <div>
          <label className="block text-lg font-medium mb-2">เลือกวันที่</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* เวลาเริ่มต้น */}
        <div>
          <label className="block text-lg font-medium mb-2">เวลาเริ่มต้น</label>
          <input
            type="time"
            className="input input-bordered w-full"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        {/* เวลาสิ้นสุด */}
        <div>
          <label className="block text-lg font-medium mb-2">เวลาสิ้นสุด</label>
          <input
            type="time"
            className="input input-bordered w-full"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* ปุ่มจอง */}
      <button className="btn btn-primary" onClick={handleBookRoom}>
        จองห้อง
      </button>

      {/* ตารางแสดงการจอง */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">รายละเอียดการจอง</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อห้อง</th>
                <th>ชั้น</th>
                <th>ตึก</th>
                <th>ประเภทห้อง</th>
                <th>สถานะการจอง</th>
              </tr>
            </thead>
            <tbody>
              {/* แถวตัวอย่าง */}
              <tr>
                <td>1</td>
                <td>ห้องประชุม A</td>
                <td>ชั้น 2</td>
                <td>ตึก A</td>
                <td>VIP</td>
                <td>จองแล้ว</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
