import {
  FaAngleLeft,
  FaBuilding,
  FaDoorOpen,
  FaDoorClosed,
  FaClock,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const CancelBooking = () => {
  const booking = JSON.parse(localStorage.getItem("selectedRoomBooking"));

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <Link to={"/main/booking-history"}>
              <FaAngleLeft className="text-4xl" />
            </Link>
          </button>
          <h1 className="text-3xl">ยกเลิกการจองห้องประชุม</h1>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-xl w-full bg-white drop-shadow-lg text-xl text-gray-800 pl-14"
              value={`: ${booking.TYPE_NAME}`}
              readOnly
            />
            <FaDoorClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-xl w-full bg-white drop-shadow-lg text-xl text-gray-800 pl-14"
              value={`: ${booking.BUILD_NAME}`}
              readOnly
            />
            <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-3xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-xl w-full bg-white drop-shadow-lg text-xl text-gray-800 pl-14"
              value={`: ${booking.ROOM_NAME}`}
              readOnly
            />
            <FaDoorOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>

        <div className="flex items-center justify-start mb-6">
          <label className="relative">
            <input
              type="text"
              className="input input-bordered rounded-xl w-full bg-white drop-shadow-lg text-xl text-gray-800 pl-14"
              value={`: ${booking.STARTDATE.split(" ")[1]} - ${
                booking.ENDDATE.split(" ")[1]
              }`}
              readOnly
            />
            <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 text-4xl" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking;
