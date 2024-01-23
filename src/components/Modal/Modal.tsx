'use client'
import { svgs } from '@/assets/icons/svgs';
import './modal.scss'
import { lockFocusInside } from '@/assets/js/tools';
import { useAppContext } from '@/hooks/useAppContext';
import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';


export interface IModal {
    name?: string
    closable?: boolean //has close icon
    onClose?: () => void //call this f on close
    children: React.ReactNode //children for modal window
    closeOnEsc?: boolean //should close modal window on Esc pressed
}


export interface IModalFunctions {
    openModal: ({name, onClose, closable, children, closeOnEsc}: IModal) => void;
    closeCurrent: () => void; //close current modal, current modal = modals[0]
    closeName: (name: string) => void; //close all modals with the specified name
    getName: () => Promise<string | null>//get name of current visible modal
    closeAll: () => void//close all modals
    contentChanged: () => void //if content changed, get all new focusable elements to lock focus inside
}



//Modal window, with stack (to avoid lost any message), methods to create, close any/all messages from anywhere, can close 'tab' inside
const Modal = forwardRef<IModalFunctions>(({}, ref): JSX.Element => {
    useImperativeHandle(ref, () => ({
        openModal({name, closable=true, onClose, closeOnEsc=true, children}) { 
            setModals(prev => ([...prev, {
                name: name || '',
                closable,
                closeOnEsc,
                onClose: onClose ? onClose : closeCurrent,
                children
            }]))
        },
        closeCurrent() {      
            setModals(prev => prev.slice(1))
        },
        closeName(name) {
            setModals(prev => prev.filter(modal => modal.name !== name))
        },
        getName() {
            return new Promise<string | null>((res) => {
                setModals(prev => {
                    prev[0] ? res(prev[0]?.name || '') : res(null)                   
                    return prev
                })
            }) 
        },
        closeAll() {
            setModals([])
        },
        contentChanged() {
            contentChanged()
        }
    }));
	

	const { setModal } = useAppContext()
    const [modals, setModals] = useState<IModal[]>([]) //stack of modal windows
    const focuser = useRef<ReturnType<typeof lockFocusInside>>() //for locking focus inside the modal
    const _modalContent = useRef<any>(null) //modal window element

	useEffect(() => {
		if (!_modalContent.current) return
		setModal(_modalContent)
	}, [_modalContent.current])


    const closeCurrent = (): void => {
        setModals(prev => prev.slice(1))
    }

    const contentChanged = (): void => {
        if (_modalContent.current) {
            focuser.current?.destroy()
            focuser.current = lockFocusInside({_parentElement: _modalContent.current})
            focuser.current.focusOn(0)
        }
    }



    const keyPressed = (e: KeyboardEvent): void => {
        if (e.code === 'Escape' && modals[0].closeOnEsc) {
            return setModals(prev => prev.slice(1))
        }
    };


    useEffect(() => {
        if (!modals[0]?.children) return       
        
        if (_modalContent.current) {           
            _modalContent.current.addEventListener("keydown", keyPressed);
            focuser.current?.destroy()
            setTimeout(() => {contentChanged()}, 200) //wait for render children
            focuser.current?.rebuild()
        } 
        return () => {
            _modalContent.current?.removeEventListener("keydown", keyPressed);           
            focuser.current?.destroy()
        }
    }, [modals[0]?.children])
    



    return (
        <div className={`modal-window ${modals.length > 0 ? "visible" : ""}`} ref={_modalContent}>
            {modals[0]?.closable &&
                <button className="closer" aria-label='Close modal window' onClick={modals[0]?.onClose ? modals[0]?.onClose : close} data-testid='modal-closer'>
                    {svgs().iconClose}
                </button>
            }

			<div className="modal__content">
                {modals[0]?.children}
            </div>
        </div>
	)

})

Modal.displayName = 'Modal'


export default Modal;

