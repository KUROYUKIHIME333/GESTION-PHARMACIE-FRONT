'use client';

import Link from 'next/link';
import { Drug, DrugForm, DrugCategory } from '@/src/types';
import { DRUG_FORM_LABELS, DRUG_CATEGORY_LABELS } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DrugTableProps {
	drugs: Drug[];
	onDelete: (drug: Drug) => void;
}

export function DrugTable({ drugs, onDelete }: DrugTableProps) {
	const getFormLabel = (form: DrugForm) => DRUG_FORM_LABELS[form] || form;
	const getCategoryLabel = (category: DrugCategory) => DRUG_CATEGORY_LABELS[category] || category;

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
						<TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
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
						drugs.map((drug) => (
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
										<Button variant="ghost" size="sm" onClick={() => onDelete(drug)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
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
