import { Link } from "react-router-dom";

function AdminNavbar() {
    const handleLogout = () => {
        // 清除 localStorage 中的 token 和 role
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");

        // 跳轉刷新
        window.location.assign("/");
    };

    return (
        <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-black  h-20 sticky top-0 z-10 text-white">
            {/* Navbar */}
            <div className="container mx-auto flex justify-between items-center py-4 px-6">


                <h1 className="text-2xl font-bold tracking-wide">
                <Link to="/admin" className="hover:text-teal-400 transition">
                管理員後台
                    </Link>
                    
                    </h1>

                <nav className="flex text-xl space-x-8 font-bold mt-2">
                    
                    <Link to="/admin/hosts" className="hover:text-teal-400 transition">
                        主辦相關
                    </Link>
                    <Link to="/admin/members" className="hover:text-teal-400 transition">
                        會員資料
                    </Link>
                    <Link to="/admin/event" className="hover:text-teal-400 transition">
                        演唱會資訊
                    </Link>



                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        登出
                    </button>
                </nav>

            </div>

            <div className="h-1 bg-gradient-to-br  via-gray-600 "></div>

        </nav>
    );
}

export default AdminNavbar;
