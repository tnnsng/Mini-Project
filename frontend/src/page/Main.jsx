import { Routes, Route } from "react-router-dom";
import Menu from "../components/Menu";
import BookingRoom from "../components/Booking-Room";
import BookingDetail from "../components/Booking-Detail";
import ChooseRoom from "../components/Choose-Room";
import BookingHistory from "../components/Booking-History";
import Report from "../components/Report";
import ReportMeeting from "../components/Report-Meeting";
import AddBuild from "../components/AddBuild.jsx";
import AddRoom from "../components/AddRoom.jsx";
import EditRoom from "../components/EditRoom.jsx";
import AddFloor from "../components/AddFloor.jsx";
import User from "../components/User.jsx";
import Waiting from "../components/WaitingApprove.jsx";
import AddPermission from "../components/AddPermission.jsx";
import CancelBooking from "../components/Cancel-Booking.jsx";
import UseRoom from "../components/UseRoom.jsx";
import EditUser from "../components/EditUser.jsx";
import AddUser from "../components/AddUser.jsx";
import UnlockUser from "../components/UnlockUser.jsx";
import AllRoom from "../components/Manage-Room.jsx";

function Main() {
  return (
    <div className="h-screen flex transition-all duration-300 overflow-hidden">
      <aside
        className={`fixed h-screen bg-gray-800 z-50 transition-transform duration-300 ease-in-out transform translate-x-0 w-52`}
      >
        <div className="flex flex-col h-full">
          <Menu />
        </div>
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
          <Route
            path="booking-history/cancel-booking/:roomName"
            element={<CancelBooking />}
          />

          <Route path="report" element={<Report />} />
          <Route path="report-meeting" element={<ReportMeeting />} />

          <Route path="manage-room" element={<AllRoom />} />
          <Route path="manage-room/add-room" element={<AddRoom />} />
          <Route path="manage-room/edit-room/:roomID" element={<EditRoom />} />

          <Route path="manage-building" element={<AddBuild />} />
          <Route path="manage-floor" element={<AddFloor />} />

          <Route path="manage-user" element={<User />} />
          <Route path="manage-user/add-user" element={<AddUser />} />
          <Route path="manage-user/edit-user/:empID" element={<EditUser />} />

          <Route path="waiting-approve" element={<Waiting />} />
          <Route path="unlock-user" element={<UnlockUser />} />
          <Route path="manage-permission" element={<AddPermission />} />
          <Route path="use-room" element={<UseRoom />} />
        </Routes>
      </main>
    </div>
  );
}

export default Main;
