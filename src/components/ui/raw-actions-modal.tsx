'use client';

import { Button } from '@/src/components/ui/button';
import { Eye, Pencil, Trash2, X } from 'lucide-react';

interface RowActionsModalProps {
	isOpen: boolean;
	onClose: () => void;
	rowName?: string;
	onView?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	canView?: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
}

export default function RowActionsModal({ isOpen, onClose, rowName, onView, onEdit, onDelete, canView = true, canEdit = true, canDelete = true }: RowActionsModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4">
			<div className="bg-white w-11/12 md:w-2/3 lg:w-2/3 sm:rounded-[2px] rounded-t-[2px] shadow-2xl border-0 sm:border border-[#C1C7CB]/60 overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-200">
				{/* Header */}
				<div className="px-6 py-4 border-b border-[#C1C7CB]/60 flex items-center justify-between">
					<h3 className="text-slate-900 font-bold text-lg">{rowName || 'Actions'}</h3>
					<Button onClick={onClose} className="cursor-pointer p-2 rounded-[2px] text-slate-400 hover:text-slate-600 hover:bg-[#eff7e4] transition-colors" aria-label="Fermer">
						<X size={18} />
					</Button>
				</div>

				{/* Actions */}
				<div className="p-2">
					{canView && onView && (
						<Button
							onClick={() => {
								onView();
								onClose();
							}}
							className="cursor-pointer w-full flex items-center gap-4 p-4 rounded-[2px] text-slate-700 hover:bg-[#eff7e4] hover:text-[#4B866B] transition-colors"
						>
							<Eye size={20} />
							<span className="font-medium">Voir les détails</span>
						</Button>
					)}

					{canEdit && onEdit && (
						<Button
							onClick={() => {
								onEdit();
								onClose();
							}}
							className="cursor-pointer w-full flex items-center gap-4 p-4 rounded-[2px] text-slate-700 hover:bg-[#eff7e4] hover:text-[#4B866B] transition-colors"
						>
							<Pencil size={20} />
							<span className="font-medium">Modifier</span>
						</Button>
					)}

					{canDelete && onDelete && (
						<Button
							onClick={() => {
								onDelete();
								onClose();
							}}
							className="cursor-pointer w-full flex items-center gap-4 p-4 rounded-[2px] text-red-600 hover:bg-red-50 transition-colors"
						>
							<Trash2 size={20} />
							<span className="font-medium">Supprimer</span>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
