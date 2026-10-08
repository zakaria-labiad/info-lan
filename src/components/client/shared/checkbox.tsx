import { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

function Checkbox({
  id,
  name,
  value,
  label,
  disabled = false,
  className = "",
  ...props
}: CheckboxProps) {
  const checkboxId = id ?? `${name}-${value}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex min-h-6 cursor-pointer items-center gap-2
        text-sm text-foreground-muted
        transition-colors
        hover:text-foreground

        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      <input
        id={checkboxId}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        className={`
          size-4 shrink-0 cursor-pointer
          rounded-md border-border
          accent-primary
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary/30
          disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />

      <span>{label}</span>
    </label>
  );
}

export { Checkbox };
