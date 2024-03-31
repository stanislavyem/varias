import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import demo from "../../../assets/images/demo.webp"
import './_create-events.scss'
import InfoCreateEvent from '@/components/Blocks/InfoCreateEvent/InfoCreateEvent'


const SectionCreateEvents = () => {
	return (
		<section className='section_create-events section_text'>
			<div className="section__content">
				<h2 className='section_create-events__header'>Become a beta tester and get paid to give feedback</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: demo as unknown as string, 
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