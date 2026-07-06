'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Pagination } from '@/src/components/ui/pagination';
import { useDrugStore } from '@/src/stores/drugs.store';
import Spinner from '@/src/components/layouts/Spinner';
import DrugForm from '@/src/components/forms/DrugForm';
import type { Drug } from '@/src/schemas/drug.schemas';

export default function OfficInInventory() {
	const { drugs, isLoading, fetchDrugs, deleteDrug, lastError } = useDrugStore();

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [drugToDelete, setDrugToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [modeState, setModeState] = useState<'create' | 'edit' | null>(null);
	const [isHiddenState, setIsHiddenState] = useState<boolean>(true);
	const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

	const LIMIT = 20;

	useEffect(() => {
		fetchDrugs();
	}, [fetchDrugs]);

	const filteredDrugs = useMemo(() => {
		if (!drugs) return [];
		return drugs.filter(
			(drug) =>
				drug.name.toLowerCase().includes(search.toLowerCase()) ||
				drug.code.toLowerCase().includes(search.toLowerCase()) ||
				(drug.genericName && drug.genericName.toLowerCase().includes(search.toLowerCase())) ||
				drug.dci.toLowerCase().includes(search.toLowerCase()),
		);
	}, [drugs, search]);

	const paginatedDrugs = useMemo(() => {
		const start = (page - 1) * LIMIT;
		return filteredDrugs.slice(start, start + LIMIT);
	}, [filteredDrugs, page]);

	const totalPages = Math.ceil(filteredDrugs.length / LIMIT);

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-8">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Medication Inventory</h2>
					{drugs && drugs.length > 0 ? <p className="text-slate-500 mt-2">{`${drugs.length} medicaments référencés`}</p> : null}
				</div>

				<Button
					onClick={() => {
						setModeState('create');
						setSelectedDrug(null);
						setIsHiddenState(false);
					}}
					className="flex gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]"
				>
					<Plus size={18} />
					<span>Nouveau médicament</span>
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative w-full lg:w-1/2">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par nom, code, nom générique ou dci ..."
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border-primary"
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
				</div>
			</div>

			{/* Table Container */}
			<div className="bento-card bg-white border border-outline-variant overflow-hidden">
				<Table className="no-scrollbar">
					<TableHeader className="bg-surface-container-low">
						<TableRow className="bg-[#F9F9FA]">
							<TableHead className="text-xs uppercase font-semibold text-slate-700">Code</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700">Nom</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700">Nom générique / Produit</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 hidden md:table-cell">DCI</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 hidden lg:table-cell">Forme</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 hidden lg:table-cell">Catégorie</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-center">Lots</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-center">Prix unitaire</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-center">Statut</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-center">Essentiel</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-center">Controlé</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700 text-right"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={12} className="text-center py-10">
									<Spinner />
								</TableCell>
							</TableRow>
						) : lastError ? (
							<TableRow>
								<TableCell colSpan={12} className="text-center py-10">
									<span className="text-center font-mono">{lastError}</span>
								</TableCell>
							</TableRow>
						) : (
							paginatedDrugs?.map((drug) => (
								<TableRow key={drug.id} className="group hover:bg-surface-container-low/50">
									<TableCell className="font-mono text-primary">{drug.code}</TableCell>
									<TableCell>
										<span className="font-bold text-primary">{drug.name}</span>
									</TableCell>
									<TableCell className="font-mono text-primary">{drug.genericName}</TableCell>
									<TableCell className="text-secondary hidden md:table-cell">{drug.dci}</TableCell>
									<TableCell className="text-secondary hidden lg:table-cell">{drug.form}</TableCell>
									<TableCell className="text-secondary hidden lg:table-cell">{drug.category}</TableCell>
									<TableCell className="text-center font-mono">{drug._count?.batches || 0}</TableCell>
									<TableCell className="text-center font-mono">{`${drug.unitPriceCDF} Fc`}</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2 text-sm">
											<span className={`w-2 h-2 rounded-full ${!drug.isActive ? 'bg-red-400' : 'bg-green-500'}`} />
											{drug.isActive ? 'Actif' : 'Inactif'}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2 text-sm">
											<span className={`w-2 h-2 rounded-full ${!drug.isEssential ? 'bg-red-400' : 'bg-green-500'}`} />
											{drug.isEssential ? 'OUI' : 'NON'}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2 text-sm">
											<span className={`w-2 h-2 rounded-full ${!drug.isControlled ? 'bg-red-400' : 'bg-green-500'}`} />
											{drug.isControlled ? 'OUI' : 'NON'}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button variant="ghost" className="cursor-pointer px-2 text-slate-400 hover:text-[rgb(25,119,119)]">
												<Link href={`/drugs/${drug.id}`}>
													<Eye size={40} />
												</Link>
											</Button>
											<Button
												variant="ghost"
												onClick={() => {
													setModeState('edit');
													setSelectedDrug(drug);
													setIsHiddenState(false);
												}}
												className="cursor-pointer px-2 text-slate-400 hover:text-[rgb(40,185,180)]"
											>
												<Pencil size={40} />
											</Button>
											<Button variant="ghost" onClick={() => setDrugToDelete({ id: drug.id, name: drug.name })} className="cursor-pointer px-2 text-slate-400 hover:text-red-600">
												<Trash2 size={40} />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination locale */}
			<Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} totalItems={filteredDrugs.length} itemsPerPage={LIMIT} />

			{/* Modale de confirmation */}
			{drugToDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
					<div className="bg-white p-8 rounded-[2px] shadow-xl border w-96 max-h-11/12 overflow-y-auto no-scrollbar">
						<h3 className="text-slate-900 font-bold text-lg">Confirmer la suppression</h3>
						<p className="text-slate-900 text-md my-4">Supprimer {drugToDelete.name} ?</p>
						<div className="flex justify-end gap-2">
							<Button className="text-slate-500 font-bold" variant="ghost" onClick={() => setDrugToDelete(null)}>
								Annuler
							</Button>
							<Button
								className="text-white font-bold bg-red-600 hover:bg-red-800 rounded-[2px]"
								onClick={() => {
									deleteDrug(drugToDelete.id);
									setDrugToDelete(null);
								}}
							>
								Supprimer
							</Button>
						</div>
					</div>
				</div>
			)}

			{!isHiddenState && modeState && <DrugForm key={modeState + (selectedDrug ? selectedDrug.id : 'new')} drug={selectedDrug} mode={modeState} setIsHidden={setIsHiddenState} />}
		</main>
	);
}
