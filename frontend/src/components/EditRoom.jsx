import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";

const EditRoom = () => {
    const [roomType, setRoomType] = useState('');
    const [roomCapacity, setRoomCapacity] = useState(''); 
    const [building, setBuilding] = useState('');
    const [floor, setFloor] = useState('');
    
    return (
        <div className="p-8 bg-white text-gray-800 min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-10 ">
                <div className="flex items-center gap-10 mb-6 ">
                    <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
                        <FaAngleLeft className="text-4xl" />
                    </button>
                    <h1 className="text-3xl">แก้ไขห้อง</h1>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-10 ">
                <div >
                    <label className="block">
                        <input type="text" placeholder="ชื่อ" className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
                    </label>
                </div>
        
                <div>
                    <select
                        className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <option value="">เลือกประเภทห้อง</option>
                        <option value="ทั่วไป">ห้องทั่วไป</option>
                        <option value="VIP">ห้อง VIP</option>
                    </select>
                </div>

                <div>
                    <select
                        className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
                        value={roomCapacity}
                        onChange={(e) => setRoomCapacity(e.target.value)}
                    >
                        <option value="">เลือกจำนวนคน</option>
                        <option value="5">6 คน</option>
                        <option value="6">10 คน</option>
                        <option value="20">20 คน</option>
                    </select>
                </div>

                <div>
                    <select
                        className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                    >
                        <option value="">เลือกชั้น</option>
                        <option value="1">ชั้น 1</option>
                        <option value="2">ชั้น 2</option>
                        <option value="3">ชั้น 3</option>
                    </select>
                </div>

                <div>
                    <select
                        className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                    >
                        <option value="">เลือกตึก</option>
                        <option value="A">ตึก A</option>
                        <option value="B">ตึก B</option>
                        <option value="C">ตึก C</option>
                    </select>
                </div>

                <label className="block">
                    <input type="text" placeholder="รายละเอียด" className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
                </label>
            </div>
            </div>

            <div className="fixed bottom-4 right-4">
                <button className="bg-yellow-500 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-yellow-600">
                    แก้ไขห้อง
                </button>
            </div>
        </div>
    );
};

export default EditRoom;
