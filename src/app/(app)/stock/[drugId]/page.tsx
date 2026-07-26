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

interface DetailSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function DetailSection({ title, icon, children }: DetailSectionProps) {
	return (
		<Card className="border-0 ring-0 shadow-xs rounded-[2px] bg-white">
			<CardHeader className="pb-3 border-b border-slate-100 bg-[#eff7e4]/40">
				<CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
					<span className="p-1.5 bg-[#56AC35]/15 text-[#4B866B] rounded-[2px]">{icon}</span>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-4">{children}</CardContent>
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
			<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
			<div className="text-sm text-slate-800 font-medium">{value || '—'}</div>
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
		<div className="grid grid-cols-12 gap-2 md:gap-4 items-center p-4 bg-white rounded-[2px] border-0 hover:bg-slate-50/80 transition-all shadow-xs">
			{/* Numéro de lot */}
			<div className="col-span-4 md:col-span-3 flex flex-col gap-1">
				<span className="font-mono text-sm font-bold text-[#103B4A]">{batch.batchNumber}</span>
				{batch.isQuarantined && (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs font-semibold bg-red-50 text-red-700 border border-red-200 w-fit">
						<Ban size={11} />
						Quarantaine
					</span>
				)}
			</div>

			{/* Quantité */}
			<div className="col-span-2 md:col-span-2 flex flex-col items-end md:items-start gap-0.5">
				<span className={`text-base md:text-lg font-bold ${batch.currentQuantity <= 0 ? 'text-red-600' : 'text-[#4B866B]'}`}>{batch.currentQuantity}</span>
				<span className="text-xs text-slate-400 hidden md:inline">unités</span>
			</div>

			{/* Péremption */}
			<div className="col-span-3 md:col-span-3 flex flex-col gap-0.5">
				<div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
					<Calendar size={13} className="text-slate-400 shrink-0" />
					<span>{PersonnalDateFormatter.toLongDateTime(batch.expiryDate)}</span>
				</div>
				<div
					className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-[2px] w-fit ${
						batch.daysUntilExpiry <= 0
							? 'bg-red-50 text-red-700 font-bold border border-red-200'
							: batch.daysUntilExpiry <= 30
								? 'bg-red-50 text-red-600 font-semibold border border-red-200'
								: batch.daysUntilExpiry <= 90
									? 'bg-amber-50 text-amber-600 border border-amber-200'
									: 'text-emerald-700'
					}`}
				>
					<AlertTriangle size={12} className={batch.daysUntilExpiry > 90 ? 'hidden' : 'shrink-0'} />
					<span>{batch.daysUntilExpiry <= 0 ? 'PÉRIMÉ' : `Expire dans ${batch.daysUntilExpiry}j`}</span>
				</div>
			</div>

			{/* Actions */}
			<div className="col-span-3 md:col-span-4 flex items-center justify-end gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowQuarantineDialog(true)}
					className={`text-xs rounded-[2px] cursor-pointer ${batch.isQuarantined ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
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

// Page principale

export default function StockDetailPage() {
	const { drugId } = useParams<{ drugId: string }>();
	// const router = useRouter();
	const { stockDetail, isLoading, fetchStockDetail } = useStockStore();
	const { quarantineBatch } = useBatchStore();

	useEffect(() => {
		if (drugId) {
			fetchStockDetail(drugId);
		}
	}, [drugId, fetchStockDetail]);

	const handleQuarantine = async (batchId: string, isQuarantined: boolean) => {
		await quarantineBatch(batchId, isQuarantined, isQuarantined ? undefined : 'Quarantaine manuelle');
		if (drugId) {
			fetchStockDetail(drugId);
		}
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
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8 bg-slate-50/50">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2px] border-0 shadow-xs">
				<div className="flex items-center gap-3">
					<Link href="/stock">
						<Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#4B866B] hover:bg-[#eff7e4] rounded-[2px]">
							<ArrowLeft size={18} />
						</Button>
					</Link>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-slate-900">{drug.name}</h1>
						<p className="text-sm text-slate-500 mt-0.5">
							{drug.dci} · <span className="font-mono font-medium text-slate-700">{drug.code}</span> · Stock total:{' '}
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
							key={`alert-${i}-${alert.severity}`}
							className={`flex items-center gap-3 p-4 rounded-[2px] border-0 shadow-xs ${
								alert.severity === 'critical' ? 'bg-red-50 text-red-700' : alert.severity === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
							}`}
						>
							<AlertTriangle size={20} className="shrink-0" />
							<span className="font-medium text-sm">{alert.message}</span>
						</div>
					))}
				</div>
			)}

			{/* Grille info + lots */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne info */}
				<div className="lg:col-span-1 flex flex-col gap-6">
					<DetailSection title="Informations générales" icon={<Boxes size={18} />}>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
							<DetailField label="Code d'identification" value={drug.code} />
							<DetailField label="Dénomination Commune Internationale (DCI)" value={drug.dci} />
							<DetailField label="Nom commercial / générique" value={drug.genericName} />
							<DetailField label="Stock total disponible" value={<span className="text-xl font-bold text-[#4B866B]">{totalQuantity} unités</span>} />
							<DetailField label="Seuil d'alerte (Min)" value={drug.minStockLevel ?? '—'} />
							<DetailField label="Seuil critique" value={drug.criticalStockLevel ?? '—'} />
							{drug.unitPriceCDF && <DetailField label="Prix unitaire (CDF)" value={<span className="text-base font-bold text-[#4B866B]">{formatPrice(drug.unitPriceCDF)} Fc</span>} />}
							{drug.unitPriceUSD && <DetailField label="Prix unitaire (USD)" value={<span className="text-base font-bold text-slate-700">$ {formatPrice(drug.unitPriceUSD)}</span>} />}
						</div>
					</DetailSection>
				</div>

				{/* Colonne lots */}
				<div className="lg:col-span-2 flex flex-col gap-4">
					<DetailSection title={`Lots actifs (${batches.length})`} icon={<Package size={18} />}>
						<div className="flex flex-col gap-2">
							{/* Header du tableau */}
							<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-100/80 rounded-[2px] border-0">
								<div className="col-span-3">N° de Lot</div>
								<div className="col-span-2">Quantité</div>
								<div className="col-span-3">Péremption</div>
								<div className="col-span-4 text-right">Actions</div>
							</div>

							{batches.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
									<Package size={40} className="text-slate-300" />
									<p className="text-slate-500 font-medium">Aucun lot actif enregistré</p>
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
