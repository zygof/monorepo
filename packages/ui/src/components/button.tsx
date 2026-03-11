import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--radius] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        destructive: 'bg-error text-white hover:bg-error/90',
        outline: 'border-2 border-primary bg-white hover:bg-primary text-primary hover:text-white',
        ghost: 'hover:bg-secondary-light hover:text-text',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 rounded-[--radius] px-3',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-[--radius] px-8',
        /**
         * pill — bouton arrondi pleine largeur, adapté aux templates salon/restaurant.
         * Taille grande pour les CTA principaux (Réserver, Prendre RDV…).
         */
        pill: 'rounded-full h-auto px-8 py-4 text-base',
        /** pill-sm — CTA secondaire, taille compacte (header, footer…) */
        'pill-sm': 'rounded-full h-auto px-6 py-2.5 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
