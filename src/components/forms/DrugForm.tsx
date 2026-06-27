'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Drug, DrugForm as DrugFormType, DrugCategory, StorageCondition } from '@/src/types';
import { api } from '@/src/lib/api';
import { DRUG_FORM_LABELS, DRUG_CATEGORY_LABELS, STORAGE_CONDITION_LABELS } from '@/src/lib/constants';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const drugSchema = z.object({
	code: z.string().min(1, 'Le code est requis').max(50, 'Maximum 50 caractères'),
	name: z.string().min(1, 'Le nom est requis').max(255, 'Maximum 255 caractères'),
	genericName: z.string().max(255).optional(),
	dci: z.string().min(1, 'La DCI est requise').max(255),
	form: z.string().min(1, 'La forme galénique est requise'),
	category: z.string().min(1, 'La catégorie est requise'),
	therapeuticClass: z.string().max(255).optional(),
	dosage: z.string().min(1, 'Le dosage est requis').max(100),
	concentration: z.string().max(100).optional(),
	unitOfDispense: z.string().min(1, "L'unité de dispensation est requise").max(50),
	packSize: z.coerce.number().min(1).default(1),
	packUnit: z.string().max(50).default('boîte'),
	ammNumber: z.string().max(100).optional(),
	isEssential: z.boolean().default(false),
	isControlled: z.boolean().default(false),
	controlledSchedule: z.string().max(10).optional(),
	isProgramDrug: z.boolean().default(false),
	programName: z.string().max(100).optional(),
	storageConditions: z.array(z.string()).default([]),
	requiresColdChain: z.boolean().default(false),
	minTemp: z.coerce.number().nullable().optional(),
	maxTemp: z.coerce.number().nullable().optional(),
	unitPriceCDF: z.coerce.number().min(0).nullable().optional(),
	unitPriceUSD: z.coerce.number().min(0).nullable().optional(),
	isPriceRegulated: z.boolean().default(false),
	minStockLevel: z.coerce.number().min(0).default(0),
	criticalStockLevel: z.coerce.number().min(0).default(0),
	reorderPoint: z.coerce.number().min(0).default(0),
	reorderQuantity: z.coerce.number().min(0).default(0),
	isActive: z.boolean().default(true),
	notes: z.string().optional(),
});

type DrugFormData = z.infer<typeof drugSchema>;

interface DrugFormProps {
	drug?: Drug;
	mode: 'create' | 'edit';
}

export function DrugForm({ drug, mode }: DrugFormProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(drugSchema),
		defaultValues: drug
			? {
					code: drug.code,
					name: drug.name,
					genericName: drug.genericName || '',
					dci: drug.dci,
					form: drug.form,
					category: drug.category,
					therapeuticClass: drug.therapeuticClass || '',
					dosage: drug.dosage,
					concentration: drug.concentration || '',
					unitOfDispense: drug.unitOfDispense,
					packSize: drug.packSize,
					packUnit: drug.packUnit,
					ammNumber: drug.ammNumber || '',
					isEssential: drug.isEssential,
					isControlled: drug.isControlled,
					controlledSchedule: drug.controlledSchedule || '',
					isProgramDrug: drug.isProgramDrug,
					programName: drug.programName || '',
					storageConditions: drug.storageConditions,
					requiresColdChain: drug.requiresColdChain,
					minTemp: drug.minTemp,
					maxTemp: drug.maxTemp,
					unitPriceCDF: drug.unitPriceCDF,
					unitPriceUSD: drug.unitPriceUSD,
					isPriceRegulated: drug.isPriceRegulated,
					minStockLevel: drug.minStockLevel,
					criticalStockLevel: drug.criticalStockLevel,
					reorderPoint: drug.reorderPoint,
					reorderQuantity: drug.reorderQuantity,
					isActive: drug.isActive,
					notes: drug.notes || '',
				}
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

	const isControlled = watch('isControlled');
	const isProgramDrug = watch('isProgramDrug');
	const storageConditions = watch('storageConditions') || [];

	const toggleStorageCondition = (condition: string) => {
		const current = storageConditions;
		const newConditions = current.includes(condition) ? current.filter((c) => c !== condition) : [...current, condition];
		setValue('storageConditions', newConditions, { shouldValidate: true });
	};

	const onSubmit = async (data: DrugFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const payload = {
				...data,
				genericName: data.genericName || undefined,
				therapeuticClass: data.therapeuticClass || undefined,
				concentration: data.concentration || undefined,
				ammNumber: data.ammNumber || undefined,
				controlledSchedule: data.controlledSchedule || undefined,
				programName: data.programName || undefined,
				notes: data.notes || undefined,
				minTemp: data.minTemp ?? undefined,
				maxTemp: data.maxTemp ?? undefined,
				unitPriceCDF: data.unitPriceCDF ?? undefined,
				unitPriceUSD: data.unitPriceUSD ?? undefined,
			};

			if (mode === 'create') {
				await api.post('/api/drugs/', payload);
			} else {
				await api.put(`/api/drugs/${drug!.id}`, payload);
			}

			router.push('/drugs');
			router.refresh();
		} catch (err: any) {
			const message = err.message || `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'}`;
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	const drugForms: DrugFormType[] = [
		'TABLET',
		'CAPSULE',
		'SYRUP',
		'INJECTABLE_IV',
		'INJECTABLE_IM',
		'INJECTABLE_SC',
		'CREAM',
		'OINTMENT',
		'DROPS_EYE',
		'DROPS_EAR',
		'DROPS_NASAL',
		'SUPPOSITORY',
		'PATCH',
		'POWDER',
		'GRANULES',
		'SOLUTION',
		'SUSPENSION',
		'AEROSOL',
		'GEL',
		'PESSARY',
		'OTHER',
	];

	const drugCategories: DrugCategory[] = [
		'ANTIRETROVIRAL',
		'ANTIMALARIAL',
		'ANTITUBERCULOSIS',
		'VACCINE',
		'ANTIBIOTIC',
		'ANALGESIC',
		'ANTIPYRETIC',
		'ANTI_INFLAMMATORY',
		'ANTIFUNGAL',
		'ANTIPARASITIC',
		'CARDIOVASCULAR',
		'ANTIHYPERTENSIVE',
		'ANTIDIABETIC',
		'RESPIRATORY',
		'GASTROINTESTINAL',
		'NEUROLOGICAL',
		'PSYCHIATRIC',
		'HORMONAL',
		'CONTRACEPTIVE',
		'VITAMINS_SUPPLEMENTS',
		'ANESTHETIC',
		'ANTISEPTIC_DISINFECTANT',
		'MEDICAL_CONSUMABLE',
		'DIAGNOSTIC_REAGENT',
		'OTHER',
	];

	const storageConditionsList: StorageCondition[] = ['ROOM_TEMP', 'COOL', 'REFRIGERATED', 'FROZEN', 'PROTECT_LIGHT', 'PROTECT_HUMIDITY', 'CONTROLLED_SUBSTANCE'];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" className="border-slate-200">
					<Link href="/drugs">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">{mode === 'create' ? 'Nouveau médicament' : 'Modifier le médicament'}</h1>
			</div>

			{/* Erreur globale */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Informations de base */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Informations de base</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="code" className="text-slate-700">
								Code <span className="text-red-500">*</span>
							</Label>
							<Input id="code" {...register('code')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="MED-001" />
							{errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="name" className="text-slate-700">
								Nom commercial <span className="text-red-500">*</span>
							</Label>
							<Input id="name" {...register('name')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="Coartem" />
							{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="genericName" className="text-slate-700">
								Nom générique
							</Label>
							<Input
								id="genericName"
								{...register('genericName')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="Artéméther/Luméfantrine"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dci" className="text-slate-700">
								DCI <span className="text-red-500">*</span>
							</Label>
							<Input id="dci" {...register('dci')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="Artéméther + Luméfantrine" />
							{errors.dci && <p className="text-sm text-red-600">{errors.dci.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="form" className="text-slate-700">
								Forme galénique <span className="text-red-500">*</span>
							</Label>
							<select
								id="form"
								{...register('form')}
								className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
							>
								<option value="">Sélectionner...</option>
								{drugForms.map((form) => (
									<option key={form} value={form}>
										{DRUG_FORM_LABELS[form]}
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
								{...register('category')}
								className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
							>
								<option value="">Sélectionner...</option>
								{drugCategories.map((cat) => (
									<option key={cat} value={cat}>
										{DRUG_CATEGORY_LABELS[cat]}
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
								{...register('therapeuticClass')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="Bêta-bloquant"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ammNumber" className="text-slate-700">
								N° AMM
							</Label>
							<Input id="ammNumber" {...register('ammNumber')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="AMM-12345" />
						</div>
					</CardContent>
				</Card>

				{/* Dosage et conditionnement */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Dosage et conditionnement</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="dosage" className="text-slate-700">
								Dosage <span className="text-red-500">*</span>
							</Label>
							<Input id="dosage" {...register('dosage')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="500mg" />
							{errors.dosage && <p className="text-sm text-red-600">{errors.dosage.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="concentration" className="text-slate-700">
								Concentration
							</Label>
							<Input id="concentration" {...register('concentration')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="250mg/5ml" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="unitOfDispense" className="text-slate-700">
								Unité de dispensation <span className="text-red-500">*</span>
							</Label>
							<Input
								id="unitOfDispense"
								{...register('unitOfDispense')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="comprimé"
							/>
							{errors.unitOfDispense && <p className="text-sm text-red-600">{errors.unitOfDispense.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="packSize" className="text-slate-700">
								Taille du conditionnement
							</Label>
							<Input id="packSize" type="number" {...register('packSize')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="packUnit" className="text-slate-700">
								Unité de conditionnement
							</Label>
							<Input id="packUnit" {...register('packUnit')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="boîte" />
						</div>
					</CardContent>
				</Card>

				{/* Stockage */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Stockage</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-slate-700">Conditions de stockage</Label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{storageConditionsList.map((condition) => (
										<label key={condition} className="flex items-center gap-2 p-2 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
											<Checkbox checked={storageConditions.includes(condition)} onCheckedChange={() => toggleStorageCondition(condition)} />
											<span className="text-sm text-slate-700">{STORAGE_CONDITION_LABELS[condition]}</span>
										</label>
									))}
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Controller
										name="requiresColdChain"
										control={control}
										render={({ field }) => <Checkbox id="requiresColdChain" checked={field.value} onCheckedChange={field.onChange} />}
									/>
									<Label htmlFor="requiresColdChain" className="text-slate-700 cursor-pointer">
										Nécessite la chaîne du froid
									</Label>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="minTemp" className="text-slate-700">
											Temp. min (°C)
										</Label>
										<Input id="minTemp" type="number" step="0.1" {...register('minTemp')} className="border-slate-200" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="maxTemp" className="text-slate-700">
											Temp. max (°C)
										</Label>
										<Input id="maxTemp" type="number" step="0.1" {...register('maxTemp')} className="border-slate-200" />
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Prix */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Prix</CardTitle>
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
								{...register('unitPriceCDF')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="0.00"
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
								{...register('unitPriceUSD')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								placeholder="0.0000"
							/>
						</div>

						<div className="flex items-center gap-2 md:col-span-2">
							<Controller name="isPriceRegulated" control={control} render={({ field }) => <Checkbox id="isPriceRegulated" checked={field.value} onCheckedChange={field.onChange} />} />
							<Label htmlFor="isPriceRegulated" className="text-slate-700 cursor-pointer">
								Prix réglementé
							</Label>
						</div>
					</CardContent>
				</Card>

				{/* Seuils de stock */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Seuils de stock</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="minStockLevel" className="text-slate-700">
								Seuil d'alerte
							</Label>
							<Input id="minStockLevel" type="number" {...register('minStockLevel')} className="border-slate-200" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="criticalStockLevel" className="text-slate-700">
								Seuil critique
							</Label>
							<Input id="criticalStockLevel" type="number" {...register('criticalStockLevel')} className="border-slate-200" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="reorderPoint" className="text-slate-700">
								Point de commande
							</Label>
							<Input id="reorderPoint" type="number" {...register('reorderPoint')} className="border-slate-200" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="reorderQuantity" className="text-slate-700">
								Qté de commande
							</Label>
							<Input id="reorderQuantity" type="number" {...register('reorderQuantity')} className="border-slate-200" />
						</div>
					</CardContent>
				</Card>

				{/* Options et classification */}
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Classification et options</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Controller name="isEssential" control={control} render={({ field }) => <Checkbox id="isEssential" checked={field.value} onCheckedChange={field.onChange} />} />
								<Label htmlFor="isEssential" className="text-slate-700 cursor-pointer">
									Médicament essentiel
								</Label>
							</div>

							<div className="flex items-center gap-2">
								<Controller name="isControlled" control={control} render={({ field }) => <Checkbox id="isControlled" checked={field.value} onCheckedChange={field.onChange} />} />
								<Label htmlFor="isControlled" className="text-slate-700 cursor-pointer">
									Substance contrôlée
								</Label>
							</div>

							{isControlled && (
								<div className="space-y-2 sm:col-span-2">
									<Label htmlFor="controlledSchedule" className="text-slate-700">
										Tableau de classement
									</Label>
									<Input id="controlledSchedule" {...register('controlledSchedule')} className="border-slate-200 w-full sm:w-48" placeholder="I, II, III..." maxLength={10} />
								</div>
							)}

							<div className="flex items-center gap-2">
								<Controller name="isProgramDrug" control={control} render={({ field }) => <Checkbox id="isProgramDrug" checked={field.value} onCheckedChange={field.onChange} />} />
								<Label htmlFor="isProgramDrug" className="text-slate-700 cursor-pointer">
									Médicament de programme
								</Label>
							</div>

							{isProgramDrug && (
								<div className="space-y-2 sm:col-span-2">
									<Label htmlFor="programName" className="text-slate-700">
										Nom du programme
									</Label>
									<Input id="programName" {...register('programName')} className="border-slate-200" placeholder="VIH/ARV, PNLP, PNT..." />
								</div>
							)}

							<div className="flex items-center gap-2">
								<Controller name="isActive" control={control} render={({ field }) => <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />} />
								<Label htmlFor="isActive" className="text-slate-700 cursor-pointer">
									Actif
								</Label>
							</div>
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
							placeholder="Notes complémentaires..."
						/>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-4">
					<Button type="button" variant="outline" className="border-slate-200">
						<Link href="/drugs">Annuler</Link>
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
