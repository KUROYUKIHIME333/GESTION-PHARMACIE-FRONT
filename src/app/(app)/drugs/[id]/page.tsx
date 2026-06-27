'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Drug } from '@/src/types';
import { api } from '@/src/lib/api';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { DRUG_FORM_LABELS, DRUG_CATEGORY_LABELS, STORAGE_CONDITION_LABELS } from '@/src/lib/constants';
import { ArrowLeft, Pencil, AlertCircle } from 'lucide-react';

export default function DrugDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [drug, setDrug] = useState<Drug | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadDrug = async () => {
			try {
				const response = await api.get(`/api/drugs/${params.id}`);
				if (response.success) {
					setDrug(response.data);
				}
			} catch (err: any) {
				if (err.status === 401) {
					router.push('/login');
					return;
				}
				if (err.status === 404) {
					setError('Médicament non trouvé');
				} else {
					setError(err.message || 'Erreur lors du chargement');
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadDrug();
	}, [params.id, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (error || !drug) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error || 'Médicament non trouvé'}</span>
				</div>
				<Button variant="outline" className="border-slate-200">
					<Link href="/drugs">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour aux médicaments
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="sm" className="border-slate-200">
						<Link href="/drugs">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Retour
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-slate-900">{drug.name}</h1>
						<p className="text-sm text-slate-500 font-mono">{drug.code}</p>
					</div>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href={`/drugs/${drug.id}/edit`}>
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
						<InfoRow label="Forme galénique" value={DRUG_FORM_LABELS[drug.form] || drug.form} />
						<InfoRow label="Catégorie" value={DRUG_CATEGORY_LABELS[drug.category] || drug.category} />
						<InfoRow label="Dosage" value={drug.dosage} />
						{drug.concentration && <InfoRow label="Concentration" value={drug.concentration} />}
						{drug.therapeuticClass && <InfoRow label="Classe thérapeutique" value={drug.therapeuticClass} />}
						{drug.ammNumber && <InfoRow label="N° AMM" value={drug.ammNumber} />}
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
						{drug.unitPriceCDF !== null && <InfoRow label="Prix unitaire (CDF)" value={`${drug.unitPriceCDF.toLocaleString('fr-FR')} CDF`} />}
						{drug.unitPriceUSD !== null && <InfoRow label="Prix unitaire (USD)" value={`${drug.unitPriceUSD.toLocaleString('fr-FR')} USD`} />}
						{drug.unitPriceCDF === null && drug.unitPriceUSD === null && <p className="text-sm text-slate-400">Aucun prix défini</p>}
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Seuils de stock</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Seuil d'alerte" value={drug.minStockLevel.toString()} />
						<InfoRow label="Seuil critique" value={drug.criticalStockLevel.toString()} />
						<InfoRow label="Point de commande" value={drug.reorderPoint.toString()} />
						<InfoRow label="Quantité de commande" value={drug.reorderQuantity.toString()} />
					</CardContent>
				</Card>

				{drug.storageConditions.length > 0 && (
					<Card className="border-slate-200 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900">Conditions de stockage</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{drug.storageConditions.map((condition) => (
									<Badge key={condition} variant="outline" className="border-slate-200 text-slate-700">
										{STORAGE_CONDITION_LABELS[condition] || condition}
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
