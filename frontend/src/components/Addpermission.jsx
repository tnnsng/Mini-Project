import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ตรวจสอบว่าได้ติดตั้งแล้ว

const AddPermission = () => {
  const [positions, setPositions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [error, setError] = useState(null); // สถานะสำหรับข้อผิดพลาด

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/position");
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    const fetchPermissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/permission");
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPositions();
    fetchPermissions();
  }, []);

  useEffect(() => {
    const fetchPositionPermissions = async () => {
      if (selectedPosition) {
        try {
          const response = await axios.get(
            `http://localhost:5000/perposition/${selectedPosition}`
          );
          const perms = response.data.reduce((acc, perm) => {
            acc[perm.PER_ID] = true;
            return acc;
          }, {});
          setSelectedPermissions(perms);
        } catch (error) {
          console.error("Error fetching position permissions:", error);
        }
      } else {
        setSelectedPermissions({});
      }
    };
    fetchPositionPermissions();
  }, [selectedPosition]);

  const handleCheckboxChange = (permId) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  const handleEdit = async () => {
    setError(null); // รีเซ็ตข้อผิดพลาด
    try {
      const payload = {
        posi_id: selectedPosition,
        permissions: Object.keys(selectedPermissions).filter(
          (permId) => selectedPermissions[permId]
        ),
      };

      const response = await axios.post(
        "http://localhost:5000/updatePermissions",
        payload
      );
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "แก้ไขสิทธิ์สำเร็จ!",
          html: response.data.message,
          confirmButtonText: "OK",
        });
      }

      // รีเซ็ตค่าให้กลับไปเป็นค่าเริ่มต้น
      setSelectedPosition("");
      setSelectedPermissions({}); // รีเซ็ตสิทธิ์ที่เลือก
    } catch (error) {
      console.error("Error updating permissions:", error);
      setError("ไม่สามารถอัปเดตสิทธิ์ได้. กรุณาลองใหม่.");
    }
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <h1 className="text-3xl">จัดการข้อมูลสิทธิ์การใช้งาน</h1>
      </div>
      {error && <div className="text-red-600">{error}</div>}{" "}
      {/* แสดงข้อผิดพลาด */}
      <div>
        <label className="block text-lg font-medium mb-2">ตำแหน่ง</label>
        <select
          className="select select-bordered rounded-2xl min-w-72 bg-white border border-gray-300 drop-shadow-lg"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">เลือกตำแหน่ง</option>
          {positions.map((pos) => (
            <option key={pos.POSI_ID} value={pos.POSI_ID}>
              {pos.POSI_NAME}
            </option>
          ))}
        </select>
      </div>
      {permissions.map((perm) => (
        <div className="flex flex-row mt-6" key={perm.PER_ID}>
          <div className="basis-1/4 md:basis-1/3 flex items-center">
            <input
              type="checkbox"
              checked={!!selectedPermissions[perm.PER_ID]}
              onChange={() => handleCheckboxChange(perm.PER_ID)}
              className="checkbox mr-3 bg-gray-200"
              id={`perm-${perm.PER_ID}`}
            />
            <label htmlFor={`perm-${perm.PER_ID}`}>{perm.PER_NAME}</label>
          </div>
        </div>
      ))}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleEdit}
          className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950"
        >
          แก้ไขการใช้งาน
        </button>
      </div>
    </div>
  );
};

export default AddPermission;
