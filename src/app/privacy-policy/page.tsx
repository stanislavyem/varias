import SectionPrivacy from '@/components/Sections/Privacy/Privacy'
import './privacy.scss'
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Privacy'
};


const Privacy = () => {
	return (
		<>
			<SectionPrivacy />
		</>
	)
}

export default Privacy