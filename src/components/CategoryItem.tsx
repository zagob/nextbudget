import { transformToCurrency } from "@/lib/utils";
import { Eye, Tag, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { memo } from "react";
import { CategoryType } from "@/@types/categories";
import { DialogUpdateCategory } from "./DialogUpdateCategory";

export const CategoryItem = memo(({ category }: { category: CategoryType }) => {
  const isIncome = category.type === "INCOME";

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 border border-neutral-700/30 hover:border-neutral-600/50">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Tag className="w-4 h-4" style={{ color: category.color }} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">{category.name}</h4>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            {isIncome ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <span>{isIncome ? "Receita" : "Despesa"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-300">
            {category?._count.Transactions || 0} transações
          </p>
          <p className="text-xs text-neutral-500">
            {transformToCurrency(category?.totalAmountCategory || 0)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <DialogUpdateCategory category={category} />
      </div>
    </div>
  );
});

CategoryItem.displayName = "CategoryItem";
