import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Update state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to delete a user
  const handleDelete = (empId) => {
    if (window.confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) {
      fetch(`http://localhost:5000/user/${empId}`, {
        method: "DELETE", // HTTP method for deleting
      })
        .then((response) => {
          if (response.ok) {
            setUsers(users.filter((user) => user.EMP_ID !== empId)); // Update UI by removing the user
            alert("ลบผู้ใช้สำเร็จ!");
          } else {
            alert("เกิดข้อผิดพลาดขณะลบผู้ใช้");
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex items-center gap-10 mb-6">
          <h1 className="text-3xl">ผู้ใช้</h1>
        </div>

        {/* User Table */}
        <table className="table-auto w-full border border-gray-800">
          <thead>
            <tr className="text-gray-800">
              <th className="border px-6 py-4">ชื่อ</th>
              <th className="border px-6 py-4">นามสกุล</th>
              <th className="border px-6 py-4">ตำแหน่ง</th>
              <th className="border px-6 py-4">แผนก</th>
              <th className="border px-6 py-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.EMP_ID}>
                  <td className="border px-6 py-4">{user.FNAME}</td>
                  <td className="border px-6 py-4">{user.LNAME}</td>
                  <td className="border px-6 py-4">{user.POSI_ID}</td>
                  <td className="border px-6 py-4">{user.DEP_ID}</td>

                  {/* Edit and Delete Buttons in the Same Cell */}
                  <td className="border px-6 py-4">
                    <div className="flex gap-2">
                      <Link to={`/main/edit-user/${user.EMP_ID}`}>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
                          แก้ไข
                        </button>
                      </Link>

                      <button
                        className="px-4 py-2 bg-red-700 text-white rounded-lg"
                        onClick={() => handleDelete(user.EMP_ID)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-6 py-4 text-center" colSpan="7">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add New User Button */}
        <div className="flex justify-end mt-6">
          <Link to="/main/add-user">
            <button className="px-6 py-2 bg-red-700 text-white rounded-lg">
              เพิ่มผู้ใช้
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserList;
