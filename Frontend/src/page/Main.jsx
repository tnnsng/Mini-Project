import { Routes, Route } from "react-router-dom";
import Menu from "../components/Menu";
import BookingRoom from "../components/Booking-Room";
import BookingDetail from "../components/Booking-Detail";
import ChooseRoom from "../components/Choose-Room";
import BookingHistory from "../components/Booking-History";
import Report from "../components/Report";

function Main() {
  return (
    <div className="h-screen flex transition-all duration-300 overflow-hidden">
      <aside
        className={`fixed h-full bg-gray-800 z-50 transition-transform duration-300 ease-in-out transform translate-x-0 w-52`}
      >
        <Menu />
      </aside>

      {/* Main content area */}
      <main className={"flex-grow h-full pl-52 bg-whie text-white"}>
        <Routes>
          <Route path="home" element={<ChooseRoom />} />
          <Route path="home/booking-room/:roomName" element={<BookingRoom />} />
          <Route
            path="home/booking-detail/:roomName"
            element={<BookingDetail />}
          />
          <Route path="booking-history" element={<BookingHistory />} />
          <Route path="report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
}

export default Main;
