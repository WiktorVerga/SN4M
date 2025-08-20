import SearchBar from "../../Components/SearchBar";
import {SongCard} from "../../Components/SongCard";
import {useEffect, useState} from "react";
import {searchSong} from "../../utilities/songs";
import {useParams} from "react-router-dom";
import {getPlaylist} from "../../utilities/playlists";

export default function AddSongs() {

    const {id} = useParams();       //ottiene l'id della playlist dai parametri URL
    const [canzoni, setCanzoni] = useState([]);     //stato per le canzoni risultanti dalla ricerca

    /* Recupera il Termine di Ricerca dalla SearchBar */
    const [search, setSearch] = useState("");       //stato per il termine di ricerca inserito dall'utente
    //Funzione passata alla SearchBar per aggiornare lo stato di ricerca
    const sendSearch = (searchTerm) => {
        setSearch(searchTerm);
    }

    //Al momento della modifica del termine di ricerca avviene la ricerca e dunque l'applicazione dei filtri
    useEffect(() => {
        if (search !== "") {
            searchSong(search).then(dati => {
                //filtra le canzoni già presenti nella playlist
                const canzoniFiltrate = dati.filter(canzone => !getPlaylist(id).canzoni.some(canzonePlaylist => canzonePlaylist === canzone.idCanzone));
                setCanzoni(canzoniFiltrate);
            })
        }
    }, [search]);

    return (
        <div className={"d-flex flex-column align-items-center my-5"}>
            {/* Titolo della pagina */}
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Aggiungi Canzoni
            </h1>
            {/* Barra di ricerca */}
            <SearchBar sendSearch={sendSearch} />
            {/* Se non c'è ricerca, mostra messaggio*/}
            {search === "" ? (
                    <div className={"my-5 vh-100"}>
                        <h3 className={"text-capitalize"}>Inizia a cercare per aggiungere canzoni</h3>
                    </div>
                )
                :
                <div className={"w-100"}>
                    {/*Se ci sono risultati di ricerca, mostra le SongCard*/}
                    <div className={"d-flex flex-column gap-5 justify-content-center mt-5"}>
                        {canzoni.map((canzone, index) => (
                            <SongCard
                                key={index}
                                song={canzone}
                                isProprietaria={true}
                                aggiungi={true}
                            />
                        ))
                        }
                    </div>
                </div>
                }
        </div>
    )
}