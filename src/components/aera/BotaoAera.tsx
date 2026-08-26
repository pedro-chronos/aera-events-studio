import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Botão primário: degradê da marca com brilho em movimento e seta que avança. */
export function BotaoAera({
  children,
  onClick,
  className,
  tamanho = "md",
  type = "button",
  disabled,
  comSeta = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tamanho?: "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  comSeta?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium text-grafite",
        "bg-[linear-gradient(135deg,var(--quartzo)_0%,var(--serenity)_50%,var(--quartzo)_100%)] bg-[length:200%_100%] bg-[position:0%_0%]",
        "shadow-aera transition-[transform,box-shadow,background-position] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-[1.04] hover:bg-[position:100%_0%] hover:shadow-aera-forte active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        tamanho === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm",
        className,
      )}
    >
      {children}
      {comSeta && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </button>
  );
}

/** Link secundário com sublinhado que cresce da esquerda. */
export function LinkAera({
  children,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(
    "link-aera cursor-pointer text-sm font-medium text-grafite",
    className,
  );
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
