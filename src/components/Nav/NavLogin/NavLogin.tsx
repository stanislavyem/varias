'use client'
import { useAppContext } from "@/hooks/useAppContext"



const NavLogin = () => {
	const { modal, lang } = useAppContext()

	const closeModal = () => {
		modal?.current?.closeCurrent()
	}

	const onLoginClick = (): void => {
		modal?.current?.openModal({
			name: 'login',
			closable: true,
			children: <div>REGISTER / LOGIN <br/><br/><br/><button onClick={closeModal}>CLOSE</button></div>
		})
	}

	return (
		<li className={`nav-item`}>
			<button onClick={onLoginClick}>Modal login</button>
		</li>
	)
}


export default NavLogin