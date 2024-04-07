import SectionDiscover from '@/components/Sections/Discover/Discover'
import './home.scss'
import SectionEvents from '@/components/Sections/Events/Events'
import SectionConnected from '@/components/Sections/Connected/Connected'
import SectionMarkets from '@/components/Sections/Markets/Markets'
import SectionCreateEvents from '@/components/Sections/CreateEvents/CreateEvents'
import OnBoarding from '@/components/Sections/OnBoarding/OnBoarding'

const Home = () => {
	return (
		<>
			<h1 className='sr-only'>Datemark app</h1>
			<SectionCreateEvents />	
			{/* <OnBoarding /> */}
			{/* <SectionMarkets /> */}
			<SectionDiscover />
			<SectionEvents />
			<SectionConnected />
		</>
	)
}

export default Home