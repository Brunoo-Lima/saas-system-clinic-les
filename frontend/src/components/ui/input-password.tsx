import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export type InputPasswordProps = React.ComponentProps<typeof Input>;

function InputPassword({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 relative">
      <Input
        id="picture"
        type={viewPassword ? "text" : "password"}
        className="relative"
        {...props}
      />

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2"
        type="button"
        onClick={() => setViewPassword(!viewPassword)}
      >
        {viewPassword ? (
          <EyeIcon className="text-muted-foreground" />
        ) : (
          <EyeOffIcon className="text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export { InputPassword };
