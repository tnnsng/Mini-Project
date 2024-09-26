import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const Waiting = () => {
  const empID = localStorage.getItem("emp_id");
  const [waiting, setWaiting] = useState([]);

  // useEffect สำหรับดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchWaiting = async () => {
      try {
        const response = await axios.get("http://localhost:5000/waitapprove");
        setWaiting(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchWaiting();
  }, []);

  const filteredWaiting = waiting.filter((waiting) => {
    const matchesWaiting = waiting.EMP_ID ? waiting.EMP_ID === empID : true;

    return matchesWaiting;
  });

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-10 mb-6 ">
        <h1 className="text-3xl">ห้องที่รออนุมัติ</h1>
      </div>

      <div className="overflow-x-auto h-[calc(100vh-150px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-800 text-lg text-center">
            <tr>
              <th></th>
              <th>Room Name</th>
              <th>Build Name</th>
              <th>Floor Name</th>
              <th>Time</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {filteredWaiting.length > 0 ? (
              filteredWaiting.map((waiting, index) => (
                <tr key={waiting.BOOK_ID} className="text-center text-lg">
                  <td>{index + 1}</td>
                  <td>{waiting.ROOM_NAME}</td>
                  <td>{waiting.BUILD_NAME}</td>
                  <td>{waiting.FLOOR_NAME}</td>
                  <td>{`${waiting.STARTDATE.split(" ")[1]} - ${
                    waiting.ENDDATE.split(" ")[1]
                  }`}</td>
                  <td className="flex justify-center items-center">
                    <button className="bg-green-500 text-white py-2 px-4 rounded-2xl hover:bg-green-800 mr-2 flex items-center gap-2">
                      <FaCheckCircle />
                      <span>อนุมัติ</span>
                    </button>

                    <button className="bg-red-800 text-white py-2 px-4 rounded-2xl hover:bg-red-950 flex items-center gap-2">
                      <MdCancel />
                      <span>ไม่อนุมัติ</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No rooms found!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Waiting;
