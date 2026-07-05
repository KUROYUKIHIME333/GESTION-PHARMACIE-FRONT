'use client';

import React from 'react';
import {
	FileText,
	Users,
	TrendingUp,
	Settings,
	HelpCircle,
	LogOut,
	Search,
	Bell,
	Plus,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	AlertTriangle,
	CheckCircle2,
	SlidersHorizontal,
	Package,
	Eye,
	Pencil,
	Badge,
	Trash2,
} from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
// Données fictives basées sur votre structure
const drugs = [
	{ id: 'DRG-4402', name: 'Amoxicilline 500mg', lab: 'Labo-Health Pharma', category: 'comprimés', dci: 'Amoxicillin', form: 'Tablet', stock: 12, threshold: 50, status: 'Critical' },
	{ id: 'DRG-8911', name: 'Doliprane 1g', lab: 'Sanofi Excellence', category: 'comprimés', dci: 'Paracetamol', form: 'Capsule', stock: 45, threshold: 100, status: 'Low Stock' },
	{ id: 'DRG-1205', name: 'Morphine HCl 10mg/ml', lab: 'Global Narcotics Div.', category: 'IV', dci: 'Morphine Hydrochloride', form: 'Injectable', stock: 284, threshold: 20, status: 'Stable' },
];

export default function OfficInInventory() {
	return (
		<>
			<main className="flex-1 flex flex-col gap-8 overflow-y-auto p-8">
				{/* Header */}
				<div className="flex justify-between items-end">
					<div>
						<h2 className="text-2xl font-bold text-slate-900">Medication Inventory</h2>
						{drugs.length > 0 && <p className="text-slate-500 mt-2">{drugs.length === 1 ? '1 medicament référencé' : `${drugs.length} medicaments référencés`}</p>}
					</div>
					<button className="bg-primary text-white px-6 py-2 flex items-center gap-2 hover:opacity-90">
						<Plus size={18} /> Nouveau médicament
					</button>
				</div>

				<div className="flex items-center gap-4">
					{/* <h1 className="text-2xl font-bold">Command Center</h1> */}
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
								<TableHead className="uppercase text-xs">Code</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">Name</TableHead>
								<TableHead className="uppercase text-xs">DCI</TableHead>
								<TableHead className="uppercase text-xs text-right">Stock</TableHead>
								<TableHead className="uppercase text-xs">Status</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{drugs.map((drug) => (
								<TableRow key={drug.id} className="hover:bg-surface-container-low/50">
									<TableCell className="font-mono text-primary">{drug.id}</TableCell>
									<TableCell>
										<div className="font-bold text-primary">{drug.name}</div>
										<div className="text-xs text-on-surface-variant/70">{drug.lab}</div>
									</TableCell>
									<TableCell className="text-secondary">{drug.dci}</TableCell>
									<TableCell className="text-secondary">{drug.dci}</TableCell>
									<TableCell className="text-secondary">{drug.dci}</TableCell>
									<TableCell className="text-secondary">{drug.dci}</TableCell>
									<TableCell className="text-secondary">{drug.dci}</TableCell>
									<TableCell className="text-right font-mono font-bold">{drug.stock}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2 text-sm">
											<span className={`w-2 h-2 rounded-full ${drug.status === 'Critical' ? 'bg-[#d98f4c]' : 'bg-secondary'}`} />
											{drug.status}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<MoreVertical size={16} className="text-outline cursor-pointer" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-slate-50 hover:bg-slate-50">
								<TableHead className="font-semibold text-slate-700">Code</TableHead>
								<TableHead className="font-semibold text-slate-700">Nom</TableHead>
								<TableHead className="font-semibold text-slate-700 hidden md:table-cell">DCI</TableHead>
								<TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Forme</TableHead>
								<TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Catégorie</TableHead>
								<TableHead className="font-semibold text-slate-700 text-center">Lots</TableHead>
								<TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
								<TableHead className="font-semibold text-slate-700 text-right"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{drugs.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-12 text-slate-400">
										Aucun médicament trouvé
									</TableCell>
								</TableRow>
							) : (
								drugs.map((drug) => (
									<TableRow key={drug.id} className="hover:bg-slate-50/50">
										<TableCell className="font-mono text-sm text-slate-600">{drug.id}</TableCell>
										<TableCell>
											<div className="font-medium text-slate-900">{drug.name}</div>
											{drug.name && <div className="text-xs text-slate-500">{drug.name}</div>}
										</TableCell>
										<TableCell className="hidden md:table-cell text-sm text-slate-600">{drug.dci}</TableCell>
										<TableCell className="hidden lg:table-cell">
											<span className="text-sm text-slate-600">{drug.form}</span>
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<span className="text-sm text-slate-600">{drug.category}</span>
										</TableCell>
										<TableCell className="text-center">
											<Badge className="bg-slate-100 text-slate-700">{drug.stock || 0}</Badge>
										</TableCell>
										<TableCell className="text-center">
											<Badge className={drug.status ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-100'}>
												{drug.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1">
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
												<Button variant="ghost" size="sm" onClick={() => {}} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</main>
		</>
	);
}
