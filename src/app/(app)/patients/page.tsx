'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { usePatientStore } from '@/src/stores/patient.store';
import { useMediaQuery } from '@/src/hooks/useMediaQuery.hooks';
import DataTable, { Column } from '@/src/components/ui/data-table';
import { Pagination } from '@/src/components/ui/pagination';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import RowActionsModal from '@/src/components/ui/raw-actions-modal';
import PatientForm from '@/src/components/forms/PatientForm';
import type { Patient } from '@/src/schemas/patient.schemas';
// import Link from 'next/link';

export default function PatientsPage() {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const { patients, isLoading, fetchPatients, deletePatient, lastError } = usePatientStore();

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);
	const [modeState, setModeState] = useState<'create' | 'edit' | null>(null);
	const [isHiddenState, setIsHiddenState] = useState(true);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [selectedRowForActions, setSelectedRowForActions] = useState<Patient | null>(null);
	const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

	const LIMIT = 50;

	useEffect(() => {
		fetchPatients();
	}, [fetchPatients]);

	const filteredPatients = useMemo(() => {
		if (!patients) return [];
		return patients.filter(
			(p) =>
				p.firstName.toLowerCase().includes(search.toLowerCase()) ||
				p.lastName.toLowerCase().includes(search.toLowerCase()) ||
				p.hospitalNumber.toLowerCase().includes(search.toLowerCase()) ||
				(p.phone && p.phone.includes(search)),
		);
	}, [patients, search]);

	const paginatedPatients = useMemo(() => {
		const start = (page - 1) * LIMIT;
		return filteredPatients.slice(start, start + LIMIT);
	}, [filteredPatients, page]);

	const totalPages = Math.ceil(filteredPatients.length / LIMIT);

	const handleView = (patient: Patient) => {
		window.location.href = `/patients/${patient.id}`;
	};

	const handleEdit = (patient: Patient) => {
		setModeState('edit');
		setSelectedPatient(patient);
		setIsHiddenState(false);
	};

	const handleDelete = (patient: Patient) => {
		setPatientToDelete({ id: patient.id, name: `${patient.firstName} ${patient.lastName}` });
	};

	const handleRowDoubleClick = (patient: Patient) => {
		setSelectedRowForActions(patient);
		setIsActionsModalOpen(true);
	};

	const columns: Column<Patient>[] = [
		{
			key: 'hospitalNumber',
			header: 'N° Dossier',
			render: (p) => <span className="font-mono text-[rgb(25,119,119)]">{p.hospitalNumber}</span>,
		},
		{
			key: 'name',
			header: 'Nom',
			render: (p) => (
				<span className="font-bold text-slate-900">
					{p.lastName} {p.firstName}
				</span>
			),
		},
		{
			key: 'gender',
			header: 'Sexe',
			hidden: 'md',
			render: (p) => <span className="text-slate-600">{p.gender === 'MALE' ? 'M' : p.gender === 'FEMALE' ? 'F' : p.gender === 'OTHER' ? 'Autre' : '?'}</span>,
		},
		{
			key: 'phone',
			header: 'Téléphone',
			hidden: 'lg',
			render: (p) => <span className="text-slate-600">{p.phone || '—'}</span>,
		},
		{
			key: 'prescriptions',
			header: 'Ordonnances',
			align: 'center',
			render: (p) => <span className="font-mono text-slate-600">{p._count?.prescriptions || 0}</span>,
		},
		{
			key: 'status',
			header: 'Statut',
			align: 'center',
			render: (p) => (
				<div className="flex items-center justify-center gap-2 text-sm">
					<span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-red-400'}`} />
					<span className="hidden sm:inline">{p.isActive ? 'Actif' : 'Inactif'}</span>
				</div>
			),
		},
	];

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Patients</h1>
					{patients && patients.length > 0 ? <p className="text-sm sm:text-base text-slate-500 mt-1">{`${patients.length} patient${patients.length > 1 ? 's' : ''}`}</p> : null}
				</div>

				{/* Desktop Button */}
				<Button
					onClick={() => {
						setModeState('create');
						setSelectedPatient(null);
						setIsHiddenState(false);
					}}
					className="hidden sm:flex gap-2 items-center justify-center font-bold text-white px-6 py-2.5 hover:bg-[#4B866B] bg-[bg-[#56AC35] rounded-[2px]"
				>
					<Plus size={18} />
					<span>Nouveau patient</span>
				</Button>
			</div>

			{/* Mobile FAB */}
			<Button
				onClick={() => {
					setModeState('create');
					setSelectedPatient(null);
					setIsHiddenState(false);
				}}
				className="sm:hidden fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#eff7e4] hover:bg-[#4B866B] opacity-80 hover:opacity-100 shadow-xl flex items-center justify-center"
			>
				<Plus size={18} className="text-[bg-[#56AC35] hover:text-white" />
			</Button>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative w-full lg:w-1/2">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par nom, n° dossier ou téléphone..."
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border
                        focus-visible:border-[rgb(25,119,119)]"
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
				</div>
			</div>

			{/* Table */}
			<DataTable
				data={paginatedPatients}
				columns={columns}
				isLoading={isLoading}
				error={lastError}
				emptyMessage="Aucun patient trouvé"
				actions={{ canView: true, canEdit: true, canDelete: true }}
				onView={handleView}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onRowDoubleClick={handleRowDoubleClick}
			/>

			{/* Pagination */}
			<Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} totalItems={filteredPatients.length} itemsPerPage={LIMIT} />

			{/* Confirm Delete */}
			<ConfirmDialog
				open={!!patientToDelete}
				onOpenChange={(open) => !open && setPatientToDelete(null)}
				title="Confirmer la suppression"
				description={patientToDelete ? `Êtes-vous sûr de vouloir supprimer ${patientToDelete.name} ?` : ''}
				onConfirm={() => {
					if (patientToDelete) {
						deletePatient(patientToDelete.id);
						setPatientToDelete(null);
					}
				}}
				confirmText="Supprimer"
				cancelText="Annuler"
				variant="destructive"
			/>

			{/* Mobile Actions Modal */}
			{!isDesktop && (
				<RowActionsModal
					isOpen={isActionsModalOpen}
					onClose={() => setIsActionsModalOpen(false)}
					rowName={selectedRowForActions ? `${selectedRowForActions.lastName} ${selectedRowForActions.firstName}` : undefined}
					onView={selectedRowForActions ? () => handleView(selectedRowForActions) : undefined}
					onEdit={selectedRowForActions ? () => handleEdit(selectedRowForActions) : undefined}
					onDelete={selectedRowForActions ? () => handleDelete(selectedRowForActions) : undefined}
					canView={true}
					canEdit={true}
					canDelete={true}
				/>
			)}

			{/* Create/Edit Modal */}
			{!isHiddenState && modeState && (
				<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
					<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col">
						<PatientForm key={modeState + (selectedPatient ? selectedPatient.id : 'new')} patient={selectedPatient} mode={modeState} setIsHidden={setIsHiddenState} />
					</div>
				</div>
			)}
		</main>
	);
}
