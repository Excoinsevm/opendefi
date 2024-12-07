import { cn } from "@/utils/cn";
import { forwardRef } from "react";

export const gridColsObject: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

export const gapObject: Record<number, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
  11: "gap-11",
  12: "gap-12",
  14: "gap-14",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
  28: "gap-28",
  32: "gap-32",
  36: "gap-36",
  40: "gap-40",
  44: "gap-44",
  48: "gap-48",
  52: "gap-52",
  56: "gap-56",
  60: "gap-60",
  64: "gap-64",
  72: "gap-72",
  80: "gap-80",
  96: "gap-96",
};

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  gap?: number;
}

const Grid: React.FC<GridProps> = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & GridProps>(
  ({ children, className, cols = 12, gap = 2 }, ref) => {
    const gridClass = "grid w-full";
    const gridColsClass = gridColsObject[cols];
    const gridGapClass = gapObject[gap];

    return (
      <div ref={ref} className={cn(gridClass, gridColsClass, gridGapClass, className)}>
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

export default Grid;
