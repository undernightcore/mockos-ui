type DividerProps = {
  color?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export default function Divider({
  color = "var(--divider-color)",
  className = "",
  orientation = "horizontal",
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`${isHorizontal ? "h-px w-full" : "h-full w-px"} ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
