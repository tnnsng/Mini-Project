import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import ChooseRoom from "./components/Choose-Room.jsx";
import BookingRoom from "./components/Booking-Room.jsx";
import BookingDetail from "./components/Booking-Detail.jsx";
import Report from "./components/Report.jsx";
//import ReportMeeting from "./components/ReportMeeting.jsx";



import "./index.css";

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
        path: "choose-room/*",
        element: <ChooseRoom />,
        children: [
          {
            path: "booking-room",
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
       // path:"reportmeeting",
       // element:<ReportMeeting/>
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
