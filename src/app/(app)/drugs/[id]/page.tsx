'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDrugStore } from '@/src/stores/drugs.store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, Pencil, Trash2, Package, Thermometer, DollarSign, AlertTriangle, CheckCircle2, XCircle, Snowflake, Shield, Heart, FileText, Calendar, Barcode, Boxes } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import DrugForm from '@/src/components/forms/DrugForm';
import type { Drug } from '@/src/schemas/drug.schemas';
import { PersonnalDateFormatter } from '@/src/lib/dates';
import Pulser from '@/src/components/ui/pulser';

const formatPrice = (value: string | number | null) => {
	if (value === null || value === undefined || value === '') return '—';
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return num.toLocaleString('fr-FR');
};

const booleanBadge = (value: boolean, labelTrue: string, labelFalse: string) => (
	<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
		{value ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
		{value ? labelTrue : labelFalse}
	</span>
);

const storageConditionLabel: Record<string, string> = {
	ROOM_TEMP: 'Température ambiante',
	COOL: 'Au frais (8-15°C)',
	REFRIGERATED: 'Réfrigéré (2-8°C)',
	FROZEN: 'Congelé (< -15°C)',
	PROTECT_LIGHT: 'Protégé de la lumière',
	PROTECT_HUMIDITY: "Protégé de l'humidité",
	CONTROLLED_SUBSTANCE: 'Substance contrôlée',
};

// Composant Section
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

// Page principale
export default function DrugDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { drugs, isLoading, fetchDrugs, deleteDrug } = useDrugStore();
	const [isEditMode, setIsEditMode] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	useEffect(() => {
		if (!drugs) {
			fetchDrugs();
		}
	}, [drugs, fetchDrugs]);

	const drug: Drug | null = useMemo(() => {
		return drugs?.find((d) => d.id === id) || null;
	}, [drugs, id]);

	const handleDelete = () => {
		if (drug) {
			deleteDrug(drug.id);
			setShowDeleteDialog(false);
			router.push('/drugs');
		}
	};

	if (isLoading || !drugs) {
		return (
			<main className="flex-1 flex items-center justify-center min-h-screen">
				<Pulser />
			</main>
		);
	}

	if (!drug) {
		return (
			<main className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
				<AlertTriangle size={48} className="text-slate-400" />
				<h2 className="text-xl font-bold text-slate-700">Médicament non trouvé</h2>
				<Link href="/drugs">
					<Button className="bg-[#56AC35] hover:bg-[#4B866B] text-white rounded-[2px]">
						<ArrowLeft size={18} className="mr-2" />
						Retour à l&apos;inventaire
					</Button>
				</Link>
			</main>
		);
	}

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/*Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-3">
					<Button
						onClick={() => {
							router.back();
						}}
						variant="ghost"
						size="sm"
						className="text-slate-500 hover:text-[#4B866B] hover:bg-[#eff7e4] rounded-[2px]"
					>
						<ArrowLeft size={18} />
					</Button>

					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-slate-900">{drug.name}</h1>
						<p className="text-sm text-slate-500">
							{drug.genericName} · {drug.code}
						</p>
					</div>
				</div>

				<div className="flex gap-2 w-full sm:w-auto">
					<Button onClick={() => setIsEditMode(true)} className="flex-1 sm:flex-none gap-2 items-center font-bold text-white px-4 py-2 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
						<Pencil size={16} />
						<span className="hidden sm:inline">Modifier</span>
					</Button>
					<Button
						onClick={() => setShowDeleteDialog(true)}
						variant="outline"
						className="flex-1 sm:flex-none gap-2 items-center font-bold text-red-600 border-red-200 hover:bg-red-50 px-4 py-2 rounded-[2px]"
					>
						<Trash2 size={16} />
						<span className="hidden sm:inline">Supprimer</span>
					</Button>
				</div>
			</div>

			{/*Badges de statut */}
			<div className="flex flex-wrap gap-2">
				{booleanBadge(drug.isActive, 'Actif', 'Inactif')}
				{drug.isEssential && (
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
						<Heart size={14} />
						Essentiel
					</span>
				)}
				{drug.isControlled && (
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
						<Shield size={14} />
						Contrôlé {drug.controlledSchedule ? `· Tableau ${drug.controlledSchedule}` : ''}
					</span>
				)}
				{drug.requiresColdChain && (
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
						<Snowflake size={14} />
						Chaîne du froid
					</span>
				)}
				{drug.isProgramDrug && (
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
						<FileText size={14} />
						{drug.programName || 'Programme'}
					</span>
				)}
				{drug.isPriceRegulated && (
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
						<DollarSign size={14} />
						Prix réglementé
					</span>
				)}
			</div>

			{/*Grille de sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Informations de base */}
				<DetailSection title="Informations de base" icon={<Barcode size={20} />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailField label="Code" value={drug.code} />
						<DetailField label="Nom commercial" value={drug.name} />
						<DetailField label="Nom générique" value={drug.genericName} />
						<DetailField label="DCI" value={drug.dci} />
						<DetailField label="Forme galénique" value={drug.form} />
						<DetailField label="Catégorie" value={drug.category} />
						<DetailField label="Classe thérapeutique" value={drug.therapeuticClass} />
						<DetailField label="N° AMM" value={drug.ammNumber} />
					</div>
				</DetailSection>

				{/* Dosage et conditionnement */}
				<DetailSection title="Dosage et conditionnement" icon={<Package size={20} />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailField label="Dosage" value={drug.dosage} />
						<DetailField label="Concentration" value={drug.concentration} />
						<DetailField label="Unité de dispensation" value={drug.unitOfDispense} />
						<DetailField label="Conditionnement" value={drug.packSize && drug.packUnit ? `${drug.packSize} ${drug.packUnit}` : null} />
					</div>
				</DetailSection>

				{/* Stockage */}
				<DetailSection title="Stockage" icon={<Thermometer size={20} />}>
					<div className="space-y-4">
						<DetailField
							label="Conditions de stockage"
							value={
								drug.storageConditions && drug.storageConditions.length > 0 ? (
									<div className="flex flex-wrap gap-2 mt-1">
										{drug.storageConditions.map((condition) => (
											<span key={condition} className="px-2.5 py-1 bg-white rounded-[2px] text-xs font-medium text-slate-700 border border-[#C1C7CB]/50">
												{storageConditionLabel[condition] || condition}
											</span>
										))}
									</div>
								) : (
									'—'
								)
							}
						/>
						{(drug.minTemp !== null && drug.minTemp !== 0) || (drug.maxTemp !== null && drug.maxTemp !== 0) ? (
							<div className="grid grid-cols-2 gap-4">
								<DetailField label="Température min" value={`${drug.minTemp}°C`} />
								<DetailField label="Température max" value={`${drug.maxTemp}°C`} />
							</div>
						) : null}
					</div>
				</DetailSection>

				{/* Prix */}
				<DetailSection title="Prix" icon={<DollarSign size={20} />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{drug.unitPriceCDF && drug.unitPriceCDF !== null ? (
							<DetailField label="Prix unitaire (CDF)" value={<span className="text-lg font-bold text-[#4B866B]">{formatPrice(drug.unitPriceCDF)} Fc</span>} />
						) : null}
						{drug.unitPriceUSD && drug.unitPriceUSD !== null ? (
							<DetailField label="Prix unitaire (USD)" value={<span className="text-lg font-bold text-slate-700">$ {formatPrice(drug.unitPriceUSD)}</span>} />
						) : null}
					</div>
				</DetailSection>

				{/* Seuils de stock */}
				<DetailSection title="Seuils de stock" icon={<Boxes size={20} />}>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{drug.minStockLevel ? (
							<DetailField label="Seuil d'alerte" value={<span className={`font-semibold ${drug.minStockLevel <= 0 ? 'text-red-600' : 'text-slate-900'}`}>{drug.minStockLevel}</span>} />
						) : null}
						{drug.criticalStockLevel ? (
							<DetailField
								label="Seuil critique"
								value={<span className={`font-semibold ${drug.criticalStockLevel <= 0 ? 'text-red-600' : 'text-slate-900'}`}>{drug.criticalStockLevel}</span>}
							/>
						) : null}
						<DetailField label="Point de commande" value={drug.reorderPoint} />
						<DetailField label="Qté de commande" value={drug.reorderQuantity} />
					</div>
				</DetailSection>

				{/* Lots */}
				<DetailSection title="Inventaire des lots" icon={<Package size={20} />}>
					<div className="flex items-center justify-between">
						<DetailField label="Nombre de lots" value={<span className="text-2xl font-bold text-[#4B866B]">{drug._count?.batches || 0}</span>} />
						<Link href={`/drugs/${drug.id}/batches`}>
							<Button variant="outline" className="border-[#4B866B] text-[#4B866B] hover:bg-[#eff7e4] rounded-[2px]">
								Voir les lots
							</Button>
						</Link>
					</div>
				</DetailSection>
			</div>

			{/*Notes*/}
			{drug.notes && (
				<DetailSection title="Notes" icon={<FileText size={20} />}>
					<p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{drug.notes}</p>
				</DetailSection>
			)}

			{/*Métadonnées*/}
			<div className="flex flex-col sm:flex-row gap-2 text-xs text-slate-400 border-t border-[#C1C7CB]/50 pt-4">
				<span className="flex items-center gap-1">
					<Calendar size={12} />
					Créé le {PersonnalDateFormatter.toLongDateTime(drug.createdAt || '')}
				</span>
				<span className="hidden sm:inline">·</span>
				<span className="flex items-center gap-1">
					<Calendar size={12} />
					Modifié le {PersonnalDateFormatter.toLongDateTime(drug.updatedAt || '')}
				</span>
			</div>

			{/*Dialogs ─ */}
			<ConfirmDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				title="Confirmer la suppression"
				description={`Êtes-vous sûr de vouloir supprimer ${drug.name} ? Cette action est irréversible.`}
				onConfirm={handleDelete}
				confirmText="Supprimer"
				cancelText="Annuler"
				variant="destructive"
			/>

			{isEditMode && (
				<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
					<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col relative">
						<button
							onClick={() => setIsEditMode(false)}
							className="absolute top-4 right-4 z-10 p-2 rounded-[2px] text-slate-400 hover:text-slate-600 hover:bg-[#eff7e4] transition-colors"
							aria-label="Retour"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
						<DrugForm drug={drug} mode="edit" setIsHidden={setIsEditMode} />
					</div>
				</div>
			)}
		</main>
	);
}
