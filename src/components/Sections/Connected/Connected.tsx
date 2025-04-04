import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding2 from "../../../assets/images/on_boarding_4.png"
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionConnected = () => {
	return (
		<section className='section_create section_text'>
			<div className="section__content">
			<h2 className='section_create__header'>Meet People</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding2.src, 
							alt: 'Datemarks is for meeting people in real life',
							pos: 'rt'
						}}
					>
						<InfoText
							header="Meet People"
							text={[
								"Invite the experience and meet new people in real life", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionConnected