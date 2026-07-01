import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const bg = 'rgb(240,247,229)';

export const metadata: Metadata = {
	title: 'Pharmacie Hospitalière',
	description: 'Système de gestion de pharmacie hospitalière',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<body className={`${inter.className} bg-[rgb(240,247,229)]`}>{children}</body>
		</html>
	);
}
