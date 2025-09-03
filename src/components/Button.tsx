import type { ButtonHTMLAttributes } from "react";

export const Button = ({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer select-none disabled:opacity-50 ${className}`}
    {...props}
  />
);
