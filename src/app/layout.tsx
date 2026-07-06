import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';

const inter = localFont({
	src: '../../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'OfficIn',
	description: 'Système de gestion de pharmacie hospitalière',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="fr">
			<body className={`${inter.className}`}>{children}</body>
		</html>
	);
};

export default RootLayout;
