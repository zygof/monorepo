type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "accent";
  className?: string;
};

const badgeVariants = {
  default: "bg-primary-light text-primary",
  success: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
