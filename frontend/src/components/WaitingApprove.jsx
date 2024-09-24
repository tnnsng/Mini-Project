const Waiting = () => {

    return (
        <div className="p-8 bg-white text-gray-800 min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-10 ">
                <div className="flex items-center gap-10 mb-6 ">
                    <h1 className="text-3xl">ห้องที่รออนุมัติ</h1>
                </div>

                <div className="overflow-x-auto h-[calc(100vh-350px)] border border-gray-800">
                    <table className="table w-full">
                        <thead className="text-gray-800 text-lg text-center">
                            <tr>
                                <th></th>
                                <th>Room</th>
                                <th>Build</th>
                                <th>Detail</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>

            </div>
        </div >
    );
};

export default Waiting;


/* เอาปุ่ม Detail หน้าอื่นมา
<td>
    <button
        className="bg-red-900 px-4 py-2 text-white hover:bg-red-950 rounded-xl"
        onClick={() => {
            localStorage.setItem(
                "selectedRoom",
                JSON.stringify(room)
            );
        }}
    >
        <Link to={`booking-detail/${room.ROOM_NAME}`}>
            More Details
        </Link>
    </button>
</td>*/