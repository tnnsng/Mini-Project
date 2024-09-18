import { useState } from "react";
import { FaBuilding,FaDoorOpen,FaDoorClosed,FaAngleLeft } from "react-icons/fa"; 

const BookRoom = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10">
      <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950"> <FaAngleLeft className="text-4xl" /></button>
      <div className="flex flex-col mb-8">
          <h1 className="text-3xl">จองห้องประชุม</h1>
      </div>
        <div  className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaDoorOpen className="mr-6 text-3xl" /> ห้อง VIP
        </div>

        <div  className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaBuilding className="mr-6 text-3xl" /> ตึก MII ชั้นที่ 1
        </div>

        <div  className="flex items-center justify-start text-2xl text-gray-800 mb-6">
          <FaDoorClosed className="mr-6 text-3xl" /> ห้อง MII105
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* วันที่เริ่มต้น */}
        <div>
          <label className="block text-lg font-medium mb-2 ">วันที่เริ่มต้น</label>
          <input
            type="date"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* เวลาเริ่มต้น */}
        <div>
          <label className="block text-lg font-medium mb-2">เวลาเริ่มต้น</label>
          <input
            type="time"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
      {/* วันที่สิ้นสุด */}
      <div>
          <label className="block text-lg font-medium mb-2">วันที่สิ้นสุด</label>
          <input
            type="date"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* เวลาสิ้นสุด */}
      <div>
          <label className="block text-lg font-medium mb-2">เวลาสิ้นสุด</label>
          <input
            type="time"
            className="input input-bordered rounded-2xl w-full bg-white border-2 border-red-900"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      

      <div className="flex justify-end">
            <button className="bg-red-900 text-xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">จองห้อง</button>
          </div>

      
      </div>
  );
};

export default BookRoom;
