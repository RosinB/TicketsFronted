import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 確保 CSS 文件被引入
import { BrowserRouter } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   // <React.StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,  // 啟用 startTransition
                v7_relativeSplatPath: true // 啟用相對 Splat 路徑解析
            }}
        >
            <App />
        </BrowserRouter>
   // </React.StrictMode>
);