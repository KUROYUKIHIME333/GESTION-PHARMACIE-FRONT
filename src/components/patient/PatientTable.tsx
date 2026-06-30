'use client';

import Link from 'next/link';
import { Patient } from '@/src/types';
import { GENDER_LABELS } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Eye, Pencil, FileText, ShoppingCart } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PatientTableProps {
	patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString('fr-FR');
	};

	const calculateAge = (dateStr: string | null) => {
		if (!dateStr) return null;
		const birth = new Date(dateStr);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50 hover:bg-slate-50">
						<TableHead className="font-semibold text-slate-700">N° Dossier</TableHead>
						<TableHead className="font-semibold text-slate-700">Nom</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden md:table-cell">Naissance</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden sm:table-cell">Genre</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Téléphone</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center hidden sm:table-cell">
							<FileText className="h-4 w-4 inline" />
						</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center hidden sm:table-cell">
							<ShoppingCart className="h-4 w-4 inline" />
						</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
						<TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{patients.length === 0 ? (
						<TableRow>
							<TableCell colSpan={9} className="text-center py-12 text-slate-400">
								Aucun patient trouvé
							</TableCell>
						</TableRow>
					) : (
						patients.map((patient) => {
							const age = calculateAge(patient.dateOfBirth);

							return (
								<TableRow key={patient.id} className="hover:bg-slate-50/50">
									<TableCell className="font-mono text-sm text-slate-600">{patient.hospitalNumber}</TableCell>

									<TableCell>
										<div className="font-medium text-slate-900">
											{patient.lastName} {patient.firstName}
										</div>
									</TableCell>

									<TableCell className="hidden md:table-cell text-sm text-slate-600">
										{formatDate(patient.dateOfBirth)}
										{age !== null && <span className="text-slate-400 ml-1">({age}a)</span>}
									</TableCell>

									<TableCell className="hidden sm:table-cell">
										<span className="text-sm text-slate-600">{GENDER_LABELS[patient.gender] || patient.gender}</span>
									</TableCell>

									<TableCell className="hidden lg:table-cell text-sm text-slate-600">{patient.phone || '—'}</TableCell>

									<TableCell className="text-center hidden sm:table-cell">
										<Badge variant="secondary" className="bg-slate-100 text-slate-700">
											{patient._count?.prescriptions || 0}
										</Badge>
									</TableCell>

									<TableCell className="text-center hidden sm:table-cell">
										<Badge variant="secondary" className="bg-slate-100 text-slate-700">
											{patient._count?.dispensations || 0}
										</Badge>
									</TableCell>

									<TableCell className="text-center">
										<Badge className={cn(patient.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-100')}>
											{patient.isActive ? 'Actif' : 'Inactif'}
										</Badge>
									</TableCell>

									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(25,119,119)]">
												<Link href={`/patients/${patient.id}`}>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(40,185,180)]">
												<Link href={`/patients/${patient.id}/edit`}>
													<Pencil className="h-4 w-4" />
												</Link>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
}
