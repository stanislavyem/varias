import SectionDiscover from '@/components/Sections/Discover/Discover'
import './home.scss'
import SectionEvents from '@/components/Sections/Events/Events'
import SectionConnected from '@/components/Sections/Connected/Connected'
import SectionMarkets from '@/components/Sections/Markets/Markets'
import SectionAbout from '@/components/Sections/About/About'

const Home = () => {
	return (
		<>
			<SectionMarkets />
			{/* <SectionAbout /> */}
			<SectionDiscover />
			<SectionEvents />
			<SectionConnected />
		</>
	)
}

export default Home