export const CheckIconSizeS = ({
  color = "#fff",
  ...props
}: {
  color?: string;
  [key: string]: unknown;
}) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke={color}
      strokeWidth={1.6666}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
