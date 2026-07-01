'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Drug, Supplier, StorageLocation, BatchCreateInput } from '@/src/types';
import { api } from '@/src/lib/api';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const batchSchema = z.object({
	batchNumber: z.string().min(1, 'Le numéro de lot est requis').max(100),
	drugId: z.string().min(1, 'Le médicament est requis'),
	supplierId: z.string().optional(),
	initialQuantity: z.coerce.number().min(1, "La quantité doit être d'au moins 1"),
	expiryDate: z.string().min(1, 'La date de péremption est requise'),
	manufacturingDate: z.string().optional(),
	purchasePriceCDF: z.coerce.number().min(0).optional(),
	purchasePriceUSD: z.coerce.number().min(0).optional(),
	locationId: z.string().optional(),
	coldChainVerified: z.boolean().default(false),
	notes: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

export function BatchForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [drugs, setDrugs] = useState<Drug[]>([]);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [locations, setLocations] = useState<StorageLocation[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(batchSchema),
		defaultValues: {
			initialQuantity: 1,
			coldChainVerified: false,
		},
	});

	const selectedDrugId = watch('drugId');
	const selectedDrug = drugs.find((d) => d.id === selectedDrugId);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoadingData(true);
				const [drugsRes, suppliersRes] = await Promise.all([api.get('/api/drugs/'), api.get('/api/suppliers/').catch(() => ({ success: true, data: { items: [] } }))]);

				if (drugsRes.success) {
					setDrugs(drugsRes.data?.drugs || []);
				}
				if (suppliersRes.success) {
					setSuppliers(suppliersRes.data?.items || suppliersRes.data?.suppliers || []);
				}
			} catch (err) {
				console.error('Erreur chargement données:', err);
			} finally {
				setIsLoadingData(false);
			}
		};

		loadData();
	}, []);

	const onSubmit = async (data: BatchFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const payload: BatchCreateInput = {
				batchNumber: data.batchNumber,
				drugId: data.drugId,
				initialQuantity: data.initialQuantity,
				expiryDate: new Date(data.expiryDate).toISOString(),
				...(data.supplierId && { supplierId: data.supplierId }),
				...(data.manufacturingDate && { manufacturingDate: new Date(data.manufacturingDate).toISOString() }),
				...(data.purchasePriceCDF && { purchasePriceCDF: data.purchasePriceCDF }),
				...(data.purchasePriceUSD && { purchasePriceUSD: data.purchasePriceUSD }),
				...(data.locationId && { locationId: data.locationId }),
				coldChainVerified: data.coldChainVerified,
				...(data.notes && { notes: data.notes }),
			};

			await api.post('/api/batches/', payload);
			router.push('/stock');
			router.refresh();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			const message = err.message || 'Erreur lors de la réception du lot';
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

	const today = new Date().toISOString().split('T')[0];

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" className="border-slate-200">
					<Link href="/stock">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">Réception de lot</h1>
			</div>

			{/* Erreur globale */}
			{error && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<Card className="border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg text-slate-900">Informations du lot</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="drugId" className="text-slate-700">
								Médicament <span className="text-red-500">*</span>
							</Label>
							<select
								id="drugId"
								{...register('drugId')}
								className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
							>
								<option value="">Sélectionner un médicament...</option>
								{drugs.map((drug) => (
									<option key={drug.id} value={drug.id}>
										{drug.code} — {drug.name} ({drug.dci})
									</option>
								))}
							</select>
							{errors.drugId && <p className="text-sm text-red-600">{errors.drugId.message}</p>}
						</div>

						{selectedDrug && selectedDrug.requiresColdChain && (
							<div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
								<AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
								<span className="text-sm text-amber-700">Ce médicament nécessite la chaîne du froid (2-8°C)</span>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="batchNumber" className="text-slate-700">
								Numéro de lot <span className="text-red-500">*</span>
							</Label>
							<Input id="batchNumber" {...register('batchNumber')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" placeholder="LOT-2024-001" />
							{errors.batchNumber && <p className="text-sm text-red-600">{errors.batchNumber.message}</p>}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="initialQuantity" className="text-slate-700">
									Quantité reçue <span className="text-red-500">*</span>
								</Label>
								<Input
									id="initialQuantity"
									type="number"
									min={1}
									{...register('initialQuantity')}
									className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
								/>
								{errors.initialQuantity && <p className="text-sm text-red-600">{errors.initialQuantity.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="supplierId" className="text-slate-700">
									Fournisseur
								</Label>
								<select
									id="supplierId"
									{...register('supplierId')}
									className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-[rgb(25,119,119)] focus:ring-1 focus:ring-[rgb(25,119,119)]"
								>
									<option value="">Sélectionner...</option>
									{suppliers.map((supplier) => (
										<option key={supplier.id} value={supplier.id}>
											{supplier.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="expiryDate" className="text-slate-700">
									Date de péremption <span className="text-red-500">*</span>
								</Label>
								<Input id="expiryDate" type="date" min={today} {...register('expiryDate')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
								{errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="manufacturingDate" className="text-slate-700">
									Date de fabrication
								</Label>
								<Input id="manufacturingDate" type="date" {...register('manufacturingDate')} className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]" />
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="purchasePriceCDF" className="text-slate-700">
									Prix d&apos;achat (CDF)
								</Label>
								<Input
									id="purchasePriceCDF"
									type="number"
									step="0.01"
									min={0}
									{...register('purchasePriceCDF')}
									className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
									placeholder="0.00"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="purchasePriceUSD" className="text-slate-700">
									Prix d&apos;achat (USD)
								</Label>
								<Input
									id="purchasePriceUSD"
									type="number"
									step="0.0001"
									min={0}
									{...register('purchasePriceUSD')}
									className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
									placeholder="0.0000"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox id="coldChainVerified" {...register('coldChainVerified')} />
							<Label htmlFor="coldChainVerified" className="text-slate-700 cursor-pointer">
								Chaîne du froid vérifiée à la réception
							</Label>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes" className="text-slate-700">
								Notes
							</Label>
							<Textarea
								id="notes"
								{...register('notes')}
								className="border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)] min-h-[80px]"
								placeholder="Observations sur la réception..."
							/>
						</div>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-4">
					<Button type="button" variant="outline" className="border-slate-200">
						<Link href="/stock">Annuler</Link>
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
								Réceptionner le lot
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
