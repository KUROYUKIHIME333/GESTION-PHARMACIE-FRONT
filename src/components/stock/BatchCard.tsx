'use client';

import { Batch } from '@/src/types';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Package, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BatchCardProps {
	batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
	const daysUntilExpiry = Math.ceil((new Date(batch.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

	const isExpired = daysUntilExpiry < 0;
	const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

	return (
		<Card className={cn('border-slate-200', batch.isQuarantined && 'border-amber-300 bg-amber-50/30', isExpired && 'border-red-300 bg-red-50/30')}>
			<CardContent className="p-4 space-y-3">
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4 text-slate-400" />
							<span className="font-mono text-sm font-medium text-slate-700">{batch.batchNumber}</span>
						</div>
						{batch.supplier && <p className="text-xs text-slate-500 mt-1">Fournisseur: {batch.supplier.name}</p>}
					</div>

					<div className="flex items-center gap-2">
						{batch.isQuarantined && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Quarantaine</Badge>}
						{isExpired && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Périmé</Badge>}
						{isNearExpiry && !isExpired && (
							<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
								<AlertTriangle className="h-3 w-3 mr-1" />
								{daysUntilExpiry}j
							</Badge>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-xs text-slate-500">Quantité</p>
						<p className={cn('text-lg font-semibold', batch.currentQuantity === 0 ? 'text-red-600' : 'text-slate-900')}>
							{batch.currentQuantity} / {batch.initialQuantity}
						</p>
					</div>

					<div>
						<p className="text-xs text-slate-500">Péremption</p>
						<div className="flex items-center gap-1">
							<Calendar className={cn('h-3 w-3', isExpired ? 'text-red-500' : isNearExpiry ? 'text-amber-500' : 'text-slate-400')} />
							<span className={cn('text-sm font-medium', isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-600' : 'text-slate-700')}>
								{new Date(batch.expiryDate).toLocaleDateString('fr-FR')}
							</span>
						</div>
					</div>
				</div>

				{batch.coldChainVerified && (
					<Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
						Chaîne du froid vérifiée
					</Badge>
				)}
			</CardContent>
		</Card>
	);
}
