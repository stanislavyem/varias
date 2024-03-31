import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding2 from "../../../assets/images/on_boarding_3.svg"
import './connected.scss'
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionConnected = () => {
	return (
		<section className='section_connected section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding2, 
							alt: 'Datemarks is for meeting people in real life',
							pos: 'rt'
						}}
					>
						<InfoText
							header="Meet People"
							text={[
								"Join events and meet new people in real life.", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionConnected