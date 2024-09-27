import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import ChooseRoom from "./components/Choose-Room.jsx";
import BookingRoom from "./components/Booking-Room.jsx";
import BookingDetail from "./components/Booking-Detail.jsx";
import Report from "./components/Report.jsx";
import ReportMeeting from "./components/Report-Meeting.jsx";
import AddBuild from "./components/AddBuild.jsx";
import AddRoom from "./components/AddRoom.jsx";
import EditRoom from "./components/EditRoom.jsx";
import AddFloor from "./components/AddFloor.jsx";

import "./index.css";
import User from "./components/User.jsx";
import Waiting from "./components/WaitingApprove.jsx";
import AddPermission from "./components/AddPermission.jsx";
import BookingHistory from "./components/Booking-History.jsx";
import CancelBooking from "./components/Cancel-Booking.jsx";
import UseRoom from "./components/UseRoom.jsx";
import EditUser from "./components/EditUser.jsx";
import AddUser from "./components/AddUser.jsx";
import UnlockUser from "./components/UnlockUser.jsx";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "main/*",
    element: <Main />,
    children: [
      {
        path: "home/*",
        element: <ChooseRoom />,
        children: [
          {
            path: "booking-room/:roomName",
            element: <BookingRoom />,
          },
          {
            path: "booking-detail/:roomName",
            element: <BookingDetail />,
          },
        ],
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "report-meeting",
        element: <ReportMeeting />,
      },
      {
        path: "manage-room/*",
        element: <AddRoom />,
        children: [
          {
            path: "edit-room",
            element: <EditRoom />,
          },
        ],
      },
      {
        path: "manage-building",
        element: <AddBuild />,
      },
      {
        path: "booking-history/*",
        element: <BookingHistory />,
        children: [
          {
            path: "cancel-booking/:roomName",
            element: <CancelBooking />,
          },
        ],
      },
      {
        path: "manage-floor",
        element: <AddFloor />,
      },
      {
        path: "unlock-user",
        element: <UnlockUser />,
      },
      {
        path: "manage-user",
        element: <User />,
        children: [
          {
            path: "add-room",
            element: <AddUser />,
          },
          {
            path: "edit-user/:empID",
            element: <EditUser />,
          },
        ],
      },
      {
        path: "waiting-approve",
        element: <Waiting />,
      },
      {
        path: "manage-permission",
        element: <AddPermission />,
      },
      {
        path: "use-room",
        element: <UseRoom />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
