import { useState } from 'react'
import { Modal } from 'react-bootstrap'

const NewLobby = (props) => {

    const {showModal, setShowModal} = props

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Lobby</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>new lobby info</h4>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary'>close</button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewLobby