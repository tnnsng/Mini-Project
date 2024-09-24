import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const [empId, setEmpId] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [amount, setAmount] = useState(0);
    const [statusId, setStatusId] = useState("");
    const [posiId, setPosiId] = useState("");
    const [depId, setDepId] = useState("");
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // User data to send to the API
        const newUser = {
            emp_id: empId,
            fname: fname,
            lname: lname,
            username: username,
            password: password,
            amount: amount,
            status_id: statusId,
            posi_id: posiId,
            dep_id: depId,
        };


        // API call to add user
        fetch("http://localhost:5000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
        .then((response) => {
            if (response.ok) {
                alert("เพิ่มผู้ใช้สำเร็จ!");
                navigate("/main/manage-user"); // Redirect back to the user management page
            } else {
                alert("เกิดข้อผิดพลาดขณะเพิ่มผู้ใช้");
            }
        })
        .catch((error) => {
            console.error("Error adding user:", error);
            alert("เกิดข้อผิดพลาดขณะเพิ่มผู้ใช้");
        });
    };

    return (
        <div className="p-8 bg-white text-gray-800 min-h-screen">
            {/* Back button and header */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-red-700 text-3xl pr-4">&lt;</button>
                <h1 className="text-3xl">เพิ่มผู้ใช้</h1>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6 mb-10">
                    {/* Employee ID input */}
                    <div>
                        <label className="block mb-2 text-sm">รหัสพนักงาน (EMP_ID)</label>
                        <input
                            type="text"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="EMP_ID"
                            required
                        />
                    </div>

                    {/* First Name input */}
                    <div>
                        <label className="block mb-2 text-sm">ชื่อ (FNAME)</label>
                        <input
                            type="text"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="ชื่อ"
                            required
                        />
                    </div>

                    {/* Last Name input */}
                    <div>
                        <label className="block mb-2 text-sm">นามสกุล (LNAME)</label>
                        <input
                            type="text"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="นามสกุล"
                            required
                        />
                    </div>

                    {/* Username input */}
                    <div>
                        <label className="block mb-2 text-sm">ชื่อผู้ใช้ (USERNAME)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Username"
                            required
                        />
                    </div>

                    {/* Password input */}
                    <div>
                        <label className="block mb-2 text-sm">รหัสผ่าน (PASSWORD)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {/* Amount input */}
                    <div>
                        <label className="block mb-2 text-sm">จำนวน (AMOUNT)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Amount"
                            required
                        />
                    </div>

                    {/* Status ID input */}
                    <div>
                        <label className="block mb-2 text-sm">สถานะ (STATUS_ID)</label>
                        <input
                            type="text"
                            value={statusId}
                            onChange={(e) => setStatusId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="STATUS_ID"
                            required
                        />
                    </div>

                    {/* Position ID dropdown */}
                    <div>
                        <label className="block mb-2 text-sm">ตำแหน่ง (POSI_ID)</label>
                        <select
                            value={posiId}
                            onChange={(e) => setPosiId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">เลือกตำแหน่ง</option>
                            <option value="POS01">ตำแหน่ง 1</option>
                            <option value="POS02">ตำแหน่ง 2</option>
                        </select>
                    </div>

                    {/* Department dropdown */}
                    <div>
                        <label className="block mb-2 text-sm">แผนก (DEP_ID)</label>
                        <select
                            value={depId}
                            onChange={(e) => setDepId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                        className="px-6 py-2 bg-red-700 text-white rounded-lg"
                    >
                        เพิ่มผู้ใช้
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
