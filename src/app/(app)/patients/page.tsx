'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Patient } from '@/src/types';
import { api } from '@/src/lib/api';
import { PatientTable } from '@/src/components/patient/PatientTable';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { Button } from '@/src/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';

export default function PatientsPage() {
	const router = useRouter();
	const [patients, setPatients] = useState<Patient[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [itemsPerPage] = useState(20);

	const loadPatients = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get(`/api/patients/?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`);

			if (response.success) {
				setPatients(response.data.patients || []);
				setTotalPages(response.data.totalPages || 1);
				setTotalItems(response.data.total || 0);
			}
		} catch (err: any) {
			if (err.status === 401) {
				router.push('/login');
				return;
			}
			setError(err.message || 'Erreur lors du chargement des patients');
		} finally {
			setIsLoading(false);
		}
	}, [page, itemsPerPage, search, router]);

	useEffect(() => {
		loadPatients();
	}, [loadPatients]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Patients</h1>
					<p className="text-sm text-slate-500 mt-1">
						{totalItems} patient{totalItems !== 1 ? 's' : ''} enregistré{totalItems !== 1 ? 's' : ''}
					</p>
				</div>

				<Button asChild className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href="/patients/new">
						<Plus className="h-4 w-4 mr-2" />
						Nouveau patient
					</Link>
				</Button>
			</div>

			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<SearchInput value={search} onChange={handleSearch} placeholder="Rechercher par nom, prénom ou n° dossier..." className="max-w-md" />

			{isLoading ? (
				<div className="rounded-lg border border-slate-200 bg-white p-12">
					<div className="flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			) : (
				<PatientTable patients={patients} />
			)}

			{!isLoading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />}
		</div>
	);
}
