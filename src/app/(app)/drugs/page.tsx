/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/lib/api';
import { usePharmacyStore } from '@/src/stores/pharmacy.store';
import { DrugTable } from '@/src/components/drug/DrugTable';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import { Button } from '@/src/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';

export default function DrugsPage() {
	const router = useRouter();
	const { setDrugs, setDrugLoading, setDrugError } = usePharmacyStore();

	// États locaux pour le pilotage de la vue
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [error, setError] = useState<string | null>(null);

	// Gestion de la suppression
	const [deleteDrug, setDeleteDrug] = useState<any | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Logique de chargement intégrée proprement
	useEffect(() => {
		let isMounted = true;

		const loadDrugs = async () => {
			setDrugLoading(true);
			setError(null);

			try {
				const res: any = await api.get(`/api/drugs?page=${page}&limit=20&search=${encodeURIComponent(search)}`);

				if (isMounted && res.success) {
					setDrugs(res.data.drugs, {
						total: res.data.total,
						page: res.data.page,
						limit: res.data.limit,
						totalPages: res.data.totalPages,
					});
					setTotalPages(res.data.totalPages);
					setTotalItems(res.data.total);
				}
			} catch (err: any) {
				if (isMounted) {
					if (err.status === 401) return router.push('/login');
					const message = err.message || 'Erreur lors du chargement des médicaments';
					setError(message);
					setDrugError(message);
				}
			} finally {
				if (isMounted) {
					setDrugLoading(false);
				}
			}
		};

		loadDrugs();

		return () => {
			isMounted = false;
		};
	}, [page, search, setDrugs, setDrugLoading, setDrugError, router]);

	const handleDelete = async () => {
		if (!deleteDrug) return;
		setIsDeleting(true);
		try {
			await api.delete(`/api/drugs/${deleteDrug.id}`);
			setDeleteDrug(null);
			// Le rechargement sera déclenché par le changement d'état si nécessaire
			// ou vous pouvez appeler une fonction de rafraîchissement ici.
			window.location.reload();
		} catch (err: any) {
			setError(err.message || 'Erreur lors de la suppression');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Médicaments</h1>
					<p className="text-sm text-slate-500 mt-1">
						{totalItems} médicament{totalItems !== 1 ? 's' : ''} référencé{totalItems !== 1 ? 's' : ''}
					</p>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href="/drugs/new" className="flex items-center">
						<Plus className="h-4 w-4 mr-2" />
						Nouveau médicament
					</Link>
				</Button>
			</div>

			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<SearchInput
				value={search}
				onChange={(value) => {
					setSearch(value);
					setPage(1);
				}}
				placeholder="Rechercher par nom, DCI ou code..."
				className="max-w-md"
			/>

			{/* DrugTable est autonome et connectée au store Zustand */}
			<DrugTable />

			{!error && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} itemsPerPage={20} />}

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
