import { cn } from '@/lib/utils';
import { format, parse, isValid } from 'date-fns';
import { useState, useEffect } from 'react';

const InputDate = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [inputValue, setInputValue] = useState(
    value ? format(value, 'dd/MM/yyyy') : '',
  );

  // Sincroniza o inputValue quando o value prop muda
  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, 'dd/MM/yyyy'));
    } else if (!value) {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    // Aplica a formatação DD/MM/AAAA
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }

    setInputValue(value);

    // Tenta fazer o parse apenas quando a data estiver completa
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          onChange(parsedDate);
        } else {
          onChange(undefined);
        }
      } catch {
        onChange(undefined);
      }
    } else {
      onChange(undefined);
    }
  };

  const handleBlur = () => {
    // Se o input estiver vazio, não faz nada
    if (!inputValue.trim()) {
      return;
    }

    // Se não está completo, limpa o campo
    if (inputValue.length < 10) {
      setInputValue('');
      onChange(undefined);
      return;
    }

    // Se está completo, valida a data
    try {
      const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
      if (!isValid(parsedDate)) {
        setInputValue('');
        onChange(undefined);
      }
    } catch {
      setInputValue('');
      onChange(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apagar normalmente
    if (e.key === 'Backspace' || e.key === 'Delete') {
      return;
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || 'DD/MM/AAAA'}
      maxLength={10}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
    />
  );
};

export default InputDate;
