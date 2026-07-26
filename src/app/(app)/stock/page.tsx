'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, AlertTriangle, TrendingDown, Boxes, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { useStockStore } from '@/src/stores/stock.store';
import { useDrugStore } from '@/src/stores/drugs.store';
import { Card, CardContent } from '@/src/components/ui/card';
import Link from 'next/link';
import Pulser from '@/src/components/ui/pulser';
import BatchForm from '@/src/components/forms/BatcheForm';

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	accent?: boolean;
	critical?: boolean;
	href?: string;
}

const now = Date.now();

function StatCard({ title, value, subtitle, icon, accent, critical, href }: StatCardProps) {
	const cardContent = (
		<Card className={`border-none ring-0 rounded-[2px] transition-all duration-200 hover:shadow-md cursor-pointer h-full ${critical ? 'bg-red-50' : accent ? 'bg-[#eff7e4]' : 'bg-white'}`}>
			<CardContent className="p-5 flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className={`p-2 rounded-[2px] ${critical ? 'bg-red-100' : accent ? 'bg-[#56AC35]/10' : 'bg-slate-100'}`}>{icon}</div>
					{href && <ArrowRight size={16} className="text-slate-400" />}
				</div>
				<div>
					<p className="text-2xl font-bold text-slate-900">{value}</p>
					<p className="text-sm font-medium text-slate-600">{title}</p>
					{subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
				</div>
			</CardContent>
		</Card>
	);

	if (href) {
		return (
			<Link href={href} className="block h-full">
				{cardContent}
			</Link>
		);
	}
	return cardContent;
}

interface StockRowProps {
	drugId: string;
	drugName: string;
	drugCode: string;
	totalQuantity: number;
	isBelowMin: boolean;
	isCritical: boolean;
	activeBatches: number;
	nearestExpiry: string | null;
	minStockLevel?: number | null;
	criticalStockLevel?: number | null;
}

function StockRow({ drugId, drugName, drugCode, totalQuantity, isBelowMin, isCritical, activeBatches, nearestExpiry, minStockLevel, criticalStockLevel }: StockRowProps) {
	const router = useRouter();
	const daysUntilExpiry = nearestExpiry ? Math.ceil((new Date(nearestExpiry).getTime() - now) / (1000 * 60 * 60 * 24)) : null;

	const statusColor = isCritical ? 'bg-red-500' : isBelowMin ? 'bg-amber-500' : 'bg-green-500';
	const statusText = isCritical ? 'Critique' : isBelowMin ? 'Bas' : 'Normal';

	return (
		<div
			onClick={() => router.push(`/stock/${drugId}`)}
			className="group grid grid-cols-12 gap-2 md:gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30 hover:border-[#4B866B]/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
		>
			{/* Nom + Code */}
			<div className="col-span-5 md:col-span-4 flex flex-col gap-1">
				<span className="font-semibold text-slate-900 text-sm md:text-base truncate">{drugName}</span>
				<span className="font-mono text-xs text-slate-500">{drugCode}</span>
			</div>

			{/* Quantité */}
			<div className="col-span-3 md:col-span-2 flex flex-col items-end md:items-start gap-1">
				<span className={`text-lg font-bold ${isCritical ? 'text-red-600' : isBelowMin ? 'text-amber-600' : 'text-[#4B866B]'}`}>{totalQuantity}</span>
				<span className="text-xs text-slate-400 hidden md:inline">unités</span>
			</div>

			{/* Seuils */}
			<div className="col-span-2 md:col-span-2 hidden md:flex flex-col gap-1">
				<div className="flex items-center gap-2 text-xs">
					<span className="text-slate-500">Min:</span>
					<span className="font-mono font-medium">{minStockLevel ?? '—'}</span>
				</div>
				<div className="flex items-center gap-2 text-xs">
					<span className="text-slate-500">Crit:</span>
					<span className="font-mono font-medium">{criticalStockLevel ?? '—'}</span>
				</div>
			</div>

			{/* Statut */}
			<div className="col-span-2 md:col-span-2 flex items-center justify-end md:justify-start gap-2">
				<span className={`w-2 h-2 rounded-full ${statusColor}`} />
				<span className={`text-xs font-semibold hidden sm:inline ${isCritical ? 'text-red-600' : isBelowMin ? 'text-amber-600' : 'text-green-600'}`}>{statusText}</span>
			</div>

			{/* Lots + Péremption */}
			<div className="col-span-2 md:col-span-2 flex flex-col items-end gap-1">
				<div className="flex items-center gap-1 text-xs text-slate-500">
					<Boxes size={12} />
					<span>
						{activeBatches} lot{activeBatches > 1 ? 's' : ''}
					</span>
				</div>
				{daysUntilExpiry !== null && daysUntilExpiry <= 90 && (
					<div className={`flex items-center gap-1 text-xs ${daysUntilExpiry <= 30 ? 'text-red-600 font-semibold' : 'text-amber-600'}`}>
						<AlertTriangle size={12} />
						<span>{daysUntilExpiry}j</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default function StockPage() {
	const { drugs, isLoading: isLoadingDrugs, isFetched: isFetchedDrugs, fetchDrugs, lastError } = useDrugStore();
	const { stockItems, isLoading: isLoadingStock, isFetched: isFetchedStock, fetchStock, drugsBelowMin, drugsCritical, totalDrugs, drugsInStock } = useStockStore();

	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'low' | 'critical' | 'expiring'>('all');

	// États gérant l'affichage du formulaire de réception de lot (en mode page principale ou modal)
	const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);

	useEffect(() => {
		if (!isFetchedStock) {
			fetchStock();
		}
		if (!isFetchedDrugs) {
			fetchDrugs();
		}
	}, [fetchStock, isFetchedStock, isFetchedDrugs, fetchDrugs]);

	// Enrichir avec les données Drug pour avoir les seuils
	const enrichedStock = useMemo(() => {
		if (!stockItems || !drugs) return [];
		return stockItems.map((item) => {
			const drug = drugs.find((d) => d.id === item.drugId);
			return {
				...item,
				minStockLevel: drug?.minStockLevel ?? null,
				criticalStockLevel: drug?.criticalStockLevel ?? null,
			};
		});
	}, [stockItems, drugs]);

	const filteredStock = useMemo(() => {
		let result = enrichedStock;

		// Filtre texte
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter((s) => s.drugName.toLowerCase().includes(q) || s.drugCode.toLowerCase().includes(q));
		}

		// Filtre statut
		if (filter === 'low') {
			result = result.filter((s) => s.isBelowMin && !s.isCritical);
		} else if (filter === 'critical') {
			result = result.filter((s) => s.isCritical);
		} else if (filter === 'expiring') {
			result = result.filter((s) => {
				if (!s.nearestExpiry) return false;
				const days = Math.ceil((new Date(s.nearestExpiry).getTime() - now) / (1000 * 60 * 60 * 24));
				return days <= 90;
			});
		}

		return result;
	}, [enrichedStock, search, filter]);

	if (isLoadingDrugs || (isLoadingStock && !stockItems)) {
		return (
			<main className="flex-1 flex items-center justify-center min-h-screen">
				<Pulser />
			</main>
		);
	}

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-900">Stock Pharmaceutique</h2>
					<p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble des stocks par médicament</p>
				</div>
				<Button onClick={() => setIsBatchFormOpen(true)} className="hidden sm:flex gap-2 items-center font-bold text-white px-6 py-2.5 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
					<Package size={18} />
					<span>Réceptionner un lot</span>
				</Button>
			</div>

			{/* Bento Grid — KPIs */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard title="Médicaments référencés" value={totalDrugs} subtitle="dans le référentiel" icon={<Package size={20} className="text-[#4B866B]" />} />
				<StatCard title="En stock" value={drugsInStock} subtitle="avec quantité > 0" icon={<Boxes size={20} className="text-[#4B866B]" />} accent />
				{drugsBelowMin > 0 && (
					<StatCard title="Stock bas" value={drugsBelowMin} subtitle="sous le seuil d'alerte" icon={<TrendingDown size={20} className="text-amber-600" />} critical={true} accent={true} />
				)}
				{drugsCritical > 0 && (
					<StatCard
						title="Stock critique"
						value={drugsCritical}
						subtitle="réapprovisionnement urgent"
						icon={<AlertTriangle size={20} className="text-red-600" />}
						critical={true}
						accent={true}
					/>
				)}
			</div>

			{/* Mobile FAB */}
			<Button
				onClick={() => setIsBatchFormOpen(true)}
				className="sm:hidden fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#eff7e4] hover:bg-[#4B866B] opacity-80 hover:opacity-100 shadow-xl flex items-center justify-center"
			>
				<Package size={18} className="text-[#4B866B] hover:text-white" />
			</Button>

			{/* Filtres + Recherche */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par nom ou code..."
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border-primary"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
					{[
						{ key: 'all', label: 'Tous', count: enrichedStock.length },
						{ key: 'low', label: 'Bas', count: enrichedStock.filter((s) => s.isBelowMin && !s.isCritical).length },
						{ key: 'critical', label: 'Critique', count: enrichedStock.filter((s) => s.isCritical).length },
						{
							key: 'expiring',
							label: 'Périmant',
							count: enrichedStock.filter((s) => {
								if (!s.nearestExpiry) return false;
								const days = Math.ceil((new Date(s.nearestExpiry).getTime() - now) / (1000 * 60 * 60 * 24));
								return days <= 90;
							}).length,
						},
					].map((f) => (
						<button
							key={f.key}
							onClick={() => setFilter(f.key as typeof filter)}
							className={`px-4 py-2 rounded-[2px] text-sm font-medium whitespace-nowrap transition-all ${
								filter === f.key ? 'bg-[#103B4A] text-white' : 'bg-white text-slate-600 border border-[#C1C7CB]/50 hover:bg-[#eff7e4]'
							}`}
						>
							{f.label}
							<span className="ml-2 text-xs opacity-70">({f.count})</span>
						</button>
					))}
				</div>
			</div>

			{/* Liste des stocks */}
			<div className="flex flex-col gap-2">
				<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
					<div className="col-span-4">Médicament</div>
					<div className="col-span-2">Quantité</div>
					<div className="col-span-2">Seuils</div>
					<div className="col-span-2">Statut</div>
					<div className="col-span-2 text-right">Lots / Péremption</div>
				</div>

				{filteredStock.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 gap-4">
						<Boxes size={48} className="text-slate-300" />
						<p className="text-slate-500 font-medium">Aucun médicament en stock</p>
						<p className="text-sm text-slate-400">Commencez par réceptionner un lot</p>
						<Button onClick={() => setIsBatchFormOpen(true)} className="gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
							<Package size={18} />
							<span>Réceptionner un lot</span>
						</Button>
					</div>
				) : (
					filteredStock.map((item) => (
						<StockRow
							key={item.drugId}
							drugId={item.drugId}
							drugName={item.drugName}
							drugCode={item.drugCode}
							totalQuantity={item.totalQuantity}
							isBelowMin={item.isBelowMin}
							isCritical={item.isCritical}
							activeBatches={item.activeBatches}
							nearestExpiry={item.nearestExpiry ?? null}
							minStockLevel={item.minStockLevel}
							criticalStockLevel={item.criticalStockLevel}
						/>
					))
				)}
			</div>

			{/* Modale d'intégration pour le formulaire de réception de lot (inspiré du design Pattern Modal de vos autres écrans) */}
			{isBatchFormOpen && (
				<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
					<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col">
						<BatchForm mode="create" setIsHidden={setIsBatchFormOpen} />
					</div>
				</div>
			)}
		</main>
	);
}
