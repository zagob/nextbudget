"use client";

import { memo, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

import { useQuery } from "@tanstack/react-query";

// import { getEveryCategories } from "@/actions/categories.actions";
import { transformToCurrency } from "@/lib/utils";
import { 
  Tag, 
  Plus,
  Eye,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3
} from "lucide-react";
import { useDateStore } from "@/store/date";
import { LoadingCard } from "../LoadingCard";

// Componente de item de categoria moderna
const CategoryItem = memo(({ category }: { category: any }) => {
  const isIncome = category.type === 'INCOME';
  
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
          <h4 className="text-sm font-medium text-white">
            {category.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            {isIncome ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <span>{isIncome ? 'Receita' : 'Despesa'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-300">
            {category.transactionCount || 0} transações
          </p>
          <p className="text-xs text-neutral-500">
            {transformToCurrency(category.totalValue || 0)}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

CategoryItem.displayName = "CategoryItem";

export const Categories = () => {
  const date = useDateStore((state) => state.date);

  const { data: categories, isPending } = useQuery({
    queryKey: ["categories", date],
    // queryFn: async () => await getEveryCategories(),
    queryFn: async () => []
  });

  const recentCategories = categories?.slice(0, 6) || [];

  if (isPending) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Tag className="w-5 h-5" />
            Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Tag className="w-5 h-5" />
            Categorias
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800">
              <Filter className="w-4 h-4 mr-1" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800">
              <Search className="w-4 h-4 mr-1" />
              Buscar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recentCategories.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 mb-2">Nenhuma categoria encontrada</p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              Nova Categoria
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {recentCategories.map((category: any) => (
                <ModernCategoryItem key={category.id} category={category} />
              ))}
            </div>
            
            {categories && categories.length > 6 && (
              <div className="pt-3 border-t border-neutral-700/50">
                <Button variant="ghost" size="sm" className="w-full text-neutral-400 hover:text-white">
                  Ver todas as categorias ({categories.length})
                </Button>
              </div>
            )}
            
            {/* Resumo rápido */}
            <div className="mt-4 pt-4 border-t border-neutral-700/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-800/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-neutral-400">Receitas</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {categories?.filter((c: any) => c.type === 'INCOME').length || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-neutral-800/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-neutral-400">Despesas</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {categories?.filter((c: any) => c.type === 'EXPENSE').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 