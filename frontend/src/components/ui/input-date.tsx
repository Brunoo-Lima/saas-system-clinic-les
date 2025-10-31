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
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  // Sincroniza o inputValue quando o value prop muda
  useEffect(() => {
    try {
      if (value && isValid(value)) {
        const formatted = format(value, 'dd/MM/yyyy');
        setInputValue(formatted);
        setHasError(false);
      } else if (!value) {
        setInputValue('');
        setHasError(false);
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      setInputValue('');
      setHasError(true);
    }
  }, [value]);

  const formatInputValue = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers;
    }
    if (numbers.length <= 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    }
    return `${numbers.substring(0, 2)}/${numbers.substring(
      2,
      4,
    )}/${numbers.substring(4, 8)}`;
  };

  const parseDateSafely = (dateString: string): Date | undefined => {
    try {
      if (dateString.length !== 10) return undefined;

      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      return isValid(parsedDate) ? parsedDate : undefined;
    } catch (error) {
      console.error('Erro ao fazer parse da data:', error);
      return undefined;
    }
  };

  const validateDate = (dateString: string): boolean => {
    if (dateString.length !== 10) return false;

    const date = parseDateSafely(dateString);
    return !!date;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputValue(rawValue);

    setInputValue(formattedValue);

    // Validação em tempo real
    if (formattedValue.length === 10) {
      const parsedDate = parseDateSafely(formattedValue);
      setHasError(!parsedDate);
      onChange(parsedDate);
    } else {
      setHasError(false);
      onChange(undefined);
    }
  };

  const handleBlur = () => {
    // Se o input estiver vazio, não faz nada
    if (!inputValue.trim()) {
      setHasError(false);
      return;
    }

    // Se não está completo, limpa o campo
    if (inputValue.length < 10) {
      setInputValue('');
      setHasError(false);
      onChange(undefined);
      return;
    }

    // Valida a data completa
    const isValidDate = validateDate(inputValue);
    setHasError(!isValidDate);

    if (!isValidDate) {
      setInputValue('');
      onChange(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas teclas úteis para entrada de data
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Permite apenas números e as teclas de controle
    if (!/\d/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
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
      aria-invalid={hasError}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
        hasError &&
          'border-destructive ring-destructive/20 dark:ring-destructive/40',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
    />
  );
};

export default InputDate;
