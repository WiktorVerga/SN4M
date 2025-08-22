import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CommunityCard from "../../Components/CommunityCard";
import {cleanCommunities} from "../../utilities/communities";
import {cleanSubscribedCommunities, getLoggedUser, getUserCommunities} from "../../utilities/users";

export default function TueCommunities() {
    const navigate = useNavigate();

    const [isTue, setIsTue] = useState(true);          //Stato che indica se mostrare le communities create dall'utente (true) o quelle a cui è iscritto (false)

    const [communities, setCommunities] = useState(getUserCommunities()? getUserCommunities() : []);       //stato che contiene tutte le communities relative all'utente, recuperate dal localStorage e se non ci sono communities è un array vuoto

    const [visualizzaCommunities, setVisualizzaCommunities] = useState([]);      //stato che contiene le communities filtrate da mostrare all'utente, in base al filtro isTue

    const [defaultData, setDefaultData] = useState([]);

    const loggedUser = getLoggedUser()      //ottiene utente loggato

    //funzione che aggiorna lo stato delle communities recuperandole di nuovo
    const update = () => {
        setCommunities(getUserCommunities())
    }

    /*Effetto che si attiva quando cambiano 'communities' o 'isTue': viene applicato il filtro:
     - se isTue = false => mostra communities a cui l'utente è iscritto ma NON create da lui
     - se isTue = true => mostra solo le communities create dall'utente*/
    const setDefaultCommunities = () => {
        cleanCommunities()
        cleanSubscribedCommunities()

        /* Applico Filtro se è selezionato "Sei Iscritto" */
        if (!isTue) {
            setDefaultData(communities.filter(community => (community.autore !== loggedUser.idUtente)));
        } else {
            /*Mostra tutte le community non create né seguite dall’utente, senza filtro di corrispondenza. */
            setDefaultData(communities.filter(community => (community.autore === loggedUser.idUtente)));
        }
    }

    useEffect(() => {
        setDefaultCommunities()
    }, [communities, isTue])

    /* Setup per Ricerca*/

    //Imposta la lista di elementi senza filtri
    useEffect(() => {
        setVisualizzaCommunities(defaultData)
    }, [defaultData]);

    //Recupera il Termine di Ricerca dalla SearchBar
    const [search, setSearch] = useState("");
    const sendSearch = (searchTerm) => {
        setSearch(searchTerm);
    }

    //Al momento della modifica del termine di ricerca avviene la ricerca e dunque l'applicazione dei filtri
    useEffect(() => {
        if (search !== "") {
            setVisualizzaCommunities(defaultData.filter(community => (
                community.titolo.toLowerCase().includes(search)
                || community.tags.some(tag => tag.toLowerCase().includes(search))
            )));
        } else {
            setDefaultCommunities()
        }
    }, [search]);

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                COMMUNITIES
            </h1>
            {/* Intestazione Dinamica con Pulsante Filtro */}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {isTue? "Le Tue Communities": "Communities a cui Sei Iscritto"}
                </h3>
                <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => setIsTue(!isTue)}>{isTue? "vedi iscrizioni" : "vedi le tue"}</button>
            </div>
            {/* SearchBar */}
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar sendSearch={sendSearch}/>
            </div>
            {visualizzaCommunities.length === 0?
                <>
                    {/*Nessuna community trovata*/}
                    <div className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"} style={{height: "50vh"}}>
                        <h3 className={"mb-5"}>
                            {isTue?
                                <>
                                    Non ho trovato Nulla!<br/>
                                    Inizia a Creare
                                </>
                            :
                                <>
                                    Non ho trovato Nulla!<br/>
                                    Esplora le Communities
                                </>
                            }
                        </h3>
                        {isTue?
                            <FloatingAddBtn navigateTo={"/creaCommunity"} dim={5}/>
                            :
                            <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => navigate("/esplora")}>Esplora Communities</button>
                        }
                    </div>
                </> : <>
                    {/* Mostra le EsploraCommunities */}
                    <div className={"d-flex flex-column justify-content-center mt-5"}>
                    {visualizzaCommunities.map((community, index) => (
                        <CommunityCard
                            key={index}
                            community={community}
                            esplora={false}
                            update={update}
                        />
                    ))
                    }
                </div>
                    <div className={"floating-btn-div"}>
                        <FloatingAddBtn navigateTo={"/creaCommunity"}
                        dim={4}/>
                    </div>
                </>}
        </div>
    )
}