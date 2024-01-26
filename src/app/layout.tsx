import type { Metadata } from "next";
import '../assets/css/global.scss'
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Context } from "@/providers/Context";
import ModalWrapper from "@/components/ModalWrapper/ModalWrapper";
import Homer from "@/components/Homer/Homer";



export const metadata: Metadata = {
	title: {
		default: 'DateMarks',
		template: '%s | DateMarks'
	},
	description: "Datemarks - app for create and attend events",
	keywords: ['DateMarks', 'meetings', 'events'],
	authors: [{ name: 'Stas Yem', url: 'https://StasYem.com' }, { name: 'Max', url: 'https://postnikov.dev' }],
	creator: 'Max Postnikov | https://postnikov.dev',

};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body className="flex flex-col min-h-dvh">
				<Context>
					<Homer />
					<ModalWrapper />
					<Header />
					<main>
						{children}
					</main>
					<Footer />
				</Context>
			</body>
		</html>
	);
}
