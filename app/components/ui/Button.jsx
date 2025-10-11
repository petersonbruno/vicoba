// app/components/ui/Button.jsx
import theme from "@/app/theme";

export default function Button({ children, color = "primary", full = false, ...props }) {
  const base = theme.button.base;
  const colorClass = theme.button.color[color];
  const sizeClass = full ? theme.button.fullSized : "";

  return (
    <button className={`${base} ${colorClass} ${sizeClass}`} {...props}>
      <span className={theme.button.inner.base}>{children}</span>
    </button>
  );
}
