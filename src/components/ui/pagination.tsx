'use client';

import { Button } from '@/src/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems: number;
	itemsPerPage: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, '...', totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
			}
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg">
			<div className="text-sm text-slate-500">
				{startItem}-{endItem} sur {totalItems}
			</div>

			<div className="flex items-center gap-1">
				<Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="h-8 w-8 p-0 border-slate-200">
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{getPageNumbers().map((page, i) =>
					page === '...' ? (
						<span key={`ellipsis-${i}`} className="px-2 text-slate-400">
							...
						</span>
					) : (
						<Button
							key={page}
							variant={currentPage === page ? 'default' : 'outline'}
							size="sm"
							onClick={() => onPageChange(page as number)}
							className={cn(
								'h-8 w-8 p-0 text-sm font-medium',
								currentPage === page ? 'bg-[rgb(25,119,119)] text-white hover:bg-[rgb(25,119,119)]/90' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
							)}
						>
							{page}
						</Button>
					),
				)}

				<Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 w-8 p-0 border-slate-200">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
