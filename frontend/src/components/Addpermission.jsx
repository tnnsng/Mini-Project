import { useState, useEffect } from "react";
import axios from "axios";
const AddPermission = () => {
  const [positions, setPositions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
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
            acc[perm.PER_ID] = true; // ติ๊กถูกสิทธิ์ที่เกี่ยวข้อง
            return acc;
          }, {});
          setSelectedPermissions(perms);
        } catch (error) {
          console.error("Error fetching position permissions:", error);
        }
      } else {
        setSelectedPermissions({}); // ล้างเมื่อไม่มีการเลือกตำแหน่ง
      }
    };
    fetchPositionPermissions();
  }, [selectedPosition]);
  const handleCheckboxChange = (permId) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId], // สลับสถานะการติ๊ก
    }));
  };
  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <h1 className="text-3xl">Permission</h1>
      </div>
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
        <div className="flex flex-row mt-6 " key={perm.PER_ID}>
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
      <div className="fixed bottom-6 right-4">
        <button className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
          แก้ไขการใช้งาน
        </button>
      </div>
    </div>
  );
};
export default AddPermission;
