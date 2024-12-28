type TextVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'body-alt' | 'kicker' | 'custom';
export type TTextProps<T extends React.ElementType> = {
  children: React.ReactNode;
  className?: string;
  tag?: T;
  variant?: TextVariants;
} & React.ComponentPropsWithoutRef<T>;
