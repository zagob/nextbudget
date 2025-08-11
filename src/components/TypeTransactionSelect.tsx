import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ToggleGroupSingleProps } from "@radix-ui/react-toggle-group";

type TypeTransactionSelectProps = ToggleGroupSingleProps;

export function TypeTransactionSelect({ ...rest }: TypeTransactionSelectProps) {
  return (
    <ToggleGroup className="border w-full" orientation="horizontal" {...rest}>
      <ToggleGroupItem
        value="EXPENSE"
        className={cn("cursor-pointer data-[state=on]:bg-red-500/40", {
          "pointer-events-none": rest.value === "EXPENSE",
        })}
      >
        Saída
      </ToggleGroupItem>
      <ToggleGroupItem
        value="INCOME"
        className={cn("cursor-pointer data-[state=on]:bg-green-500/40", {
          "pointer-events-none": rest.value === "INCOME",
        })}
      >
        Entrada
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
