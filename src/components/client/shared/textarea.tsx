import { TextareaHTMLAttributes } from "react";

import { RequiredMark } from "@/components/client/shared/required-mark";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

function Textarea({
  id,
  name,
  label,
  required = false,
  error,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? name;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <textarea
          id={textareaId}
          name={name}
          required={required}
          placeholder=" "
          className={`
            peer min-h-40 w-full resize-y rounded-md border bg-white
            px-4 pb-4 pt-7 text-sm text-foreground
            outline-none transition-colors
            focus:border-primary
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-destructive" : "border-border"}
            ${className}
          `}
          {...props}
        />

        <label
          htmlFor={textareaId}
          className="
            pointer-events-none absolute left-4 top-4
            text-sm text-foreground-muted
            transition-all duration-300

            peer-focus:top-2.5
            peer-focus:text-xs
            peer-focus:text-primary

            peer-not-placeholder-shown:top-2.5
            peer-not-placeholder-shown:text-xs
          "
        >
          {label}

          {required && (
            <RequiredMark />
          )}
        </label>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { Textarea };
