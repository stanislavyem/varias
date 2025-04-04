
const DATA = [{ title: "Discover activities", info: "Find and join exciting activities happening around you in real time.", image: "https://ik.imagekit.io/datemarks/on_boarding_1.svg?updatedAt=1712044694903" },
 { title: "Chat Now", info: "Connect instantly with other who share your interests.", image: "https://ik.imagekit.io/datemarks/on_boarding_2.svg?updatedAt=1711923185816" }, 
 { title: "Meet People", info: "Join activities and meet new people in real life.", image: "https://ik.imagekit.io/datemarks/on_boarding_3.svg?updatedAt=1711923185629" }]

 const OnBoardingCarousel = () => {
	return (
		<section className='bg-gray-100 rounded-2xl shadow-lg p-8'>
			<h2 className='text-2xl font-bold text-center mb-6'>Unique Features</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{DATA.map((item, index) => (
					<div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
						<img src={item.image} alt={item.title} className="mx-auto mb-2 w-60 h-60" />
						<h3 className="text-lg font-bold">{item.title}</h3>
						<p className="text-gray-600">{item.info}</p>
					</div>
				))}
			</div>
		</section>
	)
}

export default OnBoardingCarousel