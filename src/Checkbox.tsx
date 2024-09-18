import { Field } from "formik";
import { CheckIconSizeS } from "./assets/svgIcons";

type CheckboxProps = {
  name: string;
  label?: string;
  onClick?: () => void;
  checked: boolean | null;
  className?: string;
  setChecked?: (checked: boolean) => void;
  stopPropagation?: boolean;
  [key: string]: unknown;
};

export default function Checkbox({
  name,
  label,
  onClick,
  checked,
  className,
  setChecked,
  stopPropagation = false,
  ...props
}: CheckboxProps) {
  return (
    <div
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        if (typeof onClick === "function") {
          onClick();
        } else if (typeof setChecked === "function") {
          setChecked(!checked);
        }
      }}
      className={`flex items-center justify-between gap-1.5 cursor-pointer ${className}`}
    >
      <label htmlFor={name}>{label}</label>

      <span
        className={`flex items-center p-[2px] justify-center w-4 h-4 rounded-[4px] ${
          checked
            ? "bg-primary-500 border-0"
            : "bg-white border border-gray-300"
        }`}
      >
        <CheckIconSizeS />
      </span>

      <Field
        type="checkbox"
        name={name}
        style={{ display: "hidden" }}
        {...props}
      />
    </div>
  );
}
