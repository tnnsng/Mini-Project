import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const ReportMeeting = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); // State for no data condition
  const [rooms, setRooms] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/room");
        setRooms(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchShow = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/report_1", {
          params: {
            room: selectedRoom,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });

        if (response.data.message === "No data available") {
          setNoData(true); // Set noData state to true if no data is available
          setBooking([]); // Clear the booking data
        } else {
          setNoData(false); // Reset noData state
          // Transform the data for displaying in the graph
          const transformedData = response.data.data.map((item) => ({
            ROOM_NAME: item[0],
            BOOKING_DATE: format(new Date(item[1]), "dd/MM/yyyy"),
            TOTAL_BOOKINGS: item[2],
          }));
          setBooking(transformedData); // Set transformed data
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedRoom && selectedDate) {
      fetchShow();
    }
  }, [selectedRoom, selectedDate]);

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">Meeting Room Booking Report</h1>
      </div>

      {/* ฟอร์มเลือกห้องและเดือน */}
      <div className="flex space-x-4 justify-center mb-4">
        <div>
          <label className="block mb-1">Select Room:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border p-2 rounded bg-white"
          >
            <option value="">Select a Room...</option>
            {rooms.map((room, index) => (
              <option key={index} value={room.ROOM_NAME}>
                {room.ROOM_NAME}
              </option>
            ))}
          </select>
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
        <h2 className="text-xl">{format(selectedDate, "MMMM yyyy")}</h2>
      </div>

      {noData ? ( // If no data is available, show "No data available" message
        <p>No data available for the selected month</p>
      ) : !loading && booking.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={booking}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="BOOKING_DATE" />{" "}
            {/* ใช้ BOOKING_DATE ที่สอดคล้องกับข้อมูลที่แปลงแล้ว */}
            <YAxis ticks={[5, 15, 25, 35, 45]} domain={[0, 50]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="TOTAL_BOOKINGS" fill="#8884d8" />{" "}
            {/* ใช้ TOTAL_BOOKINGS ที่สอดคล้องกับข้อมูลที่แปลงแล้ว */}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p> // แสดงข้อความเมื่อไม่มีข้อมูล
      )}
    </div>
  );
};

export default ReportMeeting;
