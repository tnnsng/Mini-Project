import { useState, useEffect } from "react";
import axios from "axios";

const Report = () => {
  const [dataLock, setDataLock] = useState([]);
  const [department, setDepartment] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // แผนกที่เลือก

  useEffect(() => {
    const fetchLock = async () => {
      try {
        const response = await axios.get("http://localhost:5000/report_lock");
        setDataLock(response.data); // สมมติ response.data เป็น array
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    const fetchDept = async () => {
      try {
        const response = await axios.get("http://localhost:5000/dep");
        setDepartment(response.data); // สมมติ response.data เป็น array
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    const fetchReport = async () => {
      try {
        const response = await axios.get("http://localhost:5000/report_to");
        setDataReport(response.data); // สมมติ response.data เป็น array
        console.log(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchReport();
    fetchDept();
    fetchLock();
  }, []);

  const filteredData = selectedDepartment
    ? dataLock.filter((item) => item.DEP_ID === selectedDepartment)
    : dataLock;

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">Meeting Room Booking Report</h1>
      </div>
      {/* Dashboard Summary Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white pl-6 p-6 rounded-lg drop-shadow-xl">
          <h2 className="text-2xl mb-2">All Meeting Room Bookings</h2>
          <p className="text-4xl">{dataReport[0]?.RESERVE || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white pl-6 p-6 rounded-lg drop-shadow-xl">
          <h2 className="text-2xl mb-2">Meeting Room Use Amount</h2>
          <p className="text-4xl">{dataReport[0]?.USE || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-600 text-white pl-6 p-6 rounded-lg drop-shadow-xl">
          <h2 className="text-2xl mb-2">Bookings Cancel Amount</h2>
          <p className="text-4xl">{dataReport[0]?.CANCLE || 0}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">Employee Lock Report</h1>
      </div>
      <div className="flex justify-end mb-2 mr-2 text-md">
        <select
          className="select rounded-2xl w-1/4 bg-white border-1 border-gray-300 drop-shadow-xl"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Department</option>
          {department.map((dept, index) => (
            <option key={index} value={dept.DEP_ID}>
              {dept.DEP_NAME}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-gray-800 text-lg text-center">
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Lock Amount</th>
            </tr>
          </thead>
          <tbody className="text-center text-lg">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td>{index + 1}</td>
                  <td>{item.FNAME}</td>
                  <td>{item.LNAME}</td>
                  <td>{item.DEP_NAME}</td>
                  <td>{item.AMOUNT}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Don&apos;t Have Data!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
