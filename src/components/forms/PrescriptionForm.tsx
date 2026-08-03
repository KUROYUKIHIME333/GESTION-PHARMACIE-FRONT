import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { PrescriptionCreateInput, PrescriptionLineCreateInput, prescriptionCreateSchema } from '@/src/schemas/prescription.schemas';
import { Button } from '../ui/button';
import { AlertCircle, FileText, Plus, Pill } from 'lucide-react';
import { useForm } from 'react-hook-form'; //useFieldArray
import { usePrescriptionStore } from '@/src/stores/prescription.store';
import { usePatientStore } from '@/src/stores/patient.store';
import { useDrugStore } from '@/src/stores/drugs.store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Pulser from '../ui/pulser';
import { zodResolver } from '@hookform/resolvers/zod';

interface PrescriptionFormProps {
	setIsHidden: Dispatch<SetStateAction<boolean>>;
}

const PrescriptionForm = ({ setIsHidden }: PrescriptionFormProps) => {
	const { isLoading, lastError, createPrescription, addPrescriptionLine, setPrescriptionsLastError } = usePrescriptionStore();
	const { patients, fetchPatients } = usePatientStore();
	const { drugs, fetchDrugs } = useDrugStore();
	const [createdPrescriptionId, setCreatedPrescriptionId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		// control,
		// reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(prescriptionCreateSchema),
		defaultValues: {
			patientId: '',
			isInpatient: false,
			diagnosisCode: '',
			diagnosisLabel: '',
			notes: '',
		},
	});

	// const { fields, append, remove } = useFieldArray({
	// 	control,
	// 	name: 'lines' as never,
	// });

	useEffect(() => {
		fetchPatients();
		fetchDrugs();
	}, [fetchPatients, fetchDrugs]);

	const onSubmit = async (data: PrescriptionCreateInput) => {
		try {
			const result = await createPrescription(data);
			if (result) {
				setCreatedPrescriptionId(result.id);
			}
		} catch (error: unknown) {
			let message = "Erreur lors de la création de l'ordonnance";
			if (error instanceof Error) message = error.message;
			setPrescriptionsLastError(message);
		}
	};

	const handleAddLine = async (lineData: PrescriptionLineCreateInput) => {
		if (!createdPrescriptionId) return;
		try {
			await addPrescriptionLine(createdPrescriptionId, lineData);
		} catch (error: unknown) {
			let message = "Erreur lors de l'ajout de la ligne";
			if (error instanceof Error) message = error.message;
			setPrescriptionsLastError(message);
		}
	};

	const handleFinish = () => {
		setIsHidden(true);
	};

	const toUseDrugs = useMemo(() => {
		const tableDrugs = [];
		if (drugs && drugs.length > 0) {
			for (const element of drugs) {
				tableDrugs.push({
					id: element.id,
					name: element.name,
					code: element.code,
					dosage: element.dosage || null,
				});
			}
		}
		return tableDrugs;
	}, [drugs]);

	// Si l'ordonnance est créée, on passe en mode ajout de lignes
	if (createdPrescriptionId) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
				<div className="bg-white p-8 rounded-[2px] shadow-xl border w-11/12 md:w-2/3 lg:w-2/3 max-h-[90vh] overflow-y-auto">
					{lastError && (
						<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
							<AlertCircle className="h-5 w-5 flex-shrink-0" />
							<span>{lastError}</span>
						</div>
					)}

					<div className="space-y-6">
						<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
							<CardHeader>
								<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
									<Pill size={20} />
									Ajouter un médicament
								</CardTitle>
							</CardHeader>
							<CardContent>
								<PrescriptionLineForm onAdd={handleAddLine} drugs={toUseDrugs} />
								{/* <PrescriptionLineForm onAdd={handleAddLine} drugs={drugs || []} /> */}
							</CardContent>
						</Card>

						<div className="flex justify-end gap-2">
							<Button className="text-slate-500 font-bold" variant="ghost" onClick={handleFinish} type="button">
								Terminer
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="text-[#4B866B] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
								<FileText size={20} />
								Nouvelle ordonnance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="patientId" className="text-slate-700">
									Patient <span className="text-red-500">*</span>
								</Label>
								<select
									id="patientId"
									{...register('patientId')}
									className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
								>
									<option value="">Sélectionner un patient...</option>
									{patients?.map((p) => (
										<option key={p.id} value={p.id}>
											{p.hospitalNumber} — {p.lastName} {p.firstName}
										</option>
									))}
								</select>
								{errors.patientId && <p className="text-sm text-red-600">{errors.patientId.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="diagnosisCode" className="text-slate-700">
									Code diagnostic (CIM-10)
								</Label>
								<Input
									id="diagnosisCode"
									{...register('diagnosisCode')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									placeholder="Ex: J18.9"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="diagnosisLabel" className="text-slate-700">
									Libellé diagnostic
								</Label>
								<Input
									id="diagnosisLabel"
									{...register('diagnosisLabel')}
									className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
									placeholder="Description du diagnostic"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notes" className="text-slate-700">
									Notes
								</Label>
								<textarea
									{...register('notes')}
									className="w-full pl-3 pr-3 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] min-h-[80px] resize-none bg-transparent"
									placeholder="Notes complémentaires..."
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
									<FileText size={18} />
									<span>Créer l&apos;ordonnance</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

// ── Sous-formulaire pour une ligne d'ordonnance ───────────────────────────

interface PrescriptionLineFormProps {
	onAdd: (line: PrescriptionLineCreateInput) => void;
	drugs: Array<{ id: string; name: string; code: string; dosage: string | null }>;
}

function PrescriptionLineForm({ onAdd, drugs }: PrescriptionLineFormProps) {
	const [selectedDrug, setSelectedDrug] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [dosage, setDosage] = useState('');
	const [frequency, setFrequency] = useState('');
	const [duration, setDuration] = useState('');
	const [route, setRoute] = useState('');
	const [instructions, setInstructions] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDrug || !dosage) return;
		onAdd({
			drugId: selectedDrug,
			quantityPrescribed: quantity,
			dosage,
			frequency: frequency || null,
			durationDays: duration ? parseInt(duration) : null,
			route: route || null,
			instructions: instructions || null,
		});
		// Reset
		setSelectedDrug('');
		setQuantity(1);
		setDosage('');
		setFrequency('');
		setDuration('');
		setRoute('');
		setInstructions('');
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2 md:col-span-2">
					<Label className="text-slate-700">
						Médicament <span className="text-red-500">*</span>
					</Label>
					<select
						value={selectedDrug}
						onChange={(e) => setSelectedDrug(e.target.value)}
						className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
					>
						<option value="">Sélectionner...</option>
						{drugs.map((d) => (
							<option key={d.id} value={d.id}>
								{d.code} — {d.name} {d.dosage ? `(${d.dosage})` : ''}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label className="text-slate-700">
						Quantité <span className="text-red-500">*</span>
					</Label>
					<Input
						type="number"
						min={1}
						value={quantity}
						onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-slate-700">
						Posologie <span className="text-red-500">*</span>
					</Label>
					<Input
						value={dosage}
						onChange={(e) => setDosage(e.target.value)}
						placeholder="Ex: 1 comprimé matin et soir"
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-slate-700">Fréquence</Label>
					<Input
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
						placeholder="Ex: 2 fois par jour"
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-slate-700">Durée (jours)</Label>
					<Input
						type="number"
						min={1}
						value={duration}
						onChange={(e) => setDuration(e.target.value)}
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-slate-700">Voie d&apos;administration</Label>
					<Input
						value={route}
						onChange={(e) => setRoute(e.target.value)}
						placeholder="orale, IV, IM..."
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label className="text-slate-700">Instructions</Label>
					<Input
						value={instructions}
						onChange={(e) => setInstructions(e.target.value)}
						placeholder="Instructions spéciales au patient"
						className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>
			</div>

			<Button type="submit" className="flex gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] bg-[bg-[#56AC35] rounded-[2px]">
				<Plus size={18} />
				<span>Ajouter le médicament</span>
			</Button>
		</form>
	);
}

export default PrescriptionForm;
