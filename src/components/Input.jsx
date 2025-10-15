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
          className="inline-block mb-1 pl-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full px-3 py-2 border bg-white text-black border-gray-200 rounded-lg focus:bg-gray-50 outline-none duration-200 focus:ring-2 focus:ring-blue-500 ${className}`}
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
