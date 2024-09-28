import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [empId, setEmpId] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Password is optional for editing
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [posiId, setPosiId] = useState("");
  const [depId, setDepId] = useState("");
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
        setPosiId(data.POSI_ID);
        setDepId(data.DEP_ID);
        setPassword(data.PASSWORD);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data");
      });
  }, [empID]); // Use empID from useParams

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
      posi_id: posiId,
      dep_id: depId,
    };

    fetch(`http://localhost:5000/user/${empID}`, {
      // Use empID for the update
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          alert("แก้ไขผู้ใช้สำเร็จ!");
          navigate("/main/manage-user");
        } else {
          alert("เกิดข้อผิดพลาดขณะแก้ไขผู้ใช้");
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("เกิดข้อผิดพลาดขณะแก้ไขผู้ใช้");
      });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      {/* Back button and header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-red-700 text-3xl pr-4"
        >
          &lt;
        </button>
        <h1 className="text-3xl">แก้ไขผู้ใช้</h1>
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

          {/* Password input (optional for editing) */}
          <div>
            <label className="block mb-2 text-lg">PASSWORD</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="กรุณาใส่รหัสผ่านใหม่หากต้องการเปลี่ยน"
            />
          </div>

          {/* Amount input */}
          <div>
            <label className="block mb-2 text-lg">AMOUNT</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="Amount"
              required
            />
          </div>

          {/* Status ID input */}
          <div>
            <label className="block mb-2 text-lg">STATUS</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              placeholder="STATUS_ID"
              required
            >
              <option value="">เลือกสถานะ</option>
              <option value="POS01">ล็อก</option>
              <option value="POS02">ไม่ล็อก</option>
            </select>
          </div>

          {/* Position ID dropdown */}
          <div>
            <label className="block mb-2 text-lg">POSITION</label>
            <select
              value={posiId}
              onChange={(e) => setPosiId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              required
            >
              <option value="">เลือกตำแหน่ง</option>
              <option value="POS01">ตำแหน่ง 1</option>
              <option value="POS02">ตำแหน่ง 2</option>
            </select>
          </div>

          {/* Department dropdown */}
          <div>
            <label className="block mb-2 text-lg">DEPARTMENT</label>
            <select
              value={depId}
              onChange={(e) => setDepId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl bg-white"
              required
            >
              <option value="">เลือกแผนก</option>
              <option value="DEP01">แผนก 1</option>
              <option value="DEP02">แผนก 2</option>
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
