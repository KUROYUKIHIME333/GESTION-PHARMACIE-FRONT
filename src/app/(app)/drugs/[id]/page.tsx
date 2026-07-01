'use client';

import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/lib/api';
import { usePharmacyStore, useDrugList, useSelectedDrug, useDrugLoading, useDrugError } from '@/src/stores/pharmacy.store';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { DRUG_FORM_LABELS, DRUG_CATEGORY_LABELS, STORAGE_CONDITION_LABELS } from '@/src/lib/constants';
import { ArrowLeft, Pencil, AlertCircle, Loader2 } from 'lucide-react';
import type { Drug } from '@/src/stores/pharmacy.store';

interface DrugDetailResponse {
	success: boolean;
	data: Drug;
}

export default function DrugDetailPage() {
	const params = useParams();
	const router = useRouter();
	const drugId = params.id as string;

	// Store
	const drugs = useDrugList();
	const drug = useSelectedDrug();
	const isLoading = useDrugLoading();
	const error = useDrugError();
	const { setSelectedDrug, setDrugLoading, setDrugError, updateDrug } = usePharmacyStore();

	// Cherche d'abord dans la liste du store, sinon fetch
	const loadDrug = useCallback(async () => {
		// 1. Cherche dans le cache (liste déjà chargée)
		const cached = drugs.find((d) => d.id === drugId);
		if (cached) {
			setSelectedDrug(cached);
			return;
		}

		// 2. Sinon fetch depuis l'API
		setDrugLoading(true);
		setDrugError(null);

		try {
			const res = (await api.get(`/api/drugs/${drugId}`)) as DrugDetailResponse;
			if (res.success) {
				setSelectedDrug(res.data);
				// Met à jour aussi la liste si on revient en arrière
				updateDrug(drugId, res.data);
			}
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
				router.push('/login');
				return;
			}
			if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
				setDrugError('Médicament non trouvé');
			} else {
				setDrugError((err as Error).message || 'Erreur lors du chargement');
			}
		} finally {
			setDrugLoading(false);
		}
	}, [drugId, drugs, router, setSelectedDrug, setDrugLoading, setDrugError, updateDrug]);

	useEffect(() => {
		loadDrug();

		// Cleanup : désélectionne au démontage pour éviter les fuites
		return () => {
			setSelectedDrug(null);
		};
	}, [loadDrug, setSelectedDrug]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="w-8 h-8 animate-spin text-[rgb(25,119,119)]" />
			</div>
		);
	}

	if (error || !drug) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error || 'Médicament non trouvé'}</span>
				</div>
				{/* <Button variant="outline" className="border-slate-200">
					<Link href="/drugs">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour aux médicaments
					</Link>
				</Button> */}

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"></div>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<Button className="bg-white hover:bg-gray hover:font-bold">
					<Link href="/drugs" className="flex items-center">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>

				<div>
					<h1 className="text-2xl font-bold text-slate-900">{drug.name}</h1>
					<p className="text-sm text-slate-500 mt-1">{drug.code}</p>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href={`/drugs/${drug.id}/edit`} className="flex items-center">
						<Pencil className="h-4 w-4 mr-2" />
						Modifier
					</Link>
				</Button>
			</div>

			{/* Badges */}
			<div className="flex flex-wrap gap-2">
				<Badge className={drug.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-100'}>
					{drug.isActive ? 'Actif' : 'Inactif'}
				</Badge>
				{drug.isEssential && <Badge className="bg-[rgb(40,185,180)]/10 text-[rgb(25,119,119)] hover:bg-[rgb(40,185,180)]/10">Essentiel</Badge>}
				{drug.isControlled && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Contrôlé {drug.controlledSchedule ? `(${drug.controlledSchedule})` : ''}</Badge>}
				{drug.isProgramDrug && <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">{drug.programName || 'Programme'}</Badge>}
				{drug.isPriceRegulated && (
					<Badge variant="outline" className="border-amber-200 text-amber-700">
						Prix réglementé
					</Badge>
				)}
			</div>

			{/* Informations */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Informations générales</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="DCI" value={drug.dci} />
						<InfoRow label="Forme galénique" value={DRUG_FORM_LABELS[drug.form as keyof typeof DRUG_FORM_LABELS] || drug.form} />
						<InfoRow label="Catégorie" value={DRUG_CATEGORY_LABELS[drug.category as keyof typeof DRUG_CATEGORY_LABELS] || drug.category} />
						<InfoRow label="Dosage" value={drug.dosage} />
						{drug.concentration && <InfoRow label="Concentration" value={drug.concentration} />}
						{drug.therapeuticClass && <InfoRow label="Classe thérapeutique" value={drug.therapeuticClass} />}
						{drug.ammNumber && <InfoRow label="N° AMM" value={drug.ammNumber} />}
						{drug.genericName && <InfoRow label="Nom générique" value={drug.genericName} />}
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Conditionnement</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Unité de dispensation" value={drug.unitOfDispense} />
						<InfoRow label="Conditionnement" value={`${drug.packSize} ${drug.packUnit}`} />
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Prix</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{drug.unitPriceCDF !== null && drug.unitPriceCDF !== undefined ? (
							<InfoRow label="Prix unitaire (CDF)" value={`${Number(drug.unitPriceCDF).toLocaleString('fr-FR')} CDF`} />
						) : null}
						{drug.unitPriceUSD !== null && drug.unitPriceUSD !== undefined ? (
							<InfoRow label="Prix unitaire (USD)" value={`${Number(drug.unitPriceUSD).toLocaleString('fr-FR')} USD`} />
						) : null}
						{drug.unitPriceCDF == null && drug.unitPriceUSD == null && <p className="text-sm text-slate-400">Aucun prix défini</p>}
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Seuils de stock</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Seuil d'alerte" value={String(drug.minStockLevel)} />
						<InfoRow label="Seuil critique" value={String(drug.criticalStockLevel)} />
						<InfoRow label="Point de commande" value={String(drug.reorderPoint)} />
						<InfoRow label="Quantité de commande" value={String(drug.reorderQuantity)} />
					</CardContent>
				</Card>

				{drug.storageConditions && drug.storageConditions.length > 0 && (
					<Card className="border-slate-200 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900">Conditions de stockage</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{drug.storageConditions.map((condition) => (
									<Badge key={condition} variant="outline" className="border-slate-200 text-slate-700">
										{STORAGE_CONDITION_LABELS[condition as keyof typeof STORAGE_CONDITION_LABELS] || condition}
									</Badge>
								))}
							</div>
							{drug.requiresColdChain && (
								<p className="mt-3 text-sm text-amber-600 flex items-center gap-1">
									<AlertCircle className="h-4 w-4" />
									Nécessite la chaîne du froid ({drug.minTemp}°C - {drug.maxTemp}°C)
								</p>
							)}
						</CardContent>
					</Card>
				)}

				{drug.notes && (
					<Card className="border-slate-200 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900">Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-slate-600 whitespace-pre-wrap">{drug.notes}</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between items-baseline gap-4">
			<span className="text-sm text-slate-500">{label}</span>
			<span className="text-sm font-medium text-slate-900 text-right">{value}</span>
		</div>
	);
}
