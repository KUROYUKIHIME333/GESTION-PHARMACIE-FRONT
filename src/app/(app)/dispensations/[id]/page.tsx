'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispensationStore } from '@/src/stores/dispensation.store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, FileText, User, Calendar, CreditCard, Pill, Boxes, Printer, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Pulser from '@/src/components/ui/pulser';
import { PersonnalDateFormatter } from '@/src/lib/dates';
import { PaymentMethodLabels } from '@/src/schemas/dispensation.schemas';

interface DetailSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function DetailSection({ title, icon, children }: DetailSectionProps) {
	return (
		<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
			<CardHeader className="pb-3">
				<CardTitle className="text-[rgb(25,119,119)] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

interface DetailFieldProps {
	label: string;
	value: React.ReactNode;
}

function DetailField({ label, value }: DetailFieldProps) {
	return (
		<div className="space-y-1">
			<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
			<div className="text-sm text-slate-900 font-medium">{value || '—'}</div>
		</div>
	);
}

export default function DispensationDetailPage() {
	const params = useParams();
	const id = params?.id as string;
	//const router = useRouter();
	const { currentDispensation, isLoading, fetchDispensation } = useDispensationStore();

	useEffect(() => {
		if (id) fetchDispensation(id);
	}, [id, fetchDispensation]);

	if (isLoading && !currentDispensation) {
		return (
			<main className="flex-1 flex items-center justify-center min-h-screen">
				<Pulser />
			</main>
		);
	}

	if (!currentDispensation) {
		return (
			<main className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
				<AlertTriangle size={48} className="text-slate-400" />
				<h2 className="text-xl font-bold text-slate-700">Dispensation non trouvée</h2>
				<Link href="/dispensations">
					<Button className="bg-[rgb(40,185,180)] hover:bg-[rgb(25,119,119)] text-white rounded-[2px]">
						<ArrowLeft size={18} className="mr-2" />
						Retour à l&apos;historique
					</Button>
				</Link>
			</main>
		);
	}

	const d = currentDispensation;

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-3">
					<Link href="/dispensations">
						<Button variant="ghost" size="sm" className="text-slate-500 hover:text-[rgb(25,119,119)] hover:bg-[#eff7e4] rounded-[2px]">
							<ArrowLeft size={18} />
						</Button>
					</Link>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dispensation {d.dispensationNumber}</h1>
						<p className="text-sm text-slate-500">
							{PersonnalDateFormatter.toLongDateTime(d.dispensedAt)} · {PaymentMethodLabels[d.paymentMethod]}
						</p>
					</div>
				</div>

				<Button onClick={() => window.print()} variant="outline" className="gap-2 items-center font-bold border-[rgb(25,119,119)] text-[rgb(25,119,119)] hover:bg-[#eff7e4] rounded-[2px]">
					<Printer size={16} />
					<span className="hidden sm:inline">Imprimer le reçu</span>
				</Button>
			</div>

			{/* Grille info */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Patient */}
				<DetailSection title="Patient" icon={<User size={20} />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailField label="Nom" value={`${d.patient?.lastName || ''} ${d.patient?.firstName || ''}`} />
						<DetailField label="N° Dossier" value={d.patient?.hospitalNumber} />
					</div>
				</DetailSection>

				{/* Ordonnance */}
				<DetailSection title="Ordonnance" icon={<FileText size={20} />}>
					<div className="grid grid-cols-1 gap-4">
						<DetailField
							label="Référence"
							value={
								d.prescription ? (
									<Link href={`/prescriptions/${d.prescription.id}`} className="text-[rgb(25,119,119)] hover:underline">
										{d.prescription.prescriptionNumber}
									</Link>
								) : (
									'Dispensation directe'
								)
							}
						/>
					</div>
				</DetailSection>

				{/* Paiement */}
				<DetailSection title="Paiement" icon={<CreditCard size={20} />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailField label="Mode" value={PaymentMethodLabels[d.paymentMethod]} />
						<DetailField label="Total CDF" value={d.totalAmountCDF ? `${d.totalAmountCDF.toLocaleString('fr-FR')} Fc` : '—'} />
						<DetailField label="Total USD" value={d.totalAmountUSD ? `$${d.totalAmountUSD.toLocaleString('fr-FR')}` : '—'} />
						<DetailField label="Payé CDF" value={d.amountPaidCDF ? `${d.amountPaidCDF.toLocaleString('fr-FR')} Fc` : '—'} />
						<DetailField label="N° Reçu" value={d.receiptNumber} />
					</div>
				</DetailSection>
			</div>

			{/* Lignes dispensées */}
			<DetailSection title={`Médicaments dispensés (${d.lines?.length || 0})`} icon={<Pill size={20} />}>
				<div className="flex flex-col gap-2">
					{/* Header tableau */}
					<div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
						<div className="col-span-4">Médicament</div>
						<div className="col-span-2">Qté</div>
						<div className="col-span-3">Lot (FEFO)</div>
						<div className="col-span-3 text-right">Prix</div>
					</div>

					{d.lines?.length === 0 && <p className="text-sm text-slate-500 py-4">Aucune ligne.</p>}

					{d.lines?.map((line) => (
						<div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30">
							<div className="md:col-span-4 flex flex-col gap-0.5">
								<span className="font-semibold text-sm text-slate-900">{line.drug?.name || '—'}</span>
								<span className="font-mono text-xs text-slate-500">{line.drug?.code}</span>
							</div>

							<div className="md:col-span-2">
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{line.quantity}</span>
								<span className="text-xs text-slate-400 ml-1">unités</span>
							</div>

							<div className="md:col-span-3 flex items-center gap-2 text-sm text-slate-600">
								<Boxes size={14} className="text-slate-400" />
								<span className="font-mono">{line.batchId ? 'Lot traçé' : '—'}</span>
							</div>

							<div className="md:col-span-3 text-right flex flex-col gap-0.5">
								{line.totalPriceCDF && <span className="text-sm font-semibold text-slate-900">{line.totalPriceCDF.toLocaleString('fr-FR')} Fc</span>}
								{line.totalPriceUSD && <span className="text-xs text-slate-500">${line.totalPriceUSD.toLocaleString('fr-FR')}</span>}
							</div>
						</div>
					))}
				</div>
			</DetailSection>

			{/* Notes */}
			{d.notes && (
				<Card className="border-none ring-0 rounded-[2px] bg-white">
					<CardContent className="p-5">
						<p className="text-sm text-slate-600 italic">{d.notes}</p>
					</CardContent>
				</Card>
			)}

			{/* Métadonnées */}
			<div className="flex flex-col sm:flex-row gap-2 text-xs text-slate-400 border-t border-[#C1C7CB]/50 pt-4">
				<span className="flex items-center gap-1">
					<Calendar size={12} />
					Dispensé le {PersonnalDateFormatter.toLongDateTime(d.dispensedAt)}
				</span>
				{d.dispensedBy && (
					<>
						<span className="hidden sm:inline">·</span>
						<span>
							Par {d.dispensedBy.firstName} {d.dispensedBy.lastName}
						</span>
					</>
				)}
			</div>
		</main>
	);
}
