"use client"

import Link from "next/link"
import { StockOverviewItem } from "@/src/types"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { AlertTriangle, Package, ChevronRight } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface StockTableProps {
  items: StockOverviewItem[]
}

export function StockTable({ items }: StockTableProps) {
  const getDaysUntilExpiry = (dateStr: string | null) => {
    if (!dateStr) return null
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Médicament</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Stock</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center hidden sm:table-cell">Lots</TableHead>
            <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Péremption proche</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Alertes</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                Aucun médicament en stock
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const daysUntilExpiry = getDaysUntilExpiry(item.nearestExpiry)
              
              return (
                <TableRow key={item.drugId} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-medium text-slate-900">{item.drugName}</div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className={cn(
                        "font-semibold",
                        item.isCritical ? "text-red-600" : 
                        item.isBelowMin ? "text-amber-600" : "text-slate-700"
                      )}>
                        {item.totalQuantity}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center hidden sm:table-cell">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {item.activeBatches}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    {daysUntilExpiry !== null ? (
                      <span className={cn(
                        "text-sm",
                        daysUntilExpiry < 0 ? "text-red-600 font-medium" :
                        daysUntilExpiry <= 30 ? "text-amber-600" :
                        "text-slate-500"
                      )}>
                        {daysUntilExpiry < 0 
                          ? `Périmé depuis ${Math.abs(daysUntilExpiry)}j` 
                          : `${daysUntilExpiry}j restants`}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.isCritical && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critique
                        </Badge>
                      )}
                      {!item.isCritical && item.isBelowMin && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          Stock bas
                        </Badge>
                      )}
                      {!item.isCritical && !item.isBelowMin && (
                        <span className="text-sm text-emerald-600">OK</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Link
                      href={`/stock/${item.drugId}`}
                      className="inline-flex items-center gap-1 text-sm text-[rgb(25,119,119)] hover:text-[rgb(40,185,180)] font-medium"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}