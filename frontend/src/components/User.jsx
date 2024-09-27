import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";

const User = () => {
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
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบผู้ใช้นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบ!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/user/${empId}`, {
          method: "DELETE", // HTTP method for deleting
        })
          .then((response) => {
            if (response.ok) {
              setUsers(users.filter((user) => user.EMP_ID !== empId)); // Update UI by removing the user
              Swal.fire("ลบผู้ใช้สำเร็จ!", "", "success");
            } else {
              Swal.fire("เกิดข้อผิดพลาดขณะลบผู้ใช้", "", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-10 mb-6">
        <h1 className="text-3xl">จัดการข้อมูลผู้ใช้</h1>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto h-[calc(100vh-200px)] border border-gray-800">
        <table className="table w-full">
          <thead className="text-gray-800 text-lg text-center">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Lock Amount</th>
              <th>Status</th>
              <th>Position</th>
              <th>Department</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.EMP_ID} className="text-center text-lg">
                  <td>{user.FNAME}</td>
                  <td>{user.LNAME}</td>
                  <td>{user.USERNAME}</td>
                  <td>{user.PASSWORD}</td>
                  <td>{user.AMOUNT}</td>
                  <td>{user.STATUS_NAME}</td>
                  <td>{user.POSI_NAME}</td>
                  <td>{user.DEP_NAME}</td>

                  {/* Edit and Delete Buttons in the Same Cell */}
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      <Link to={`edit-user/${user.EMP_ID}`}>
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded-2xl hover:bg-yellow-800 flex items-center gap-2">
                          <FaPencilAlt />
                          <span>แก้ไข</span>
                        </button>
                      </Link>

                      <button
                        className="bg-red-800 text-white py-2 px-4 rounded-2xl hover:bg-red-950 flex items-center gap-2"
                        onClick={() => handleDelete(user.EMP_ID)}
                      >
                        <ImCross />
                        <span>ลบ</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-500 px-6 py-4 text-center"
                  colSpan="7"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New User Button */}
      <div className="flex justify-end mt-6">
        <Link to="add-user">
          <button className="px-6 py-2 bg-green-600 text-white text-xl rounded-xl hover:bg-green-800">
            เพิ่มผู้ใช้
          </button>
        </Link>
      </div>
    </div>
  );
};

export default User;
