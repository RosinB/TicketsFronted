import React from "react";

function InputField({ label, type, value, onChange, placeholder, errorMessage, pattern, required }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={value}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!pattern || pattern.test(inputValue)) {
                        onChange(inputValue);
                    }
                }}
                placeholder={placeholder}
                required={required}
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
}

export default InputField;
