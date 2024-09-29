import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const EditUser = () => {
  const [empId, setEmpId] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Password is optional for editing
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  //const [posiId, setPosiId] = useState("");
  //const [depId, setDepId] = useState("");

  const [position, setPosition] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const navigate = useNavigate();
  const { empID } = useParams(); // Get the user ID from the route params

  // Fetch the existing user data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:5000/users/${empID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setEmpId(data.EMP_ID);
        setFname(data.FNAME);
        setLname(data.LNAME);
        setUsername(data.USERNAME);
        setAmount(data.AMOUNT);
        setStatus(data.STATUS_ID);
        //setPosiId(data.POSI_ID);
        //setDepId(data.DEP_ID);
        setSelectedPosition(data.POSI_ID);
        setSelectedDepartment(data.DEP_ID);
        setPassword(data.PASSWORD);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data");
      });
  }, [empID]); // Use empID from useParams

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await axios.get("http://localhost:5000/position");
        setPosition(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    const fetchDepartment = async () => {
      try {
        const response = await axios.get("http://localhost:5000/dep");
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

    // User data to send to the API
    const updatedUser = {
      emp_id: empId,
      fname: fname,
      lname: lname,
      username: username,
      password: password || undefined, // Optional, only update if changed
      amount: amount,
      status_id: status,
      posi_id: selectedPosition,
      dep_id: selectedDepartment,
    };

    Swal.fire({
      title: "ยืนยันการแก้ไข",
      text: `คุณต้องการแก้ไขผู้ใช้ ${fname} ${lname} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, แก้ไขเลย!",
      cancelButtonText: "ยกเลิก",
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/user/${empID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("สำเร็จ!", "แก้ไขผู้ใช้สำเร็จ!", "success");
              navigate("/main/manage-user");
            } else {
              Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแก้ไขผู้ใช้ได้", "error");
            }
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแก้ไขผู้ใช้ได้", "error");
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
        <h1 className="text-3xl">แก้ไขข้อมูลผู้ใช้</h1>
      </div>

      {/* Form section */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* First Name input */}
          <div>
            <label className="block mb-2 text-lg">First Name</label>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="ชื่อ"
              required
            />
          </div>

          {/* Last Name input */}
          <div>
            <label className="block mb-2 text-lg">Last Name</label>
            <input
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
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
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="Username"
              required
            />
          </div>

          {/* Password input with show/hide feature */}
          <div className="relative">
            <label className="block mb-2 text-lg">PASSWORD</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="กรุณาใส่รหัสผ่านใหม่หากต้องการเปลี่ยน"
            />
            <span
              className="absolute right-3 top-12 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Position ID dropdown */}
          <div>
            <label className="block mb-2 text-lg">POSITION</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
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
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
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
            className="px-6 py-2 bg-yellow-500 text-white rounded-xl text-2xl hover:bg-yellow-800"
          >
            แก้ไขผู้ใช้
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
