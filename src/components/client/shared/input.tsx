import type { ComponentProps } from "react";

import { RequiredMark } from "@/components/client/shared/required-mark";

type FloatingFieldProps = Omit<
  ComponentProps<"input">,
  "id" | "name" | "type" | "placeholder"
> & {
  id: string;
  name: string;
  label: string;
  type?: "email" | "tel" | "text";
};

function Input({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required = false,
  ...props
}: FloatingFieldProps) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        {...props}
        className="
        peer
        h-14
        w-full
        rounded-md
        border
        bg-white
        px-4
        pb-2
        pt-5
        text-sm
        text-foreground
        outline-none
        transition-all
        duration-200

        hover:border-primary/20

        focus:border-primary
        focus:ring-2
        focus:ring-primary/10

        disabled:cursor-not-allowed
        disabled:bg-gray-50
        disabled:text-foreground-muted/80
        "
      />

      <label
        htmlFor={id}
        className="
        pointer-events-none
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        bg-white
        text-sm
        text-foreground-muted
        transition-all
        duration-200

        peer-focus:top-2
        peer-focus:translate-y-0
        peer-focus:text-xs
        peer-focus:font-medium
        peer-focus:text-primary

        peer-not-placeholder-shown:top-2
        peer-not-placeholder-shown:translate-y-0
        peer-not-placeholder-shown:text-xs
        "
      >
        {label}
        {required && <RequiredMark />}
      </label>
    </div>
  );
}

export { Input, RequiredMark };
