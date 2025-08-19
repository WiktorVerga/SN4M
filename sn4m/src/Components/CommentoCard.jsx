import send from "../media/send.svg";
import {useEffect, useState} from "react";
import {getLetter, getLoggedUser, getUser, getUsers, logout, setUsers} from "../utilities/users";
import {getCommunity, updateCommunity} from "../utilities/communities";
import {toast} from "react-toastify";

export const CommentoCard = ({commento, idCommunity, idPlaylist, update}) => {

    const [autore, setAutore] = useState({});

    const [letter, setLetter] = useState("");

    const [isProprietario, setIsProprietario] = useState(false);

    const [testoCommento, setTestoCommento] = useState("");
    const [testoErrore, setTestoErrore] = useState("");

    const [openEdit, setOpenEdit] = useState(false);

    const loggedUser = getLoggedUser();

    const checkTesto = () => {

        const txtArea = document.getElementById("testoCommento");
        txtArea.classList.remove("is-invalid")

        /* Controllo Testo Commento */

        //Controllo Lunghezza Testo Commento
        if (testoCommento.length > 150 || testoCommento.length < 10) {

            //Avviene Errore:
            txtArea.classList.add("is-invalid")
            setTestoErrore("Il Testo del Commento deve essere lungo Tra 10 e 150 caratteri")
            return false
        }

        return true
    }

    function getData() {
        const oggi = new Date();

        const giorno = String(oggi.getDate()).padStart(2, '0'); // gg
        const mese = String(oggi.getMonth() + 1).padStart(2, '0'); // mm (i mesi partono da 0)
        const anno = oggi.getFullYear(); // aaaa

        const dataFormattata = `${giorno}-${mese}-${anno}`;

        return dataFormattata;
    }

    const handleSubmit = () => {
        if (checkTesto()) {
            const community = getCommunity(idCommunity)
            const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)

            const nuovoCommento = {
                idCommento: commento.idCommento,
                testo: testoCommento,
                data: getData(),
                autore: loggedUser.idUtente
            }

            playlist.commenti = [...playlist.commenti.filter(item => item.idCommento !== commento.idCommento), nuovoCommento]

            community.playlistCondivise = [...community.playlistCondivise.filter(item => item.idPlaylist !== idPlaylist), playlist]

            updateCommunity(community)

            setOpenEdit(false)

            update()

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
        } else {
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

    const handleDelete = () => {
        const community = getCommunity(idCommunity)
        const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)

        playlist.commenti = playlist.commenti.filter(item => item.idCommento !== commento.idCommento)

        const validate = prompt("Digita: ELIMINA")

        if (validate === "ELIMINA") {
            updateCommunity(community)

            update()

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