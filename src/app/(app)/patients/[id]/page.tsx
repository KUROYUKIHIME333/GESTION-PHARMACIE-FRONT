'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePatientStore } from '@/src/stores/patient.store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, User, Pencil, Trash2, AlertTriangle, CheckCircle2, XCircle, Phone, Calendar, ShieldAlert, Heart, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import PatientForm from '@/src/components/forms/PatientForm';
import AllergyForm from '@/src/components/forms/AllergyForm';
import Pulser from '@/src/components/ui/pulser';
import type { Patient } from '@/src/schemas/patient.schemas';
import { PersonnalDateFormatter } from '@/src/lib/dates';

const booleanBadge = (value: boolean | null | undefined, labelTrue: string, labelFalse: string, colorTrue = 'green', colorFalse = 'red') => {
	const v = value === true;
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
				v ? `bg-${colorTrue}-100 text-${colorTrue}-700` : `bg-${colorFalse}-100 text-${colorFalse}-700`
			}`}
		>
			{v ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
			{v ? labelTrue : labelFalse}
		</span>
	);
};

const severityColor = (severity: string) => {
	switch (severity) {
		case 'ANAPHYLAXIS':
			return 'bg-red-100 text-red-700 border-red-200';
		case 'SEVERE':
			return 'bg-orange-100 text-orange-700 border-orange-200';
		case 'MODERATE':
			return 'bg-amber-100 text-amber-700 border-amber-200';
		default:
			return 'bg-green-100 text-green-700 border-green-200';
	}
};

const severityLabel = (severity: string) => {
	switch (severity) {
		case 'ANAPHYLAXIS':
			return 'Anaphylaxie';
		case 'SEVERE':
			return 'Sévère';
		case 'MODERATE':
			return 'Modérée';
		default:
			return 'Légère';
	}
};

interface DetailSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function DetailSection({ title, icon, children }: DetailSectionProps) {
	return (
		<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
			<CardHeader className="pb-3">
				<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
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
	className?: string;
}

function DetailField({ label, value, className = '' }: DetailFieldProps) {
	return (
		<div className={`space-y-1 ${className}`}>
			<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
			<div className="text-sm text-slate-900 font-medium">{value || '—'}</div>
		</div>
	);
}

export default function PatientDetailPage() {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();
	const { patients, isLoading, fetchPatients, deletePatient } = usePatientStore();
	const [isEditMode, setIsEditMode] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showAllergyForm, setShowAllergyForm] = useState(false);

	useEffect(() => {
		if (id) {
			fetchPatients();
		}
	}, [id, fetchPatients]);

	const patient: Patient | null = useMemo(() => {
		return patients?.find((p) => p.id === id) || null;
	}, [patients, id]);

	const handleDelete = () => {
		if (patient) {
			deletePatient(patient.id);
			setShowDeleteDialog(false);
			router.push('/patients');
		}
	};

	if (!patient) {
		if (isLoading) {
			return (
				<main className="flex-1 flex items-center justify-center min-h-screen">
					<Pulser />
				</main>
			);
		}

		if (!isLoading) {
			return (
				<main className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
					<AlertTriangle size={48} className="text-slate-400" />
					<h2 className="text-xl font-bold text-slate-700">Patient non trouvé</h2>
					<Link href="/patients">
						<Button className="bg-[#56AC35] hover:bg-[#4B866B] text-white rounded-[2px]">
							<ArrowLeft size={18} className="mr-2" />
							Retour à la liste
						</Button>
					</Link>
				</main>
			);
		}
	}

	if (patient) {
		return (
			<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<Link href="/patients">
							<Button variant="ghost" size="sm" className="text-slate-500 hover:text-[rgb(25,119,119)] hover:bg-[#eff7e4] rounded-[2px]">
								<ArrowLeft size={18} />
							</Button>
						</Link>
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-slate-900">
								{patient.lastName} {patient.firstName}
							</h1>
							<p className="text-sm text-slate-500">
								{patient.hospitalNumber} · {patient.gender === 'MALE' ? 'Masculin' : patient.gender === 'FEMALE' ? 'Féminin' : 'Inconnu'}
							</p>
						</div>
					</div>

					<div className="flex gap-2 w-full sm:w-auto">
						<Button onClick={() => setIsEditMode(true)} className="flex-1 sm:flex-none gap-2 items-center font-bold text-white px-4 py-2 hover:bg-[#4B866B] bg-[bg-[#56AC35] rounded-[2px]">
							<Pencil size={16} />
							<span className="hidden sm:inline">Modifier</span>
						</Button>
						<Button
							onClick={() => setShowDeleteDialog(true)}
							variant="outline"
							className="flex-1 sm:flex-none gap-2 items-center font-bold text-red-600 border-red-200 hover:bg-red-50 px-4 py-2 rounded-[2px]"
						>
							<Trash2 size={16} />
							<span className="hidden sm:inline">Supprimer</span>
						</Button>
					</div>
				</div>

				{/* Badges */}
				<div className="flex flex-wrap gap-2">
					{booleanBadge(patient.isActive, 'Actif', 'Inactif')}
					{patient.isHivPatient && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
							<Heart size={14} />
							VIH {patient.arvCode ? `· ${patient.arvCode}` : ''}
						</span>
					)}
					{patient.isTbPatient && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
							<Activity size={14} />
							TB {patient.tbCode ? `· ${patient.tbCode}` : ''}
						</span>
					)}
				</div>

				{/* Grille */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Identité */}
					<DetailSection title="Identité" icon={<User size={20} />}>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<DetailField label="N° Dossier" value={patient.hospitalNumber} />
							<DetailField label="Nom" value={`${patient.lastName} ${patient.firstName}`} />
							<DetailField label="Sexe" value={patient.gender === 'MALE' ? 'Masculin' : patient.gender === 'FEMALE' ? 'Féminin' : patient.gender === 'OTHER' ? 'Autre' : 'Inconnu'} />
							{patient.dateOfBirth && <DetailField label="Date de naissance" value={PersonnalDateFormatter.toLongDate(patient.dateOfBirth)} />}
							{patient.nationalId && <DetailField label="N° Identité" value={patient.nationalId} />}
						</div>
					</DetailSection>

					{/* Contact */}
					<DetailSection title="Contact" icon={<Phone size={20} />}>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<DetailField label="Téléphone" value={patient.phone} />
							<DetailField label="Adresse" value={patient.address} />
							<DetailField label="Commune" value={patient.commune} />
							<DetailField label="Province" value={patient.province} />
						</div>
					</DetailSection>

					{/* Allergies */}
					<DetailSection title="Allergies" icon={<ShieldAlert size={20} />}>
						<div className="space-y-3">
							{patient.allergies && patient.allergies.length > 0 ? (
								patient.allergies.map((allergy) => (
									<div key={allergy.id} className={`flex items-center justify-between p-3 rounded-[2px] border ${severityColor(allergy.severity)}`}>
										<div className="flex flex-col gap-1">
											<span className="font-semibold text-sm">{allergy.substance}</span>
											{allergy.reaction && <span className="text-xs opacity-80">{allergy.reaction}</span>}
										</div>
										<span className="text-xs font-bold px-2 py-1 rounded-full bg-white/60">{severityLabel(allergy.severity)}</span>
									</div>
								))
							) : (
								<p className="text-sm text-slate-500">Aucune allergie documentée</p>
							)}
							<Button
								onClick={() => setShowAllergyForm(true)}
								variant="outline"
								className="w-full gap-2 items-center font-bold text-[rgb(25,119,119)] border-[rgb(25,119,119)]/30 hover:bg-[#eff7e4] rounded-[2px] mt-2"
							>
								<Plus size={16} />
								Ajouter une allergie
							</Button>
						</div>
					</DetailSection>

					{/* Programmes */}
					<DetailSection title="Programmes de santé" icon={<Heart size={20} />}>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<DetailField label="VIH" value={patient.isHivPatient ? `OUI${patient.arvCode ? ` · ${patient.arvCode}` : ''}` : 'Non'} />
							<DetailField label="Tuberculose" value={patient.isTbPatient ? `OUI${patient.tbCode ? ` · ${patient.tbCode}` : ''}` : 'Non'} />
							<DetailField label="Pathologies chroniques" value={patient.chronicConditions?.join(', ') || '—'} />
						</div>
					</DetailSection>
				</div>

				{/* Métadonnées */}
				<div className="flex flex-col sm:flex-row gap-2 text-xs text-slate-400 border-t border-[#C1C7CB]/50 pt-4">
					<span className="flex items-center gap-1">
						<Calendar size={12} />
						Créé le {PersonnalDateFormatter.toLongDateTime(patient.createdAt || '')}
					</span>
					<span className="hidden sm:inline">·</span>
					<span className="flex items-center gap-1">
						<Calendar size={12} />
						Modifié le {PersonnalDateFormatter.toLongDateTime(patient.updatedAt || '')}
					</span>
				</div>

				{/* Dialogs */}
				<ConfirmDialog
					open={showDeleteDialog}
					onOpenChange={setShowDeleteDialog}
					title="Confirmer la suppression"
					description={`Êtes-vous sûr de vouloir supprimer ${patient.firstName} ${patient.lastName} ?`}
					onConfirm={handleDelete}
					confirmText="Supprimer"
					cancelText="Annuler"
					variant="destructive"
				/>

				{isEditMode && (
					<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
						<div className="bg-white w-full sm:w-11/12 md:w-2/3 lg:w-2/3 sm:max-h-[90vh] sm:rounded-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden flex flex-col relative">
							<button
								onClick={() => setIsEditMode(false)}
								className="absolute top-4 right-4 z-10 p-2 rounded-[2px] text-slate-400 hover:text-slate-600 hover:bg-[#eff7e4] transition-colors"
								aria-label="Fermer"
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
							<PatientForm patient={patient} mode="edit" setIsHidden={setIsEditMode} />
						</div>
					</div>
				)}

				{showAllergyForm && <AllergyForm patientId={patient.id} setIsHidden={setShowAllergyForm} />}
			</main>
		);
	}
}
