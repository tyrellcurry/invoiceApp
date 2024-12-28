type TextVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'kicker' | 'custom';
export interface ITextProps {
  children: React.ReactNode;
  className?: string;
  tag?: React.ElementType;
  variant?: TextVariants;
}
