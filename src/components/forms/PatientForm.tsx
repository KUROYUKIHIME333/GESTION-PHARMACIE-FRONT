import { Dispatch, SetStateAction, useEffect } from 'react';
import { Patient, PatientCreateInput, PatientUpdateInput, GenderValues, patientCreateSchema, patientUpdateSchema } from '@/src/schemas/patient.schemas';
import { Button } from '../ui/button';
import { AlertCircle, UserPlus, User } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { usePatientStore } from '@/src/stores/patient.store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import Pulser from '../ui/pulser';
import { zodResolver } from '@hookform/resolvers/zod';

interface PatientFormProps {
	patient?: Patient | null;
	mode: 'create' | 'edit';
	setIsHidden: Dispatch<SetStateAction<boolean>>;
}

const PatientForm = ({ patient, mode, setIsHidden }: PatientFormProps) => {
	const { isLoading, lastError, createPatient, updatePatient, setPatientsLastError } = usePatientStore();

	const resolver = mode === 'create' ? patientCreateSchema : patientUpdateSchema;

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resolver),
		defaultValues: {
			gender: 'UNKNOWN',
			isActive: true,
			chronicConditions: [],
			isHivPatient: false,
			isTbPatient: false,
		},
	});

	useEffect(() => {
		if (mode === 'create') {
			reset({
				gender: 'UNKNOWN',
				isActive: true,
				chronicConditions: [],
				isHivPatient: false,
				isTbPatient: false,
			});
		}
		if (patient && mode === 'edit') {
			// const { id, createdAt, updatedAt, _count, allergies, ...patientData } = patient;
			reset(patient);
		}
	}, [mode, patient, reset]);

	const onSubmit = async (data: PatientCreateInput | PatientUpdateInput) => {
		try {
			if (mode === 'create') {
				const result = await createPatient(data as PatientCreateInput);
				if (result) setIsHidden(true);
			}
			if (mode === 'edit' && patient?.id) {
				await updatePatient(data as PatientUpdateInput, patient.id);
				setIsHidden(true);
			}
		} catch (error: unknown) {
			let message = `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'}`;
			if (error instanceof Error) message = error.message;
			setPatientsLastError(message);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="bg-white p-8 rounded-[2px] shadow-xl border w-11/12 md:w-2/3 lg:w-2/3 max-h-[90vh] overflow-y-auto">
				{lastError && (
					<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
						<AlertCircle className="h-5 w-5 flex-shrink-0" />
						<span>{lastError}</span>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{/* Identité */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
								<User size={20} />
								Identité
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="hospitalNumber" className="text-slate-700">
									N° Dossier <span className="text-red-500">*</span>
								</Label>
								<Input
									id="hospitalNumber"
									{...register('hospitalNumber')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
								{errors.hospitalNumber && <p className="text-sm text-red-600">{errors.hospitalNumber.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-slate-700">
									Nom <span className="text-red-500">*</span>
								</Label>
								<Input
									id="lastName"
									{...register('lastName')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
								{errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="firstName" className="text-slate-700">
									Prénom <span className="text-red-500">*</span>
								</Label>
								<Input
									id="firstName"
									{...register('firstName')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
								{errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="gender" className="text-slate-700">
									Sexe
								</Label>
								<select
									id="gender"
									{...register('gender')}
									className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
								>
									{GenderValues.map((g) => (
										<option key={g} value={g}>
											{g === 'MALE' ? 'Masculin' : g === 'FEMALE' ? 'Féminin' : g === 'OTHER' ? 'Autre' : 'Inconnu'}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dateOfBirth" className="text-slate-700">
									Date de naissance
								</Label>
								<Input
									id="dateOfBirth"
									type="date"
									{...register('dateOfBirth')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="nationalId" className="text-slate-700">
									N° Carte d&apos;identité
								</Label>
								<Input
									id="nationalId"
									{...register('nationalId')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Contact */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Contact</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="phone" className="text-slate-700">
									Téléphone
								</Label>
								<Input
									id="phone"
									{...register('phone')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="address" className="text-slate-700">
									Adresse
								</Label>
								<Input
									id="address"
									{...register('address')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="commune" className="text-slate-700">
									Commune
								</Label>
								<Input
									id="commune"
									{...register('commune')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="province" className="text-slate-700">
									Province
								</Label>
								<Input
									id="province"
									{...register('province')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Programmes de santé */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Programmes de santé</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Controller
											name="isHivPatient"
											control={control}
											render={({ field }) => <Checkbox id="isHivPatient" checked={!!field.value} onCheckedChange={field.onChange} />}
										/>
										<Label htmlFor="isHivPatient" className="text-slate-700 cursor-pointer">
											Patient VIH
										</Label>
									</div>
									<Input
										id="arvCode"
										{...register('arvCode')}
										placeholder="Code ARV"
										className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Controller
											name="isTbPatient"
											control={control}
											render={({ field }) => <Checkbox id="isTbPatient" checked={!!field.value} onCheckedChange={field.onChange} />}
										/>
										<Label htmlFor="isTbPatient" className="text-slate-700 cursor-pointer">
											Patient TB
										</Label>
									</div>
									<Input
										id="tbCode"
										{...register('tbCode')}
										placeholder="Code TB"
										className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Options */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Options</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<Controller name="isActive" control={control} render={({ field }) => <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />} />
								<Label htmlFor="isActive" className="text-slate-700 cursor-pointer">
									Patient actif
								</Label>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-2">
						<Button className="text-slate-500 font-bold" variant="ghost" onClick={() => setIsHidden(true)} type="button">
							Annuler
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className={`flex gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] ${isLoading ? 'bg-[rgb(25,119,119)]' : 'bg-[bg-[#56AC35]'} rounded-[2px]`}
						>
							{isLoading ? (
								<Pulser />
							) : (
								<>
									<UserPlus size={18} />
									<span>{mode === 'create' ? 'Créer' : 'Modifier'}</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PatientForm;
