// components/FormInput.jsx
"use client";
export default function FormInput({ label, id, type = "text", ...props }) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="text-sm text-gray-600">{label}</label>}
      <input
        id={id}
        type={type}
        {...props}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
