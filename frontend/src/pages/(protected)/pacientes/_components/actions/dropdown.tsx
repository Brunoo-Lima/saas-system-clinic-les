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
          checked={selectedGender === 'Male'}
          onCheckedChange={(checked) => onChangeGender(checked ? 'Male' : null)}
        >
          Masculino
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedGender === 'Female'}
          onCheckedChange={(checked) =>
            onChangeGender(checked ? 'Female' : null)
          }
        >
          Feminino
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
