'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Drug } from '@/src/types';
import { api } from '@/src/lib/api';
import { DrugTable } from '@/src/components/drug/DrugTable';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import { Button } from '@/src/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';

export default function DrugsPage() {
	const router = useRouter();
	const [drugs, setDrugs] = useState<Drug[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [itemsPerPage] = useState(20);

	const [deleteDrug, setDeleteDrug] = useState<Drug | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const loadDrugs = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get(`/api/drugs/?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`);

			if (response.success) {
				setDrugs(response.data.drugs || []);
				setTotalPages(response.data.totalPages || 1);
				setTotalItems(response.data.total || 0);
			}
		} catch (err: any) {
			if (err.status === 401) {
				router.push('/login');
				return;
			}
			setError(err.message || 'Erreur lors du chargement des médicaments');
		} finally {
			setIsLoading(false);
		}
	}, [page, itemsPerPage, search, router]);

	useEffect(() => {
		loadDrugs();
	}, [loadDrugs]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handleDelete = async () => {
		if (!deleteDrug) return;

		setIsDeleting(true);
		setError(null);

		try {
			await api.delete(`/api/drugs/${deleteDrug.id}`);
			setDeleteDrug(null);
			loadDrugs();
		} catch (err: any) {
			const message = err.message || 'Erreur lors de la suppression';
			setError(message);
			setIsDeleting(false);
			setDeleteDrug(null);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Médicaments</h1>
					<p className="text-sm text-slate-500 mt-1">
						{totalItems} médicament{totalItems !== 1 ? 's' : ''} référencé{totalItems !== 1 ? 's' : ''}
					</p>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href="/drugs/new">
						<Plus className="h-4 w-4 mr-2" />
						Nouveau médicament
					</Link>
				</Button>
			</div>

			{/* Erreur */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* Recherche */}
			<SearchInput value={search} onChange={handleSearch} placeholder="Rechercher par nom, DCI ou code..." className="max-w-md" />

			{/* Tableau */}
			{isLoading ? (
				<div className="rounded-lg border border-slate-200 bg-white p-12">
					<div className="flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			) : (
				<DrugTable drugs={drugs} onDelete={setDeleteDrug} />
			)}

			{/* Pagination */}
			{!isLoading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />}

			{/* Dialogue de confirmation */}
			<ConfirmDialog
				open={!!deleteDrug}
				onOpenChange={(open) => !open && setDeleteDrug(null)}
				title="Supprimer le médicament"
				description={`Êtes-vous sûr de vouloir supprimer "${deleteDrug?.name}" ? Cette action est irréversible.`}
				onConfirm={handleDelete}
				isLoading={isDeleting}
				confirmText="Supprimer"
				variant="destructive"
			/>
		</div>
	);
}
