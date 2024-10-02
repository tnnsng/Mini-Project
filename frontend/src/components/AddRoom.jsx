import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AddRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [roomDetail, setRoomDetail] = useState("");
  const [roomStatus, setRoomStatus] = useState(""); // สำหรับสถานะห้อง
  const [emp, setEmp] = useState(""); // สำหรับพนักงาน

  const [type, setType] = useState([]);
  const [build, setBuild] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]); // รายการสถานะห้อง
  const [employees, setEmployees] = useState([]); // รายการพนักงาน

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
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

    fetchEmployees();
    fetchStatuses();
    fetchBuild();
    fetchFloor();
    fetchType();
  }, []);

  const handleAddRoom = async () => {
    if (
      !roomName ||
      !roomType ||
      !roomCapacity ||
      !building ||
      !floor ||
      !roomStatus ||
      !emp
    ) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "warning");
      return;
    }

    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการเพิ่มห้องนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เพิ่มเลย!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const newRoom = {
          room_name: roomName,
          amount: Number(roomCapacity),
          detail: roomDetail,
          build_id: building,
          floor_id: floor,
          type_id: roomType,
          stroom_id: roomStatus,
          emp_id: emp,
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
              Swal.fire("สำเร็จ!", "เพิ่มห้องสำเร็จ!", "success").then(() => {
                navigate("/main/manage-room");
              });
            } else {
              Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มห้องได้", "error");
            }
          })
          .catch((error) => {
            console.error("Error adding room:", error);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มห้องได้", "error");
          });
      }
    });
  };

  // กรองชั้นตามตึกที่เลือก
  const uniqueFloors = building
    ? floors.filter((floor) => floor.BUILD_ID === building)
    : Array.from(new Map(floors.map((f) => [f.FLOOR_NAME, f])).values());

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

          {/* ตึก ชั้น*/}
          <div className="flex flex-cols-2 gap-6">
            <div className="col-span-1 w-full">
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

            <div className="col-span-1 w-full">
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
          </div>

          {/* รายละเอียด */}
          <div className="col-span-2">
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

      <div className="fixed right-8">
        <button
          onClick={handleAddRoom}
          className="bg-green-500 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-green-800"
        >
          เพิ่ม
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
