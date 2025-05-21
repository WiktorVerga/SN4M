import {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {useNavigate, useSearchParams} from "react-router-dom";
import TagSelector from "../../Components/TagSelector";
import {getCommunities, getCommunity, setCommunities, updateCommunity} from "../../utilities/communities";
import {toast} from "react-toastify";


export default function ModificaCommunity() {

    /* Functional Vars */
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const communityId = searchParams.get("id")
    const [community, setCommunity] = useState({})

    const [showNewTitolo, setShowNewTitolo] = useState(false);
    const [showNewDescrizione, setShowNewDescrione] = useState(false);

    /* Dati Form */
    const [titolo, setTitolo] = useState("");

    const [descrizione, setDescrizione] = useState("");

    const [tags, setTags] = useState([])
    const getTags = (array) => {
        setTags(array)
    }

    /* Dati Errori Form */
    const [titoloError, setTitoloError] = useState("");
    const limMaxTitolo = 30
    const limMinTitolo = 5

    const [descrizioneError, setDescrizioneError] = useState("");
    const limMaxDescrizione = 150
    const limMinDescrizione = 10

    const [hasError, setHasError] = useState(false)

    const resetState = () => {
        setTitolo("");
        setDescrizione("");
        setShowNewTitolo(false);
        setShowNewDescrione(false);
    }

    const handleSaveTitolo = () => {
        const existingCommunities = getCommunities()

        const titoloInput = document.getElementById("titolo");
        titoloInput.classList.remove("is-invalid")

        /* Controllo Titolo */

        //Controllo Lunghezza Titolo
        if (titolo.length > 30 || titolo.length < 5) {
            //Avviene Errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo deve essere lungo Tra 5 e 30 caratteri")
            setHasError(true)
        }

        //Controllo Unicità Titolo
        if (existingCommunities?.some(item => (item.titolo === titolo))) {
            //Avviene errore:
            titoloInput.classList.add("is-invalid")
            setTitoloError("Il Titolo è già in uso")
            setHasError(true)
        }
    }

    const handleSaveDescrizione = () => {
        const existingCommunities = getCommunities()

        const descrizioneInput = document.getElementById("floatingTextarea2");
        descrizioneInput.classList.remove("is-invalid")

        /* Controllo Descrizione */

        //Conotrollo Lunghezza Descrizione
        if (descrizione.length > 150 || descrizione.length < 10) {
            //Avviene Errore:
            descrizioneInput.classList.add("is-invalid")
            setDescrizioneError("La Descrizione deve essere lunga Tra 10 e 150 caratteri")
            setHasError(true)
        }
    }

    const handleSubmit = () => {
        if (showNewTitolo && titolo.length > 0) handleSaveTitolo()
        if (showNewDescrizione && descrizione.length > 0) handleSaveDescrizione()

        if (!hasError) {

            updateCommunity({
                idCommunity: community.idCommunity,
                titolo: showNewTitolo ? titolo : community.titolo,
                descrizione: showNewDescrizione ? descrizione : community.descrizione,
                tags: [...tags],
                autore: community.autore,
                playlistCondivise: community.playlistCondivise
            })

            toast.success("Modifiche Salvate", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });

            resetState()
        } else {
            toast.error("Errore nel Salvataggio", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
            })

            setHasError(false)
        }
    }

    const handleDeleteCommunity = () => {
        const validate = prompt("Digita: ELIMINA")

        if (validate === "ELIMINA") {
            setCommunities(getCommunities()?.filter(item => item.idCommunity !== communityId))
            navigate("/esplora")
        }
    }

    const handleAnnulla = () => {
        navigate(-1)
    }

    /* UseEffect */
    useEffect(() => {
        /* Recupero Dati Community */
        const community = getCommunities()?.find(item => item.idCommunity === communityId)
        console.log(getCommunity(communityId))

        if (community == null) return

        setCommunity(community)
    }, [])

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Modifica la Tua Community
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

                    {/*Primo Gruppo: Titolo + Bottone Modifica */}
                    <div className={"col-5 d-flex align-items-center"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <input type="text" className="form-control" id="titolo"
                                   placeholder="Titolo"
                                   readOnly={true}
                                   value={community.titolo}
                            />
                            <label htmlFor="floatingInput">Titolo</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={() => {setShowNewTitolo(!showNewTitolo)}}
                        >
                            {showNewTitolo? <i className="bi bi-x-lg"></i> : <i className="bi bi-pencil"></i>}
                        </button>
                    </div>

                    {/*Secondo Gruppo: Nuovo Titolo */}
                    {showNewTitolo && <div className={"col-5 d-flex align-items-center"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <input type="text" className="form-control" id="titolo"
                                   required={true}
                                   placeholder="Titolo"
                                   onChange={(e) => {
                                       setTitolo(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Nuovo Titolo</label>
                            <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                <span className={(titolo.length < limMinTitolo || titolo.length > limMaxTitolo) ? " text-danger " : "text-secondary"}>{titolo.length}/{limMaxTitolo}</span>
                            </div>
                            <div className="invalid-feedback">{titoloError}</div>
                        </div>
                    </div>}
                </div>

                {/*Riga per Descrizione*/}
                <div className={"row flex-row justify-content-between mt-5"}>

                    {/*Primo Gruppo: Descrizione + Bottone Modifica */}
                    <div className={"col-5 d-flex"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <textarea className="form-control" placeholder="Scrivi una Descrizione"
                                      id="floatingTextarea2"
                                      style={{height: 100}}
                                      readOnly={true}
                                      value={community.descrizione}
                                      maxLength={250}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Descrizione</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={() => {setShowNewDescrione(!showNewDescrizione)}}
                        >
                            {showNewDescrizione? <i className="bi bi-x-lg"></i> : <i className="bi bi-pencil"></i>}
                        </button>
                    </div>

                    {/*Secondo Gruppo: Nuova Descrizione */}
                    {showNewDescrizione && <div className={"col-5 d-flex"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <textarea className="form-control" placeholder="Scrivi una Nuova Descrizione"
                                      id="floatingTextarea2"
                                      style={{height: 100}}
                                      required={true}
                                      maxLength={250}
                                      onChange={(e) => {
                                          setDescrizione(e.target.value)
                                          e.target.classList.remove("is-invalid")
                                      }}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Nuova Descrizione</label>
                            <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                <span className={(descrizione.length < limMinDescrizione || descrizione.length > limMaxDescrizione) ? " text-danger " : "text-secondary"}>{descrizione.length}/{limMaxDescrizione}</span>
                            </div>
                            <div className="invalid-feedback">{descrizioneError}</div>
                        </div>
                    </div>}
                </div>


                {/*Riga per Select Tags*/}
                <h3 className={"mt-5"}>
                    Tags
                </h3>

                <TagSelector
                    personalizzati={true}
                    returnData={getTags}
                    limMax={25}
                    limMin={3}
                    initialState={community.tags}
                />

                {/*TODO: handleSubmit*/}
                <input type={"button"} value="Salva Modifiche" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={handleSubmit}/>

                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={handleAnnulla}/>
            </form>

            <h4 className={"spacer text-danger fw-bold"}>
                Elimina Community
            </h4>
            <button className={"btn btn-danger mt-3 mb-5 text-uppercase"}
                    onClick={handleDeleteCommunity}
            >
                Elimina Community
            </button>
        </div>
    )
}