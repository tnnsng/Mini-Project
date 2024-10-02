import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const AddRoom = () => {
  const [roomName, setRoomName] = useState('');  
  const [roomType, setRoomType] = useState('');  
  const [roomCapacity, setRoomCapacity] = useState('');  
  const [building, setBuilding] = useState('');  
  const [floor, setFloor] = useState('');  
  const [roomDetail, setRoomDetail] = useState('');  

  const [type, setType] = useState([]);  
  const [build, setBuild] = useState([]);  
  const [floors, setFloors] = useState([]);  
  const [rooms, setRooms] = useState([]);  
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/room");
        setRooms(response.data);  
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    
    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:5000/type");
        setType(response.data);  
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    
    const fetchBuild = async () => {
      try {
        const response = await axios.get("http://localhost:5000/build");
        setBuild(response.data);  
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    
    const fetchFloor = async () => {
      try {
        const response = await axios.get("http://localhost:5000/floor");
        setFloors(response.data);  
      } catch (error) {
        console.error("Error fetching floors:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchBuild();
    fetchFloor();
    fetchType();
    fetchRooms();
  }, []);

  const uniqueFloors = floors.filter((floor) => {
    if (building) {
      return floor.BUILD_ID === building;  
    }
    return true;  
  });

  const handleAddRoom = async () => {
    if (!roomName || !roomType || !roomCapacity || !building || !floor) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newRoom = {
      ROOM_NAME: roomName,
      TYPE_ID: roomType,
      AMOUNT: roomCapacity,
      BUILD_ID: building,
      FLOOR_NAME: floor,
      ROOM_DETAIL: roomDetail,
    };

    fetch("http://localhost:5000/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoom),
    })
      .then((response) => {
        if (response.ok) {
          alert("เพิ่มห้องสำเร็จ!");
          navigate("/main/manage-room"); 
        } else {
          alert("เกิดข้อผิดพลาดขณะเพิ่มห้อง");
        }
      })
      .catch((error) => {
        console.error("Error adding room:", error);
        alert("เกิดข้อผิดพลาดขณะเพิ่มห้อง");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="flex items-center gap-10 mb-6">
          <button
            onClick={handleBack}
            className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950"
          >
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl">เพิ่มห้อง</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-10"> 
          <div>
            <label className="block">
              <input
                type="text"
                placeholder="ชื่อ"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
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
              {rooms.map((amount, index) => (
                <option key={index} value={amount.AMOUNT}>
                  {amount.AMOUNT} คน
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
          onClick={handleAddRoom} 
          className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
          เพิ่ม
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
