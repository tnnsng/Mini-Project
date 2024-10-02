import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";

const Waiting = () => {
  const empID = localStorage.getItem("emp_id");
  const [waiting, setWaiting] = useState([]);

  useEffect(() => {
    const fetchWaiting = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/waitapprove");
        setWaiting(response.data);
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

  const handleApprove = async (bookId) => {
    try {
      const response = await fetch(`http://203.188.54.9/~u6611850015/api/approved/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResult = await response.json();
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: errorResult.error || "เกิดข้อผิดพลาดในการอนุมัติ",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "เสร็จสิ้น",
        text: "อนุมัติการจองสำเร็จ",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error booking room:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะอนุมัติการจองห้องประชุม กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleNotApprove = async (bookId) => {
    const { value: reason } = await Swal.fire({
      title: "เหตุผลในการไม่อนุมัติ",
      input: "text",
      inputPlaceholder: "กรุณากรอกเหตุผล...",
      showCancelButton: true,
      confirmButtonText: "ส่ง",
      cancelButtonText: "ยกเลิก",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("กรุณากรอกเหตุผล!");
        }
      },
    });

    if (reason) {
      try {
        const response = await fetch("http://203.188.54.9/~u6611850015/api/not-approved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: bookId,
            reason: reason,
          }),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: errorResult.error || "เกิดข้อผิดพลาดในการไม่อนุมัติ",
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "เสร็จสิ้น",
          text: "ไม่อนุมัติการจองสำเร็จ",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error booking room:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดขณะอนุมัติการจองห้องประชุม กรุณาลองใหม่อีกครั้ง",
        });
      }
    }
  };

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
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-2xl hover:bg-green-800 mr-2 flex items-center gap-2"
                      onClick={() => handleApprove(waiting.BOOK_ID)}
                    >
                      <FaCheckCircle />
                      <span>อนุมัติ</span>
                    </button>

                    <button
                      className="bg-red-800 text-white py-2 px-4 rounded-2xl hover:bg-red-950 flex items-center gap-2"
                      onClick={() => handleNotApprove(waiting.BOOK_ID)}
                    >
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
