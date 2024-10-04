import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const AddUser = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [position, setPosition] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/position");
        setPosition(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchDepartment = async () => {
      try {
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/dep");
        setDepartment(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchDepartment();
    fetchPosition();
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // หาชื่อของ Position และ Department ตาม ID ที่เลือก
    const posiName = position.find(
      (posi) => posi.POSI_ID === selectedPosition
    )?.POSI_NAME;
    const depName = department.find(
      (dep) => dep.DEP_ID === selectedDepartment
    )?.DEP_NAME;

    // ข้อมูลผู้ใช้ที่เพิ่มมาแสดงใน SweetAlert ก่อนบันทึก
    const newUser = {
      fname: fname,
      lname: lname,
      username: username,
      password: password,
      amount: 0,
      status_id: "SE001",
      posi_id: selectedPosition,
      dep_id: selectedDepartment,
    };

    // แสดงการยืนยันด้วยข้อมูลที่กรอก
    Swal.fire({
      title: "ยืนยันการเพิ่มผู้ใช้",
      html: `
        <strong>First Name:</strong> ${newUser.fname}<br />
        <strong>Last Name:</strong> ${newUser.lname}<br />
        <strong>Username:</strong> ${newUser.username}<br />
        <strong>Password:</strong> ${newUser.password}<br />
        <strong>Position:</strong> ${posiName}<br />
        <strong>Department:</strong> ${depName}<br />
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้ายืนยัน ให้ส่งข้อมูลไปยัง API
        fetch("http://203.188.54.9/~u6611850015/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("เพิ่มผู้ใช้สำเร็จ!", "", "success");
              navigate("/main/manage-user"); // Redirect back to the user management page
            } else {
              Swal.fire("เกิดข้อผิดพลาดขณะเพิ่มผู้ใช้", "", "error");
            }
          })
          .catch((error) => {
            console.error("Error adding user:", error);
            Swal.fire("เกิดข้อผิดพลาดขณะเพิ่มผู้ใช้", "", "error");
          });
      }
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      {/* Back button and header */}
      <div className="flex items-center mb-6 gap-6">
        <button
          className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950"
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft className="text-4xl" />
        </button>
        <h1 className="text-3xl">เพิ่มผู้ใช้</h1>
      </div>

      {/* Form section */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* First Name input */}
          <div>
            <label className="block mb-2 text-lg">FIRST NAME</label>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              placeholder="ชื่อ"
              required
            />
          </div>

          {/* Last Name input */}
          <div>
            <label className="block mb-2 text-lg">LAST NAME</label>
            <input
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              placeholder="นามสกุล"
              required
            />
          </div>

          {/* Username input */}
          <div>
            <label className="block mb-2 text-lg">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              placeholder="Username"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block mb-2 text-lg">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              placeholder="Password"
              required
            />
          </div>

          {/* Position ID dropdown */}
          <div>
            <label className="block mb-2 text-lg">POSITION</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              required
            >
              <option value="">เลือกตำแหน่ง</option>
              {position.map((posi, index) => (
                <option key={index} value={posi.POSI_ID}>
                  {posi.POSI_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* Department dropdown */}
          <div>
            <label className="block mb-2 text-lg">DEPARTMENT</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white"
              required
            >
              <option value="">เลือกแผนก</option>
              {department.map((dep, index) => (
                <option key={index} value={dep.DEP_ID}>
                  {dep.DEP_NAME}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white text-xl rounded-xl hover:bg-green-800"
          >
            เพิ่มผู้ใช้
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
