import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";

const EditRoom = () => {
  const navigate = useNavigate();
  const { ROOM_ID } = useParams(); // ดึง ROOM_ID จาก URL

  const handleBack = () => {
    navigate(-1);
  };

  const [roomType, setRoomType] = useState(''); 
  const [roomCapacity, setRoomCapacity] = useState(''); 
  const [building, setBuilding] = useState(''); 
  const [floor, setFloor] = useState(''); 
  const [roomDetail, setRoomDetail] = useState(''); 
  
  const [type, setType] = useState([]); 
  const [build, setBuild] = useState([]); 
  const [floors, setFloors] = useState([]); 
  const [rooms, setRooms] = useState([]); 

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/room/${ROOM_ID}`); // ดึงข้อมูลห้องตาม ROOM_ID
        const roomData = response.data;

        setRoomType(roomData.TYPE_NAME); // ใช้ TYPE_ID แทน TYPE_NAME
        setBuilding(roomData.BUILD_NAME); // ใช้ BUILD_ID แทน BUILD_NAME
        setFloor(roomData.FLOOR_NAME);
        setRoomDetail(roomData.ROOM_DETAIL);
      } catch (error) {
        console.error("Error fetching room data:", error);
        alert("Error fetching room data");
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/room");
        setRooms(response.data); 
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    
    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:5000/type");
        setType(response.data); 
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
    
    const fetchFloor = async () => {
      try {
        const response = await axios.get("http://localhost:5000/floor");
        setFloors(response.data); 
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchRoomData(); // ดึงข้อมูลห้องเฉพาะ
    fetchRooms();
    fetchType();
    fetchBuild();
    fetchFloor();
  }, [ROOM_ID]); // ใช้ ROOM_ID ใน dependencies เพื่อให้เรียกใหม่เมื่อมีการเปลี่ยนแปลง

  // กรองชั้นตามตึกที่เลือก
  const uniqueFloors = building
    ? floors.filter((floor) => floor.BUILD_ID === building)
    : Array.from(
        new Map(floors.map((f) => [f.FLOOR_NAME, f])).values()
    );

  // ฟังก์ชันอัปเดตห้อง
  const handleUpdateRoom = async () => {
    const updatedRoom = {
      TYPE_ID: roomType,
      AMOUNT: roomCapacity,
      BUILD_ID: building,
      FLOOR_NAME: floor,
      ROOM_DETAIL: roomDetail,
    };

    try {
      const response = await axios.put(`http://localhost:5000/room/${ROOM_ID}`, updatedRoom);
      if (response.status === 200) {
        alert("แก้ไขห้องสำเร็จ!");
        navigate("/main/manage-room"); 
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตห้อง:", error);
      alert("เกิดข้อผิดพลาดขณะแก้ไขห้อง");
    }
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10 ">
        <div className="flex items-center gap-10 mb-6 ">
          <button
            onClick={handleBack}
            className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950"
          >
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl">แก้ไขห้อง</h1>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-10 ">
          <div>
            <label className="block">
              <input
                type="text"
                placeholder="ชื่อห้อง"
                value={roomDetail}
                onChange={(e) => setRoomDetail(e.target.value)}
                className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </label>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">เลือกประเภทห้อง</option>
              {type.map((type, index) => (
                <option key={index} value={type.TYPE_ID}>
                  {type.TYPE_NAME}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
            >
              <option value="">เลือกจำนวนคน</option>
              {rooms.map((room, index) => (
                <option key={index} value={room.AMOUNT}>
                  {room.AMOUNT} คน
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              <option value="">เลือกตึก</option>
              {build.map((build, index) => (
                <option key={index} value={build.BUILD_ID}>
                  {build.BUILD_NAME}
                </option>
              ))}
            </select>
          </div>
        
          <div>
            <select
              className="select select-bordered rounded-2xl w-72 bg-white border-2 border-red-900"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">เลือกชั้น</option>
              {uniqueFloors.map((floor, index) => (
                <option key={index} value={floor.FLOOR_NAME}>
                  {floor.FLOOR_NAME}
                </option>
              ))}
            </select>
          </div>

          <label className="block">
            <input
              type="text"
              placeholder="รายละเอียด"
              value={roomDetail}
              onChange={(e) => setRoomDetail(e.target.value)}
              className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </label>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button 
          onClick={handleUpdateRoom} // เรียกใช้ฟังก์ชันอัปเดตเมื่อคลิก
          className="bg-yellow-500 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-yellow-600">
          แก้ไขห้อง
        </button>
      </div>
    </div>
  );
};

export default EditRoom;
