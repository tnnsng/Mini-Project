import "./App.css";
import Menu from "./components/Menu";
//import BookRoom from "./components/BookRoom";
import ChooseRoom from "./components/ChooseRoom";

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
        className={`flex-grow h-full pl-52 bg-whie text-white overflow-y-auto`} // เพิ่ม overflow-y-auto เมื่ออยู่ในหน้าที่กำหนด
      >
        <ChooseRoom />
      </main>
    </div>
  );
}

export default App;
