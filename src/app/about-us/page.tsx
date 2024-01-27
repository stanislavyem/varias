import SectionAbout from '@/components/Sections/About/About'
import './about-us.scss'
import { Metadata } from 'next';


export const metadata: Metadata = {
	title: 'About us'
};


const AboutUs = () => {
	return (
		<>
			<SectionAbout />
		</>
	)
}

export default AboutUs