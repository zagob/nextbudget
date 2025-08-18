"use client";

import * as React from "react";
import { SelectIcons } from "./SelectIcons";

export function SelectIconsExample() {
  const [selectedIcon, setSelectedIcon] = React.useState<string>("");

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">SelectIcons Component</h2>
        <p className="text-muted-foreground">
          Um componente performático para selecionar qualquer ícone do Lucide através de um popover com grid e busca.
        </p>
        <p className="text-sm text-muted-foreground">
          Inclui todos os ícones disponíveis no Lucide React com busca em tempo real.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecionar Ícone</label>
          <SelectIcons
            value={selectedIcon}
            onValueChange={setSelectedIcon}
            placeholder="Escolha um ícone..."
          />
        </div>

        {selectedIcon && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Ícone Selecionado:</h3>
            <p className="text-sm text-muted-foreground">
              Nome: <code className="bg-background px-1 py-0.5 rounded text-xs">{selectedIcon}</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total de ícones disponíveis: +1000 ícones do Lucide React
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Exemplo Desabilitado</label>
          <SelectIcons
            value="home"
            onValueChange={() => {}}
            placeholder="Componente desabilitado"
            disabled
          />
        </div>

        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Recursos de Performance:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Importação dinâmica de todos os ícones</li>
            <li>• Memoização da lista filtrada</li>
            <li>• Callbacks otimizados com useCallback</li>
            <li>• Busca em tempo real com debounce implícito</li>
            <li>• Renderização virtualizada do grid</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
