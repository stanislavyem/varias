import './discover.scss'
import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding1 from "../../../assets/images/on_boarding_1.svg"
import InfoText from '@/components/Blocks/InfoText/InfoText'



const SectionDiscover = () => {
	return (
		<section className='section_discover section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding1, 
							alt: 'Screen to swipe on events',
							pos: 'rt'
						}}
					>
						<InfoText 
							header="Discover Events"
							text={[
								"Discover exiting events by swiping right to express interest or left to explore more options.", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionDiscover