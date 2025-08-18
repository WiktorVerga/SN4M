import add from "../media/add-song.svg"
import remove from "../media/rem-song.svg"
import salvata from "../media/salvata.svg"
import {useState} from "react";
import {getLoggedUser} from "../utilities/users";
import {useParams} from "react-router-dom";
import {addSong, removeSong} from "../utilities/playlists";
import {toast} from "react-toastify";

export const SongCard = ({song, isProprietaria, aggiungi, update}) => {

    const {id} = useParams();

    const [aggiunta, setAggiunta] = useState(false);

    const loggedUser = getLoggedUser()

    const handleAggiungi = () => {
        if (!aggiunta) {
            addSong(id, song.idCanzone)
            setAggiunta(true);

            toast.success("Canzone Aggiunta", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })
        }
    }

    const handleRimuovi = () => {
        removeSong(id, song.idCanzone)
        toast.success("Canzone Rimossa", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
            progress: undefined,
        })

        update()
    }

    return (
        <div className={"card song-card-bg text-decoration-none w-100"}>
            <div className={"card-body d-flex gap-3 align-items-center justify-content-between"}>
                {/* Sezione sinistra: immagine della canzone + titolo e artista */}
                <div className={"d-flex align-items-center gap-5"}>
                    {/* Immagine della copertina: se non disponibile, usa un placeholder */}
                    <img className={"bg-black rounded-4"} style={{height: 100, width: 100}}
                         src={song.img.url ? song.img?.url : "https://placehold.co/100x100"} alt={"copertina canzone"}/>
                    <div className={"text-white d-flex flex-column gap-3 fs-5"}>
                        <p className={"my-auto"}>{song.titolo}</p>
                        <p className={"my-auto"}>{song.artista}</p>
                    </div>
                </div>
                {/* Sezione destra: anno pubblicazione, durata e (se proprietaria) bottone di aggiunta/rimozione */}
                <div className={"d-flex gap-3 align-items-center text-white gap-5 fs-5"}>
                    <p className={"my-auto"}>{song.anno}</p>
                    <p className={"my-auto mx-5"}>{song.durata}</p>
                    {/* Se la playlist è dell’utente → mostra pulsante (aggiungi o rimuovi a seconda di "esplora": se è true c'è aggiunge se false è rimuovi) */}
                    {isProprietaria &&
                        <button className={"bottone-canzone"}
                                onClick={aggiungi? handleAggiungi : handleRimuovi}
                        >
                            {aggiungi ? (aggiunta?<img className={"me-4"} src={salvata}/> : <img className={"me-4"} src={add}/>) : <img className={"me-4"} src={remove}/>}
                        </button>
                    }
                </div>

            </div>
        </div>
    )
}