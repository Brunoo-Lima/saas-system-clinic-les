import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';

interface IDropdownProps {
  selectedGender: string | null;
  onChangeGender: (selectedGender: string | null) => void;
}

export const Dropdown = ({
  selectedGender,
  onChangeGender,
}: IDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Gênero <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={selectedGender === 'male'}
          onCheckedChange={(checked) => onChangeGender(checked ? 'male' : null)}
        >
          Masculino
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedGender === 'female'}
          onCheckedChange={(checked) =>
            onChangeGender(checked ? 'female' : null)
          }
        >
          Feminino
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
