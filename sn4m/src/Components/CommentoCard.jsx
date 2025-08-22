import send from "../media/send.svg";
import {useEffect, useState} from "react";
import {getLetter, getLoggedUser, getUser, getUsers, logout, setUsers} from "../utilities/users";
import {getCommunity, updateCommunity} from "../utilities/communities";
import {toast} from "react-toastify";

//Componente che riceve come props: il commento, id della community, id della playlist e funzione update
export const CommentoCard = ({commento, idCommunity, idPlaylist, update}) => {
    /*Variabili*/
    const [autore, setAutore] = useState({});           //stato per memorizzare i dati dell'autore del commento

    const [letter, setLetter] = useState("");       //stato per memorizzare la lettera iniziale dell'autore

    const [isProprietario, setIsProprietario] = useState(false);     //stato che verifica se l'utente loggato è proprietario del commento

    const [testoCommento, setTestoCommento] = useState("");      //stato per il testo del commento
    const [testoErrore, setTestoErrore] = useState("");         //stato per gestire messaggi di errore del commento

    const [openEdit, setOpenEdit] = useState(false);      //stato per gestire l'apertura della modalità modifica (overlay)

    const loggedUser = getLoggedUser();         //ottiene l'utente attualmente loggato

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
        return true
    }

    //Funzione per ottenere la data corrente in formato gg-mm-aaaa
    function getData() {
        const oggi = new Date();

        const giorno = String(oggi.getDate()).padStart(2, '0'); // gg
        const mese = String(oggi.getMonth() + 1).padStart(2, '0'); // mm (i mesi partono da 0)
        const anno = oggi.getFullYear(); // aaaa

        const dataFormattata = `${giorno}-${mese}-${anno}`;

        return dataFormattata;
    }

    //Funzione per modificare un commento
    const handleSubmit = () => {
        if (checkTesto()) {     //se il testo è valido
            const community = getCommunity(idCommunity)     //ottiene la community
            const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)       //trova la playlist

            /*Crea oggetto Commento Modificato*/
            const nuovoCommento = {
                idCommento: commento.idCommento,
                testo: testoCommento,
                data: getData(),
                autore: loggedUser.idUtente
            }

            //aggiorna i commenti della playlist modificando il giusto commento
            playlist.commenti = [...playlist.commenti.filter(item => item.idCommento !== commento.idCommento), nuovoCommento]

            //aggiorna le playlist condivise della community
            community.playlistCondivise = [...community.playlistCondivise.filter(item => item.idPlaylist !== idPlaylist), playlist]

            //salva modifiche nel localStorage
            updateCommunity(community)

            //chiude overlay
            setOpenEdit(false)

            // Aggiorna la UI genitore
            update()

            //Notifica di successo
            toast.success("Commento Modificato!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });
        } else {    //se il testo non è valido
            //Notifica di errore
            toast.error("Errore nella Modifica!", {
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

    //Funzione per eliminare un commento
    const handleDelete = () => {
        const community = getCommunity(idCommunity)     //ottiene la community
        const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)   //trova la playlist

        //elimina dai commenti il commento selezionato dall'utente
        playlist.commenti = playlist.commenti.filter(item => item.idCommento !== commento.idCommento)

        // Richiede conferma
        const validate = prompt("Digita: ELIMINA")

        if (validate === "ELIMINA") {
            updateCommunity(community)

            update()

            //Notifica di successo
            toast.success("Commento Eliminato!", {
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
            toast.error("Commento non Eliminato!", {
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

    //useEffect per aggiornare stati derivati dal commento all'inizializzazione o quando cambia il commento
    useEffect(() => {
        setAutore(getUser(commento.autore));
        setLetter(getLetter(commento.autore))
        setIsProprietario(commento.autore === loggedUser.idUtente)
        setTestoCommento(commento.testo)
    }, [commento]);

    return (
        <>
            {openEdit &&
                <div className="overlay">
                    {/* Overlay per modifica commento */}
                    <div className="overlay-content w-100">
                        <h2 className={"my-5"}>Modifica il Commento</h2>
                        <div className={"card comment-bg w-100 h-50"}>
                            <div className={"card-body d-flex flex-column gap-3"}>
                                <div className={"d-flex"}>
                                    <div className={"d-flex align-items-center"}>
                                        <div className={"text-decoration-none mx-auto "} onClick={() => {
                                        }}>
                                            <div className={"avatar"}>{getLetter(loggedUser.idUtente)}</div>
                                        </div>
                                        <div className={"ms-3 text-white"}>
                                            <h4 className={"m-0"}>{loggedUser.username}</h4>
                                            <p className={"fs-5 m-0"}>{commento.data}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Form modifica Commento */}
                                <form name={"commenta"} autoComplete={"off"}>
                                    <div className={"position-relative"}>
                                        <textarea
                                            className={"form-control scrivi-commento w-100 text-white position-relative"}
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
                                        <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                            <span
                                                className={(testoCommento.length < 10 || testoCommento.length > 150) ? " text-danger " : "text-secondary"}>{testoCommento.length}/{150}</span>
                                        </div>
                                        <div className="invalid-feedback">{testoErrore}</div>
                                    </div>
                                    {/* Pulsante Annulla e Conferma */}
                                    <div className={"d-flex w-100 justify-content-end mt-3 gap-3"}>
                                        <button className={"btn btn-primary"}
                                                onClick={() => {
                                                    setTestoCommento(commento.testo)
                                                    setOpenEdit(false)
                                                }}>Annulla
                                        </button>
                                        <button type={"button"} className={"btn btn-primary  col-1"}
                                                onClick={handleSubmit}><img src={send}/></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* Card commento */}
            <div className={"w-75"}>
                <div className={"card comment-bg"}>
                    <div className={"card-body d-flex flex-column gap-3"}>
                        <div className={"d-flex justify-content-between"}>
                            <div className={"d-flex align-items-center"}>
                                <div className={"text-decoration-none mx-auto "} onClick={() => {
                                }}>
                                    <div className={"avatar"}>{letter}</div>
                                </div>
                                <div className={"ms-3 text-white"}>
                                    <h4 className={"m-0"}>{autore?.username}</h4>
                                    <p className={"fs-5 m-0"}>{commento.data}</p>
                                </div>
                            </div>
                            {/* Pulsanti Modifica e Elimina solo se proprietario */}
                            {isProprietario &&
                                <div className={""}>
                                    <button className="btn btn-primary mx-2"
                                            onClick={handleDelete}
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                    <button className="btn btn-primary mx-2"
                                            onClick={() => {setOpenEdit(true)}}
                                    >
                                        <i className="bi bi-pencil" ></i>
                                    </button>
                                </div>
                            }
                        </div>
                        {/* Textarea commento in sola lettura */}
                        <form name={"commenta"} autoComplete={"off"}>
                            <div className={"position-relative"}>
                            <textarea
                                className={"scrivi-commento w-100 text-white position-relative"}
                                value={commento.testo}
                                id="testoCommento"
                                style={{height: 100}}
                                readOnly={true}
                                maxLength={250}
                            />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}