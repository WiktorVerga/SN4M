import SearchBar from "../../Components/SearchBar";
import {SongCard} from "../../Components/SongCard";
import {useEffect, useState} from "react";
import {searchSong} from "../../utilities/songs";
import {useParams} from "react-router-dom";
import {getPlaylist} from "../../utilities/playlists";

export default function AddSongs() {

    const {id} = useParams();
    const [canzoni, setCanzoni] = useState([]);

    //Recupera il Termine di Ricerca dalla SearchBar
    const [search, setSearch] = useState("");
    const sendSearch = (searchTerm) => {
        setSearch(searchTerm);
    }

    //Al momento della modifica del termine di ricerca avviene la ricerca e dunque l'applicazione dei filtri
    useEffect(() => {
        if (search !== "") {
            searchSong(search).then(dati => {
                const canzoniFiltrate = dati.filter(canzone => !getPlaylist(id).canzoni.some(canzonePlaylist => canzonePlaylist === canzone.idCanzone));
                setCanzoni(canzoniFiltrate);
            })
        }
    }, [search]);

    return (
        <div className={"d-flex flex-column align-items-center my-5"}>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Aggiungi Canzoni
            </h1>
            <SearchBar sendSearch={sendSearch} />
            {search === "" ? (
                    <div className={"my-5 vh-100"}>
                        <h3 className={"text-capitalize"}>Inizia a cercare per aggiungere canzoni</h3>
                    </div>


                )
                :
                <div className={"w-100"}>
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