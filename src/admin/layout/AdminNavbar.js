import { Link } from "react-router-dom";
import { Home, Users, LogOut, LayoutDashboard, Building, User } from 'lucide-react';

function AdminNavbar() {
    // 登出
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        window.location.assign("/");
    };

    return (
        <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-black h-18 sticky top-0 z-10 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
                    <Home className="w-6 h-6" />
                    <Link to="/admin/dashboard" className="hover:text-teal-400 transition">管理員後台</Link>
                </h1>

                <button 
                    className="lg:hidden text-teal-400 focus:outline-none"
                    onClick={() => {
                        const menu = document.getElementById('mobile-menu');
                        menu.classList.toggle('hidden');
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <nav id="mobile-menu" className="hidden md:flex flex-col lg:flex-row text-xl space-y-4 lg:space-y-0 lg:space-x-8 font-bold mt-4 lg:mt-0">
                    <CustomLink to="/admin/dashboard">
                        <LayoutDashboard className="w-5 h-5 text-teal-500" />
                        演唱會控台
                    </CustomLink>
                    <CustomLink to="/admin/hosts">
                        <Building className="w-5 h-5 text-teal-500" />
                        主辦方
                    </CustomLink>
                    <CustomLink to="/admin/members">
                        <User className="w-5 h-5 text-teal-500" />
                        會員
                    </CustomLink>
                    <CustomLink to="/admin/refund">
                        <User className="w-5 h-5 text-teal-500" />
                        退票管理
                    </CustomLink>
                    <CustomLink to="/admin/traffic">
                        <Users className="w-5 h-5 text-teal-500" />
                        流量分析測試
                    </CustomLink>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        登出
                    </button>
                </nav>
            </div>

            <div className="h-1 -mt-2 bg-gradient-to-br via-gray-600"></div>
        </nav>
    );
}

export default AdminNavbar;

const CustomLink = ({ to, children }) => {
    return (
        <Link to={to} className="hover:text-teal-400 transition flex items-center gap-2">
            {children}
        </Link>
    );
};
