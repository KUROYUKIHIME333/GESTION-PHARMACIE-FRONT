'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Rechercher...', className }: SearchInputProps) {
	return (
		<div className={cn('relative', className)}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="pl-10 pr-10 h-10 border-slate-200 focus:border-[rgb(25,119,119)] focus:ring-[rgb(25,119,119)]"
			/>
			{value && (
				<button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
