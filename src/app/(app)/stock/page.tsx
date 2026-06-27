'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StockOverviewItem } from '@/src/types';
import { api } from '@/src/lib/api';
import { StockTable } from '@/src/components/stock/StockTable';
import { SearchInput } from '@/src/components/ui/search-input';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

export default function StockPage() {
	const router = useRouter();
	const [items, setItems] = useState<StockOverviewItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [summary, setSummary] = useState({
		totalDrugs: 0,
		drugsInStock: 0,
		drugsBelowMin: 0,
		drugsCritical: 0,
		totalValueCDF: 0,
	});

	const loadStock = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get('/api/stock/');

			if (response.success) {
				const allItems = response.data.items || [];
				setItems(allItems);
				setSummary(
					response.data.summary || {
						totalDrugs: 0,
						drugsInStock: 0,
						drugsBelowMin: 0,
						drugsCritical: 0,
						totalValueCDF: 0,
					},
				);
			}
		} catch (err: any) {
			if (err.status === 401) {
				router.push('/login');
				return;
			}
			setError(err.message || 'Erreur lors du chargement du stock');
		} finally {
			setIsLoading(false);
		}
	}, [router]);

	useEffect(() => {
		loadStock();
	}, [loadStock]);

	const filteredItems = items.filter((item) => item.drugName.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Stock</h1>
					<p className="text-sm text-slate-500 mt-1">Vue d'ensemble des stocks par médicament</p>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href="/batches/new">
						<Package className="h-4 w-4 mr-2" />
						Réceptionner un lot
					</Link>
				</Button>
			</div>

			{/* KPIs */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<Package className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{summary.drugsInStock}</p>
								<p className="text-xs text-slate-500">En stock</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
								<TrendingDown className="h-5 w-5 text-amber-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{summary.drugsBelowMin}</p>
								<p className="text-xs text-slate-500">Stock bas</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
								<AlertTriangle className="h-5 w-5 text-red-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{summary.drugsCritical}</p>
								<p className="text-xs text-slate-500">Critiques</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
								<DollarSign className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{(summary.totalValueCDF / 1000000).toFixed(1)}M</p>
								<p className="text-xs text-slate-500">Valeur (CDF)</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Erreur */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* Recherche */}
			<SearchInput value={search} onChange={setSearch} placeholder="Rechercher un médicament..." className="max-w-md" />

			{/* Tableau */}
			{isLoading ? (
				<div className="rounded-lg border border-slate-200 bg-white p-12">
					<div className="flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			) : (
				<StockTable items={filteredItems} />
			)}
		</div>
	);
}
