import React, { useState, useEffect } from "react";

import { FaPencilAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { Link } from "react-router-dom";  // อย่าลืมนำเข้าสำหรับใช้ Link ในการนำทาง

const AllRoom = () => {
    const [building, setBuilding] = useState('');  // ตึก
    const [floor, setFloor] = useState('');  // ชั้น
    
    const [build, setBuild] = useState([]);  // รายการตึกจาก API
    const [rooms, setRooms] = useState([]);  // รายการห้องจาก API
    
    const [selectedBuild, setSelectedBuild] = useState("");  // ตึกที่ถูกเลือก
    const [selectedFloor, setSelectedFloor] = useState("");  // ชั้นที่ถูกเลือก

    // ฟังก์ชันสำหรับกรองห้องตามตึกและชั้นที่เลือก
    const filteredRooms = rooms.filter(room => {
        return (
            (selectedBuild ? room.BUILD_NAME === selectedBuild : true) &&
            (selectedFloor ? room.FLOOR_NAME === selectedFloor : true)
        );
    });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get("http://localhost:5000/room");
                setRooms(response.data); // เก็บข้อมูลห้องที่ได้จาก API
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            }
        };
        const fetchBuild = async () => {
            try {
                const response = await axios.get("http://localhost:5000/build");
                setBuild(response.data);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            }
        };

        fetchBuild();
        fetchRooms(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
    }, []);

    return (
        <div className="p-8 bg-white text-gray-800 min-h-screen">
            <h1 className="text-3xl mb-8">ห้องทั้งหมด</h1>

                {/* ปุ่มเพิ่มห้อง */}
                <div className="mb-4 flex justify-end">
                <Link to="add-room">
                    <button className="bg-red-900 px-4 py-2 text-white hover:bg-red-950 rounded-xl">
                        เพิ่มห้อง
                    </button>
                </Link>       
            </div>


           
            {/* ตารางแสดงห้อง */}
            <div className="overflow-x-auto h-[calc(100vh-300px)] border border-gray-800">
                <table className="table w-full">
                    <thead className="text-gray-600 text-lg text-center">
                        <tr>
                            <th></th>
                            <th>Room</th>
                            <th>Build</th>
                            <th>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room, index) => (
                                <tr
                                    key={room.ROOM_ID}
                                    className="text-center hover:bg-gray-200"
                                >
                                    <td>{index + 1}</td>
                                    <td>{room.ROOM_NAME}</td>
                                    <td>{room.BUILD_NAME}</td>
                                 
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
                                <td colSpan="9" className="text-center">
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
