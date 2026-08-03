'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react'; //FileText, CreditCard
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { useDispensationStore } from '@/src/stores/dispensation.store';
//import { useMediaQuery } from '@/src/hooks/useMediaQuery.hooks';
import DataTable, { Column } from '@/src/components/ui/data-table';
import { Pagination } from '@/src/components/ui/pagination';
import type { Dispensation, PaymentMethod } from '@/src/schemas/dispensation.schemas';
import { PaymentMethodLabels } from '@/src/schemas/dispensation.schemas';
import { PersonnalDateFormatter } from '@/src/lib/dates';
import Link from 'next/link';

const paymentIcon = (method: PaymentMethod) => {
	switch (method) {
		case 'CASH_CDF':
		case 'CASH_USD':
			return <span className="text-xs font-mono text-green-600">Espèces</span>;
		case 'INSURANCE':
		case 'ONG_COVERAGE':
			return <span className="text-xs font-mono text-blue-600">Couverture</span>;
		case 'FREE':
			return <span className="text-xs font-mono text-slate-500">Gratuit</span>;
		default:
			return <span className="text-xs font-mono text-slate-600">{PaymentMethodLabels[method]}</span>;
	}
};

export default function DispensationsPage() {
	//const isDesktop = useMediaQuery('(min-width: 768px)');
	const { dispensations, isLoading, fetchDispensations, lastError } = useDispensationStore();
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const LIMIT = 20;

	useEffect(() => {
		fetchDispensations();
	}, [fetchDispensations]);

	const filtered = useMemo(() => {
		if (!dispensations) return [];
		const q = search.toLowerCase();
		return dispensations.filter(
			(d) =>
				d.dispensationNumber?.toLowerCase().includes(q) ||
				d.patient?.lastName.toLowerCase().includes(q) ||
				d.patient?.firstName.toLowerCase().includes(q) ||
				d.patient?.hospitalNumber.toLowerCase().includes(q),
		);
	}, [dispensations, search]);

	const paginated = useMemo(() => {
		const start = (page - 1) * LIMIT;
		return filtered.slice(start, start + LIMIT);
	}, [filtered, page]);

	const totalPages = Math.ceil(filtered.length / LIMIT) || 1;

	const columns: Column<Dispensation>[] = [
		{
			key: 'dispensationNumber',
			header: 'N° Dispensation',
			render: (d) => <span className="font-mono text-[rgb(25,119,119)] text-sm">{d.dispensationNumber}</span>,
		},
		{
			key: 'patient',
			header: 'Patient',
			render: (d) => <span className="font-semibold text-slate-900 text-sm">{d.patient ? `${d.patient.lastName} ${d.patient.firstName}` : '—'}</span>,
		},
		{
			key: 'hospitalNumber',
			header: 'N° Dossier',
			hidden: 'md',
			render: (d) => <span className="font-mono text-xs text-slate-500">{d.patient?.hospitalNumber || '—'}</span>,
		},
		{
			key: 'date',
			header: 'Date',
			hidden: 'md',
			render: (d) => <span className="text-slate-600 text-sm">{PersonnalDateFormatter.toLongDate(d.dispensedAt)}</span>,
		},
		{
			key: 'payment',
			header: 'Paiement',
			align: 'center',
			render: (d) => (
				<div className="flex flex-col items-center gap-0.5">
					{paymentIcon(d.paymentMethod)}
					{d.totalAmountCDF && <span className="text-xs font-mono text-slate-600">{d.totalAmountCDF.toLocaleString('fr-FR')} Fc</span>}
				</div>
			),
		},
		{
			key: 'lines',
			header: 'Lignes',
			align: 'center',
			render: (d) => <span className="font-mono text-slate-600 text-sm">{d.lineCount || d.lines?.length || 0}</span>,
		},
	];

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dispensations</h1>
					{dispensations && dispensations.length > 0 ? (
						<p className="text-sm sm:text-base text-slate-500 mt-1">
							{dispensations.length} dispensation{dispensations.length > 1 ? 's' : ''}
						</p>
					) : null}
				</div>

				<Link href="/dispensations/new">
					<Button className="hidden sm:flex gap-2 items-center justify-center font-bold text-white px-6 py-2.5 hover:bg-[rgb(25,119,119)] bg-[rgb(40,185,180)] rounded-[2px]">
						<Plus size={18} />
						<span>Nouvelle dispensation</span>
					</Button>
				</Link>
			</div>

			{/* Mobile FAB */}
			<Link href="/dispensations/new" className="sm:hidden">
				<Button className="fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#eff7e4] hover:bg-[rgb(25,119,119)] opacity-80 hover:opacity-100 shadow-xl flex items-center justify-center">
					<Plus size={18} className="text-[rgb(40,185,180)] hover:text-white" />
				</Button>
			</Link>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative w-full lg:w-1/2">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par n°, patient ou n° dossier..."
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
				data={paginated}
				columns={columns}
				isLoading={isLoading}
				error={lastError}
				emptyMessage="Aucune dispensation trouvée"
				actions={{ canView: true, canEdit: false, canDelete: false }}
				onView={(d) => {
					window.location.href = `/dispensations/${d.id}`;
				}}
			/>

			{/* Pagination */}
			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={LIMIT} />
		</main>
	);
}
