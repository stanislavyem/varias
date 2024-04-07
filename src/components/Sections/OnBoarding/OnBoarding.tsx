import './onboarding.scss'

import Carousel from '../../Utils/Carousel'
const DATA = [{ title: "Discover Events", info: "Discover exiting events by swiping right to express interest or left to explore more options.", image: "https://ik.imagekit.io/datemarks/on_boarding_1.svg?updatedAt=1712044694903" },
 { title: "Chat Now", info: "Connect instantly with other who share your interests.", image: "https://ik.imagekit.io/datemarks/on_boarding_2.svg?updatedAt=1711923185816" }, 
 { title: "Meet People", info: "Join events and meet new people in real life.", image: "https://ik.imagekit.io/datemarks/on_boarding_3.svg?updatedAt=1711923185629" }]

const OnBoardingCarousel = () => {
	return (
		<section className='section_markets section_text'>
			<Carousel data={DATA} />
		</section>
	)
}

export default OnBoardingCarousel