import React, { useState, useEffect } from 'react';
import axios from 'axios'; // นำเข้า axios
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // นำเข้า format จาก date-fns

const RoomUsageChart = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [booking, setBooking] = useState([]); // เก็บข้อมูลการจองทั้งหมด
  const [loading, setLoading] = useState(false); // สำหรับแสดงสถานะกำลังโหลด

  const rooms = ['Room A', 'Room B', 'Room C', 'Room D', 'Room E'];

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // ดึงข้อมูลจาก API เมื่อมีการเปลี่ยนแปลง room หรือ selectedDate
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/booking");
        setBooking(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false); // สิ้นสุดการโหลดข้อมูล
      }
    };

    fetchBooking();
  }, [selectedRoom, selectedDate]); // ดึงข้อมูลทุกครั้งที่มีการเปลี่ยนแปลง

  // กรองข้อมูลการจองตามห้องที่ผู้ใช้เลือก
  const filteredBooking = booking.filter((booking) => {
    const matchesRoomBooking = selectedRoom ? booking.room_name === selectedRoom : true;
    return matchesRoomBooking;
  });

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">Meeting Room Booking Report</h1>
      </div>
      
      {/* ฟอร์มเลือกห้องและเดือน */}
      <div className="flex space-x-4 justify-center mb-4">
        <div>
          <label className="block mb-1">Select or Enter Room:</label>
          <input 
            list="room-list" 
            value={selectedRoom} 
            onChange={handleRoomChange} 
            className="border p-2 rounded bg-white"
            placeholder="Type or select a room"
          />
          <datalist id="room-list">
            {rooms.map((room, index) => (
              <option key={index} value={room} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block mb-1">Select Month:</label>
          <DatePicker 
            selected={selectedDate} 
            onChange={handleDateChange} 
            dateFormat="MM/yyyy" 
            showMonthYearPicker 
            className="border p-2 rounded bg-white"
          />
        </div>
      </div>

      {/* แสดงชื่อเดือนเต็ม */}
      <div className="mb-4">
        <h2 className="text-xl">{format(selectedDate, 'MMMM yyyy')}</h2> {/* แสดงชื่อเดือนและปี */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredBooking}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RoomUsageChart;
