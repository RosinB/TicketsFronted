import { Link } from "react-router-dom";

function AdminNavbar() {

// 登出
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        window.location.assign("/");
    };


    return (

        <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-black  h-20 sticky top-0 z-10 text-white">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-2xl font-bold tracking-wide">

                    <Link to="/admin" className="hover:text-teal-400 transition">管理員後台</Link></h1>

                    <nav className="flex text-xl space-x-8 font-bold mt-2">
                        <CustomLink to={"/admin/hosts"}>主辦方</CustomLink>
                        <CustomLink to={"/admin/members"}>會員資料</CustomLink>
                        <CustomLink to={"/admin/event"}>演唱會資訊</CustomLink>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                            登出
                        </button>
                        
                    </nav>
            </div>


            <div className="h-1 bg-gradient-to-br  via-gray-600 "></div>

        </nav>
    );
}

export default AdminNavbar;


const  CustomLink = ({to, children})=>{
    
    return (
        <Link to={to} className={"hover:text-teal-400 transition "}>
            {children}
        </Link>
    );
}