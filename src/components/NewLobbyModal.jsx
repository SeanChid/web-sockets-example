import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'

const NewLobbyModal = (props) => {

    const {showModal, setShowModal, entryCode, setEntryCode} = props
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post('/api/lobby', { entryCode })
        .then((res) => {
            navigate(`/lobby/${res.data.lobbyId}`, {state: {entryCode}})
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Lobby</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Enter an entry code'
                        value={entryCode}
                        onChange={(e) => setEntryCode(e.target.value)}
                    />
                    <br/>
                    <button type='submit' className='btn btn-primary'>Create</button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default NewLobbyModal