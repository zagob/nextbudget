import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationItem } from "./NavigationItem";

export const Menu = () => {
  return (
    <NavigationMenu className="mb-4">
      <NavigationMenuList>
        <NavigationItem href="/" title="Resumo Geral" />
        <NavigationItem href="/accounts" title="Bancos" />
        <NavigationItem href="/transactions" title="Transações" />
        <NavigationItem href="/transfers" title="Transferências" />
      </NavigationMenuList>
    </NavigationMenu>
  );
};
