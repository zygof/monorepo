type CardProps = {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
};

export function Card({ children, className = "", highlighted = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 transition-shadow duration-200 md:p-8 ${
        highlighted
          ? "bg-primary ring-primary text-white shadow-xl ring-2"
          : "bg-bg-white shadow-md hover:shadow-lg"
      } ${className}`}
    >
      {children}
    </div>
  );
}
