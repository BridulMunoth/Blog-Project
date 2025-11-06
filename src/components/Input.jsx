import React from "react";
import { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", error, ...rest }, //props are also written as rest as it depicts the remaining props
  ref
) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="inline-block mb-1 pl-1 text-sm font-medium text-slate-800 dark:text-slate-200 prefer-light"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full px-4 py-2.5 border bg-white text-slate-900 border-slate-300 rounded-lg focus:bg-white outline-none duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:focus:bg-slate-750 dark:focus:border-orange-400 dark:placeholder:text-slate-500 force-light-bg force-light-text force-light-ring ${className}`}
        {...rest}
        id={id}
        aria-invalid={!!error}
        aria-describedby={errorId}
      />
      {typeof error === "string" && (
        <p id={errorId} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
