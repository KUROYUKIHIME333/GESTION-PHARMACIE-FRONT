'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';
import { usePharmacyStore, useDrugList, useDrugLoading, useDrugError } from '@/src/stores/pharmacy.store';
import { DRUG_FORM_LABELS, DRUG_CATEGORY_LABELS } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Drug } from '@/src/stores/pharmacy.store';

interface DrugListResponse {
	success: boolean;
	data: {
		drugs: Drug[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export function DrugTable() {
	const drugs = useDrugList();
	const isLoading = useDrugLoading();
	const error = useDrugError();
	const { setDrugs, setDrugLoading, setDrugError, removeDrug } = usePharmacyStore();

	useEffect(() => {
		let cancelled = false;

		async function loadDrugs() {
			setDrugLoading(true);
			setDrugError(null);

			try {
				const res = (await api.get('/api/drugs')) as DrugListResponse;
				if (!cancelled && res.success) {
					setDrugs(res.data.drugs, {
						total: res.data.total,
						page: res.data.page,
						limit: res.data.limit,
						totalPages: res.data.totalPages,
					});
				}
			} catch (err) {
				if (!cancelled) {
					setDrugError(err instanceof Error ? err.message : 'Erreur de chargement');
				}
			} finally {
				if (!cancelled) {
					setDrugLoading(false);
				}
			}
		}

		loadDrugs();

		return () => {
			cancelled = true;
		};
	}, [setDrugs, setDrugLoading, setDrugError]);

	async function handleDelete(drug: Drug) {
		if (!confirm(`Supprimer le médicament "${drug.name}" ?`)) return;

		try {
			await api.delete(`/api/drugs/${drug.id}`);
			removeDrug(drug.id);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
		}
	}

	if (isLoading) {
		return <div className="py-12 text-center text-slate-400">Chargement...</div>;
	}

	if (error) {
		return (
			<div className="py-12 text-center">
				<p className="text-red-500 mb-2">{error}</p>
				<Button variant="outline" size="sm" onClick={() => window.location.reload()}>
					Réessayer
				</Button>
			</div>
		);
	}

	const getFormLabel = (form: string) => DRUG_FORM_LABELS[form as keyof typeof DRUG_FORM_LABELS] || form;
	const getCategoryLabel = (category: string) => DRUG_CATEGORY_LABELS[category as keyof typeof DRUG_CATEGORY_LABELS] || category;

	return (
		<div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50 hover:bg-slate-50">
						<TableHead className="font-semibold text-slate-700">Code</TableHead>
						<TableHead className="font-semibold text-slate-700">Nom</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden md:table-cell">DCI</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Forme</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Catégorie</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center">Lots</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
						<TableHead className="font-semibold text-slate-700 text-right"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{drugs.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center py-12 text-slate-400">
								Aucun médicament trouvé
							</TableCell>
						</TableRow>
					) : (
						drugs.map((drug: Drug) => (
							<TableRow key={drug.id} className="hover:bg-slate-50/50">
								<TableCell className="font-mono text-sm text-slate-600">{drug.code}</TableCell>
								<TableCell>
									<div className="font-medium text-slate-900">{drug.name}</div>
									{drug.genericName && <div className="text-xs text-slate-500">{drug.genericName}</div>}
								</TableCell>
								<TableCell className="hidden md:table-cell text-sm text-slate-600">{drug.dci}</TableCell>
								<TableCell className="hidden lg:table-cell">
									<span className="text-sm text-slate-600">{getFormLabel(drug.form)}</span>
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									<span className="text-sm text-slate-600">{getCategoryLabel(drug.category)}</span>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="secondary" className="bg-slate-100 text-slate-700">
										{drug._count?.batches || 0}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge className={cn(drug.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-100')}>
										{drug.isActive ? 'Actif' : 'Inactif'}
									</Badge>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-1">
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(25,119,119)]">
											<Link href={`/drugs/${drug.id}`}>
												<Eye className="h-4 w-4" />
											</Link>
										</Button>
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(40,185,180)]">
											<Link href={`/drugs/${drug.id}/edit`}>
												<Pencil className="h-4 w-4" />
											</Link>
										</Button>
										<Button variant="ghost" size="sm" onClick={() => handleDelete(drug)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
