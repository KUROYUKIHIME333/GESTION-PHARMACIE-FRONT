import { Dispatch, SetStateAction, useEffect } from 'react';
import { Drug, DrugCategoryValues, DrugFormValues, StorageConditionValues, drugSchemas } from '@/src/schemas/drug.schemas';
import { Button } from '../ui/button';
import { AlertCircle, Pencil } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { DrugCreateInput, DrugUpdateInput } from '@/src/schemas/drug.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDrugStore } from '@/src/stores/drugs.store';
import { StorageCondition } from '@/src/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import Spinner from '../layouts/Spinner';

interface DrugFormProps {
	drug?: Drug | null;
	mode: 'create' | 'edit';
	setIsHidden: Dispatch<SetStateAction<boolean>>;
}
const DrugForm = ({ drug, mode, setIsHidden }: DrugFormProps) => {
	const { isLoading, lastError, createDrug, updateDrug, setDrugsLastError } = useDrugStore();
	const {
		register: registerCreate,
		handleSubmit: handleSubmitCreate,
		setValue: setValueCreate,
		control: controlCreate,
		reset: resetCreate,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(drugSchemas),
		defaultValues: drug
			? drugSchemas.parse(drug)
			: {
					packSize: 1,
					packUnit: 'boîte',
					isEssential: false,
					isControlled: false,
					isProgramDrug: false,
					requiresColdChain: false,
					isPriceRegulated: false,
					minStockLevel: 0,
					criticalStockLevel: 0,
					reorderPoint: 0,
					reorderQuantity: 0,
					isActive: true,
					storageConditions: [],
				},
	});

	useEffect(() => {
		if (mode === 'create') {
			console.log('Mode:', mode, 'Drug:', drug || 'aucun');
			resetCreate({
				packSize: 1,
				packUnit: 'boîte',
				isEssential: false,
				isControlled: false,
				isProgramDrug: false,
				requiresColdChain: false,
				isPriceRegulated: false,
				minStockLevel: 0,
				criticalStockLevel: 0,
				reorderPoint: 0,
				reorderQuantity: 0,
				isActive: true,
				storageConditions: [],
			});
		}
		if (drug && mode === 'edit') {
			console.log('Mode:', mode, 'Drug:', drug || 'aucun');
			resetCreate(drugSchemas.parse(drug));
		}
	}, [mode, drug, resetCreate]);

	const isControlled = useWatch({
		control: controlCreate,
		name: 'isControlled',
	});

	const isProgramDrug = useWatch({
		control: controlCreate,
		name: 'isProgramDrug',
	});
	const storageConditions = useWatch({
		control: controlCreate,
		name: 'storageConditions',
		defaultValue: [],
	});

	const toggleStorageCondition = (condition: string) => {
		const current = storageConditions || [];
		const newConditions = current.includes(condition as StorageCondition) ? current.filter((c: string) => c !== condition) : [...current, condition];
		setValueCreate('storageConditions', newConditions as StorageCondition[]);
	};

	const onSubmit = async (data: Drug) => {
		console.log('Le new: ', data);

		try {
			if (mode === 'create') {
				createDrug(data as DrugCreateInput);
			}
			if (mode === 'edit') {
				updateDrug(data as DrugUpdateInput, data.id);
			}

			setIsHidden(true);
		} catch (error: unknown) {
			let message = `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'}`;

			if (error instanceof Error) {
				message = error.message;
			}
			setDrugsLastError(message);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="bg-white p-8 rounded-[2px] shadow-xl border w-11/12 md:w-2/3 lg:w-2/3  max-h-11/12 overflow-y-auto no-scrollbar">
				{/* Erreur globale */}
				{lastError && (
					<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
						<AlertCircle className="h-5 w-5 flex-shrink-0" />
						<span>{lastError}</span>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmitCreate(onSubmit)}>
					{/* Informations de base */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Informations de base</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="code" className="text-slate-700">
									Code <span className="text-red-500">*</span>
								</Label>
								<Input
									id="code"
									{...registerCreate('code')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="name" className="text-slate-700">
									Nom commercial <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									{...registerCreate('name')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="genericName" className="text-slate-700">
									Nom générique
								</Label>
								<Input
									id="genericName"
									{...registerCreate('genericName')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dci" className="text-slate-700">
									DCI <span className="text-red-500">*</span>
								</Label>
								<Input
									id="dci"
									{...registerCreate('dci')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.dci && <p className="text-sm text-red-600">{errors.dci.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="form" className="text-slate-700">
									Forme galénique <span className="text-red-500">*</span>
								</Label>
								<select
									id="form"
									{...registerCreate('form')}
									className="w-full pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								>
									<option value="">Sélectionner...</option>
									{DrugFormValues.map((form, i) => (
										<option key={`${form}-${i}`} value={form}>
											{form}
										</option>
									))}
								</select>
								{errors.form && <p className="text-sm text-red-600">{errors.form.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="category" className="text-slate-700">
									Catégorie <span className="text-red-500">*</span>
								</Label>
								<select
									id="category"
									{...registerCreate('category')}
									className="w-full pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								>
									<option value="">Sélectionner...</option>
									{DrugCategoryValues.map((cat, i) => (
										<option key={`${cat}-${i}`} value={cat}>
											{cat}
										</option>
									))}
								</select>
								{errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="therapeuticClass" className="text-slate-700">
									Classe thérapeutique
								</Label>
								<Input
									id="therapeuticClass"
									{...registerCreate('therapeuticClass')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ammNumber" className="text-slate-700">
									N° AMM
								</Label>
								<Input
									id="ammNumber"
									{...registerCreate('ammNumber')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Dosage et conditionnement */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Dosage et conditionnement</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="dosage" className="text-slate-700">
									Dosage <span className="text-red-500">*</span>
								</Label>
								<Input
									id="dosage"
									{...registerCreate('dosage')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.dosage && <p className="text-sm text-red-600">{errors.dosage.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="concentration" className="text-slate-700">
									Concentration
								</Label>
								<Input
									id="concentration"
									{...registerCreate('concentration')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="unitOfDispense" className="text-slate-700">
									Unité de dispensation <span className="text-red-500">*</span>
								</Label>
								<Input
									id="unitOfDispense"
									{...registerCreate('unitOfDispense')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.unitOfDispense && <p className="text-sm text-red-600">{errors.unitOfDispense.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="packSize" className="text-slate-700">
									Taille du conditionnement
								</Label>
								<Input
									id="packSize"
									type="number"
									{...registerCreate('packSize')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="packUnit" className="text-slate-700">
									Unité de conditionnement
								</Label>
								<Input
									id="packUnit"
									{...registerCreate('packUnit')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Stockage */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Stockage</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4">
								<div className="flex items-center gap-2">
									<Controller
										name="requiresColdChain"
										control={controlCreate}
										render={({ field }) => <Checkbox id="requiresColdChain" checked={field.value} onCheckedChange={field.onChange} />}
									/>
									<Label htmlFor="requiresColdChain" className="text-slate-700 cursor-pointer">
										Nécessite la chaîne du froid
									</Label>
								</div>
								<div className="space-y-2">
									<Label className="text-slate-700">Conditions de stockage</Label>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{StorageConditionValues.map((condition) => (
											<label key={condition} className="flex items-center gap-2 p-2 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
												<Checkbox checked={storageConditions?.includes(condition)} onCheckedChange={() => toggleStorageCondition(condition)} />
												<span className="text-sm text-slate-700">{condition}</span>
											</label>
										))}
									</div>
								</div>

								<div className="space-y-4">
									<Label className="text-slate-700">Températures de stockage</Label>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="minTemp" className="text-slate-700">
												Temp. min (°C)
											</Label>
											<Input id="minTemp" type="number" step="0.1" {...registerCreate('minTemp')} className="border-none ring-0 rounded-[2px] bg-[#eff7e4]" />
										</div>

										<div className="space-y-2">
											<Label htmlFor="maxTemp" className="text-slate-700">
												Temp. max (°C)
											</Label>
											<Input id="maxTemp" type="number" step="0.1" {...registerCreate('maxTemp')} className="border-none ring-0 rounded-[2px] bg-[#eff7e4]" />
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Prix */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Prix</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="unitPriceCDF" className="text-slate-700">
									Prix unitaire (CDF)
								</Label>
								<Input
									id="unitPriceCDF"
									type="number"
									step="0.01"
									{...registerCreate('unitPriceCDF')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="unitPriceUSD" className="text-slate-700">
									Prix unitaire (USD)
								</Label>
								<Input
									id="unitPriceUSD"
									type="number"
									step="0.0001"
									{...registerCreate('unitPriceUSD')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="flex items-center gap-2 md:col-span-2">
								<Controller
									name="isPriceRegulated"
									control={controlCreate}
									render={({ field }) => <Checkbox id="isPriceRegulated" checked={field.value} onCheckedChange={field.onChange} />}
								/>
								<Label htmlFor="isPriceRegulated" className="text-slate-700 cursor-pointer">
									Prix réglementé
								</Label>
							</div>
						</CardContent>
					</Card>

					{/* Seuils de stock */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Seuils de stock</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="minStockLevel" className="text-slate-700">
									Seuil d&apos;alerte
								</Label>
								<Input
									id="minStockLevel"
									type="number"
									{...registerCreate('minStockLevel')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="criticalStockLevel" className="text-slate-700">
									Seuil critique
								</Label>
								<Input
									id="criticalStockLevel"
									type="number"
									{...registerCreate('criticalStockLevel')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="reorderPoint" className="text-slate-700">
									Point de commande
								</Label>
								<Input
									id="reorderPoint"
									type="number"
									{...registerCreate('reorderPoint')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="reorderQuantity" className="text-slate-700">
									Qté de commande
								</Label>
								<Input
									id="reorderQuantity"
									type="number"
									{...registerCreate('reorderQuantity')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Options et classification */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Classification et options</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<Controller
										name="isEssential"
										control={controlCreate}
										render={({ field }) => <Checkbox id="isEssential" checked={field.value !== null ? field.value : undefined} onCheckedChange={field.onChange} />}
									/>
									<Label htmlFor="isEssential" className="text-slate-700 cursor-pointer">
										Médicament essentiel
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<Controller
										name="isControlled"
										control={controlCreate}
										render={({ field }) => <Checkbox id="isControlled" checked={field.value !== null ? field.value : undefined} onCheckedChange={field.onChange} />}
									/>
									<Label htmlFor="isControlled" className="text-slate-700 cursor-pointer">
										Substance contrôlée
									</Label>
								</div>

								{isControlled && (
									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="controlledSchedule" className="text-slate-700">
											Tableau de classement
										</Label>
										<Input
											id="controlledSchedule"
											{...registerCreate('controlledSchedule')}
											className="border-slate-200 w-full sm:w-48"
											placeholder="I, II, III..."
											maxLength={10}
										/>
									</div>
								)}

								<div className="flex items-center gap-2">
									<Controller
										name="isProgramDrug"
										control={controlCreate}
										render={({ field }) => <Checkbox id="isProgramDrug" checked={field.value !== null ? field.value : undefined} onCheckedChange={field.onChange} />}
									/>
									<Label htmlFor="isProgramDrug" className="text-slate-700 cursor-pointer">
										Médicament de programme
									</Label>
								</div>

								{isProgramDrug && (
									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="programName" className="text-slate-700">
											Nom du programme
										</Label>
										<Input id="programName" {...registerCreate('programName')} className="border-none ring-0 rounded-[2px] bg-[#eff7e4]" placeholder="VIH/ARV, PNLP, PNT..." />
									</div>
								)}

								<div className="flex items-center gap-2">
									<Controller name="isActive" control={controlCreate} render={({ field }) => <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />} />
									<Label htmlFor="isActive" className="text-slate-700 cursor-pointer">
										Actif
									</Label>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Notes */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea
								{...registerCreate('notes')}
								className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary min-h-[100px]"
								placeholder="Notes complémentaires..."
							/>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-2">
						<Button
							className="text-slate-500 font-bold"
							variant="ghost"
							onClick={() => {
								setIsHidden(true);
							}}
						>
							Annuler
						</Button>

						<Button
							type="submit"
							disabled={isLoading}
							className={`flex gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] ${isLoading ? 'bg-[#4B866B]' : 'bg-[#56AC35]'} rounded-[2px]`}
						>
							{isLoading ? (
								<Spinner />
							) : (
								<>
									<Pencil size={18} />
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
export default DrugForm;
