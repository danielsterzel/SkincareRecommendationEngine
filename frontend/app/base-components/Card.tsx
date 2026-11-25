import { cn } from "@/lib/cn";
import { type ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className, children ,...props }: CardProps) {
  return (
    <div className={cn("rounded-[32px] bg-white shadow-md", className)} {...props}>
        {children}
    </div>
  );
}
