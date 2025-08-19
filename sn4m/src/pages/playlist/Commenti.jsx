import {Link, useParams, useSearchParams} from "react-router-dom";
import {getLetter, getLoggedUser} from "../../utilities/users";
import send from "../../media/send.svg";
import {useEffect, useState} from "react";
import {getCommentiPlaylist, getCommunity, updateCommunity} from "../../utilities/communities";
import {CommentoCard} from "../../Components/CommentoCard";
import {toast} from "react-toastify";


export const Commenti = () => {
    const {idPlaylist, idCommunity} = useParams()
    const [community] = useSearchParams()

    const [testoCommento, setTestoCommento] = useState("")
    const [testoErrore, setTestoErrore] = useState("")

    const [commenti, setCommenti] = useState([])

    const loggedUser = getLoggedUser()

    const update = () => {
        setCommenti(getCommentiPlaylist(idCommunity, idPlaylist))
    }

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

    /* Generazione ID Univoco: basato su timestamp e numero casuale */
    function generateId() {
        return Date.now() + '-' + Math.floor(Math.random() * 10000);
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

            playlist.commenti.push({
                idCommento: generateId(),
                testo: testoCommento,
                data: getData(),
                autore: loggedUser.idUtente
            })

            community.playlistCondivise = [...community.playlistCondivise.filter(item => item.idPlaylist !== idPlaylist), playlist]

            updateCommunity(community)

            setTestoCommento("")

            update()

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

    // Funzione di supporto per convertire "gg-mm-aaaa" in Date
    function parseDate(str) {
        const [giorno, mese, anno] = str.split('-').map(Number);
        return new Date(anno, mese - 1, giorno); // mese parte da 0
    }

    useEffect(() => {
        const dati = getCommentiPlaylist(idCommunity, idPlaylist)

        // Ordinamento dal più vecchio al più recente
        dati.sort((a, b) => parseDate(b.data) - parseDate(a.data));

        setCommenti(dati)

    }, [idCommunity, idPlaylist])

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Commenti: {community.get("idCommunity")}
            </h1>

            <div className={"d-flex flex-column align-items-center gap-5"}>
                <div className={"card comment-bg w-75 h-50"}>
                    <div className={"card-body d-flex flex-column gap-3"}>
                        <div className={"d-flex"}>
                            <div className={"d-flex align-items-center"}>
                                <div className={"text-decoration-none mx-auto "} onClick={() => {
                                }}>
                                    <div className={"avatar"}>{getLetter(loggedUser.idUtente)}</div>
                                </div>
                                <div className={"ms-3 text-white"}>
                                    <h4 className={"m-0"}>{loggedUser.username}</h4>
                                    <p className={"fs-5 m-0"}>{getData()}</p>
                                </div>

                            </div>
                        </div>
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
                                <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                                    <span className={(testoCommento.length < 10 || testoCommento.length > 150) ? " text-danger " : "text-secondary"}>{testoCommento.length}/{150}</span>
                                </div>
                                <div className="invalid-feedback">{testoErrore}</div>
                            </div>
                            <div className={"d-flex w-100 justify-content-end mt-3"}>
                                <button type={"button"} className={"btn btn-primary  col-1"} onClick={handleSubmit}><img src={send}/></button>
                            </div>
                        </form>
                    </div>
                </div>

                <hr className={"w-100"}/>

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