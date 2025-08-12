import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
