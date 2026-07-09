'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Spinner from './spinner';

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => void;
	isLoading?: boolean;
	confirmText?: string;
	cancelText?: string;
	variant?: 'destructive' | 'default';
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, isLoading = false, confirmText = 'Confirmer', cancelText = 'Annuler' }: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md bg-white w-full max-w-sm rounded-[2px] ring-0 shadow-2xl border border-[#C1C7CB]/60 overflow-hidden">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div>
							<DialogTitle className="text-lg font-semibold text-slate-900">
								<span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
									<AlertTriangle className="h-5 w-5 text-red-600" />
								</span>
								{title}
							</DialogTitle>
							<DialogDescription className="text-sm text-slate-500 mt-1">{description}</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className="cursor-pointer text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-200 rounded-[2px] px-4 border-none"
					>
						{cancelText}
					</Button>
					<Button onClick={onConfirm} disabled={isLoading} className="cursor-pointer font-semibold bg-red-500 text-white hover:bg-red-600 rounded-[2px] px-5 shadow-sm">
						{isLoading ? <Spinner /> : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
