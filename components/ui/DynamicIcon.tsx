'use client';

import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export default function DynamicIcon({ name, ...props }: Props) {
  const Icon = (Icons as any)[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
