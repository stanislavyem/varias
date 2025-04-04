import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding2 from "../../../assets/images/on_boarding_3.png"
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionChat = () => {
	return (
		<section className='section_create section_text'>
			<div className="section__content">
			<h2 className='section_create__header'>Chat Now</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding2.src, 
							alt: 'Chat to talk to event participants',
							pos: 'lt'
						}}
					>
						<InfoText 
							header="Chat Now"
							text={[
								"Engage in conversation to bring your plans to life", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionChat