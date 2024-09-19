import { useState } from "react";
//import { useEffect } from "react";
import {
  FaBuilding,
  FaDoorOpen,
  FaDoorClosed,
  FaAngleLeft,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const BookingRoom = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  /*const [type, setType] = useState("");
  const [build, setBuild] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const storedType = localStorage.getItem("type_name");
    const storedBuild = localStorage.getItem("build_name");
    const storedFloor = localStorage.getItem("floor_name");
    const storedRoom = localStorage.getItem("room_name");

    if (storedType) {
      setType(storedType);
    }
    if (storedBuild) {
      setBuild(storedBuild);
    }
    if (storedFloor) {
      setFloor(storedFloor);
    }
    if (storedRoom) {
      setRoom(storedRoom);
    }
  });*/

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <Link to={"/main/choose-room"}>
              <FaAngleLeft className="text-4xl" />
            </Link>
          </button>
          <h1 className="text-3xl">จองห้องประชุม</h1>
        </div>

        {/* ห้อง VIP */}
        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-lg w-full bg-white border-red-900 border-2 text-gray-800 pl-14"
              value=" : " //{type}
              readOnly
            />
            <FaDoorClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-3xl" />
          </label>
        </div>

        {/* ตึก MII ชั้นที่ 1  */}
        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-lg w-full bg-white border-red-900 border-2 text-gray-800 pl-14"
              value=" : " //{build} {floor}
              readOnly
            />
            <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-3xl" />
          </label>
        </div>

        {/* ห้อง MII105 */}
        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-lg w-full bg-white border-red-900 border-2 text-gray-800 pl-14"
              value=" : " //{room}
              readOnly
            />
            <FaDoorOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-3xl" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่เริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่เริ่มต้น
          </label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker pr-10"
              dateFormat="dd/MM/yyyy"
              placeholderText="เลือกวันที่เริ่มต้น"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />{" "}
            {/* ไอคอนปฏิทิน */}
          </div>
        </div>

        {/* เวลาเริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาเริ่มต้น</label>
          <div className="relative">
            <DatePicker
              selected={startTime}
              onChange={(time) => setStartTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker pr-10"
              placeholderText="เลือกเวลาเริ่มต้น"
            />
            <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />{" "}
            {/* ไอคอนนาฬิกา */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่สิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่สิ้นสุด
          </label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker pr-10"
              dateFormat="dd/MM/yyyy"
              placeholderText="เลือกวันที่สิ้นสุด"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />{" "}
            {/* ไอคอนปฏิทิน */}
          </div>
        </div>

        {/* เวลาสิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาสิ้นสุด</label>
          <div className="relative">
            <DatePicker
              selected={endTime}
              onChange={(time) => setEndTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker pr-10"
              placeholderText="เลือกเวลาสิ้นสุด"
            />
            <FaClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />{" "}
            {/* ไอคอนนาฬิกา */}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-red-900 text-xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
          จองห้อง
        </button>
      </div>
    </div>
  );
};

export default BookingRoom;
