'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Patient, PatientAllergy } from '@/src/types';
import { api } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';
import { GENDER_LABELS, ALLERGY_SEVERITY_LABELS, ALLERGY_SEVERITY_COLORS } from '@/src/lib/constants';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AllergyList } from '@/src/components/patient/AllergyList';
import { ArrowLeft, Pencil, AlertCircle, FileText, ShoppingCart } from 'lucide-react';

export default function PatientDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { user } = useAuthStore();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const canViewSensitiveData = user?.role === 'PHARMACIST' || user?.role === 'DOCTOR' || user?.role === 'SUPERADMIN';

	const loadPatient = useCallback(async () => {
		try {
			const [patientRes, allergiesRes] = await Promise.all([api.get(`/api/patients/${params.id}`), api.get(`/api/patients/${params.id}/allergies`)]);

			if (patientRes.success) {
				setPatient(patientRes.data);
			}
			if (allergiesRes.success) {
				setAllergies(allergiesRes.data || []);
			}
		} catch (err: any) {
			if (err.status === 401) {
				router.push('/login');
				return;
			}
			if (err.status === 404) {
				setError('Patient non trouvé');
			} else {
				setError(err.message || 'Erreur lors du chargement');
			}
		} finally {
			setIsLoading(false);
		}
	});

	useEffect(() => {
		loadPatient();
	}, [loadPatient, params.id, router]);

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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (error || !patient) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error || 'Patient non trouvé'}</span>
				</div>
				<Button variant="outline" className="border-slate-200">
					<Link href="/patients">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour aux patients
					</Link>
				</Button>
			</div>
		);
	}

	const age = calculateAge(patient.dateOfBirth);

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="sm" className="border-slate-200">
						<Link href="/patients">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Retour
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-slate-900">
							{patient.lastName} {patient.firstName}
						</h1>
						<p className="text-sm text-slate-500 font-mono">{patient.hospitalNumber}</p>
					</div>
				</div>

				<Button className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					<Link href={`/patients/${patient.id}/edit`}>
						<Pencil className="h-4 w-4 mr-2" />
						Modifier
					</Link>
				</Button>
			</div>

			{/* Badges */}
			<div className="flex flex-wrap gap-2">
				<Badge className={patient.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{patient.isActive ? 'Actif' : 'Inactif'}</Badge>
				{patient.gender && (
					<Badge variant="outline" className="border-slate-200 text-slate-700">
						{GENDER_LABELS[patient.gender]}
					</Badge>
				)}
				{age !== null && (
					<Badge variant="outline" className="border-slate-200 text-slate-700">
						{age} ans
					</Badge>
				)}
			</div>

			{/* Informations */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Identité</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Nom complet" value={`${patient.lastName} ${patient.firstName}`} />
						<InfoRow label="N° Dossier" value={patient.hospitalNumber} />
						{patient.nationalId && <InfoRow label="N° Carte ID" value={patient.nationalId} />}
						<InfoRow label="Date de naissance" value={formatDate(patient.dateOfBirth)} />
						<InfoRow label="Genre" value={GENDER_LABELS[patient.gender] || 'Non précisé'} />
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Contact</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Téléphone" value={patient.phone || '—'} />
						<InfoRow label="Adresse" value={patient.address || '—'} />
						<InfoRow label="Commune" value={patient.commune || '—'} />
						<InfoRow label="Territoire" value={patient.territoire || '—'} />
						<InfoRow label="Province" value={patient.province || '—'} />
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Couverture</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<InfoRow label="Assurance" value={patient.insuranceId || '—'} />
						<InfoRow label="Référence ONG" value={patient.ongCoverageRef || '—'} />
					</CardContent>
				</Card>

				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Historique</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-slate-500 flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Ordonnances
							</span>
							<span className="text-lg font-semibold text-slate-900">{patient._count?.prescriptions || 0}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-slate-500 flex items-center gap-2">
								<ShoppingCart className="h-4 w-4" />
								Dispensations
							</span>
							<span className="text-lg font-semibold text-slate-900">{patient._count?.dispensations || 0}</span>
						</div>
					</CardContent>
				</Card>

				{/* Données sensibles — visible uniquement PHARMACIST/DOCTOR/SUPERADMIN */}
				{canViewSensitiveData && (
					<Card className="border-slate-200 border-l-4 border-l-red-400 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900 flex items-center gap-2">
								Données sensibles
								<span className="text-xs font-normal text-red-500">(Accès restreint)</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoRow label="VIH" value={patient.isHivPatient ? `Oui${patient.arvCode ? ` (${patient.arvCode})` : ''}` : 'Non'} />
							<InfoRow label="Tuberculose" value={patient.isTbPatient ? `Oui${patient.tbCode ? ` (${patient.tbCode})` : ''}` : 'Non'} />
						</CardContent>
					</Card>
				)}

				{patient.chronicConditions.length > 0 && (
					<Card className="border-slate-200 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900">Pathologies chroniques</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{patient.chronicConditions.map((condition) => (
									<Badge key={condition} variant="outline" className="border-slate-200 text-slate-700">
										{condition}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{patient.notes && (
					<Card className="border-slate-200 md:col-span-2">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900">Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-slate-600 whitespace-pre-wrap">{patient.notes}</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Allergies */}
			<AllergyList patientId={patient.id} allergies={allergies} onAllergyAdded={loadPatient} />
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between items-baseline gap-4">
			<span className="text-sm text-slate-500">{label}</span>
			<span className="text-sm font-medium text-slate-900 text-right">{value}</span>
		</div>
	);
}
