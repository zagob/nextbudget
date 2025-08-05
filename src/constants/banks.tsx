import { Building2, CreditCard, PiggyBank, Wallet } from "lucide-react";

export const getBankIcon = (bankName: string) => {
  const name = bankName.toLowerCase();
  if (name.includes("nubank"))
    return <CreditCard className="w-6 h-6 text-purple-500" />;
  if (name.includes("itau") || name.includes("itáu"))
    return <Building2 className="w-6 h-6 text-orange-500" />;
  if (name.includes("bradesco"))
    return <Building2 className="w-6 h-6 text-red-500" />;
  if (name.includes("santander"))
    return <Building2 className="w-6 h-6 text-red-600" />;
  if (name.includes("caixa"))
    return <Building2 className="w-6 h-6 text-blue-600" />;
  if (name.includes("banco do brasil") || name.includes("bb"))
    return <Building2 className="w-6 h-6 text-yellow-500" />;
  if (name.includes("inter"))
    return <Building2 className="w-6 h-6 text-orange-600" />;
  if (name.includes("carteira") || name.includes("wallet"))
    return <Wallet className="w-6 h-6 text-green-500" />;
  if (name.includes("poupanca") || name.includes("poupança"))
    return <PiggyBank className="w-6 h-6 text-blue-500" />;
  if (name.includes("picpay"))
    return <CreditCard className="w-6 h-6 text-green-500" />;
  return <Building2 className="w-6 h-6 text-neutral-400" />;
};

export const getGradientClass = (bankName: string) => {
  const name = bankName.toLowerCase();
  if (name.includes("nubank"))
    return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
  if (name.includes("itau") || name.includes("itáu"))
    return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
  if (name.includes("bradesco"))
    return "from-red-500/20 to-red-600/20 border-red-500/30";
  if (name.includes("santander"))
    return "from-red-600/20 to-red-700/20 border-red-600/30";
  if (name.includes("caixa"))
    return "from-blue-600/20 to-blue-700/20 border-blue-600/30";
  if (name.includes("banco do brasil") || name.includes("bb"))
    return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
  if (name.includes("inter"))
    return "from-orange-600/20 to-orange-700/20 border-orange-600/30";
  if (name.includes("carteira") || name.includes("wallet"))
    return "from-green-500/20 to-green-600/20 border-green-500/30";
  if (name.includes("poupanca") || name.includes("poupança"))
    return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
  if (name.includes("picpay"))
    return "from-green-500/20 to-green-600/20 border-green-500/30";
  return "from-neutral-500/20 to-neutral-600/20 border-neutral-500/30";
};
