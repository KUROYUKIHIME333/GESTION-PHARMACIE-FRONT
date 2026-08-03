'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Clock, CheckCircle2, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { usePrescriptionStore } from '@/src/stores/prescription.store';
// import { useMediaQuery } from '@/src/hooks/useMediaQuery.hooks';
import DataTable, { Column } from '@/src/components/ui/data-table';
import { Pagination } from '@/src/components/ui/pagination';
import PrescriptionForm from '@/src/components/forms/PrescriptionForm';
import type { Prescription, PrescriptionStatus } from '@/src/schemas/prescription.schemas';
import { PersonnalDateFormatter } from '@/src/lib/dates';

const statusConfig: Record<PrescriptionStatus, { label: string; color: string; icon: React.ReactNode }> = {
	DRAFT: { label: 'Brouillon', color: 'bg-slate-100 text-slate-600', icon: <Clock size={12} /> },
	PENDING: { label: 'En attente', color: 'bg-blue-100 text-blue-700', icon: <Clock size={12} /> },
	PARTIALLY_DISPENSED: { label: 'Partiel', color: 'bg-amber-100 text-amber-700', icon: <AlertCircle size={12} /> },
	DISPENSED: { label: 'Servie', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
	CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
	EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-600', icon: <AlertTriangle size={12} /> },
};

export default function PrescriptionsPage() {
	// const isDesktop = useMediaQuery('(min-width: 768px)');
	const { prescriptions, isLoading, fetchPrescriptions, lastError } = usePrescriptionStore();

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [isHiddenState, setIsHiddenState] = useState(true);

	const LIMIT = 50;

	useEffect(() => {
		fetchPrescriptions();
	}, [fetchPrescriptions]);

	const filteredPrescriptions = useMemo(() => {
		if (!prescriptions) return [];
		return prescriptions.filter(
			(p) =>
				p.prescriptionNumber?.toLowerCase().includes(search.toLowerCase()) ||
				p.patient?.lastName.toLowerCase().includes(search.toLowerCase()) ||
				p.patient?.firstName.toLowerCase().includes(search.toLowerCase()) ||
				p.diagnosisLabel?.toLowerCase().includes(search.toLowerCase()),
		);
	}, [prescriptions, search]);

	const paginatedPrescriptions = useMemo(() => {
		const start = (page - 1) * LIMIT;
		return filteredPrescriptions.slice(start, start + LIMIT);
	}, [filteredPrescriptions, page]);

	const totalPages = Math.ceil(filteredPrescriptions.length / LIMIT);

	const handleView = (prescription: Prescription) => {
		// Pour l'instant, pas de page détail — on pourrait l'ajouter plus tard
		console.log('View prescription', prescription.id);
	};

	useEffect(()=>{
		console.log(prescriptions)
	}, [prescriptions])

	const columns: Column<Prescription>[] = [
		{
			key: 'prescriptionNumber',
			header: 'N° Ordonnance',
			render: (p) => <span className="font-mono text-[rgb(25,119,119)]">{p.prescriptionNumber}</span>,
		},
		{
			key: 'patient',
			header: 'Patient',
			render: (p) => <span className="font-semibold text-slate-900">{p.patient ? `${p.patient.lastName} ${p.patient.firstName}` : '—'}</span>,
		},
		{
			key: 'status',
			header: 'Statut',
			align: 'center',
			render: (p) => {
				const config = statusConfig[p.status];
				return (
					<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
						{config.icon}
						<span className="hidden sm:inline">{config.label}</span>
					</span>
				);
			},
		},
		{
			key: 'date',
			header: 'Date',
			hidden: 'md',
			render: (p) => <span className="text-slate-600 text-sm">{PersonnalDateFormatter.toLongDate(p.visitDate)}</span>,
		},
		{
			key: 'lines',
			header: 'Lignes',
			align: 'center',
			render: (p) => <span className="font-mono text-slate-600">{p.lineCount}</span>,
		},
		{
			key: 'diagnosis',
			header: 'Diagnostic',
			hidden: 'lg',
			render: (p) => <span className="text-slate-600 text-sm truncate max-w-[150px]">{p.diagnosisLabel || '—'}</span>,
		},
	];

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ordonnances</h2>
					{prescriptions && prescriptions.length > 0 ? (
						<p className="text-sm sm:text-base text-slate-500 mt-1">{`${prescriptions.length} ordonnance${prescriptions.length > 1 ? 's' : ''}`}</p>
					) : null}
				</div>
				<Button onClick={() => setIsHiddenState(false)} className="hidden sm:flex gap-2 items-center font-bold text-white px-6 py-2.5 hover:bg-[#4B866B] bg-[#56AC35] rounded-[2px]">
					<Plus size={18} />
					<span>Nouvelle ordonnance</span>
				</Button>
			</div>

			{/* Mobile FAB */}
			<Button
				onClick={() => setIsHiddenState(false)}
				className="sm:hidden fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#eff7e4] hover:bg-[#4B866B] opacity-80 hover:opacity-100 shadow-xl flex items-center justify-center"
			>
				<Plus size={18} className="text-[#56AC35] hover:text-white" />
			</Button>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative w-full lg:w-1/2">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par n° ordonnance, patient ou diagnostic..."
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border-[rgb(25,119,119)]"
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
				</div>
			</div>

			{/* Table */}
			<DataTable
				data={paginatedPrescriptions}
				columns={columns}
				isLoading={isLoading}
				error={lastError}
				emptyMessage="Aucune ordonnance trouvée"
				actions={{ canView: true, canEdit: false, canDelete: false }}
				onView={handleView}
			/>

			{/* Pagination */}
			<Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} totalItems={filteredPrescriptions.length} itemsPerPage={LIMIT} />

			{/* Create Modal */}
			{!isHiddenState && (
				<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
					<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col">
						<PrescriptionForm setIsHidden={setIsHiddenState} />
					</div>
				</div>
			)}
		</main>
	);
}
