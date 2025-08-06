import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {getLoggedUser, getUsers, setUsers} from "../../utilities/users";
import {getPlaylists, setPlaylists} from "../../utilities/playlists";
import TagSelector from "../../Components/TagSelector";
import {toast} from "react-toastify";

export default function CreaPlaylist() {
    /* Functional Vars */
    const navigate = useNavigate();

    /* Dati Form */
    const [titolo, setTitolo] = useState("");

    const [descrizione, setDescrizione] = useState("");


    /* Dati Errori Form */
    const [titoloError, setTitoloError] = useState("");
    const limMaxTitolo = 30
    const limMinTitolo = 5

    const [descrizioneError, setDescrizioneError] = useState("");
    const limMaxDescrizione = 150
    const limMinDescrizione = 10

    const [tags, setTags] = useState([])
    const getTags = (array) => {
        setTags(array)
    }


    const handleSubmit = () => {
        const existingPlaylists = getPlaylists()

        /* Controlli Form */
        const titoloInput = document.getElementById("titolo");
        const descrizioneInput = document.getElementById("descrizione");

        titoloInput.classList.remove("is-invalid")
        descrizioneInput.classList.remove("is-invalid")

        let hasError = false

        /* Controllo Titolo */

        //Controllo Lunghezza Titolo
        if (titolo.length > 30 || titolo.length < 5) {
            //Avviene Errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo deve essere lungo Tra 5 e 30 caratteri")
            hasError = true
        }

        //Controllo Unicità Titolo
        if (existingPlaylists?.some(item => (item.titolo === titolo))) {
            //Avviene errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo è già in uso")
            hasError = true
        }

        /* Controllo Descrizione */

        //Controllo Lunghezza Descrizione
        if (descrizione.length > 150 || descrizione.length < 10) {
            //Avviene Errore:
            descrizioneInput.classList.add("is-invalid")
            setDescrizioneError("La Descrizione deve essere lunga Tra 10 e 150 caratteri")
            hasError = true
        }

        /* Creazione Playlist con Dati Sicuri */
        if (hasError) return

        function generateId() {
            return Date.now() + '-' + Math.floor(Math.random() * 10000);
        }

        const loggedUser = getLoggedUser()

        const playlist = {
            idPlaylist: generateId(),
            titolo: titolo,
            descrizione: descrizione,
            tags: [...tags],
            canzoni: []
        }

        /* Salvataggio dati playlist in LocalStorage */

        //Aggiorno l'utente salvando la playlist che ha appena creato
        if (!hasError) {
            const existingUsers = getUsers()
            const users = existingUsers?.filter(item => item.email !== loggedUser.email)
            loggedUser.playlistProprie.push(playlist)
            setUsers([...users, loggedUser])

            toast.success("Playlist Creata", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })

            navigate(-1)
        }
    }

    const handleAnnulla = () => {
        navigate(-1)
    }

    return (<div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Crea la Tua Playlist
            </h1>
            <h3>
                Informazioni sulla Playlist
            </h3>

            <form
                name={"signin"}
                className={"mt-5"}
                autoComplete={"off"}
            >

                {/*Riga user e Titolo*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black ">
                            <input type="text" className="form-control" id="titolo"
                                   required={true}
                                   placeholder="Titolo"
                                   onChange={(e) => {
                                       setTitolo(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Titolo</label>

                            <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                <span className={(titolo.length < limMinTitolo || titolo.length > limMaxTitolo) ? " text-danger " : "text-secondary"}>{titolo.length}/{limMaxTitolo}</span>
                            </div>

                            <div className="invalid-feedback">{titoloError}</div>
                        </div>

                    </div>
                    <div className={"col-5"}>
                    </div>
                </div>

                {/*Riga per Descrizione*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className={"col-5"}>
                        <div className="form-floating">
                            <textarea className="form-control" placeholder="Scrivi una Descrizione"
                                      id="descrizione"
                                      style={{height: 100}}
                                      required={true}
                                      maxLength={250}
                                      onChange={(e) => {
                                          setDescrizione(e.target.value)
                                          e.target.classList.remove("is-invalid")
                                      }}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Descrizione</label>
                            <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                <span className={(descrizione.length < limMinDescrizione || descrizione.length > limMaxDescrizione) ? " text-danger " : "text-secondary"}>{descrizione.length}/{limMaxDescrizione}</span>
                            </div>
                            <div className="invalid-feedback">{descrizioneError}</div>
                        </div>

                    </div>
                    <div className={"col-5"}>
                    </div>
                </div>


                {/*Riga per Select Tag*/}
                <h3 className={"mt-5"}>
                    Tags
                </h3>

                <TagSelector
                    personalizzati={true}
                    returnData={getTags}
                    limMin={3}
                    limMax={25}
                />

                <input type={"button"} value="Crea Playlist" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={handleSubmit}/>

                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={handleAnnulla}/>
            </form>
        </div>
    )
};