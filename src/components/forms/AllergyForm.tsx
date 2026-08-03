import { Dispatch, SetStateAction } from 'react';
import { AllergyCreateInput, AllergySeverityValues, allergyCreateSchema } from '@/src/schemas/patient.schemas';
import { Button } from '../ui/button';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { usePatientStore } from '@/src/stores/patient.store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Pulser from '../ui/pulser';
import { zodResolver } from '@hookform/resolvers/zod';

interface AllergyFormProps {
	patientId: string;
	setIsHidden: Dispatch<SetStateAction<boolean>>;
}

const AllergyForm = ({ patientId, setIsHidden }: AllergyFormProps) => {
	const { isLoading, lastError, addAllergy, setPatientsLastError } = usePatientStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(allergyCreateSchema),
		defaultValues: {
			severity: 'MILD',
		},
	});

	const onSubmit = async (data: AllergyCreateInput) => {
		try {
			await addAllergy(patientId, data);
			setIsHidden(true);
		} catch (error: unknown) {
			let message = "Erreur lors de l'ajout de l'allergie";
			if (error instanceof Error) message = error.message;
			setPatientsLastError(message);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="bg-white p-8 rounded-[2px] shadow-xl border w-11/12 md:w-1/2 lg:w-1/3">
				{lastError && (
					<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
						<AlertCircle className="h-5 w-5 flex-shrink-0" />
						<span>{lastError}</span>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
								<ShieldAlert size={20} />
								Nouvelle allergie
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="substance" className="text-slate-700">
									Substance <span className="text-red-500">*</span>
								</Label>
								<Input
									id="substance"
									{...register('substance')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									placeholder="Nom de la substance allergisante"
								/>
								{errors.substance && <p className="text-sm text-red-600">{errors.substance.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="severity" className="text-slate-700">
									Sévérité <span className="text-red-500">*</span>
								</Label>
								<select
									id="severity"
									{...register('severity')}
									className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
								>
									{AllergySeverityValues.map((s) => (
										<option key={s} value={s}>
											{s === 'MILD' ? 'Légère' : s === 'MODERATE' ? 'Modérée' : s === 'SEVERE' ? 'Sévère' : 'Anaphylaxie'}
										</option>
									))}
								</select>
								{errors.severity && <p className="text-sm text-red-600">{errors.severity.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="reaction" className="text-slate-700">
									Réaction observée
								</Label>
								<Input
									id="reaction"
									{...register('reaction')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									placeholder="Description de la réaction"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmedBy" className="text-slate-700">
									Confirmé par
								</Label>
								<Input
									id="confirmedBy"
									{...register('confirmedBy')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									placeholder="Nom du praticien"
								/>
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
									<ShieldAlert size={18} />
									<span>Ajouter</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AllergyForm;
