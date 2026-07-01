'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Patient, Drug, PrescriptionCreateInput, PrescriptionLineCreateInput, HospitalService } from '@/src/types';
import { api } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';
import { DRUG_FORM_LABELS } from '@/src/lib/constants';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

const prescriptionLineSchema = z.object({
	drugId: z.string().min(1, 'Le médicament est requis'),
	quantityPrescribed: z.coerce.number().min(1, 'Minimum 1'),
	dosage: z.string().min(1, 'La posologie est requise').max(500),
	frequency: z.string().optional(),
	durationDays: z.coerce.number().min(1).optional(),
	route: z.string().optional(),
	instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
	patientId: z.string().min(1, 'Le patient est requis'),
	serviceId: z.string().optional(),
	isInpatient: z.boolean().default(false),
	admissionRef: z.string().max(100).optional(),
	diagnosisCode: z.string().max(50).optional(),
	diagnosisLabel: z.string().max(255).optional(),
	notes: z.string().optional(),
	lines: z.array(prescriptionLineSchema).min(1, 'Au moins un médicament est requis'),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export function PrescriptionForm() {
	const router = useRouter();
	const { user } = useAuthStore();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [drugs, setDrugs] = useState<Drug[]>([]);
	const [services, setServices] = useState<HospitalService[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [patientSearch, setPatientSearch] = useState('');
	const [showPatientResults, setShowPatientResults] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(prescriptionSchema),
		defaultValues: {
			isInpatient: false,
			lines: [{ drugId: '', quantityPrescribed: 1, dosage: '' }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'lines',
	});

	const selectedPatientId = watch('patientId');
	const selectedPatient = patients.find((p) => p.id === selectedPatientId);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoadingData(true);
				const [drugsRes, servicesRes] = await Promise.all([api.get('/api/drugs/'), api.get('/api/hospital-services/').catch(() => ({ success: true, data: { items: [] } }))]);

				if (drugsRes.success) {
					setDrugs(drugsRes.data?.drugs || []);
				}
				if (servicesRes.success) {
					const items = servicesRes.data?.items || servicesRes.data || [];
					setServices(Array.isArray(items) ? items : []);
				}
			} catch (err) {
				console.error('Erreur chargement données:', err);
			} finally {
				setIsLoadingData(false);
			}
		};

		loadData();
	}, []);

	// Recherche de patients
	useEffect(() => {
		const searchPatients = async () => {
			if (patientSearch.length < 2) {
				setPatients([]);
				return;
			}
			try {
				const res = await api.get(`/api/patients/?search=${encodeURIComponent(patientSearch)}&limit=10`);
				if (res.success) {
					setPatients(res.data?.patients || []);
				}
			} catch (err) {
				console.error('Erreur recherche patients:', err);
			}
		};

		const timeout = setTimeout(searchPatients, 300);
		return () => clearTimeout(timeout);
	}, [patientSearch]);

	const addLine = () => {
		append({ drugId: '', quantityPrescribed: 1, dosage: '' });
	};

	const removeLine = (index: number) => {
		if (fields.length > 1) {
			remove(index);
		}
	};

	const selectPatient = (patient: Patient) => {
		setValue('patientId', patient.id);
		setPatientSearch(`${patient.lastName} ${patient.firstName} (${patient.hospitalNumber})`);
		setShowPatientResults(false);
	};

	const onSubmit = async (data: PrescriptionFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			// Créer l'ordonnance
			const prescriptionPayload: PrescriptionCreateInput = {
				patientId: data.patientId,
				prescribedById: user?.id,
				...(data.serviceId && { serviceId: data.serviceId }),
				isInpatient: data.isInpatient,
				...(data.admissionRef && { admissionRef: data.admissionRef }),
				...(data.diagnosisCode && { diagnosisCode: data.diagnosisCode }),
				...(data.diagnosisLabel && { diagnosisLabel: data.diagnosisLabel }),
				...(data.notes && { notes: data.notes }),
			};

			const prescriptionRes = await api.post('/api/prescriptions/', prescriptionPayload);

			if (!prescriptionRes.success || !prescriptionRes.data?.id) {
				throw new Error("Erreur lors de la création de l'ordonnance");
			}

			const prescriptionId = prescriptionRes.data.id;

			// Ajouter les lignes
			for (const line of data.lines) {
				const linePayload: PrescriptionLineCreateInput = {
					drugId: line.drugId,
					quantityPrescribed: line.quantityPrescribed,
					dosage: line.dosage,
					...(line.frequency && { frequency: line.frequency }),
					...(line.durationDays && { durationDays: line.durationDays }),
					...(line.route && { route: line.route }),
					...(line.instructions && { instructions: line.instructions }),
				};

				await api.post(`/api/prescriptions/${prescriptionId}/lines`, linePayload);
			}

			router.push('/prescriptions');
			router.refresh();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			const message = err?.message ? err.message : "Erreur lors de la création de l'ordonnance";
			setError(message);
			setIsLoading(false);
		}
	};

	if (isLoadingData) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" className="border-slate-200">
					<Link href="/prescriptions">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">Nouvelle ordonnance</h1>
			</div>

			{/* Erreur */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Patient */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Patient</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="relative">
							<Label htmlFor="patientSearch" className="text-slate-700">
								Rechercher un patient <span className="text-red-500">*</span>
							</Label>
							<Input
								id="patientSearch"
								value={patientSearch}
								onChange={(e) => {
									setPatientSearch(e.target.value);
									setShowPatientResults(true);
									if (!e.target.value) {
										setValue('patientId', '');
									}
								}}
								onFocus={() => setShowPatientResults(true)}
								className="mt-1 border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="Nom, prénom ou n° dossier..."
							/>
							{showPatientResults && patients.length > 0 && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
									{patients.map((patient) => (
										<button
											key={patient.id}
											type="button"
											onClick={() => selectPatient(patient)}
											className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0"
										>
											<div className="font-medium text-slate-900">
												{patient.lastName} {patient.firstName}
											</div>
											<div className="text-xs text-slate-500 font-mono">{patient.hospitalNumber}</div>
										</button>
									))}
								</div>
							)}
							{showPatientResults && patientSearch.length >= 2 && patients.length === 0 && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg p-4 text-sm text-slate-500">Aucun patient trouvé</div>
							)}
							<input type="hidden" {...register('patientId')} />
							{errors.patientId && <p className="text-sm text-red-600 mt-1">{errors.patientId.message}</p>}
						</div>

						{selectedPatient && (
							<div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-slate-900">
											{selectedPatient.lastName} {selectedPatient.firstName}
										</p>
										<p className="text-sm text-slate-500 font-mono">{selectedPatient.hospitalNumber}</p>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => {
											setValue('patientId', '');
											setPatientSearch('');
											setPatients([]);
										}}
										className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Informations générales */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Informations</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="serviceId" className="text-slate-700">
								Service
							</Label>
							<select
								id="serviceId"
								{...register('serviceId')}
								className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
							>
								<option value="">Sélectionner...</option>
								{services.map((service) => (
									<option key={service.id} value={service.id}>
										{service.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex items-center gap-2 h-10">
							<Checkbox id="isInpatient" {...register('isInpatient')} />
							<Label htmlFor="isInpatient" className="text-slate-700 cursor-pointer">
								Patient hospitalisé
							</Label>
						</div>

						<div className="space-y-2">
							<Label htmlFor="admissionRef" className="text-slate-700">
								N° Admission
							</Label>
							<Input id="admissionRef" {...register('admissionRef')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="diagnosisCode" className="text-slate-700">
								Code diagnostic (CIM-10)
							</Label>
							<Input id="diagnosisCode" {...register('diagnosisCode')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="J18.9" />
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="diagnosisLabel" className="text-slate-700">
								Libellé diagnostic
							</Label>
							<Input
								id="diagnosisLabel"
								{...register('diagnosisLabel')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="Pneumonie, organisme non spécifié"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Lignes de prescription */}
				<Card className="border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-lg text-slate-900">Médicaments prescrits</CardTitle>
						<Button type="button" onClick={addLine} variant="outline" size="sm" className="border-slate-200">
							<Plus className="h-4 w-4 mr-1" />
							Ajouter
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{errors.lines && !Array.isArray(errors.lines) && <p className="text-sm text-red-600">{errors.lines.message}</p>}

						{fields.map((field, index) => (
							<div key={field.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-slate-700">Ligne {index + 1}</span>
									{fields.length > 1 && (
										<Button type="button" variant="ghost" size="sm" onClick={() => removeLine(index)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div className="space-y-1 md:col-span-2">
										<Label className="text-slate-700 text-sm">
											Médicament <span className="text-red-500">*</span>
										</Label>
										<select
											{...register(`lines.${index}.drugId`)}
											className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
										>
											<option value="">Sélectionner...</option>
											{drugs.map((drug) => (
												<option key={drug.id} value={drug.id}>
													{drug.name} ({drug.dci}) — {DRUG_FORM_LABELS[drug.form] || drug.form}
												</option>
											))}
										</select>
										{errors.lines?.[index]?.drugId && <p className="text-sm text-red-600">{errors.lines[index]?.drugId?.message}</p>}
									</div>

									<div className="space-y-1">
										<Label className="text-slate-700 text-sm">
											Quantité <span className="text-red-500">*</span>
										</Label>
										<Input type="number" min={1} {...register(`lines.${index}.quantityPrescribed`)} className="border-slate-200 h-9" />
										{errors.lines?.[index]?.quantityPrescribed && <p className="text-sm text-red-600">{errors.lines[index]?.quantityPrescribed?.message}</p>}
									</div>

									<div className="space-y-1">
										<Label className="text-slate-700 text-sm">Durée (jours)</Label>
										<Input type="number" min={1} {...register(`lines.${index}.durationDays`)} className="border-slate-200 h-9" />
									</div>

									<div className="space-y-1 md:col-span-2">
										<Label className="text-slate-700 text-sm">
											Posologie <span className="text-red-500">*</span>
										</Label>
										<Input {...register(`lines.${index}.dosage`)} className="border-slate-200 h-9" placeholder="1 comprimé matin et soir pendant 7 jours" />
										{errors.lines?.[index]?.dosage && <p className="text-sm text-red-600">{errors.lines[index]?.dosage?.message}</p>}
									</div>

									<div className="space-y-1">
										<Label className="text-slate-700 text-sm">Fréquence</Label>
										<Input {...register(`lines.${index}.frequency`)} className="border-slate-200 h-9" placeholder="2 fois par jour" />
									</div>

									<div className="space-y-1">
										<Label className="text-slate-700 text-sm">Voie d&apos;administration</Label>
										<Input {...register(`lines.${index}.route`)} className="border-slate-200 h-9" placeholder="orale, IV, IM..." />
									</div>

									<div className="space-y-1 md:col-span-2">
										<Label className="text-slate-700 text-sm">Instructions</Label>
										<Input {...register(`lines.${index}.instructions`)} className="border-slate-200 h-9" placeholder="À prendre pendant les repas..." />
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Notes */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<Textarea
							{...register('notes')}
							className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)] min-h-[80px]"
							placeholder="Observations complémentaires..."
						/>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-4">
					<Button type="button" variant="outline" className="border-slate-200">
						<Link href="/prescriptions">Annuler</Link>
					</Button>
					<Button type="submit" disabled={isLoading} className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Enregistrement...
							</span>
						) : (
							<span className="flex items-center gap-2">
								<Save className="h-4 w-4" />
								Créer l&apos;ordonnance
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
