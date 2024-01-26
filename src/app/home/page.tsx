import SectionDiscover from '@/components/Sections/Discover/Discover'
import './home.scss'
import SectionEvents from '@/components/Sections/Events/Events'
import SectionConnected from '@/components/Sections/Connected/Connected'
import SectionMarkets from '@/components/Sections/Markets/Markets'
import SectionCreateEvents from '@/components/Sections/CreateEvents/CreateEvents'

const Home = () => {
	return (
		<>
			<h1 className='sr-only'>Datemark app</h1>
			<SectionCreateEvents />	
			<SectionMarkets />
			<SectionDiscover />
			<SectionEvents />
			<SectionConnected />
		</>
	)
}

export default Home