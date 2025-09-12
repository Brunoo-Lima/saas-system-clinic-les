'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

type DropdownItem = {
  label: string;
  value: string;
};

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export const Dropdown = ({ label, items, value, onChange }: DropdownProps) => {
  const [internalValue, setInternalValue] = useState<string | null>(
    value ?? null,
  );

  const handleChange = (newValue: string, checked: boolean) => {
    const finalValue = checked ? newValue : null;

    if (onChange) {
      onChange(finalValue);
    } else {
      setInternalValue(finalValue);
    }
  };

  const currentValue = value ?? internalValue;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto flex items-center gap-1">
          {label} <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={currentValue === item.value}
            onCheckedChange={(checked) => handleChange(item.value, checked)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
