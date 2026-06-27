'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StockDetail, Batch } from '@/src/types';
import { api } from '@/src/lib/api';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BatchCard } from '@/src/components/stock/BatchCard';
import { AlertBadge } from '@/src/components/stock/AlertBadge';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';

export default function StockDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [detail, setDetail] = useState<StockDetail['data'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadDetail = async () => {
			try {
				const response = await api.get(`/api/stock/${params.drugId}`);
				if (response.success) {
					setDetail(response.data);
				}
			} catch (err: any) {
				if (err.status === 401) {
					router.push('/login');
					return;
				}
				setError(err.message || 'Erreur lors du chargement');
			} finally {
				setIsLoading(false);
			}
		};

		loadDetail();
	}, [params.drugId, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (error || !detail) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error || 'Données non disponibles'}</span>
				</div>
				<Button variant="outline" className="border-slate-200">
					<Link href="/stock">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour au stock
					</Link>
				</Button>
			</div>
		);
	}

	const { drug, totalQuantity, batches, alerts } = detail;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" className="border-slate-200">
					<Link href="/stock">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-slate-900">{drug.name}</h1>
					<p className="text-sm text-slate-500 font-mono">{drug.code}</p>
				</div>
			</div>

			{/* Alertes */}
			{alerts.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{alerts.map((alert, i) => (
						<AlertBadge key={i} type={alert.severity} message={alert.message} />
					))}
				</div>
			)}

			{/* Résumé */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<Package className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{totalQuantity}</p>
								<p className="text-xs text-slate-500">Unités en stock</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
								<Package className="h-5 w-5 text-secondary" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{batches.length}</p>
								<p className="text-xs text-slate-500">Lots actifs</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
								<Package className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{drug.minStockLevel}</p>
								<p className="text-xs text-slate-500">Seuil d'alerte</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Lots */}
			<div>
				<h2 className="text-lg font-semibold text-slate-900 mb-4">Lots en stock</h2>
				{batches.length === 0 ? (
					<Card className="border-slate-200">
						<CardContent className="p-8 text-center text-slate-400">Aucun lot en stock pour ce médicament</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{batches.map((batch, i) => (
							<BatchCard
								key={i}
								batch={{
									id: '',
									batchNumber: batch.batchNumber,
									drugId: drug.id,
									drug: { id: drug.id, name: drug.name, code: drug.code },
									supplierId: null,
									supplier: null,
									currentQuantity: batch.currentQuantity,
									initialQuantity: batch.currentQuantity,
									expiryDate: batch.expiryDate,
									manufacturingDate: null,
									purchasePriceCDF: null,
									purchasePriceUSD: null,
									locationId: null,
									coldChainVerified: false,
									isQuarantined: batch.isQuarantined,
									isActive: true,
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
