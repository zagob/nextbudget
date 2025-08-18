"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// Importa todos os ícones como um único objeto
import * as LucideIcons from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

// Lógica correta para extrair os nomes dos ícones
const iconNames = Object.entries(LucideIcons)
  .filter(
    ([key, value]) =>
      value &&
      typeof value === "object" &&
      "$$typeof" in value &&
      !key.endsWith("Icon")
  )
  .map(([key]) => key);

// Define as props do componente
interface SelectIconsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectIcons({
  value,
  onValueChange,
  placeholder = "Selecionar ícone",
  className,
  disabled = false,
}: SelectIconsProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const parentRef = React.useRef<HTMLDivElement>(null);

  // Filtra os ícones com base na busca do usuário
  const filteredIcons = React.useMemo(() => {
    if (!searchQuery.trim()) return iconNames;
    const query = searchQuery.toLowerCase();
    return iconNames.filter((name) => name.toLowerCase().includes(query));
  }, [searchQuery]);

  // Configuração da virtualização para grid
  const COLS = 6; // Número de colunas no grid
  const ITEM_HEIGHT = 40; // Altura de cada item (botão do ícone)
  const GAP = 4; // Gap entre os itens

  // Calcula o número de linhas necessárias
  const rows = Math.ceil(filteredIcons.length / COLS);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT + GAP,
    overscan: 5,
  });

  // Força o recálculo da virtualização quando o popover abre
  React.useEffect(() => {
    if (open) {
      // Pequeno delay para garantir que o popover esteja renderizado
      const timer = setTimeout(() => {
        if (parentRef.current) {
          virtualizer.measure();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, virtualizer]);

  // Função para selecionar um ícone
  const handleIconSelect = React.useCallback(
    (iconName: string) => {
      onValueChange?.(iconName);
      setOpen(false);
      setSearchQuery("");
    },
    [onValueChange]
  );

  // Função para limpar a seleção
  const handleClear = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onValueChange?.("");
    },
    [onValueChange]
  );

  // Componente do ícone selecionado (para exibir no botão)
  const SelectedIconComponent = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {SelectedIconComponent && (
              <SelectedIconComponent className="h-4 w-4" />
            )}
            <span className={cn(!value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
          </div>
          {value && (
            <div
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClear(e);
              }}
              role="button"
              tabIndex={0}
              aria-label="Limpar seleção"
              className="rounded-sm p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
            </div>
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="z-50 w-[288px] rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Buscar ícone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
          <div ref={parentRef} className="h-64 overflow-y-auto p-2">
            {filteredIcons.length > 0 &&
            open &&
            virtualizer.getVirtualItems().length > 0 ? (
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow: any) => {
                  const rowIndex = virtualRow.index;
                  const startIndex = rowIndex * COLS;

                  return (
                    <div
                      key={virtualRow.key}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${ITEM_HEIGHT}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="flex gap-1"
                    >
                      {Array.from({ length: COLS }, (_, colIndex) => {
                        const iconIndex = startIndex + colIndex;
                        if (iconIndex >= filteredIcons.length) return null;

                        const iconName = filteredIcons[iconIndex];
                        const IconComponent = LucideIcons[
                          iconName as keyof typeof LucideIcons
                        ] as React.ComponentType<{ className?: string }>;

                        if (!IconComponent) {
                          return null;
                        }

                        return (
                          <button
                            key={`${virtualRow.key}-${colIndex}`}
                            type="button"
                            onClick={() => handleIconSelect(iconName)}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md border border-transparent hover:bg-accent hover:text-accent-foreground transition-colors",
                              value === iconName &&
                                "bg-primary text-primary-foreground"
                            )}
                            title={iconName}
                          >
                            <IconComponent className="h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : filteredIcons.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhum ícone encontrado
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Carregando ícones...
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
