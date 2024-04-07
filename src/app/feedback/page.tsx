import SurveySection from '@/components/Sections/Survey/Survey'
import { Metadata } from 'next';


export const metadata: Metadata = {
	title: 'Feedback'
};


const Feeback = () => {
	return (
		<>
			<SurveySection />
		</>
	)
}

export default Feeback