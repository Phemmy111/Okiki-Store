import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "whatsapp";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

// ── Variant + size maps ───────────────────────────────────────────────────────

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue hover:bg-blue-light text-white shadow-sm hover:shadow focus-visible:ring-blue",
  secondary:
    "bg-navy hover:bg-navy-mid text-white shadow-sm focus-visible:ring-navy",
  outline:
    "border border-blue text-blue hover:bg-blue hover:text-white focus-visible:ring-blue",
  ghost:
    "text-navy hover:bg-page focus-visible:ring-navy",
  danger:
    "bg-danger hover:bg-red-700 text-white shadow-sm focus-visible:ring-danger",
  gold:
    "bg-gold hover:bg-gold-light text-navy font-bold shadow-sm hover:shadow focus-visible:ring-gold",
  whatsapp:
    "bg-whatsapp hover:bg-whatsapp-dark text-white shadow-sm focus-visible:ring-whatsapp",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3.5 py-1.5 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-base px-7 py-3.5 gap-2.5",
};

// ── Shared class builder ──────────────────────────────────────────────────────

function buildClasses(
  variant: Variant,
  size: Size,
  isLoading: boolean,
  className?: string
) {
  return cn(
    // Base
    "inline-flex items-center justify-center font-semibold rounded-full",
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none select-none",
    // Variant
    variantClasses[variant],
    // Size
    sizeClasses[size],
    // Loading
    isLoading && "cursor-wait",
    className
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Button component ──────────────────────────────────────────────────────────

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buildClasses(variant, size, isLoading, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        icon && iconPosition === "left" && <span aria-hidden>{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === "right" && (
        <span aria-hidden>{icon}</span>
      )}
    </button>
  );
}

// ── ButtonLink (anchor styled as button) ─────────────────────────────────────

export function ButtonLink({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: AnchorProps) {
  return (
    <a
      className={buildClasses(variant, size, isLoading, className)}
      {...props}
    >
      {icon && iconPosition === "left" && <span aria-hidden>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span aria-hidden>{icon}</span>}
    </a>
  );
}

export default Button;
