import type { LucideIcon } from 'lucide-react';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  className?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};
