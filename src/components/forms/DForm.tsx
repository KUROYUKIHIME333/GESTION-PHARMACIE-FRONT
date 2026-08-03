'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray, useWatch, Control, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dispensationCreateSchema, DispensationCreateInput, PaymentMethodValues, PaymentMethodLabels } from '@/src/schemas/dispensation.schemas';
import { useDispensationStore } from '@/src/stores/dispensation.store';
import { usePatientStore } from '@/src/stores/patient.store';
import { usePrescriptionStore } from '@/src/stores/prescription.store';
import { useStockStore } from '@/src/stores/stock.store';
import { useDrugStore } from '@/src/stores/drugs.store';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, Plus, Trash2, Pill, User, CreditCard, FileText, AlertTriangle, CheckCircle2, XCircle, Ban, Calendar, Boxes } from 'lucide-react';
import Pulser from '@/src/components/ui/pulser';
import { PersonnalDateFormatter } from '@/src/lib/dates';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface LineStockInfo {
	batchNumber: string;
	expiryDate: string;
	daysUntilExpiry: number;
	currentQuantity: number;
	enoughStock: boolean;
	isQuarantined: boolean;
	isExpired: boolean;
}

interface DispensationLineItemProps {
	index: number;
	control: Control<DispensationCreateInput>;
	drugs: Array<{ id: string; code: string; name: string; dci: string }> | null;
	errors: FieldErrors<DispensationCreateInput>;
	stockInfo: LineStockInfo | null | undefined;
	getAllergyForDrug: (drugId: string) => { substance: string; severity: string; reaction?: string | null } | undefined;
	checkLineStock: (index: number, drugId: string, quantity: number) => void;
	onRemoveLine: (index: number) => void;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function ShieldAlertCustom({ severity }: { severity: string }) {
	if (severity === 'ANAPHYLAXIS') return <Ban size={10} />;
	if (severity === 'SEVERE') return <AlertTriangle size={10} />;
	return <AlertCircle size={10} />;
}

// ------------------------------------------------------------------
// Sous-composant : Ligne de dispensation
// ------------------------------------------------------------------

const DispensationLineItem = ({ index, control, drugs, errors, stockInfo, getAllergyForDrug, checkLineStock, onRemoveLine }: DispensationLineItemProps) => {
	const drugId = useWatch({ control, name: `lines.${index}.drugId` });
	const quantity = useWatch({ control, name: `lines.${index}.quantity` });

	const qty = useMemo(() => Number(quantity) || 1, [quantity]);
	const allergy = useMemo(() => (drugId ? getAllergyForDrug(drugId) : undefined), [drugId, getAllergyForDrug]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white rounded-[2px] border border-[#C1C7CB]/30">
			{/* Médicament */}
			<div className="md:col-span-4 space-y-2">
				<Label className="text-slate-700 text-xs">
					Médicament <span className="text-red-500">*</span>
				</Label>
				<Controller
					name={`lines.${index}.drugId`}
					control={control}
					render={({ field }) => (
						<select
							value={field.value || ''}
							onChange={(e) => {
								field.onChange(e.target.value);
								checkLineStock(index, e.target.value, qty);
							}}
							className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent text-sm"
						>
							<option value="">Sélectionner...</option>
							{drugs?.map((d) => (
								<option key={d.id} value={d.id}>
									{d.code} — {d.name}
								</option>
							))}
						</select>
					)}
				/>
				{errors.lines?.[index]?.drugId && <p className="text-sm text-red-600">{errors.lines[index]?.drugId?.message}</p>}
			</div>

			{/* Quantité */}
			<div className="md:col-span-2 space-y-2">
				<Label className="text-slate-700 text-xs">
					Qté <span className="text-red-500">*</span>
				</Label>
				<Controller
					name={`lines.${index}.quantity`}
					control={control}
					render={({ field }) => (
						<Input
							type="number"
							min={1}
							value={field.value ?? ''}
							onChange={(e) => {
								const val = parseInt(e.target.value, 10) || 1;
								field.onChange(val);
								checkLineStock(index, drugId || '', val);
							}}
							className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
						/>
					)}
				/>
				{errors.lines?.[index]?.quantity && <p className="text-sm text-red-600">{errors.lines[index]?.quantity?.message}</p>}
			</div>

			{/* Info FEFO */}
			<div className="md:col-span-5 space-y-1">
				<Label className="text-slate-700 text-xs">Lot sélectionné (FEFO)</Label>
				{stockInfo ? (
					<div
						className={`flex flex-col gap-1 text-xs p-2 rounded-[2px] ${
							stockInfo.enoughStock && !stockInfo.isExpired && !stockInfo.isQuarantined
								? 'bg-green-50 text-green-700 border border-green-200'
								: 'bg-red-50 text-red-700 border border-red-200'
						}`}
					>
						<div className="flex items-center gap-2">
							<Boxes size={12} />
							<span className="font-mono font-semibold">{stockInfo.batchNumber}</span>
							{stockInfo.enoughStock ? <CheckCircle2 size={12} className="text-green-600" /> : <XCircle size={12} className="text-red-600" />}
						</div>
						<div className="flex items-center gap-2">
							<Calendar size={12} />
							<span>{stockInfo.expiryDate ? PersonnalDateFormatter.toLongDate(stockInfo.expiryDate) : '—'}</span>
							<span className={stockInfo.daysUntilExpiry <= 30 ? 'text-red-600 font-bold' : 'text-green-600'}>({stockInfo.daysUntilExpiry}j)</span>
						</div>
						{!stockInfo.enoughStock && <span className="font-semibold">Stock insuffisant !</span>}
						{stockInfo.isExpired && (
							<span className="font-semibold flex items-center gap-1">
								<Ban size={10} /> Lot périmé
							</span>
						)}
					</div>
				) : (
					<div className="text-xs text-slate-400 italic">Sélectionnez un médicament...</div>
				)}

				{/* Alerte allergie ligne */}
				{allergy && (
					<div className={`flex items-center gap-1.5 text-xs mt-1 ${allergy.severity === 'ANAPHYLAXIS' ? 'text-red-600 font-bold' : 'text-amber-600'}`}>
						<AlertTriangle size={12} />
						Allergie {allergy.severity}: {allergy.substance}
					</div>
				)}
			</div>

			{/* Supprimer */}
			<div className="md:col-span-1 flex items-start justify-end">
				<Button type="button" variant="ghost" size="sm" onClick={() => onRemoveLine(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
					<Trash2 size={16} />
				</Button>
			</div>
		</div>
	);
};

// ------------------------------------------------------------------
// Composant principal
// ------------------------------------------------------------------

const DispensationForm = () => {
	const router = useRouter();
	const { isLoading, lastError, createDispensation, setDispensationsLastError } = useDispensationStore();
	const { patients, fetchPatients } = usePatientStore();
	const { prescriptions, fetchPrescriptions } = usePrescriptionStore();
	const { fetchStockDetail } = useStockStore();
	const { drugs, fetchDrugs } = useDrugStore();

	const [linesStockMap, setLinesStockMap] = useState<Record<number, LineStockInfo | null>>({});

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(dispensationCreateSchema),
		defaultValues: {
			patientId: '',
			prescriptionId: null,
			paymentMethod: 'CASH_CDF',
			totalAmountCDF: null,
			totalAmountUSD: null,
			amountPaidCDF: null,
			amountPaidUSD: null,
			insuranceCoverage: null,
			receiptNumber: null,
			notes: null,
			lines: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'lines',
	});

	// ── Patient & dérivations (single source of truth : le form) ──
	const patientId = useWatch({
		control,
		name: 'patientId',
	});

	const selectedPatient = useMemo(() => patients?.find((p) => p.id === patientId), [patients, patientId]);

	const patientAllergies = useMemo(() => selectedPatient?.allergies ?? [], [selectedPatient]);

	const globalAllergyAlert = useMemo(() => {
		const severe = patientAllergies.find((a) => a.severity === 'ANAPHYLAXIS');
		if (severe) {
			return `⚠️ ALLERGIE SÉVÈRE : ${severe.substance} (${severe.reaction || 'Anaphylaxie'}) — Vérification obligatoire avant dispensation.`;
		}
		return null;
	}, [patientAllergies]);

	const patientPrescriptions = useMemo(() => {
		if (!patientId || !prescriptions) return [];
		return prescriptions.filter((p) => p.patient?.id === patientId && p.status === 'PENDING');
	}, [patientId, prescriptions]);

	// ── Chargement initial ──
	useEffect(() => {
		fetchPatients();
		fetchPrescriptions();
		fetchDrugs();
	}, [fetchPatients, fetchPrescriptions, fetchDrugs]);

	// ── FEFO : lecture synchrone du store après fetch ──
	const checkLineStock = useCallback(
		async (index: number, drugId: string, quantity: number) => {
			if (!drugId || quantity < 1) {
				setLinesStockMap((prev) => {
					const next = { ...prev };
					delete next[index];
					return next;
				});
				return;
			}

			await fetchStockDetail(drugId);

			// Lecture synchrone du store fraîchement mis à jour (valide dans un handler Zustand)
			const freshStockDetail = useStockStore.getState().stockDetail;
			if (!freshStockDetail) return;

			const validBatches = freshStockDetail.batches
				.filter((b) => !b.isQuarantined && b.daysUntilExpiry > 0 && b.currentQuantity > 0)
				.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

			const chosen = validBatches[0];

			setLinesStockMap((prev) => ({
				...prev,
				[index]: chosen
					? {
							batchNumber: chosen.batchNumber,
							expiryDate: chosen.expiryDate,
							daysUntilExpiry: chosen.daysUntilExpiry,
							currentQuantity: chosen.currentQuantity,
							enoughStock: chosen.currentQuantity >= quantity,
							isQuarantined: chosen.isQuarantined,
							isExpired: chosen.daysUntilExpiry <= 0,
						}
					: {
							batchNumber: '—',
							expiryDate: '',
							daysUntilExpiry: 0,
							currentQuantity: 0,
							enoughStock: false,
							isQuarantined: false,
							isExpired: true,
						},
			}));
		},
		[fetchStockDetail],
	);

	// ── Allergies par médicament ──
	const getAllergyForDrug = useCallback(
		(drugId: string) => {
			const drug = drugs?.find((d) => d.id === drugId);
			if (!drug) return undefined;
			return patientAllergies.find(
				(a) =>
					a.substance.toLowerCase() === drug.name.toLowerCase() ||
					a.substance.toLowerCase() === drug.dci.toLowerCase() ||
					drug.name.toLowerCase().includes(a.substance.toLowerCase()) ||
					drug.dci.toLowerCase().includes(a.substance.toLowerCase()),
			);
		},
		[drugs, patientAllergies],
	);

	// ── Suppression d'une ligne avec réindexation du stockMap ──
	const handleRemoveLine = useCallback(
		(index: number) => {
			remove(index);
			setLinesStockMap((prev) => {
				const next: Record<number, LineStockInfo | null> = {};
				Object.entries(prev).forEach(([key, value]) => {
					const idx = Number(key);
					if (idx < index) {
						next[idx] = value;
					} else if (idx > index) {
						next[idx - 1] = value;
					}
				});
				return next;
			});
		},
		[remove],
	);

	// ── Soumission ──
	const onSubmit = async (data: DispensationCreateInput) => {
		try {
			// Vérification métier frontend : stock et allergies bloquantes
			for (let i = 0; i < data.lines.length; i++) {
				const line = data.lines[i];
				const stockInfo = linesStockMap[i];

				if (stockInfo && (!stockInfo.enoughStock || stockInfo.isExpired)) {
					setDispensationsLastError(`Ligne ${i + 1} : stock insuffisant ou lot périmé (${stockInfo.batchNumber}). Veuillez vérifier le stock FEFO.`);
					return;
				}

				const allergy = getAllergyForDrug(line.drugId);
				if (allergy?.severity === 'ANAPHYLAXIS') {
					setDispensationsLastError(`Dispensation bloquée : allergie ${allergy.severity} à ${allergy.substance}`);
					return;
				}
			}

			const result = await createDispensation(data);
			if (result) {
				router.push(`/dispensations/${result.id}`);
			}
		} catch (error: unknown) {
			let message = 'Erreur lors de la dispensation';
			if (error instanceof Error) message = error.message;
			setDispensationsLastError(message);
		}
	};

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Erreur globale */}
			{lastError && (
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span className="text-sm font-medium">{lastError}</span>
				</div>
			)}

			{/* Alerte allergies */}
			{globalAllergyAlert && (
				<div className="flex items-start gap-3 p-4 rounded-[2px] bg-red-50 border border-red-200 text-red-700">
					<AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
					<span className="text-sm font-semibold">{globalAllergyAlert}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
				{/* ── Section Patient ── */}
				<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
					<CardHeader>
						<CardTitle className="text-[rgb(25,119,119)] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
							<User size={20} />
							Patient & Contexte
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="patientId" className="text-slate-700">
								Patient <span className="text-red-500">*</span>
							</Label>
							<Controller
								name="patientId"
								control={control}
								render={({ field }) => (
									<select
										id="patientId"
										value={field.value || ''}
										onChange={(e) => field.onChange(e.target.value)}
										className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
									>
										<option value="">Sélectionner un patient...</option>
										{patients?.map((p) => (
											<option key={p.id} value={p.id}>
												{p.hospitalNumber} — {p.lastName} {p.firstName}
											</option>
										))}
									</select>
								)}
							/>
							{errors.patientId && <p className="text-sm text-red-600">{errors.patientId.message}</p>}
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="prescriptionId" className="text-slate-700">
								Ordonnance liée (optionnel)
							</Label>
							<Controller
								name="prescriptionId"
								control={control}
								render={({ field }) => (
									<select
										id="prescriptionId"
										value={field.value || ''}
										onChange={(e) => field.onChange(e.target.value || null)}
										disabled={!patientId || patientPrescriptions.length === 0}
										className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent disabled:opacity-50"
									>
										<option value="">Dispensation sans ordonnance</option>
										{patientPrescriptions.map((pres) => (
											<option key={pres.id} value={pres.id}>
												{pres.prescriptionNumber} — {pres.diagnosisLabel || 'Sans diagnostic'}
											</option>
										))}
									</select>
								)}
							/>
						</div>

						{/* Allergies du patient */}
						{patientAllergies.length > 0 && (
							<div className="md:col-span-2 flex flex-wrap gap-2">
								{patientAllergies.map((allergy, idx) => (
									<span
										key={idx}
										className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
											allergy.severity === 'ANAPHYLAXIS'
												? 'bg-red-100 text-red-700 border border-red-200'
												: allergy.severity === 'SEVERE'
													? 'bg-orange-100 text-orange-700 border border-orange-200'
													: 'bg-amber-100 text-amber-700 border border-amber-200'
										}`}
									>
										<ShieldAlertCustom severity={allergy.severity} />
										{allergy.substance}
									</span>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* ── Section Lignes de dispensation ── */}
				<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
					<CardHeader>
						<CardTitle className="text-[rgb(25,119,119)] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
							<Pill size={20} />
							Médicaments dispensés
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{fields.length === 0 && <p className="text-sm text-slate-500">Aucun médicament ajouté.</p>}

						{fields.map((field, index) => (
							<DispensationLineItem
								key={field.id}
								index={index}
								control={control as Control<DispensationCreateInput>}
								drugs={drugs}
								errors={errors as FieldErrors<DispensationCreateInput>}
								stockInfo={linesStockMap[index]}
								getAllergyForDrug={getAllergyForDrug}
								checkLineStock={checkLineStock}
								onRemoveLine={handleRemoveLine}
							/>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={() => append({ drugId: '', quantity: 1, prescriptionLineId: null })}
							className="w-full gap-2 items-center font-bold text-[rgb(25,119,119)] border-[rgb(25,119,119)]/30 hover:bg-[#eff7e4] rounded-[2px]"
						>
							<Plus size={16} />
							Ajouter un médicament
						</Button>
						{errors.lines && !Array.isArray(errors.lines) && <p className="text-sm text-red-600">{errors.lines.message}</p>}
					</CardContent>
				</Card>

				{/* ── Section Paiement ── */}
				<Card className="border-none ring-0 rounded-[2px] bg-[#eff7e4]">
					<CardHeader>
						<CardTitle className="text-[rgb(25,119,119)] pb-3 border-b border-[#C1C7CB] text-lg text-slate-900 flex items-center gap-2">
							<CreditCard size={20} />
							Paiement
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="paymentMethod" className="text-slate-700">
								Mode de paiement <span className="text-red-500">*</span>
							</Label>
							<Controller
								name="paymentMethod"
								control={control}
								render={({ field }) => (
									<select
										id="paymentMethod"
										value={field.value}
										onChange={field.onChange}
										className="w-full pl-3 pr-8 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] bg-transparent"
									>
										{PaymentMethodValues.map((pm) => (
											<option key={pm} value={pm}>
												{PaymentMethodLabels[pm]}
											</option>
										))}
									</select>
								)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="receiptNumber" className="text-slate-700">
								N° Reçu
							</Label>
							<Input
								id="receiptNumber"
								{...register('receiptNumber')}
								placeholder="Ex: REC-2026-001"
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						{/* Montants CDF / USD */}
						<div className="space-y-2">
							<Label htmlFor="totalAmountCDF" className="text-slate-700">
								Montant total (CDF)
							</Label>
							<Input
								id="totalAmountCDF"
								type="number"
								step="0.01"
								{...register('totalAmountCDF', { valueAsNumber: true })}
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="totalAmountUSD" className="text-slate-700">
								Montant total (USD)
							</Label>
							<Input
								id="totalAmountUSD"
								type="number"
								step="0.0001"
								{...register('totalAmountUSD', { valueAsNumber: true })}
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amountPaidCDF" className="text-slate-700">
								Montant payé (CDF)
							</Label>
							<Input
								id="amountPaidCDF"
								type="number"
								step="0.01"
								{...register('amountPaidCDF', { valueAsNumber: true })}
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amountPaidUSD" className="text-slate-700">
								Montant payé (USD)
							</Label>
							<Input
								id="amountPaidUSD"
								type="number"
								step="0.0001"
								{...register('amountPaidUSD', { valueAsNumber: true })}
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="insuranceCoverage" className="text-slate-700">
								Prise en charge assurance (CDF)
							</Label>
							<Input
								id="insuranceCoverage"
								type="number"
								step="0.01"
								{...register('insuranceCoverage', { valueAsNumber: true })}
								className="pl-3 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)]"
							/>
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="notes" className="text-slate-700">
								Notes
							</Label>
							<textarea
								id="notes"
								{...register('notes')}
								rows={2}
								className="w-full pl-3 pr-3 py-2 text-gray-800 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:bg-white focus-visible:border-[rgb(25,119,119)] min-h-[60px] resize-none bg-transparent"
								placeholder="Observations éventuelles..."
							/>
						</div>
					</CardContent>
				</Card>

				{/* ── Actions ── */}
				<div className="flex justify-end gap-3">
					<Button type="button" variant="ghost" onClick={() => router.push('/dispensations')} className="text-slate-500 font-bold">
						Annuler
					</Button>
					<Button
						type="submit"
						disabled={isLoading || fields.length === 0 || !patientId}
						className={`flex gap-2 items-center font-bold text-white px-6 py-2.5 hover:bg-[rgb(25,119,119)] rounded-[2px] ${isLoading ? 'bg-[rgb(25,119,119)]' : 'bg-[rgb(40,185,180)]'}`}
					>
						{isLoading ? (
							<Pulser />
						) : (
							<>
								<FileText size={18} />
								<span>Valider la dispensation</span>
							</>
						)}
					</Button>
				</div>
			</form>
		</main>
	);
};

export default DispensationForm;
