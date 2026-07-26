'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStockStore } from '@/src/stores/stock.store';
import { useBatchStore } from '@/src/stores/batches.store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, Package, AlertTriangle, Calendar, Boxes, Ban, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import Pulser from '@/src/components/ui/pulser';
import { PersonnalDateFormatter } from '@/src/lib/dates';

const formatPrice = (value: string | number | null) => {
	if (value === null || value === undefined || value === '') return '—';
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return num.toLocaleString('fr-FR');
};

// const booleanBadge = (value: boolean, labelTrue: string, labelFalse: string) => (
// 	<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
// 		{value ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
// 		{value ? labelTrue : labelFalse}
// 	</span>
// );

interface DetailSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function DetailSection({ title, icon, children }: DetailSectionProps) {
	return (
		<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
			<CardHeader className="pb-3">
				<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

interface DetailFieldProps {
	label: string;
	value: React.ReactNode;
	className?: string;
}

function DetailField({ label, value, className = '' }: DetailFieldProps) {
	return (
		<div className={`space-y-1 ${className}`}>
			<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
			<div className="text-sm text-slate-900 font-medium">{value || '—'}</div>
		</div>
	);
}

interface BatchRowProps {
	batch: {
		id: string;
		batchNumber: string;
		currentQuantity: number;
		expiryDate: string;
		isQuarantined: boolean;
		daysUntilExpiry: number;
	};
	onQuarantine: (id: string, isQuarantined: boolean) => void;
}

function BatchRow({ batch, onQuarantine }: BatchRowProps) {
	const [showQuarantineDialog, setShowQuarantineDialog] = useState(false);

	return (
		<div className="grid grid-cols-12 gap-2 md:gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30">
			{/* Numéro de lot */}
			<div className="col-span-4 md:col-span-3 flex flex-col gap-1">
				<span className="font-mono text-sm font-semibold text-[#103B4A]">{batch.batchNumber}</span>
				{batch.isQuarantined && (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 w-fit">
						<Ban size={10} />
						Quarantaine
					</span>
				)}
			</div>

			{/* Quantité */}
			<div className="col-span-2 md:col-span-2 flex flex-col items-end md:items-start gap-1">
				<span className={`text-lg font-bold ${batch.currentQuantity <= 0 ? 'text-red-600' : 'text-[#4B866B]'}`}>{batch.currentQuantity}</span>
				<span className="text-xs text-slate-400 hidden md:inline">unités</span>
			</div>

			{/* Péremption */}
			<div className="col-span-3 md:col-span-3 flex flex-col gap-1">
				<div className="flex items-center gap-2 text-sm">
					<Calendar size={14} className="text-slate-400" />
					<span>{PersonnalDateFormatter.toLongDateTime(batch.expiryDate)}</span>
				</div>
				<div
					className={`flex items-center gap-1 text-xs ${
						batch.daysUntilExpiry <= 0 ? 'text-red-600 font-bold' : batch.daysUntilExpiry <= 30 ? 'text-red-600' : batch.daysUntilExpiry <= 90 ? 'text-amber-600' : 'text-green-600'
					}`}
				>
					<AlertTriangle size={12} className={batch.daysUntilExpiry > 90 ? 'hidden' : ''} />
					<span>{batch.daysUntilExpiry <= 0 ? 'PÉRIMÉ' : `${batch.daysUntilExpiry} jour${batch.daysUntilExpiry > 1 ? 's' : ''}`}</span>
				</div>
			</div>

			{/* Actions */}
			<div className="col-span-3 md:col-span-4 flex items-center justify-end gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowQuarantineDialog(true)}
					className={`text-xs rounded-[2px] ${batch.isQuarantined ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
				>
					{batch.isQuarantined ? 'Lever quarantaine' : 'Quarantaine'}
				</Button>
			</div>

			<ConfirmDialog
				open={showQuarantineDialog}
				onOpenChange={setShowQuarantineDialog}
				title={batch.isQuarantined ? 'Lever la quarantaine' : 'Mettre en quarantaine'}
				description={
					batch.isQuarantined ? `Confirmer la levée de quarantaine du lot ${batch.batchNumber} ?` : `Mettre le lot ${batch.batchNumber} en quarantaine ? Le lot ne sera plus dispensable.`
				}
				onConfirm={() => {
					onQuarantine(batch.id, !batch.isQuarantined);
					setShowQuarantineDialog(false);
				}}
				confirmText={batch.isQuarantined ? 'Lever' : 'Quarantaine'}
				cancelText="Annuler"
				variant={batch.isQuarantined ? 'default' : 'destructive'}
			/>
		</div>
	);
}

// ── Page principale ───────────────────────────────────────────────────────

export default function StockDetailPage() {
	const { drugId } = useParams<{ drugId: string }>();
	const router = useRouter();
	const { stockDetail, isLoading, fetchStockDetail } = useStockStore();
	const { quarantineBatch } = useBatchStore();

	useEffect(() => {
		fetchStockDetail(drugId);
	}, [drugId, fetchStockDetail]);

	const handleQuarantine = async (batchId: string, isQuarantined: boolean) => {
		await quarantineBatch(batchId, isQuarantined, isQuarantined ? undefined : 'Quarantaine manuelle');
		// Rafraîchir les données
		fetchStockDetail(drugId);
		router.push('/drug');
	};

	if (isLoading && !stockDetail) {
		return (
			<main className="flex-1 flex items-center justify-center min-h-screen">
				<Pulser />
			</main>
		);
	}

	if (!stockDetail) {
		return (
			<main className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
				<AlertTriangle size={48} className="text-slate-400" />
				<h2 className="text-xl font-bold text-slate-700">Données de stock non disponibles</h2>
				<Link href="/stock">
					<Button className="bg-[#56AC35] hover:bg-[#4B866B] text-white rounded-[2px]">
						<ArrowLeft size={18} className="mr-2" />
						Retour au stock
					</Button>
				</Link>
			</main>
		);
	}

	const { drug, totalQuantity, batches, alerts } = stockDetail;

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-3">
					<Link href="/stock">
						<Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#4B866B] hover:bg-[#eff7e4] rounded-[2px]">
							<ArrowLeft size={18} />
						</Button>
					</Link>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-slate-900">{drug.name}</h1>
						<p className="text-sm text-slate-500">
							{drug.dci} · {drug.code} · Stock total:{' '}
							<span
								className={`font-bold ${totalQuantity <= (drug.criticalStockLevel || 0) ? 'text-red-600' : totalQuantity <= (drug.minStockLevel || 0) ? 'text-amber-600' : 'text-[#4B866B]'}`}
							>
								{totalQuantity} unités
							</span>
						</p>
					</div>
				</div>

				<div className="flex gap-2 w-full sm:w-auto">
					<Link href={`/drugs/${drugId}`}>
						<Button variant="outline" className="flex-1 sm:flex-none gap-2 items-center font-bold border-[#4B866B] text-[#4B866B] hover:bg-[#eff7e4] rounded-[2px]">
							<LinkIcon size={16} />
							<span className="hidden sm:inline">Fiche médicament</span>
						</Button>
					</Link>
					<Link href="/batches/new">
						<Button className="flex-1 sm:flex-none gap-2 items-center font-bold text-white px-4 py-2 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
							<Package size={16} />
							<span className="hidden sm:inline">Nouveau lot</span>
						</Button>
					</Link>
				</div>
			</div>

			{/* Alertes */}
			{alerts && alerts.length > 0 && (
				<div className="flex flex-col gap-2">
					{alerts.map((alert, i) => (
						<div
							key={i}
							className={`flex items-center gap-3 p-4 rounded-[2px] border ${
								alert.severity === 'critical'
									? 'bg-red-50 border-red-200 text-red-700'
									: alert.severity === 'warning'
										? 'bg-amber-50 border-amber-200 text-amber-700'
										: 'bg-blue-50 border-blue-200 text-blue-700'
							}`}
						>
							<AlertTriangle size={20} />
							<span className="font-medium text-sm">{alert.message}</span>
						</div>
					))}
				</div>
			)}

			{/* Grille info + lots */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne info */}
				<div className="lg:col-span-1 flex flex-col gap-6">
					<DetailSection title="Informations" icon={<Boxes size={20} />}>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<DetailField label="Code" value={drug.code} />
							<DetailField label="DCI" value={drug.dci} />
							<DetailField label="Nom générique" value={drug.genericName} />
							<DetailField label="Stock total" value={<span className="text-2xl font-bold text-[#4B866B]">{totalQuantity}</span>} />
							<DetailField label="Seuil d'alerte" value={drug.minStockLevel ?? '—'} />
							<DetailField label="Seuil critique" value={drug.criticalStockLevel ?? '—'} />
							{drug.unitPriceCDF && <DetailField label="Prix unitaire (CDF)" value={<span className="text-lg font-bold text-[#4B866B]">{formatPrice(drug.unitPriceCDF)} Fc</span>} />}
							{drug.unitPriceUSD && <DetailField label="Prix unitaire (USD)" value={<span className="text-lg font-bold text-slate-700">$ {formatPrice(drug.unitPriceUSD)}</span>} />}
						</div>
					</DetailSection>
				</div>

				{/* Colonne lots */}
				<div className="lg:col-span-2 flex flex-col gap-4">
					<DetailSection title={`Lots actifs (${batches.length})`} icon={<Package size={20} />}>
						<div className="flex flex-col gap-2">
							{/* Header */}
							<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
								<div className="col-span-3">Lot</div>
								<div className="col-span-2">Quantité</div>
								<div className="col-span-3">Péremption</div>
								<div className="col-span-4 text-right">Actions</div>
							</div>

							{batches.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 gap-3">
									<Package size={40} className="text-slate-300" />
									<p className="text-slate-500 font-medium">Aucun lot actif</p>
									<Link href="/batches/new">
										<Button className="gap-2 items-center font-bold text-white px-4 py-2 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
											<Package size={16} />
											Réceptionner un lot
										</Button>
									</Link>
								</div>
							) : (
								batches.map((batch) => <BatchRow key={batch.id} batch={batch} onQuarantine={handleQuarantine} />)
							)}
						</div>
					</DetailSection>
				</div>
			</div>
		</main>
	);
}
