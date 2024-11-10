import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/">My Website</Link>
                </h1>
                <ul className="flex space-x-6 text-white font-semibold">
                    <li>
                        <Link to="/" className="hover:text-gray-300 transition">
                            首頁
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" className="hover:text-gray-300 transition">
                            註冊
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="hover:text-gray-300 transition">
                            登入
                        </Link>
                    </li>
                    <li>
                        <Link to="/members" className="hover:text-gray-300 transition">
                            顯示會員資料
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
