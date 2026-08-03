import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Batch, BatchCreateInput, batchCreateSchema } from '@/src/schemas/stock.schemas';
import { Button } from '../ui/button';
import { AlertCircle, Package, Pencil } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useBatchStore } from '@/src/stores/batches.store';
import { useDrugStore } from '@/src/stores/drugs.store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import Pulser from '../ui/pulser';
import { zodResolver } from '@hookform/resolvers/zod';

interface BatchFormProps {
	batch?: Batch | null;
	mode: 'create' | 'edit';
	setIsHidden: Dispatch<SetStateAction<boolean>>;
}

const BatchForm = ({ batch, mode, setIsHidden }: BatchFormProps) => {
	const { isLoading, lastError, createBatch, updateBatch, setBatchesLastError } = useBatchStore();
	const { drugs, fetchDrugs } = useDrugStore();
	const [selectedDrugName, setSelectedDrugName] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(batchCreateSchema),
		defaultValues: {
			batchNumber: '',
			drugId: '',
			supplierId: '',
			initialQuantity: 1,
			expiryDate: '',
			manufacturingDate: '',
			purchasePriceCDF: undefined,
			purchasePriceUSD: undefined,
			locationId: '',
			coldChainVerified: false,
			notes: '',
		},
	});

	// const watchedDrugId = useWatch({
	// 	control,
	// 	name: 'drugId',
	// 	defaultValue: '',
	// });

	useEffect(() => {
		if (mode === 'create') {
			reset({
				batchNumber: '',
				drugId: '',
				supplierId: '',
				initialQuantity: 1,
				expiryDate: '',
				manufacturingDate: '',
				purchasePriceCDF: undefined,
				purchasePriceUSD: undefined,
				locationId: '',
				coldChainVerified: false,
				notes: '',
			});
		}
		if (batch && mode === 'edit') {
			reset({
				...batch,
				expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().slice(0, 16) : '',
				manufacturingDate: batch.manufacturingDate ? new Date(batch.manufacturingDate).toISOString().slice(0, 16) : '',
			});
		}
	}, [mode, batch, reset]);

	// Logique inspirée de DrugForm adaptée pour la gestion du médicament sélectionné
	const handleDrugSelection = (drugId: string) => {
		setValue('drugId', drugId);
		if (drugId && drugs) {
			const foundDrug = drugs.find((d) => d.id === drugId);
			setSelectedDrugName(foundDrug?.name || '');
		} else {
			setSelectedDrugName('');
		}
	};

	const onSubmit = async (data: BatchCreateInput) => {
		try {
			const payload = {
				...data,
				expiryDate: new Date(data.expiryDate).toISOString(),
				manufacturingDate: data.manufacturingDate ? new Date(data.manufacturingDate).toISOString() : null,
			};

			if (mode === 'create') {
				await createBatch(payload);
			}
			if (mode === 'edit' && batch?.id) {
				await updateBatch(payload, batch.id);
			}

			setIsHidden(true);
		} catch (error: unknown) {
			let message = `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'}`;
			if (error instanceof Error) {
				message = error.message;
			}
			setBatchesLastError(message);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="bg-white p-8 rounded-[2px] shadow-xl border w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto no-scrollbar">
				{lastError && (
					<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
						<AlertCircle className="h-5 w-5 flex-shrink-0" />
						<span>{lastError}</span>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
								<Package size={20} />
								Informations du lot
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="batchNumber" className="text-slate-700">
									Numéro de lot <span className="text-red-500">*</span>
								</Label>
								<Input
									id="batchNumber"
									{...register('batchNumber')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
									placeholder="Ex: LOT-2026-001"
								/>
								{errors.batchNumber && <p className="text-sm text-red-600">{errors.batchNumber.message}</p>}
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="drugId" className="text-slate-700">
									Médicament <span className="text-red-500">*</span>
								</Label>
								<select
									id="drugId"
									{...register('drugId', {
										onChange: (e) => handleDrugSelection(e.target.value),
									})}
									className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary bg-transparent"
								>
									<option value="">Sélectionner un médicament...</option>
									{drugs?.map((drug) => (
										<option key={drug.id} value={drug.id}>
											{drug.code} — {drug.name} ({drug.dci})
										</option>
									))}
								</select>
								{selectedDrugName && <p className="text-xs text-[#4B866B] font-medium">Médicament sélectionné : {selectedDrugName}</p>}
								{errors.drugId && <p className="text-sm text-red-600">{errors.drugId.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="initialQuantity" className="text-slate-700">
									Quantité initiale <span className="text-red-500">*</span>
								</Label>
								<Input
									id="initialQuantity"
									type="number"
									min={1}
									{...register('initialQuantity', { valueAsNumber: true })}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.initialQuantity && <p className="text-sm text-red-600">{errors.initialQuantity.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="expiryDate" className="text-slate-700">
									Date de péremption <span className="text-red-500">*</span>
								</Label>
								<Input
									id="expiryDate"
									type="datetime-local"
									{...register('expiryDate')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="manufacturingDate" className="text-slate-700">
									Date de fabrication
								</Label>
								<Input
									id="manufacturingDate"
									type="datetime-local"
									{...register('manufacturingDate')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="supplierId" className="text-slate-700">
									Fournisseur
								</Label>
								<Input
									id="supplierId"
									{...register('supplierId')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
									placeholder="ID du fournisseur"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Prix d'achat */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Prix d&apos;achat</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="purchasePriceCDF" className="text-slate-700">
									Prix d&apos;achat (CDF)
								</Label>
								<Input
									id="purchasePriceCDF"
									type="number"
									step="0.01"
									{...register('purchasePriceCDF', { valueAsNumber: true })}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.purchasePriceCDF && <p className="text-sm text-red-600">{errors.purchasePriceCDF.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="purchasePriceUSD" className="text-slate-700">
									Prix d&apos;achat (USD)
								</Label>
								<Input
									id="purchasePriceUSD"
									type="number"
									step="0.0001"
									{...register('purchasePriceUSD', { valueAsNumber: true })}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
								/>
								{errors.purchasePriceUSD && <p className="text-sm text-red-600">{errors.purchasePriceUSD.message}</p>}
							</div>
						</CardContent>
					</Card>

					{/* Stockage */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Stockage</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="locationId" className="text-slate-700">
									Emplacement
								</Label>
								<Input
									id="locationId"
									{...register('locationId')}
									className="pl-3 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary"
									placeholder="ID de l'emplacement"
								/>
							</div>

							<div className="flex items-center gap-2">
								<Controller
									name="coldChainVerified"
									control={control}
									render={({ field }) => <Checkbox id="coldChainVerified" checked={field.value} onCheckedChange={field.onChange} />}
								/>
								<Label htmlFor="coldChainVerified" className="text-slate-700 cursor-pointer">
									Chaîne du froid vérifiée
								</Label>
							</div>
						</CardContent>
					</Card>

					{/* Notes */}
					<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
						<CardHeader>
							<CardTitle className="dark-official-green pb-3 border-b border-[#C1C7CB] text-lg text-slate-900">Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								{...register('notes')}
								className="w-full pl-3 pr-3 py-2 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-primary min-h-[100px] resize-none bg-transparent"
								placeholder="Notes complémentaires..."
							/>
							{errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
						</CardContent>
					</Card>

					<div className="flex justify-end gap-2">
						<Button className="text-slate-500 font-bold" variant="ghost" onClick={() => setIsHidden(false)} type="button">
							Annuler
						</Button>

						<Button
							type="submit"
							disabled={isLoading}
							className={`flex gap-2 items-center font-bold text-white px-6 py-2 hover:bg-[#4B866B] ${isLoading ? 'bg-[#4B866B]' : 'bg-[#56AC35]'} rounded-[2px]`}
						>
							{isLoading ? (
								<Pulser />
							) : (
								<>
									<Pencil size={18} />
									<span>{mode === 'create' ? 'Réceptionner' : 'Modifier'}</span>
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BatchForm;
