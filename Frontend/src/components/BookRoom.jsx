import { useState } from "react";
import {
  FaBuilding,
  FaDoorOpen,
  FaDoorClosed,
  FaAngleLeft,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom-datepicker.css"; // เพิ่ม custom CSS

const BookRoom = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="flex items-center gap-6 mb-10">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl">จองห้องประชุม</h1>
        </div>
        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaDoorOpen className="mr-6 text-3xl" /> ห้อง VIP
        </div>

        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaBuilding className="mr-6 text-3xl" /> ตึก MII ชั้นที่ 1
        </div>

        <div className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaDoorClosed className="mr-6 text-3xl" /> ห้อง MII105
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่เริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่เริ่มต้น
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker"
            dateFormat="dd/MM/yyyy"
            placeholderText="เลือกวันที่เริ่มต้น"
          />
        </div>

        {/* เวลาเริ่มต้น */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาเริ่มต้น</label>
          <DatePicker
            selected={startTime}
            onChange={(time) => setStartTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="เวลา"
            dateFormat="HH:mm"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker"
            placeholderText="เลือกเวลาเริ่มต้น"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่สิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">
            วันที่สิ้นสุด
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker"
            dateFormat="dd/MM/yyyy"
            placeholderText="เลือกวันที่สิ้นสุด"
          />
        </div>

        {/* เวลาสิ้นสุด */}
        <div className="relative">
          <label className="block text-lg font-medium mb-2">เวลาสิ้นสุด</label>
          <DatePicker
            selected={endTime}
            onChange={(time) => setEndTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="เวลา"
            dateFormat="HH:mm"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900 custom-datepicker"
            placeholderText="เลือกเวลาสิ้นสุด"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
          จองห้อง
        </button>
      </div>
    </div>
  );
};

export default BookRoom;
