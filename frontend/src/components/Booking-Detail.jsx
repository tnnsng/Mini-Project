import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

const BookingDetail = () => {
  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
          <Link to={"/main/choose-room"}>
            <FaAngleLeft className="text-4xl" />
          </Link>
        </button>
        <h1 className="text-3xl">รายละเอียดการจองห้องประชุม</h1>
      </div>
    </div>
  );
};

export default BookingDetail;
