import React, { useId } from "react";

function Select({
    options = [],
    label,
    className = "",
    ...props
}, ref) {
  const id = useId();
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
      <select
        ref={ref}
        id={id}
        className={`px-4 py-2.5 rounded-lg bg-white text-slate-900 border border-slate-300 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:focus:bg-slate-750 dark:focus:border-orange-400 w-full cursor-pointer force-light-bg force-light-text force-light-ring ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select); // another way to use forwardRef, it allows the parent component to pass a ref to the select element
// forwardRef is a React utility that allows you to pass a ref through a component to one of its children.
// It is used here to allow the parent component to access the select element directly, which can be useful for form handling or other interactions.
// It is a higher-order component that takes a component and returns a new component with the ref

Select.displayName = "Select"; // This is important for debugging purposes, it helps identify the component in React DevTools
// It allows the component to be recognized as a Select component rather than a generic forwardRef component    