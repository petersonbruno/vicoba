export default function FormInput({ id, label, type = "text", value = "", ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-600">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value ?? ""}   // ✅ Always controlled
        {...props}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
