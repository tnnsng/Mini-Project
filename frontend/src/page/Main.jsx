import { Routes, Route } from "react-router-dom";
import Menu from "../components/Menu";
import BookingRoom from "../components/Booking-Room";
import BookingDetail from "../components/Booking-Detail";
import ChooseRoom from "../components/Choose-Room";
import BookingHistory from "../components/Booking-History";
import Report from "../components/Report";
import ReportMeeting from "../components/ReportMeeting";

function Main() {
  return (
    <div className="h-screen flex transition-all duration-300 overflow-hidden">
      <aside
        className={`fixed h-full bg-gray-800 z-50 transition-transform duration-300 ease-in-out transform translate-x-0 w-52`}
      >
        <Menu />
      </aside>

      {/* Main content area */}
      <main
        className={`flex-grow h-full pl-52 bg-whie text-white overflow-y-auto`} // เพิ่ม overflow-y-auto เมื่ออยู่ในหน้าที่กำหนด
      >
        <Routes>
          <Route path="choose-room" element={<ChooseRoom />} />
          <Route path="choose-room/booking-room" element={<BookingRoom />} />
          <Route
            path="choose-room/booking-detail/:roomName"
            element={<BookingDetail />}
          />
          <Route path="booking-history" element={<BookingHistory />} />
          <Route path="report" element={<Report />} />
          <Route path="reportmeeting" element={<ReportMeeting />} />
        </Routes>
      </main>
    </div>
  );
}

export default Main;
