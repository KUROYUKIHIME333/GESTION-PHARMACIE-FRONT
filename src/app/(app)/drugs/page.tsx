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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:justify-between sm:items-center gap-4 sm:gap-0">
				{/* Partie Gauche : Titre et compteur */}
				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-900">Medication Inventory</h2>
					{drugs && drugs.length > 0 ? (
						<p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">{`${drugs.length} médicament${drugs.length > 1 ? 's' : ''} référencé${drugs.length > 1 ? 's' : ''}`}</p>
					) : null}
				</div>

				{/* Partie Droite : Bouton (Prend toute la largeur sur mobile) */}
				{/* Mobile FAB */}
				<Button
					onClick={() => {
						setModeState('create');
						setSelectedDrug(null);
						setIsHiddenState(false);
					}}
					className="sm:hidden fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#eff7e4] hover:bg-[#4B866B] opacity-80 hover:opacity-100 shadow-xl flex items-center justify-center"
				>
					<Plus size={18} className="text-[#4B866B] hover:text-white" />
				</Button>

				{/* Desktop Button */}
				<Button
					onClick={() => {
						setModeState('create');
						setSelectedDrug(null);
						setIsHiddenState(false);
					}}
					className="hidden sm:flex gap-2 items-center justify-center font-bold text-white px-6 py-2.5 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px] w-full sm:w-auto"
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

			{/*  MODALE DE CONFIRMATION DE SUPPRESSION  */}
			{drugToDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-sm rounded-[2px] shadow-2xl border border-[#C1C7CB]/60 overflow-hidden">
						{/* Header avec accent visuel */}
						<div className="bg-red-50 px-6 py-4 border-b border-red-100">
							<h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-red-500" />
								Confirmer la suppression
							</h3>
						</div>

						{/* Corps */}
						<div className="px-6 py-5">
							<p className="text-slate-600 text-sm leading-relaxed">
								Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-slate-900">{drugToDelete.name}</span> ? Cette action est irréversible.
							</p>
						</div>

						{/* Footer actions */}
						<div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
							<Button variant="ghost" onClick={() => setDrugToDelete(null)} className="text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-200 rounded-[2px] px-4">
								Annuler
							</Button>
							<Button
								onClick={() => {
									deleteDrug(drugToDelete.id);
									setDrugToDelete(null);
								}}
								className="text-white font-semibold bg-red-600 hover:bg-red-700 rounded-[2px] px-5 shadow-sm"
							>
								Supprimer
							</Button>
						</div>
					</div>
				</div>
			)}

			{/*  MODALE DE CRÉATION / MODIFICATION (DrugForm wrapper) */}
			{!isHiddenState && modeState && (
				<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
					<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col">
						{/* DrugForm enfant gère son propre contenu scrollable */}
						<DrugForm key={modeState + (selectedDrug ? selectedDrug.id : 'new')} drug={selectedDrug} mode={modeState} setIsHidden={setIsHiddenState} />
					</div>
				</div>
			)}
		</main>
	);
}
