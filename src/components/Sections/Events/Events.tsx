import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/events_1.svg"
import './events.scss'
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionEvents = () => {
	return (
		<section className='section_events section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: image1, 
							alt: '!!!',
							pos: 'lt'
						}}
					>
						<InfoText 
							header="Header"
							text={[
								"Explore curated events from our trusted partners and local businesses", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionEvents