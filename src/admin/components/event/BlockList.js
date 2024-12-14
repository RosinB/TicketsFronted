import React from "react";
import { motion } from "framer-motion";

function BlockList() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            {/* 旋轉動畫 */}
            <motion.div
                className="w-24 h-24 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-lg"
                animate={{ rotate: 360 }} // 旋轉動畫
                transition={{
                    repeat: Infinity, // 持續循環
                    duration: 2, // 2 秒完成一次旋轉
                    ease: "linear", // 線性速度
                }}
            />
        </div>
    );
}

export default BlockList;
