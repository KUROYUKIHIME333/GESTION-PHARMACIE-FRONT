'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import DataTable, { Column } from '@/src/components/ui/data-table';
import RowActionsModal from '@/src/components/ui/raw-actions-modal';
import { Pagination } from '@/src/components/ui/pagination';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import { useDrugStore } from '@/src/stores/drugs.store';
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
	const [selectedRowForActions, setSelectedRowForActions] = useState<Drug | null>(null);
	const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

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

	// AJOUTER ces handlers :
	const handleView = (drug: Drug) => {
		// Navigation vers la page de détail
		window.location.href = `/drugs/${drug.id}`;
	};

	const handleEdit = (drug: Drug) => {
		setModeState('edit');
		setSelectedDrug(drug);
		setIsHiddenState(false);
	};

	const handleDelete = (drug: Drug) => {
		setDrugToDelete({ id: drug.id, name: drug.name });
	};

	const handleRowDoubleClick = (drug: Drug) => {
		// Ouvrir le modal d'actions sur mobile (détecté par la classe sm:)
		// Ou toujours ouvrir — le modal est responsive
		setSelectedRowForActions(drug);
		setIsActionsModalOpen(true);
	};

	// AJOUTER avant le return :
	const columns: Column<Drug>[] = [
		{
			key: 'code',
			header: 'Code',
			render: (drug) => <span className="font-mono text-primary">{drug.code}</span>,
		},
		{
			key: 'name',
			header: 'Nom',
			render: (drug) => <span className="font-bold text-primary">{drug.name}</span>,
		},
		{
			key: 'genericName',
			header: 'Nom générique / Produit',
			render: (drug) => <span className="font-mono text-primary">{drug.genericName}</span>,
		},
		{
			key: 'dci',
			header: 'DCI',
			hidden: 'md',
			render: (drug) => <span className="text-secondary">{drug.dci}</span>,
		},
		{
			key: 'form',
			header: 'Forme',
			hidden: 'lg',
			render: (drug) => <span className="text-secondary">{drug.form}</span>,
		},
		{
			key: 'category',
			header: 'Catégorie',
			hidden: 'lg',
			render: (drug) => <span className="text-secondary">{drug.category}</span>,
		},
		{
			key: 'batches',
			header: 'Lots',
			align: 'center',
			cellClassName: 'font-mono',
			render: (drug) => drug._count?.batches || 0,
		},
		{
			key: 'unitPrice',
			header: 'Prix unitaire',
			align: 'center',
			cellClassName: 'font-mono',
			render: (drug) => `${drug.unitPriceCDF} Fc`,
		},
		{
			key: 'status',
			header: 'Statut',
			align: 'center',
			render: (drug) => (
				<div className="flex items-center justify-center gap-2 text-sm">
					<span className={`w-2 h-2 rounded-full ${!drug.isActive ? 'bg-red-400' : 'bg-green-500'}`} />
					{drug.isActive ? 'Actif' : 'Inactif'}
				</div>
			),
		},
		{
			key: 'essential',
			header: 'Essentiel',
			align: 'center',
			render: (drug) => (
				<div className="flex items-center justify-center gap-2 text-sm">
					<span className={`w-2 h-2 rounded-full ${!drug.isEssential ? 'bg-red-400' : 'bg-green-500'}`} />
					{drug.isEssential ? 'OUI' : 'NON'}
				</div>
			),
		},
		{
			key: 'controlled',
			header: 'Controlé',
			align: 'center',
			render: (drug) => (
				<div className="flex items-center justify-center gap-2 text-sm">
					<span className={`w-2 h-2 rounded-full ${!drug.isControlled ? 'bg-red-400' : 'bg-green-500'}`} />
					{drug.isControlled ? 'OUI' : 'NON'}
				</div>
			),
		},
	];

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-3 md:p-6 lg:p-8">
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
			{/* SUPPRIMER tout le div "Table Container" et son contenu, et REMPLACER par : */}
			<DataTable
				data={paginatedDrugs}
				columns={columns}
				isLoading={isLoading}
				error={lastError}
				emptyMessage="Aucun médicament trouvé"
				actions={{ canView: true, canEdit: true, canDelete: true }}
				onView={handleView}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onRowDoubleClick={handleRowDoubleClick}
			/>

			{/* Pagination locale */}
			<Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} totalItems={filteredDrugs.length} itemsPerPage={LIMIT} />

			{/*  MODALE DE CONFIRMATION DE SUPPRESSION  */}
			<ConfirmDialog
				open={!!drugToDelete}
				onOpenChange={(open) => !open && setDrugToDelete(null)}
				title="Confirmer la suppression"
				description={drugToDelete ? `Êtes-vous sûr de vouloir supprimer ${drugToDelete.name} ? Cette action est irréversible.` : ''}
				onConfirm={() => {
					if (drugToDelete) {
						deleteDrug(drugToDelete.id);
						setDrugToDelete(null);
					}
				}}
				confirmText="Supprimer"
				cancelText="Annuler"
				variant="destructive"
			/>

			{/* modal d'actions mobile : */}
			<RowActionsModal
				isOpen={isActionsModalOpen}
				onClose={() => setIsActionsModalOpen(false)}
				rowName={selectedRowForActions?.name}
				onView={selectedRowForActions ? () => handleView(selectedRowForActions) : undefined}
				onEdit={selectedRowForActions ? () => handleEdit(selectedRowForActions) : undefined}
				onDelete={selectedRowForActions ? () => handleDelete(selectedRowForActions) : undefined}
				canView={true}
				canEdit={true}
				canDelete={true}
			/>

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
