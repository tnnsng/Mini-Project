import { FaUser, FaLock } from "react-icons/fa"; // ใช้ไอคอนจาก react-icons
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // เมื่อการล็อกอินสำเร็จ
      if (response.data.status === "ok") {
        const { token, Employee_ID, Employee_Name, Role_Name } = response.data;

        if (token && Employee_ID && Employee_Name && Role_Name) {
          // เก็บข้อมูลใน localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("Employee_ID", Employee_ID);
          localStorage.setItem("Employee_Name", Employee_Name);
          localStorage.setItem("Role_Name", Role_Name);

          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: `WELCOME : ${Employee_Name}`,
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/main"); // นำทางไปหน้า /main
          });
        } else {
          throw new Error("Missing data from the server");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
          confirmButtonText: "Try Again",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred during Login",
      });
    }
  };

  return (
    <div className="login-page flex flex-col min-h-screen">
      {/* Main Content */}
      <div
        className="content flex flex-grow items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(69, 10, 10, 0.75), rgba(69, 10, 10, 0.75)), url('/src/img/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <div className="container flex items-center justify-center flex-col md:flex-row w-full px-4">
          <div className="right-side w-full md:w-1/2 flex justify-center">
            <div
              className="login-form bg-white p-8 rounded-2xl shadow-lg w-96 max-w-md relative"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.60)" }} // พื้นหลังโปร่งใส
            >
              <h1 className="text-4xl font-extrabold mb-6 text-center text-red-900">
                LOGIN
              </h1>
              <form onSubmit={handleLogin}>
                <div className="mb-4 relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered rounded-2xl w-full mt-1 pl-10 bg-white text-gray-800"
                    placeholder="Username"
                  />
                </div>
                <div className="mb-6 relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input rounded-2xl w-full mt-1 pl-10 bg-white text-gray-800"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn border-red-900 bg-red-900 text-white py-2 px-4 text-xl font-normal w-auto rounded-2xl hover:bg-red-950 float-right"
                >
                  <Link to={"/main/choose-room"}>Login</Link>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
