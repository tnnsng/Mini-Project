import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditRoom = () => {
  const navigate = useNavigate();
  const { roomID } = useParams(); // ดึง ROOM_ID จาก URL

  const handleBack = () => {
    navigate(-1);
  };

  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [roomDetail, setRoomDetail] = useState("");
  const [roomStatus, setRoomStatus] = useState(""); // สำหรับสถานะห้อง
  const [emp, setEmp] = useState(""); // สำหรับพนักงาน

  const [type, setType] = useState([]); // รายการประเภทห้อง
  const [build, setBuild] = useState([]); // รายการตึก
  const [floors, setFloors] = useState([]); // รายการชั้น
  const [statuses, setStatuses] = useState([]); // รายการสถานะห้อง
  const [employees, setEmployees] = useState([]); // รายการพนักงาน

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/room/${roomID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const roomData = await response.json();

        // ตั้งค่าข้อมูลห้องก่อนการแก้ไข
        setRoomName(roomData.ROOM_NAME);
        setRoomType(roomData.TYPE_ID);
        setRoomCapacity(roomData.AMOUNT);
        setBuilding(roomData.BUILD_ID);
        setFloor(roomData.FLOOR_ID);
        setRoomDetail(roomData.DETAIL);
        setRoomStatus(roomData.STROOM_ID);
        setEmp(roomData.EMP_ID);
      } catch (error) {
        console.error("Error fetching room data:", error);
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูลห้อง",
          text: "ไม่สามารถดึงข้อมูลห้องได้",
          confirmButtonText: "ตกลง",
        });
      }
    };

    fetchRoomData();

    // ฟังก์ชันสำหรับดึงข้อมูลเพิ่มเติม (ประเภท ตึก ชั้น สถานะห้อง และพนักงาน)
    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/type");
        setType(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    const fetchBuilds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/build");
        setBuild(response.data);
      } catch (error) {
        console.error("Error fetching builds:", error);
      }
    };

    const fetchFloors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/floor");
        setFloors(response.data);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/status");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTypes();
    fetchBuilds();
    fetchFloors();
    fetchStatuses();
    fetchEmployees();
  }, [roomID]);

  // กรองชั้นตามตึกที่เลือก
  const uniqueFloors = building
    ? floors.filter((floor) => floor.BUILD_ID === building)
    : Array.from(new Map(floors.map((f) => [f.FLOOR_NAME, f])).values());

  // ฟังก์ชันอัปเดตห้อง
  const handleUpdateRoom = async () => {
    const updatedRoom = {
      TYPE_ID: roomType,
      AMOUNT: roomCapacity,
      BUILD_ID: building,
      FLOOR_ID: floor,
      DETAIL: roomDetail,
      ROOM_NAME: roomName,
      STROOM_ID: roomStatus,
      EMP_ID: emp,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/room/${roomID}`,
        updatedRoom
      );
      if (response.status === 200) {
        // แจ้งเตือนสำเร็จด้วย SweetAlert
        await Swal.fire({
          icon: "success",
          title: "แก้ไขห้องสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/main/manage-room");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตห้อง:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขห้องได้",
        confirmButtonText: "ตกลง",
      });
    }
  };

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
          <h1 className="text-3xl">แก้ไขห้อง</h1>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* ชื่อห้อง */}
          <div className="col-span-1">
            <label className="block">ชื่อห้อง</label>
            <input
              type="text"
              placeholder="ชื่อห้อง"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-500 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* ประเภทห้อง */}
          <div className="col-span-1">
            <label className="block">ประเภทห้อง</label>
            <select
              className="select select-bordered rounded-xl w-full bg-white border border-gray-500"
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

          {/* จำนวนการบรรจุ */}
          <div className="col-span-1">
            <label className="block">จำนวนการบรรจุ</label>
            <input
              type="text"
              placeholder="จำนวนการบรรจุ"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-500 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* ตึก */}
          <div className="col-span-1">
            <label className="block">ตึก</label>
            <select
              className="select select-bordered rounded-xl w-full bg-white border border-gray-500"
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

          {/* ชั้น */}
          <div className="col-span-1">
            <label className="block">ชั้น</label>
            <select
              className="select select-bordered rounded-xl w-full bg-white border border-gray-500"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
            >
              <option value="">เลือกชั้น</option>
              {uniqueFloors.map((floor, index) => (
                <option key={index} value={floor.FLOOR_ID}>
                  {floor.FLOOR_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* รายละเอียด */}
          <div className="col-span-1">
            <label className="block">รายละเอียด</label>
            <input
              type="text"
              placeholder="รายละเอียด"
              value={roomDetail}
              onChange={(e) => setRoomDetail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-500 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* สถานะห้อง */}
          <div className="col-span-1">
            <label className="block">สถานะห้อง</label>
            <select
              className="select select-bordered rounded-xl w-full bg-white border border-gray-500"
              value={roomStatus}
              onChange={(e) => setRoomStatus(e.target.value)}
            >
              <option value="">เลือกสถานะห้อง</option>
              {statuses.map((status, index) => (
                <option key={index} value={status.STROOM_ID}>
                  {status.STROOM_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* พนักงาน */}
          <div className="col-span-1">
            <label className="block">พนักงาน</label>
            <select
              className="select select-bordered rounded-xl w-full bg-white border border-gray-500"
              value={emp}
              onChange={(e) => setEmp(e.target.value)}
            >
              <option value="">เลือกพนักงาน</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee.EMP_ID}>
                  {employee.FNAME} {employee.LNAME}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="fixed flex right-4">
        <button
          onClick={handleUpdateRoom} // เรียกใช้ฟังก์ชันอัปเดตเมื่อคลิก
          className="bg-yellow-500 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-yellow-600"
        >
          แก้ไขห้อง
        </button>
      </div>
    </div>
  );
};

export default EditRoom;
