import "./App.css";
import Menu from "./components/Menu";

function App() {
  return (
    <div className="h-screen flex transition-all duration-300 overflow-hidden">
      <aside
        className={`fixed h-full bg-gray-800 z-50 transition-transform duration-300 ease-in-out transform translate-x-0 w-52`}
      >
        <Menu />
      </aside>

      {/* Main content area */}
      <main
        className={`flex-grow px-4 bg-white text-white`} // เพิ่ม overflow-y-auto เมื่ออยู่ในหน้าที่กำหนด
      ></main>
    </div>
  );
}

export default App;
