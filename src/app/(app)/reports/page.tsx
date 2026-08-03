'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Package, AlertTriangle, Activity, Calendar } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useStockStore } from '@/src/stores/stock.store';
import { useDispensationStore } from '@/src/stores/dispensation.store';
import { useDrugStore } from '@/src/stores/drugs.store';
import { PersonnalDateFormatter } from '@/src/lib/dates';
import Pulser from '@/src/components/ui/pulser';
import Link from 'next/link';

type ReportTab = 'stock' | 'expiry' | 'dispensations';

const actualDate = Date.now();

export default function ReportsPage() {
	const [activeTab, setActiveTab] = useState<ReportTab>('stock');
	const { stockItems, isLoading: stockLoading, fetchStock } = useStockStore();
	const { dispensations, isLoading: dispLoading, fetchDispensations } = useDispensationStore();
	const { fetchDrugs } = useDrugStore();

	useEffect(() => {
		fetchStock();
		fetchDispensations();
		fetchDrugs();
	}, [fetchStock, fetchDispensations, fetchDrugs]);

	const expiredBatches = useMemo(() => {
		if (!stockItems) return [];
		return stockItems.filter((item) => {
			if (!item.nearestExpiry) return false;
			const days = Math.ceil((new Date(item.nearestExpiry).getTime() - actualDate) / (1000 * 60 * 60 * 24));
			return days <= 90;
		});
	}, [stockItems]);

	const exportCSV = (filename: string, rows: string[][]) => {
		const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
	};

	const handleExportStock = () => {
		if (!stockItems) return;
		const rows = [
			['Médicament', 'Code', 'Quantité', 'Seuil min', 'Seuil critique', 'Lots actifs', 'Péremption proche'],
			...stockItems.map((s) => [
				s.drugName,
				s.drugCode,
				String(s.totalQuantity),
				String(s.minStockLevel ?? ''),
				String(s.criticalStockLevel ?? ''),
				String(s.activeBatches),
				s.nearestExpiry ? PersonnalDateFormatter.toLongDate(s.nearestExpiry) : '—',
			]),
		];
		exportCSV(`stock_${new Date().toISOString().slice(0, 10)}.csv`, rows);
	};

	const handleExportExpiry = () => {
		const rows = [
			['Médicament', 'Code', 'Quantité', 'Jours restants', 'Péremption'],
			...expiredBatches.map((s) => {
				const days = s.nearestExpiry ? Math.ceil((new Date(s.nearestExpiry).getTime() - actualDate) / (1000 * 60 * 60 * 24)) : 0;
				return [s.drugName, s.drugCode, String(s.totalQuantity), String(days), PersonnalDateFormatter.toLongDate(s.nearestExpiry!)];
			}),
		];
		exportCSV(`peremptions_${new Date().toISOString().slice(0, 10)}.csv`, rows);
	};

	const handleExportDispensations = () => {
		if (!dispensations) return;
		const rows = [
			['N°', 'Date', 'Patient', 'N° Dossier', 'Mode paiement', 'Montant CDF'],
			...dispensations.map((d) => [
				d.dispensationNumber,
				PersonnalDateFormatter.toLongDate(d.dispensedAt),
				d.patient ? `${d.patient.lastName} ${d.patient.firstName}` : '—',
				d.patient?.hospitalNumber || '—',
				d.paymentMethod,
				d.totalAmountCDF ? String(d.totalAmountCDF) : '—',
			]),
		];
		exportCSV(`dispensations_${new Date().toISOString().slice(0, 10)}.csv`, rows);
	};

	if ((stockLoading && !stockItems) || (dispLoading && !dispensations)) {
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
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Rapports</h1>
					<p className="text-sm text-slate-500 mt-1">Export et consultation des données de la pharmacie</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 overflow-x-auto pb-1">
				{[
					{ key: 'stock' as ReportTab, label: 'Stock actuel', icon: <Package size={16} /> },
					{ key: 'expiry' as ReportTab, label: 'Péremptions', icon: <AlertTriangle size={16} /> },
					{ key: 'dispensations' as ReportTab, label: 'Dispensations', icon: <Activity size={16} /> },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-sm font-medium whitespace-nowrap transition-all ${
							activeTab === tab.key ? 'bg-[rgb(25,119,119)] text-white' : 'bg-white text-slate-600 border border-[#C1C7CB]/50 hover:bg-[#eff7e4]'
						}`}
					>
						{tab.icon}
						{tab.label}
					</button>
				))}
			</div>

			{/* Content */}
			{activeTab === 'stock' && (
				<ReportSection title="Stock actuel par médicament" count={stockItems?.length || 0} onExport={handleExportStock} icon={<Package size={20} />}>
					<div className="flex flex-col gap-2">
						<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
							<div className="col-span-4">Médicament</div>
							<div className="col-span-2">Quantité</div>
							<div className="col-span-2">Statut</div>
							<div className="col-span-2">Lots</div>
							<div className="col-span-2 text-right">Péremption</div>
						</div>
						{stockItems?.map((item) => (
							<Link href={`/stock/${item.drugId}`} key={item.drugId}>
								<div className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30 hover:border-[rgb(25,119,119)]/50 transition-all">
									<div className="col-span-4">
										<p className="font-semibold text-sm text-slate-900">{item.drugName}</p>
										<p className="font-mono text-xs text-slate-500">{item.drugCode}</p>
									</div>
									<div className="col-span-2">
										<span className={`text-lg font-bold ${item.isCritical ? 'text-red-600' : item.isBelowMin ? 'text-amber-600' : 'text-[rgb(25,119,119)]'}`}>
											{item.totalQuantity}
										</span>
									</div>
									<div className="col-span-2">
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
												item.isCritical ? 'bg-red-100 text-red-700' : item.isBelowMin ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
											}`}
										>
											{item.isCritical ? 'Critique' : item.isBelowMin ? 'Bas' : 'Normal'}
										</span>
									</div>
									<div className="col-span-2 text-sm text-slate-600">{item.activeBatches} lot(s)</div>
									<div className="col-span-2 text-right text-xs text-slate-500">{item.nearestExpiry ? PersonnalDateFormatter.toLongDate(item.nearestExpiry) : '—'}</div>
								</div>
							</Link>
						))}
					</div>
				</ReportSection>
			)}

			{activeTab === 'expiry' && (
				<ReportSection title="Péremptions dans les 90 jours" count={expiredBatches.length} onExport={handleExportExpiry} icon={<AlertTriangle size={20} />}>
					<div className="flex flex-col gap-2">
						<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
							<div className="col-span-4">Médicament</div>
							<div className="col-span-2">Quantité</div>
							<div className="col-span-3">Péremption</div>
							<div className="col-span-3 text-right">Jours restants</div>
						</div>
						{expiredBatches.map((item) => {
							const days = item.nearestExpiry ? Math.ceil((new Date(item.nearestExpiry).getTime() - actualDate) / (1000 * 60 * 60 * 24)) : 0;
							return (
								<Link href={`/stock/${item.drugId}`} key={item.drugId}>
									<div className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30 hover:border-[rgb(25,119,119)]/50 transition-all">
										<div className="col-span-4">
											<p className="font-semibold text-sm text-slate-900">{item.drugName}</p>
											<p className="font-mono text-xs text-slate-500">{item.drugCode}</p>
										</div>
										<div className="col-span-2 text-lg font-bold text-slate-900">{item.totalQuantity}</div>
										<div className="col-span-3 text-sm text-slate-600">{item.nearestExpiry ? PersonnalDateFormatter.toLongDate(item.nearestExpiry) : '—'}</div>
										<div className="col-span-3 text-right">
											<span
												className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
													days <= 30 ? 'bg-red-100 text-red-700' : days <= 60 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
												}`}
											>
												<Calendar size={10} />
												{days}j
											</span>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</ReportSection>
			)}

			{activeTab === 'dispensations' && (
				<ReportSection title="Historique des dispensations" count={dispensations?.length || 0} onExport={handleExportDispensations} icon={<Activity size={20} />}>
					<div className="flex flex-col gap-2">
						<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
							<div className="col-span-3">N°</div>
							<div className="col-span-3">Patient</div>
							<div className="col-span-2">Date</div>
							<div className="col-span-2">Paiement</div>
							<div className="col-span-2 text-right">Montant</div>
						</div>
						{dispensations?.map((d) => (
							<Link href={`/dispensations/${d.id}`} key={d.id}>
								<div className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30 hover:border-[rgb(25,119,119)]/50 transition-all">
									<div className="col-span-3 font-mono text-sm text-[rgb(25,119,119)]">{d.dispensationNumber}</div>
									<div className="col-span-3">
										<p className="font-semibold text-sm text-slate-900">{d.patient ? `${d.patient.lastName} ${d.patient.firstName}` : '—'}</p>
										<p className="font-mono text-xs text-slate-500">{d.patient?.hospitalNumber}</p>
									</div>
									<div className="col-span-2 text-sm text-slate-600">{PersonnalDateFormatter.toLongDate(d.dispensedAt)}</div>
									<div className="col-span-2 text-xs text-slate-600">{d.paymentMethod}</div>
									<div className="col-span-2 text-right font-mono text-sm text-slate-900">{d.totalAmountCDF ? `${d.totalAmountCDF.toLocaleString('fr-FR')} Fc` : '—'}</div>
								</div>
							</Link>
						))}
					</div>
				</ReportSection>
			)}
		</main>
	);
}

function ReportSection({ title, count, onExport, icon, children }: { title: string; count: number; onExport: () => void; icon: React.ReactNode; children: React.ReactNode }) {
	return (
		<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-[rgb(25,119,119)] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2 w-full">
						{icon}
						{title}
						<span className="ml-auto text-sm font-normal text-slate-500">({count} entrées)</span>
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex justify-end">
					<Button onClick={onExport} variant="outline" className="gap-2 items-center font-bold text-[rgb(25,119,119)] border-[rgb(25,119,119)]/30 hover:bg-white rounded-[2px]">
						<Download size={16} />
						Exporter CSV
					</Button>
				</div>
				{children}
			</CardContent>
		</Card>
	);
}
