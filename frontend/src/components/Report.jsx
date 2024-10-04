import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

const Report = () => {
  const [dataLock, setDataLock] = useState([]);
  const [department, setDepartment] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true); // Add loading state

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchLock = async () => {
      try {
        setLoading(true); // Set loading to true
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/report_lock");
        setDataLock(response.data);
      } catch (error) {
        console.error("Error fetching lock data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchDept = async () => {
      try {
        setLoading(true); // Set loading to true
        const response = await axios.get("http://203.188.54.9/~u6611850015/api/dep");
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching department data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchReport = async () => {
      try {
        setLoading(true); // Set loading to true
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        const response = await axios.post("http://203.188.54.9/~u6611850015/api/report_to", {
          month,
          year,
        });
        setDataReport(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDept();
    fetchLock();
    fetchReport(); // Fetch report data on component mount and date change
  }, [selectedDate]);

  const filteredData = selectedDepartment
    ? dataLock.filter((item) => item.DEP_ID === selectedDepartment)
    : dataLock;

  return (
    <div className="p-8 bg-white text-gray-800 min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-3xl">Meeting Room Booking Report</h1>
      </div>

      <div className="flex justify-center items-center mb-2">
        <div className="flex flex-row">
          <label className="w-36 p-3 mt-1">Select Month:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="border max-w-xs p-2 my-2 bg-white rounded-xl drop-shadow-lg"
          />
        </div>
      </div>

      {/* Show loading indicator */}
      {loading ? (
        <div className="text-center my-8">
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <>
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
              <p className="text-4xl">{dataReport[0]?.CANCEL || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mb-8">
            <h1 className="text-3xl">Employee Lock Report</h1>
          </div>
          <div className="flex justify-end mb-4 mr-2 text-md">
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
          <div className="overflow-x-auto border border-gray-800">
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
                    <td colSpan="5" className="text-center">
                      Don't Have Data!!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;
