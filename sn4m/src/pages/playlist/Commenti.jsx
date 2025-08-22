import {useParams} from "react-router-dom";
import {getLetter, getLoggedUser} from "../../utilities/users";
import send from "../../media/send.svg";
import {useEffect, useState} from "react";
import {getCommentiPlaylist, getCommunity, updateCommunity} from "../../utilities/communities";
import {CommentoCard} from "../../Components/CommentoCard";
import {toast} from "react-toastify";
import {getPlaylist} from "../../utilities/playlists.js";


export const Commenti = () => {
    /* Variabili */
    const {idPlaylist, idCommunity} = useParams()    //recupera parametri da URL

    const [testoCommento, setTestoCommento] = useState("")      //stato testo inserito nel commento
    const [testoErrore, setTestoErrore] = useState("")      //messaggio errore validazione testo commento

    const [isTuoi, setIsTuoi] = useState(false)      //indica se mostrare solo i commenti dell’utente loggato

    const [commenti, setCommenti] = useState([])    //lista commenti caricati

    const loggedUser = getLoggedUser()          //utente attualmente loggato
    const [playlist, setPlaylist] = useState()      //playlist a cui appartengono i commenti


    //Aggiorna lo stato della pagina per mostrare i dati più recenti
    const update = () => {
        //recupera i commenti della playlist
        const dati = getCommentiPlaylist(idCommunity, idPlaylist)

        //Ordina dal più vecchio al più recente
        dati.sort((a, b) => parseDate(b.data) - parseDate(a.data));

        if (isTuoi) {   //se è attivo il filtro "i tuoi commenti"
            //filtra solo i commenti dell’utente
            const commentiProprietari = dati.filter(item => item.autore === loggedUser.idUtente)
            if (commentiProprietari.length > 0) {
                setCommenti(commentiProprietari)        //aggiorna stato con i propri commenti
            } else {
                setIsTuoi(false)        //se non ci sono commenti propri, disattiva filtro
            }
        } else {
            setCommenti(dati)       //altrimenti mostra tutti i commenti
        }
    }

    //Funzione per validare il testo del commento
    const checkTesto = () => {

        const txtArea = document.getElementById("testoCommento");
        txtArea.classList.remove("is-invalid")

        //Controllo Lunghezza Testo Commento
        if (testoCommento.length > 150 || testoCommento.length < 10) {
            //Avviene Errore:
            txtArea.classList.add("is-invalid")
            setTestoErrore("Il Testo del Commento deve essere lungo Tra 10 e 150 caratteri")
            return false
        }
        return true         //testo valido
    }

    /* Generazione ID Univoco: basato su timestamp e numero casuale */
    function generateId() {
        return Date.now() + '-' + Math.floor(Math.random() * 10000);
    }

    //Restituisce data odierna in formato "gg-mm-aaaa"
    function getData() {
        const oggi = new Date();

        const giorno = String(oggi.getDate()).padStart(2, '0'); // gg
        const mese = String(oggi.getMonth() + 1).padStart(2, '0'); // mm
        const anno = oggi.getFullYear(); // aaaa

        const dataFormattata = `${giorno}-${mese}-${anno}`;

        return dataFormattata;
    }

    //Funzione per la Gestione della pubblicazione del commento
    const handleSubmit = () => {
        if (checkTesto()) {     //se il testo è valido
            const community = getCommunity(idCommunity)     //recupera community
            const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)       //trova playlist interessata

            //Aggiungo un nuovo oggetto commento all'array di commenti
            playlist.commenti.push({
                idCommento: generateId(),
                testo: testoCommento,
                data: getData(),
                autore: loggedUser.idUtente
            })

            //Aggiorno l'array di playlist condivise
            community.playlistCondivise = [...community.playlistCondivise.filter(item => item.idPlaylist !== idPlaylist), playlist]

            updateCommunity(community)          //salvo nel localStorage

            //Reimposto lo stato della pagina e la aggiorno
            setTestoCommento("")

            update()

            //Notifica di successo
            toast.success("Commento Aggiunto!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });
        } else {
            //Notifica di errore
            toast.error("Errore nella Creazione!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
            })
        }
    }

    // Funzione per convertire "gg-mm-aaaa" in Date
    function parseDate(str) {
        const [giorno, mese, anno] = str.split('-').map(Number);
        return new Date(anno, mese - 1, giorno); // mese parte da 0
    }

    //UseEffect si aggiorna al cambio di IdCommunity, idPlaylist e isTuoi
    useEffect(() => {
        setPlaylist(getPlaylist(idPlaylist))        //recupera playlist

        //Imposta tutti i dati iniziali dello stato
        update()

    }, [idCommunity, idPlaylist, isTuoi])

    return (
        <div>
            {/*Titolo dinamico*/}
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Commenti: {playlist?.titolo}
            </h1>

            {/* Card per scrivere un nuovo commento */}
            <div className={"d-flex flex-column align-items-center gap-5"}>
                <div className={"card comment-bg w-75 h-50"}>
                    <div className={"card-body d-flex flex-column gap-3"}>
                        <div className={"d-flex"}>
                            <div className={"d-flex align-items-center"}>
                                <div className={"text-decoration-none mx-auto "} onClick={() => {
                                }}>
                                    {/* Avatar con iniziale username */}
                                    <div className={"avatar"}>{getLetter(loggedUser.idUtente)}</div>
                                </div>
                                {/*nome utente e data*/}
                                <div className={"ms-3 text-white"}>
                                    <h4 className={"m-0"}>{loggedUser.username}</h4>
                                    <p className={"fs-5 m-0"}>{getData()}</p>
                                </div>

                            </div>
                        </div>
                        {/* Form scrittura commento */}
                        <form name={"commenta"} autoComplete={"off"}>
                            <div className={"position-relative"}>
                                <textarea className={"form-control scrivi-commento w-100 text-white position-relative"}
                                          value={testoCommento}
                                          id="testoCommento"
                                          style={{height: 100}}
                                          required={true}
                                          maxLength={250}
                                          onChange={(e) => {
                                              setTestoCommento(e.target.value)
                                              e.target.classList.remove("is-invalid")
                                          }}
                                          placeholder="Scrivi commento..."
                                          onFocus={(e) => (e.target.placeholder = "")}
                                          onBlur={(e) => (e.target.placeholder = "Scrivi commento...")}
                                />
                                {/* Contatore caratteri */}
                                <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                    <span className={(testoCommento.length < 10 || testoCommento.length > 150) ? " text-danger " : "text-secondary"}>{testoCommento.length}/{150}</span>
                                </div>
                                {/* Messaggio errore validazione */}
                                <div className="invalid-feedback">{testoErrore}</div>
                            </div>
                            {/* Pulsante invio */}
                            <div className={"d-flex w-100 justify-content-end mt-3"}>
                                <button type={"button"} className={"btn btn-primary  col-1"} onClick={handleSubmit}><img src={send}/></button>
                            </div>
                        </form>
                    </div>
                </div>

                <hr className={"w-100"}/>

                {/* Intestazione Dinamica con Pulsante Filtro, appare solo se ci sono commenti propri*/}
                {commenti.filter(item => item.autore === loggedUser.idUtente).length > 0 &&
                    <div className={"row flex-row align-items-center w-100"}>
                    <h3 className={"col"}>
                        {isTuoi ? "I Tuoi Commenti" : "Tutti i Commenti"}
                    </h3>
                    <button className={"col-2 btn btn-primary text-uppercase"}
                            onClick={() => setIsTuoi(!isTuoi)}>{isTuoi ? "Vedi Tutti" : "vedi i Tuoi"}</button>
                </div>}
                {/* Lista commenti o messaggio vuoto */}
                {commenti?.length > 0 ?
                    commenti?.map((commento, index) => (
                    <CommentoCard
                        commento={commento}
                        idCommunity={idCommunity}
                        idPlaylist={idPlaylist}
                        update={update}
                    />
                ))
                    :
                    <div>Non ci sono ancora commenti!</div>
                }
            </div>
        </div>
    )
}