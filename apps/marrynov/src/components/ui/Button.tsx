import Link from "next/link";
import { type ComponentProps } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "accentOutline";
type Size = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, keyof ButtonBaseProps> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonBaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  accent: "bg-accent text-white hover:bg-accent-hover shadow-sm",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  accentOutline:
    "border-2 bg-white border-accent text-accent hover:bg-accent hover:text-white",
  ghost: "text-primary hover:bg-primary-light",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-colors duration-200 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return <Link className={classes} {...(props as ComponentProps<typeof Link>)} />;
  }

  return <button className={classes} {...(props as ComponentProps<"button">)} />;
}
