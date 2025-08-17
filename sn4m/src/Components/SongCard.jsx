import add from "../media/add-song.svg"
import remove from "../media/rem-song.svg"

export const SongCard = ({song, isProprietaria, esplora}) => {

    return (
        <div className={"card song-card-bg text-decoration-none w-100"}>
            <div className={"card-body d-flex gap-3 align-items-center justify-content-between"}>
                {/* Sezione sinistra: immagine della canzone + titolo e artista */}
                <div className={"d-flex align-items-center gap-5"}>
                    {/* Immagine della copertina: se non disponibile, usa un placeholder */}
                    <img className={"bg-black rounded-4"} style={{height: 100, width: 100}}
                         src={song.img.url ? song.img.url : "https://placehold.co/100x100"} alt={"copertina canzone"}/>
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
                        <button className={"bottone-canzone"}>
                            {esplora ? <img src={add}/> : <img src={remove}/>}
                        </button>
                    }
                </div>

            </div>
        </div>
    )
}