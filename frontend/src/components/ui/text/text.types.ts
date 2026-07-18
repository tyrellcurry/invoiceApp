import { ElementType, ReactNode } from 'react';

type TextVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'body-alt' | 'kicker' | 'custom';
export interface ITextProps {
  children: ReactNode;
  className?: string;
  tag?: ElementType;
  variant?: TextVariants;
  htmlFor?: string;
}
