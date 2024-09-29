import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // อย่าลืมนำเข้าสำหรับใช้ Link ในการนำทาง

const AllRoom = () => {
  const [rooms, setRooms] = useState([]); // รายการห้องจาก API

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/room");
        setRooms(response.data); // เก็บข้อมูลห้องที่ได้จาก API
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchRooms(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  // Function to delete a user
  const handleDelete = (roomID) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบห้องนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบ!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/room/${roomID}`, {
          method: "DELETE", // HTTP method for deleting
        })
          .then((response) => {
            if (response.ok) {
              setRooms(rooms.filter((room) => room.ROOM_ID !== roomID)); // Update UI by removing the user
              Swal.fire("ลบห้องสำเร็จ!", "", "success");
            } else {
              Swal.fire("เกิดข้อผิดพลาดขณะลบห้อง", "", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <h1 className="text-3xl mb-6">ข้อมูลห้องทั้งหมด</h1>

      {/* ปุ่มเพิ่มห้อง */}
      <div className="mb-4 flex justify-end">
        <Link to="add-room">
          <button className="bg-green-500 px-4 py-2 text-white hover:bg-green-800 rounded-2xl">
            เพิ่มห้อง
          </button>
        </Link>
      </div>

      {/* ตารางแสดงห้อง */}
      <div className="overflow-x-auto h-[calc(100vh-300px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-600 text-xl text-center">
            <tr>
              <th></th>
              <th>Room</th>
              <th>Build</th>
              <th>Floor</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <tr
                  key={room.ROOM_ID}
                  className="text-center hover:bg-gray-200"
                >
                  <td>{index + 1}</td>
                  <td>{room.ROOM_NAME}</td>
                  <td>{room.BUILD_NAME}</td>
                  <td>{room.FLOOR_NAME}</td>

                  {/* Edit and Delete Buttons in the Same Cell */}
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      <Link to={`edit-room/${room.ROOM_ID}`}>
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded-2xl hover:bg-yellow-800 flex items-center gap-2">
                          <FaPencilAlt />
                          <span>แก้ไข</span>
                        </button>
                      </Link>

                      <button
                        className="bg-red-800 text-white py-2 px-4 rounded-2xl hover:bg-red-950 flex items-center gap-2"
                        onClick={() => handleDelete(room.ROOM_ID)}
                      >
                        <ImCross />
                        <span>ลบ</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  ไม่พบห้องใดๆ !!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRoom;
