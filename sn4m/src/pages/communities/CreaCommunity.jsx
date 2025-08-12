import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getLoggedUser, getUsers, setUsers} from "../../utilities/users";
import {getCommunities, setCommunities} from "../../utilities/communities";
import TagSelector from "../../Components/TagSelector";
import {toast} from "react-toastify";

export default function CreaCommunity() {
    /* Variabili funzionali */
    const navigate = useNavigate();     //navigazione tra pagine
    const [canSubmit, setCabSubmit] = useState(false);

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
    const getTags = (array) => {             //Funzione callback passata a TagSelector per aggiornare i tag
        setTags(array)
    }


    const handleSubmit = () => {            //creazione community
        const existingCommunities = getCommunities()        //recupera le community esistenti dal localStorage

        /* Controlli Form */
        const titoloInput = document.getElementById("titolo");
        const descrizioneInput = document.getElementById("descrizione");

        titoloInput.classList.remove("is-invalid")
        descrizioneInput.classList.remove("is-invalid")

        let hasError = false            //flag per bloccare la creazione se ci sono errori

        /* Controllo Titolo */

        //Controllo Lunghezza Titolo
        if (titolo.length > 30 || titolo.length < 5) {
            //Avviene Errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo deve essere lungo Tra 5 e 30 caratteri")
            hasError = true
        }

        //Controllo Unicità Titolo
        if (existingCommunities?.some(item => (item.titolo === titolo))) {
            //Avviene errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo è già in uso")
            hasError = true
        }

        /* Controllo Descrizione */

        //Conotrollo Lunghezza Descrizione
        if (descrizione.length > 150 || descrizione.length < 10) {
            //Avviene Errore:
            descrizioneInput.classList.add("is-invalid")
            setDescrizioneError("La Descrizione deve essere lunga Tra 10 e 150 caratteri")
            hasError = true
        }

        /* Creazione Community con Dati Sicuri */
        if (hasError) return                //se ci sono errori interrompe il flusso

        /* Generazione ID Univoco: basato su timestamp e numero casuale */
        function generateId() {
            return Date.now() + '-' + Math.floor(Math.random() * 10000);
        }

        const loggedUser = getLoggedUser()          //recupera info utente loggato

        /* --- COSTRUZIONE OGGETTO COMMUNITY --- */
        const community = {
            idCommunity: generateId(),
            titolo: titolo,
            descrizione: descrizione,
            tags: [...tags],
            autore: loggedUser.idUtente,
            playlistCondivise: []
        }

        /* Salvataggio dati EsploraCommunities in LocalStorage */

        //Aggiungo alla lista di EsploraCommunities
        if (existingCommunities) setCommunities([...existingCommunities, community])
        else setCommunities([community])

        //Aggiorno l'utente salvando la community che ha appena creato
        if (!hasError) {
            const existingUsers = getUsers()
            const users = existingUsers?.filter(item => item.email !== loggedUser.email)        //toglie dalla lista degli utenti l'utente loggato
            loggedUser.communities.push(community.idCommunity)      //aggiunge la community nella lista delle community dell'utente
            setUsers([...users, loggedUser])        //salva nel localStorage gli utenti

            /* Notifica e Ritorno alla Pagina Precedente */
            toast.success("Community Creata", {
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

    //Controllo Massimi e Minimi di Tags
    useEffect(() => {
        if (tags.length < 3 || tags.length > 15) {
            setCabSubmit(false)
        } else {
            setCabSubmit(true)
        }
    }, [tags]);

    return (<div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Crea la Tua Community
            </h1>
            <h3>
                Informazioni sulla Community
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

                {/*Pulsanti Conferma e Annulla*/}
                <input type={"button"} value="Crea Community" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       disabled={!canSubmit}
                       onClick={handleSubmit}/>

                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={handleAnnulla}/>
            </form>
        </div>
    )
};