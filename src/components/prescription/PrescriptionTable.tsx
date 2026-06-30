'use client';

import Link from 'next/link';
import { Prescription, PrescriptionStatus } from '@/src/types';
import { PRESCRIPTION_STATUS_LABELS, PRESCRIPTION_STATUS_COLORS } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Eye } from 'lucide-react';

interface PrescriptionTableProps {
	prescriptions: Prescription[];
}

export function PrescriptionTable({ prescriptions }: PrescriptionTableProps) {
	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50 hover:bg-slate-50">
						<TableHead className="font-semibold text-slate-700">N° Ordonnance</TableHead>
						<TableHead className="font-semibold text-slate-700">Patient</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden md:table-cell">Prescripteur</TableHead>
						<TableHead className="font-semibold text-slate-700 hidden sm:table-cell">Date</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center">Lignes</TableHead>
						<TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
						<TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{prescriptions.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-12 text-slate-400">
								Aucune ordonnance trouvée
							</TableCell>
						</TableRow>
					) : (
						prescriptions.map((prescription) => (
							<TableRow key={prescription.id} className="hover:bg-slate-50/50">
								<TableCell className="font-mono text-sm text-slate-600">{prescription.prescriptionNumber}</TableCell>

								<TableCell>
									{prescription.patient ? (
										<div>
											<div className="font-medium text-slate-900">
												{prescription.patient.lastName} {prescription.patient.firstName}
											</div>
											<div className="text-xs text-slate-500 font-mono">{prescription.patient.hospitalNumber}</div>
										</div>
									) : (
										<span className="text-sm text-slate-400">—</span>
									)}
								</TableCell>

								<TableCell className="hidden md:table-cell text-sm text-slate-600">{prescription.prescribedBy ? `Dr. ${prescription.prescribedBy.lastName}` : '—'}</TableCell>

								<TableCell className="hidden sm:table-cell text-sm text-slate-600">{formatDate(prescription.visitDate)}</TableCell>

								<TableCell className="text-center">
									<Badge variant="secondary" className="bg-slate-100 text-slate-700">
										{prescription.lines?.length || 0}
									</Badge>
								</TableCell>

								<TableCell className="text-center">
									<Badge variant="outline" className={PRESCRIPTION_STATUS_COLORS[prescription.status] || 'bg-slate-100 text-slate-600'}>
										{PRESCRIPTION_STATUS_LABELS[prescription.status] || prescription.status}
									</Badge>
								</TableCell>

								<TableCell className="text-right">
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-[rgb(25,119,119)]">
										<Link href={`/prescriptions/${prescription.id}`}>
											<Eye className="h-4 w-4" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
