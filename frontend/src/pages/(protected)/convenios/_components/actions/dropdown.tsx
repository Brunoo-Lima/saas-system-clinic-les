import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { medicalSpecialties } from '@/pages/(protected)/medicos/_constants';

interface IDropdownProps {
  selectedSpecialty: string | null;
  onChangeSpecialty: (checked: string | null) => void;
}

export const Dropdown = ({
  selectedSpecialty,
  onChangeSpecialty,
}: IDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="md:ml-auto ml-0">
          Especialidade <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="left-0">
        {medicalSpecialties.map((specialty) => (
          <DropdownMenuCheckboxItem
            key={specialty.value}
            checked={selectedSpecialty === specialty.value}
            onCheckedChange={(checked) =>
              onChangeSpecialty(checked ? specialty.value : null)
            }
          >
            {specialty.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
