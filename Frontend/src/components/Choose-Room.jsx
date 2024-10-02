import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaClock } from "react-icons/fa"; // ไอคอนค้นหา
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ChooseRoom = () => {
  // useState สำหรับจัดการค่าที่ผู้ใช้เลือกเพื่อกรองห้อง
  const [type, setType] = useState([]);
  const [build, setBuild] = useState([]);
  const [floor, setFloor] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [selectedBuild, setSelectedBuild] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booking, setBooking] = useState([]);

  const [rooms, setRooms] = useState([]);

  // useEffect สำหรับดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/room");
        setRooms(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchType = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/type");
        setType(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchBuild = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/build");
        setBuild(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchFloor = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/floor");
        setFloor(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchBooking = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/booking");
        setBooking(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchBooking();
    fetchBuild();
    fetchFloor();
    fetchType();
    fetchRooms(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  const uniqueFloors = selectedBuild
    ? floor.filter((floor) => floor.BUILD_ID === selectedBuild)
    : Array.from(
        new Map(floor.map((f) => [f.FLOOR_NAME, f])).values() // กรอง object ที่ไม่ซ้ำกันตามชื่อชั้น
      );

  // ฟังก์ชันกรองห้องตามค่าที่เลือกจาก dropdown และช่องค้นหา
  const filteredRooms = rooms.filter((room) => {
    // ตรวจสอบค่าของ dropdown ที่ผู้ใช้เลือกทีละตัว
    const matchesRoomType = selectedType ? room.TYPE_ID === selectedType : true;
    const matchesBuilding = selectedBuild
      ? room.BUILD_ID === selectedBuild
      : true;
    const matchesFloor = selectedFloor
      ? room.FLOOR_NAME === selectedFloor
      : true;
    const matchesAmount = selectedAmount
      ? room.AMOUNT === parseInt(selectedAmount, 10) // แปลง selectedAmount เป็น int
      : true;

    // ตรวจสอบค่าช่องค้นหา
    const matchesSearch = searchQuery
      ? room.ROOM_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.DETAIL.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.TYPE_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.BUILD_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.FLOOR_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(room.AMOUNT).toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const isRoomAvailable = (room) => {
      const formatDateTime = (date, time) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เดือนใน JavaScript เริ่มต้นที่ 0
        const year = date.getFullYear();

        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
      };

      return !booking.some((b) => {
        if (b.ROOM_ID === room.ROOM_ID) {
          const startDateTime = b.STARTDATE; // แปลง STARTDATE เป็น Date object
          const endDateTime = b.ENDDATE; // แปลง ENDDATE เป็น Date object

          // ตรวจสอบว่า selectedDate และ selectedTime มีค่าไหม
          if (selectedDate && selectedTime) {
            const selectedDateTime = formatDateTime(selectedDate, selectedTime);

            console.log(selectedDateTime);
            // ตรวจสอบว่าช่วงเวลาที่เลือกตรงกับช่วงเวลาที่มีการจองหรือไม่
            return (
              selectedDateTime >= startDateTime &&
              selectedDateTime <= endDateTime
            );
          }
          return false;
        }
        return false;
      });
    };

    const roomIsAvailable = isRoomAvailable(room);

    // Return เงื่อนไขการกรอง
    return (
      matchesRoomType &&
      matchesBuilding &&
      matchesFloor &&
      matchesAmount &&
      matchesSearch &&
      roomIsAvailable
    );
  });

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <h1 className="text-3xl mb-8">ห้องประชุม</h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-[20%,80%] gap-8">
        {/* ฝั่งซ้าย - Dropdown ต่างๆ */}
        <div className="space-y-6">
          {/* จำนวนคน */}
          <div>
            <label className="block text-lg font-medium mb-2">
              จำนวนการบรรจุ
            </label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
            >
              <option value="">เลือกจำนวนการบรรจุ</option>
              {rooms.map((amount, index) => (
                <option key={index} value={amount.AMOUNT}>
                  {amount.AMOUNT} คน
                </option>
              ))}
            </select>
          </div>

          {/* ประเภทห้อง */}
          <div>
            <label className="block text-lg font-medium mb-2">ประเภทห้อง</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">เลือกประเภทห้อง</option>
              {type.map((type, index) => (
                <option key={index} value={type.TYPE_ID}>
                  {type.TYPE_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* ตึก */}
          <div>
            <label className="block text-lg font-medium mb-2">ตึก</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
              value={selectedBuild}
              onChange={(e) => setSelectedBuild(e.target.value)}
            >
              <option value="">เลือกตึก</option>
              {build.map((build, index) => (
                <option key={index} value={build.BUILD_ID}>
                  {build.BUILD_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* ชั้น */}
          <div>
            <label className="block text-lg font-medium mb-2">ชั้น</label>
            <select
              className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="">เลือกชั้น</option>
              {uniqueFloors.map((floor, index) => (
                <option key={index} value={floor.FLOOR_NAME}>
                  {floor.FLOOR_NAME}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ฝั่งขวา - ตารางแสดงห้องที่ตรงกับตัวเลือก */}
        <div className="flex flex-col space-y-6 pr-6">
          {/* ค้นหาห้อง พร้อมเลือกวันและเวลา */}
          <div className="flex space-x-4 items-center">
            {/* ช่องค้นหาห้อง */}
            <div className="relative w-1/3">
              <input
                type="text"
                className="input input-bordered rounded-2xl w-full pl-12 text-gray-800 bg-white border border-gray-300 drop-shadow-lg"
                placeholder="ค้นหาห้อง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            {/* ตัวเลือกวันที่ */}
            <div className="relative w-1/3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
                placeholderText="เลือกวันที่"
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
            </div>

            {/* ตัวเลือกเวลา */}
            <div className="relative w-1/3">
              <DatePicker
                selected={selectedTime}
                onChange={(time) => setSelectedTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                className="select select-bordered rounded-2xl w-full bg-white border border-gray-300 drop-shadow-lg"
                placeholderText="เลือกเวลา"
              />
              <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
            </div>
          </div>

          {/* ตารางแสดงห้อง */}
          <div className="overflow-x-auto h-[calc(100vh-300px)] border border-gray-800">
            <table className="table w-full">
              <thead className="text-gray-600 text-lg text-center">
                <tr>
                  <th></th>
                  <th>Room</th>
                  <th>Floor</th>
                  <th>Build</th>
                  <th>Room Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-left">Detail</th>
                  <th>Booking Detail</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room, index) => (
                    <tr
                      key={room.ROOM_ID}
                      className="text-center hover:bg-gray-200"
                    >
                      <td>{index + 1}</td>
                      <td>{room.ROOM_NAME}</td>
                      <td>{room.FLOOR_NAME}</td>
                      <td>{room.BUILD_NAME}</td>
                      <td>{room.TYPE_NAME}</td>
                      <td>{room.AMOUNT}</td>
                      <td>{room.STROOM_NAME}</td>
                      <td className="text-left">
                        {room.DETAIL.length > 20
                          ? room.DETAIL.substring(0, 20) + "..."
                          : room.DETAIL}
                      </td>
                      <td>
                        <button
                          className="bg-red-900 px-4 py-2 text-white hover:bg-red-950 rounded-xl"
                          onClick={() => {
                            localStorage.setItem(
                              "selectedRoom",
                              JSON.stringify(room)
                            );
                          }}
                        >
                          <Link to={`booking-room/${room.ROOM_NAME}`}>จอง</Link>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No rooms found!!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoom;
