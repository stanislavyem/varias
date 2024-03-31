import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import logo from "../../../assets/images/ic_app_logo.svg"
import './_create-events.scss'
import InfoCreateEvent from '@/components/Blocks/InfoCreateEvent/InfoCreateEvent'


const SectionCreateEvents = () => {
	return (
		<section className='section_create-events section_text'>
			<div className="section__content">
				<h2 className='section_create-events__header'>Create events in minutes</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: logo, 
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<InfoCreateEvent />
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionCreateEvents