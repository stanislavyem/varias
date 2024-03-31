import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding2 from "../../../assets/images/on_boarding_2.svg"
import './events.scss'
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionEvents = () => {
	return (
		<section className='section_events section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding2, 
							alt: 'Chat to talk to event participants',
							pos: 'lt'
						}}
					>
						<InfoText 
							header="Chat Now"
							text={[
								"Connect instantly with other who share your interests.", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionEvents