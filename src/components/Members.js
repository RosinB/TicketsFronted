import React from "react";

const Members = () => {





    
    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員資料</h2>
            <table className="table-auto w-full mt-6 border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-200 px-4 py-2">會員 ID</th>
                        <th className="border border-gray-200 px-4 py-2">姓名</th>
                        <th className="border border-gray-200 px-4 py-2">電子郵件</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2 text-center">1</td>
                        <td className="border border-gray-200 px-4 py-2">Alice</td>
                        <td className="border border-gray-200 px-4 py-2">alice@example.com</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2 text-center">2</td>
                        <td className="border border-gray-200 px-4 py-2">Bob</td>
                        <td className="border border-gray-200 px-4 py-2">bob@example.com</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Members;
