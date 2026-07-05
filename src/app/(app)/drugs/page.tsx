'use client';

import { useEffect } from 'react';
import { Search, Plus, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Pagination } from '@/src/components/ui/pagination';
import { useDrugStore } from '@/src/stores/drugs.store'; // Ajustez le chemin selon votre structure
import Spinner from '@/src/components/layouts/Spinner';

export default function OfficInInventory() {
	// Récupération des données du store
	const { drugs, total, page, limit, totalPages, isLoading, fetchDrugs, deleteDrug } = useDrugStore();

	// Chargement initial
	useEffect(() => {
		fetchDrugs();
	}, [fetchDrugs]);

	const handlePageChange = (newPage: number) => {
		// Si votre API supporte la pagination via des paramètres,
		// vous devriez appeler une fonction comme setDrugsPage(newPage) puis fetchDrugs()
		console.log('Changement de page vers:', newPage);
	};

	return (
		<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-8">
			{/* Header */}
			<div className="flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Medication Inventory</h2>
					<p className="text-slate-500 mt-2">{total !== null ? `${total} medicaments référencés` : 'Chargement...'}</p>
				</div>
				<Link href="/drugs/new">
					<button className="bg-primary text-white px-6 py-2 flex items-center gap-2 hover:opacity-90">
						<Plus size={18} /> Nouveau médicament
					</button>
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative w-full lg:w-1/2">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Global Search (⌘K)"
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border-primary"
					/>
				</div>
			</div>

			{/* Table Container */}
			<div className="bento-card bg-white border border-outline-variant overflow-hidden">
				<Table className="no-scrollbar">
					<TableHeader className="bg-surface-container-low">
						<TableRow>
							<TableHead className="text-xs uppercase font-semibold text-slate-700">Code</TableHead>
							<TableHead className="text-xs uppercase font-semibold text-slate-700">Nom</TableHead>
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
								<TableCell colSpan={8} className="text-center py-10">
									<Spinner/>
								</TableCell>
							</TableRow>
						) : (
							drugs?.map((drug) => (
								<TableRow key={drug.id} className="group hover:bg-surface-container-low/50">
									<TableCell className="font-mono text-primary">{drug.code}</TableCell>
									<TableCell>
										<div className="font-bold text-primary">{drug.name}</div>
									</TableCell>
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
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(25,119,119)]">
												<Link href={`/drugs/${drug.id}`}>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(40,185,180)]">
												<Link href={`/drugs/${drug.id}/edit`}>
													<Pencil className="h-4 w-4" />
												</Link>
											</Button>
											<Button variant="ghost" size="sm" onClick={() => deleteDrug(drug.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{totalPages !== null && page !== null && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} totalItems={total || 0} itemsPerPage={limit || 20} />}
			</div>
		</main>
	);
}
