import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 清除 localStorage 中的 token 和 role
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");


        // 跳轉到首頁
        navigate("/");
        window.location.reload(); // 強制刷新頁面

    };


    return (
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white py-4 px-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-wide">管理員後台</h1>
                <nav className="flex space-x-6">
                    <Link to="/admin" className="hover:text-lime-400 transition">
                        首頁
                    </Link>
                    <Link to="/admin/hosts" className="hover:text-lime-400 transition">
                        新增主辦
                    </Link>
                    <Link to="/admin/tickets" className="hover:text-lime-400 transition">
                        票務管理
                    </Link>
                    <Link to="/admin/orders" className="hover:text-lime-400 transition">
                        訂單管理
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        登出
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default AdminNavbar;
