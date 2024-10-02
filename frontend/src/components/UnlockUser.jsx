import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2";

const UnlockUser = () => {
  const [users, setUsers] = useState([]);

  // Fetch user data from API when component mounts
  useEffect(() => {
    fetch("http://203.188.54.9/~u6611850015/api/users")
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
    Swal.fire({
      title: "คุณต้องการปลดล็อกการใช้งาน?",
      text: `ของ : ${user.FNAME} ${user.LNAME}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ปลดล็อก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = {
          fname: user.FNAME,
          lname: user.LNAME,
          username: user.USERNAME,
          password: user.PASSWORD, // Send the current password
          amount: 0, // Reset amount to 0
          status_id: "SE001",
          posi_id: user.POSI_ID,
          dep_id: user.DEP_ID,
        };

        fetch(`http://203.188.54.9/~u6611850015/api/user/${user.EMP_ID}`, {
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
              Swal.fire({
                icon: "success",
                title: "ปลดล็อกการใช้งานสำเร็จ",
                text: `${user.FNAME} ${user.LNAME} ปลดล็อกการใช้งานแล้ว`,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Failed to reset the user's amount.",
              });
            }
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Error updating user.",
            });
          });
      }
    });
  };

  // Filter users that need to be unlocked
  const lockedUsers = users.filter((user) => user.AMOUNT >= 3);

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-10 mb-6">
        <h1 className="text-3xl">ปลดล็อกผู้ใช้</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="py-3 px-4 border-b font-semibold text-gray-800">
                First Name
              </th>
              <th className="py-3 px-4 border-b font-semibold text-gray-800">
                Last Name
              </th>
              <th className="py-3 px-4 border-b font-semibold text-gray-800">
                Position
              </th>
              <th className="py-3 px-4 border-b font-semibold text-gray-800">
                Department
              </th>
              <th className="py-3 px-4 border-b font-semibold text-gray-800">
                Unlock User
              </th>
            </tr>
          </thead>
          <tbody>
            {lockedUsers.length > 0 ? (
              lockedUsers.map((user) => (
                <tr key={user.EMP_ID} className=" text-center">
                  <td className="py-4 px-4 border-b text-gray-700">
                    {user.FNAME}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700">
                    {user.LNAME}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700">
                    {user.POSI_NAME}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700">
                    {user.DEP_NAME}
                  </td>
                  <td className="py-4 px-4 border-b flex justify-center">
                    <button
                      onClick={() => handleUnlock(user)}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-800 transition flex items-center gap-2"
                    >
                      <FaLock />
                      <span>ปลดล็อก</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  ไม่มีผู้ใช้โดนล็อกการใช้งาน!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnlockUser;
