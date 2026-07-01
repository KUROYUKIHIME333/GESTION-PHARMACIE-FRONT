'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Watch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Patient, PatientCreateInput, Gender } from '@/src/types';
import { api } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';
import { GENDER_LABELS } from '@/src/lib/constants';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';

const patientSchema = z.object({
	hospitalNumber: z.string().min(1, 'Le numéro de dossier est requis').max(50),
	firstName: z.string().min(1, 'Le prénom est requis').max(100),
	lastName: z.string().min(1, 'Le nom est requis').max(100),
	dateOfBirth: z.string().optional(),
	gender: z.string().optional(),
	nationalId: z.string().max(50).optional(),
	phone: z.string().max(20).optional(),
	address: z.string().optional(),
	commune: z.string().max(100).optional(),
	territoire: z.string().max(100).optional(),
	province: z.string().max(100).optional(),
	insuranceId: z.string().optional(),
	ongCoverageRef: z.string().max(100).optional(),
	isHivPatient: z.boolean().default(false),
	arvCode: z.string().max(50).optional(),
	isTbPatient: z.boolean().default(false),
	tbCode: z.string().max(50).optional(),
	chronicConditions: z.array(z.string()).default([]),
	isActive: z.boolean().default(true),
	notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
	patient?: Patient;
	mode: 'create' | 'edit';
}

export function PatientForm({ patient, mode }: PatientFormProps) {
	const router = useRouter();
	const { user } = useAuthStore();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [chronicInput, setChronicInput] = useState('');
	const [chronicConditions, setChronicConditions] = useState<string[]>(patient?.chronicConditions || []);

	const canViewSensitiveData = user?.role === 'PHARMACIST' || user?.role === 'DOCTOR' || user?.role === 'SUPERADMIN';

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(patientSchema),
		defaultValues: patient
			? {
					hospitalNumber: patient.hospitalNumber,
					firstName: patient.firstName,
					lastName: patient.lastName,
					dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
					gender: patient.gender,
					nationalId: patient.nationalId || '',
					phone: patient.phone || '',
					address: patient.address || '',
					commune: patient.commune || '',
					territoire: patient.territoire || '',
					province: patient.province || '',
					insuranceId: patient.insuranceId || '',
					ongCoverageRef: patient.ongCoverageRef || '',
					isHivPatient: patient.isHivPatient || false,
					arvCode: patient.arvCode || '',
					isTbPatient: patient.isTbPatient || false,
					tbCode: patient.tbCode || '',
					chronicConditions: patient.chronicConditions,
					isActive: patient.isActive,
					notes: patient.notes || '',
				}
			: {
					isActive: true,
					chronicConditions: [],
				},
	});

	// const isHivPatient = watch('isHivPatient');
	// const isTbPatient = watch('isTbPatient');

    const isHivPatient = watch("isHivPatient");
	const isTbPatient = watch('isTbPatient');

	const addChronicCondition = () => {
		if (chronicInput.trim() && !chronicConditions.includes(chronicInput.trim())) {
			const newConditions = [...chronicConditions, chronicInput.trim()];
			setChronicConditions(newConditions);
			setValue('chronicConditions', newConditions);
			setChronicInput('');
		}
	};

	const removeChronicCondition = (condition: string) => {
		const newConditions = chronicConditions.filter((c) => c !== condition);
		setChronicConditions(newConditions);
		setValue('chronicConditions', newConditions);
	};

	const onSubmit = async (data: PatientFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const payload: PatientCreateInput = {
				hospitalNumber: data.hospitalNumber,
				firstName: data.firstName,
				lastName: data.lastName,
				...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth).toISOString() }),
				...(data.gender && { gender: data.gender as Gender }),
				...(data.nationalId && { nationalId: data.nationalId }),
				...(data.phone && { phone: data.phone }),
				...(data.address && { address: data.address }),
				...(data.commune && { commune: data.commune }),
				...(data.territoire && { territoire: data.territoire }),
				...(data.province && { province: data.province }),
				...(data.insuranceId && { insuranceId: data.insuranceId }),
				...(data.ongCoverageRef && { ongCoverageRef: data.ongCoverageRef }),
				isHivPatient: data.isHivPatient,
				...(data.isHivPatient && data.arvCode && { arvCode: data.arvCode }),
				isTbPatient: data.isTbPatient,
				...(data.isTbPatient && data.tbCode && { tbCode: data.tbCode }),
				chronicConditions,
				isActive: data.isActive,
				...(data.notes && { notes: data.notes }),
			};

			if (mode === 'create') {
				await api.post('/api/patients/', payload);
			} else {
				await api.put(`/api/patients/${patient!.id}`, payload);
			}

			router.push('/patients');
			router.refresh();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
            let message = `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'}`;
            if(err.message){
                message = err.message
            };
			setError(message);
			setIsLoading(false);
		}
	};

	const genders: Gender[] = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" className="border-slate-200">
					<Link href="/patients">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">{mode === 'create' ? 'Nouveau patient' : 'Modifier le patient'}</h1>
			</div>

			{/* Erreur */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Identité */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Identité</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="hospitalNumber" className="text-slate-700">
								N° Dossier <span className="text-red-500">*</span>
							</Label>
							<Input
								id="hospitalNumber"
								{...register('hospitalNumber')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="P-2024-001"
							/>
							{errors.hospitalNumber && <p className="text-sm text-red-600">{errors.hospitalNumber.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="nationalId" className="text-slate-700">
								N° Carte d&apos;identité
							</Label>
							<Input id="nationalId" {...register('nationalId')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName" className="text-slate-700">
								Nom <span className="text-red-500">*</span>
							</Label>
							<Input id="lastName" {...register('lastName')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
							{errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="firstName" className="text-slate-700">
								Prénom <span className="text-red-500">*</span>
							</Label>
							<Input id="firstName" {...register('firstName')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
							{errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateOfBirth" className="text-slate-700">
								Date de naissance
							</Label>
							<Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="gender" className="text-slate-700">
								Genre
							</Label>
							<select
								id="gender"
								{...register('gender')}
								className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
							>
								<option value="">Non précisé</option>
								{genders.map((g) => (
									<option key={g} value={g}>
										{GENDER_LABELS[g]}
									</option>
								))}
							</select>
						</div>
					</CardContent>
				</Card>

				{/* Contact */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Contact</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone" className="text-slate-700">
								Téléphone
							</Label>
							<Input id="phone" {...register('phone')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="+243..." />
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address" className="text-slate-700">
								Adresse
							</Label>
							<Textarea id="address" {...register('address')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)] min-h-[60px]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="commune" className="text-slate-700">
								Commune
							</Label>
							<Input id="commune" {...register('commune')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="territoire" className="text-slate-700">
								Territoire
							</Label>
							<Input id="territoire" {...register('territoire')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="province" className="text-slate-700">
								Province
							</Label>
							<Input id="province" {...register('province')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>
					</CardContent>
				</Card>

				{/* Couverture */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Couverture</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="insuranceId" className="text-slate-700">
								Assurance
							</Label>
							<Input id="insuranceId" {...register('insuranceId')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="ID assurance" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="ongCoverageRef" className="text-slate-700">
								Référence ONG
							</Label>
							<Input id="ongCoverageRef" {...register('ongCoverageRef')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>
					</CardContent>
				</Card>

				{/* Données sensibles — visible uniquement PHARMACIST/DOCTOR/SUPERADMIN */}
				{canViewSensitiveData && (
					<Card className="border-slate-200 border-l-4 border-l-red-400">
						<CardHeader>
							<CardTitle className="text-lg text-slate-900 flex items-center gap-2">
								Données sensibles
								<span className="text-xs font-normal text-red-500">(Accès restreint)</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<Checkbox id="isHivPatient" {...register('isHivPatient')} />
									<Label htmlFor="isHivPatient" className="text-slate-700 cursor-pointer">
										Patient VIH
									</Label>
								</div>
								{isHivPatient && (
									<div className="space-y-2">
										<Label htmlFor="arvCode" className="text-slate-700">
											Code ARV
										</Label>
										<Input id="arvCode" {...register('arvCode')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
									</div>
								)}

								<div className="flex items-center gap-2">
									<Checkbox id="isTbPatient" {...register('isTbPatient')} />
									<Label htmlFor="isTbPatient" className="text-slate-700 cursor-pointer">
										Patient TB
									</Label>
								</div>
								{isTbPatient && (
									<div className="space-y-2">
										<Label htmlFor="tbCode" className="text-slate-700">
											Code TB
										</Label>
										<Input id="tbCode" {...register('tbCode')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Pathologies chroniques */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Pathologies chroniques</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Input
								value={chronicInput}
								onChange={(e) => setChronicInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChronicCondition())}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="Ajouter une pathologie..."
							/>
							<Button type="button" onClick={addChronicCondition} variant="outline" className="border-slate-200">
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{chronicConditions.map((condition) => (
								<span key={condition} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
									{condition}
									<button type="button" onClick={() => removeChronicCondition(condition)} className="text-slate-400 hover:text-red-500">
										<X className="h-3 w-3" />
									</button>
								</span>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Options */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Options</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<Checkbox id="isActive" {...register('isActive')} />
							<Label htmlFor="isActive" className="text-slate-700 cursor-pointer">
								Patient actif
							</Label>
						</div>
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
							className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)] min-h-[100px]"
							placeholder="Observations médicales..."
						/>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-4">
					<Button type="button" variant="outline" className="border-slate-200">
						<Link href="/patients">Annuler</Link>
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
								{mode === 'create' ? 'Créer' : 'Enregistrer'}
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
