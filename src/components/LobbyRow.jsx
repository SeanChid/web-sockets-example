import axios from 'axios'

const LobbyRow = (props) => {
    const {entryCode, lobbyId, setLobbyData} = props

    const deleteLobby = () => {
        axios.delete(`/api/lobby/${lobbyId}`)
            .then((res) => {
                setLobbyData(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <h4>
            {entryCode} <button className='btn btn-danger' onClick={deleteLobby}>Delete</button>
            </h4>
        </div>
    )
}

export default LobbyRow