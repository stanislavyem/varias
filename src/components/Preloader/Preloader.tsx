import './preloader.scss'

const Preloader = () => {
	return (
		<div className="preloader" title='Please wait' aria-label="Please wait">
			<div className="dash dash_1"></div>
			<div className="dash dash_2"></div>
			<div className="dash dash_3"></div>
			<div className="dash dash_4"></div>
		</div>
	)
}


export default Preloader