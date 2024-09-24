//import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";


const AddBuild = () => {

    //const [building, setBuilding] = useState('');
  
    
    return (
        <div className="p-8 bg-white text-gray-800 min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-10 ">
                <div className="flex items-center gap-10 mb-6 ">
                    <button className="btn btn-circle bg-red-900 text-white border-red-900 hover:bg-red-950">
                        <FaAngleLeft className="text-4xl" />
                    </button>
                    <h1 className="text-3xl">เพิ่มตึก</h1>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-10 ">
                    <div >
                        <label className="block">
                            <input type="text" placeholder="ชื่อ" className="mt-1 block w-72 px-3 py-2 bg-white border-2 border-red-900 rounded-2xl
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
                        </label>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 right-4">
                <button className="bg-red-900 text-2xl text-center text-white py-2 px-6 rounded-xl hover:bg-red-950">
                 เพิ่ม
                </button>
            </div>
        </div>
    );
};

export default AddBuild;
