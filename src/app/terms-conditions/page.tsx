import SectionTerms from '@/components/Sections/Terms/Terms'
import './terms.scss'
import { Metadata } from 'next';


export const metadata: Metadata = {
	title: 'Terms us'
};


const Terms = () => {
	return (
		<>
			<SectionTerms />
		</>
	)
}

export default Terms