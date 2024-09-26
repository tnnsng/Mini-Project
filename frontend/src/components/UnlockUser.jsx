import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";

const CreateTable = () => {
  const [users, setUsers] = useState([]);

  // Fetch user data from API when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data); // Assuming data is an array of users
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data");
      });
  }, []);

  // Function to reset amount to 0 and send other user data
  const handleUnlock = (user) => {
    const updatedUser = {
      fname: user.FNAME,
      lname: user.LNAME,
      username: user.USERNAME,
      password: user.PASSWORD, // Send the current password
      amount: 0, // Reset amount to 0
      status_id: user.STATUS_ID,
      posi_id: user.POSI_ID,
      dep_id: user.DEP_ID,
    };

    fetch(`http://localhost:5000/user/${user.EMP_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          // Update local state after successful unlock
          setUsers(
            users.map((u) =>
              u.EMP_ID === user.EMP_ID ? { ...u, AMOUNT: 0 } : u
            )
          );
        } else {
          alert("Failed to reset amount");
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Error updating user");
      });
  };

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="grid grid-cols-1 gap-6 mb-10 ">
        <div className="flex items-center gap-10 mb-6 ">
          <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
            <FaAngleLeft className="text-4xl" />
          </button>
          <h1 className="text-3xl font-semibold">ปลดล็อก</h1>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="py-3 px-4 border-b  font-semibold text-gray-600">
                ชื่อพนักงาน
              </th>
              <th className="py-3 px-4 border-b  font-semibold text-gray-600">
                วันที่
              </th>
              <th className="py-3 px-4 border-b font-semibold text-gray-600">
                ปลดล็อก
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user.AMOUNT >= 3 && ( // Only show rows where AMOUNT is 3
                  <tr
                    key={user.EMP_ID}
                    className="hover:bg-gray-100 text-center"
                  >
                    <td className="py-4 px-4 border-b text-gray-700">
                      {user.FNAME} {user.LNAME}
                    </td>
                    <td className="py-4 px-4 border-b text-gray-700">
                      {/* Display the current date */}
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 border-b">
                      <button
                        onClick={() => handleUnlock(user)}
                        className="px-4 py-2 bg-red-700 text-white rounded-lg shadow hover:bg-red-800 transition"
                      >
                        ปลดล็อก
                      </button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateTable;
