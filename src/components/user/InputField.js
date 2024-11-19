import React from "react";

function InputField({ label, type,name, value, onChange, placeholder, errorMessage, pattern, required }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                name={name} // 绑定 name 属性

                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
}

export default InputField;
