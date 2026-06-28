import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pharmacie Hospitalière',
	description: 'Système de gestion de pharmacie hospitalière',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<body className={`${inter.className} overflow-hidden` }>{children}</body>
		</html>
	);
}
