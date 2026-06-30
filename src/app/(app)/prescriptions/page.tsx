'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Prescription, PrescriptionStatus } from '@/src/types';
import { api } from '@/src/lib/api';
import { PrescriptionTable } from '@/src/components/prescription/PrescriptionTable';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Plus, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PRESCRIPTION_STATUS_LABELS, PRESCRIPTION_STATUS_COLORS } from '@/src/lib/constants';

export default function PrescriptionsPage() {
	const router = useRouter();
	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | ''>('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [itemsPerPage] = useState(20);

	const statuses: PrescriptionStatus[] = ['DRAFT', 'PENDING', 'PARTIALLY_DISPENSED', 'DISPENSED', 'CANCELLED', 'EXPIRED'];

	const loadPrescriptions = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			let url = `/api/prescriptions/?page=${page}&limit=${itemsPerPage}`;
			if (search) url += `&search=${encodeURIComponent(search)}`;
			if (statusFilter) url += `&status=${statusFilter}`;

			const response = await api.get(url);

			if (response.success) {
				setPrescriptions(response.data.prescriptions || []);
				setTotalPages(response.data.totalPages || 1);
				setTotalItems(response.data.total || 0);
			}
		} catch (err: any) {
			if (err.status === 401) {
				router.push('/login');
				return;
			}
			setError(err.message || 'Erreur lors du chargement des ordonnances');
		} finally {
			setIsLoading(false);
		}
	}, [page, itemsPerPage, search, statusFilter, router]);

	useEffect(() => {
		loadPrescriptions();
	}, [loadPrescriptions]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handleStatusFilter = (status: PrescriptionStatus | '') => {
		setStatusFilter(status);
		setPage(1);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Ordonnances</h1>
					<p className="text-sm text-slate-500 mt-1">
						{totalItems} ordonnance{totalItems !== 1 ? 's' : ''}
					</p>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href="/prescriptions/new">
						<Plus className="h-4 w-4 mr-2" />
						Nouvelle ordonnance
					</Link>
				</Button>
			</div>

			{/* Filtres par statut */}
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => handleStatusFilter('')}
					className={cn('px-3 py-1.5 rounded-full text-sm font-medium transition-colors', statusFilter === '' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
				>
					Tous
				</button>
				{statuses.map((status) => (
					<button
						key={status}
						onClick={() => handleStatusFilter(status)}
						className={cn(
							'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
							statusFilter === status ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
						)}
					>
						{PRESCRIPTION_STATUS_LABELS[status]}
					</button>
				))}
			</div>

			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<SearchInput value={search} onChange={handleSearch} placeholder="Rechercher par patient ou n° ordonnance..." className="max-w-md" />

			{isLoading ? (
				<div className="rounded-lg border border-slate-200 bg-white p-12">
					<div className="flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			) : (
				<PrescriptionTable prescriptions={prescriptions} />
			)}

			{!isLoading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />}
		</div>
	);
}
