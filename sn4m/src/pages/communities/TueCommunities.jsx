import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CommunityCard from "../../Components/CommunityCard";
import {getCommunities, setCommunities} from "../../utilities/communities";
import {getLoggedUser, getUserCommunities} from "../../utilities/users";

export default function TueCommunities() {
    const navigate = useNavigate();

    const [isTue, setIsTue] = useState(false);          //Stato che indica se mostrare le communities create dall'utente (true) o quelle a cui è iscritto (false)

    const [communities, setCommunities] = useState(getUserCommunities()? getUserCommunities() : []);       //stato che contiene tutte le communities relative all'utente, recuperate dal localStorage e se non ci sono communities è un array vuoto

    const [visualizzaCommunities, setVisualizzaCommunities] = useState([]);         //stato che contiene le communities filtrate da mostrare all'utente, in base al filtro isTue

    const loggedUser = getLoggedUser()

    //funzione che aggiorna lo stato delle communities recuperandole di nuovo
    const update = () => {
        setCommunities(getUserCommunities())
    }

    /*Effetto che si attiva quando cambiano 'communities' o 'isTue': viene applicato il filtro:
     - se isTue = false => mostra communities a cui l'utente è iscritto ma NON create da lui
     - se isTue = true => mostra solo le communities create dall'utente*/
    useEffect(() => {

        /* Applico Filtro se è selezionato "Sei Iscritto" */
        if (!isTue) {
            setVisualizzaCommunities(communities.filter(community => (community.autore !== loggedUser.email)));
        } else {
            /*Mostra tutte le community non create né seguite dall’utente, senza filtro di corrispondenza. */
            setVisualizzaCommunities(communities.filter(community => (community.autore === loggedUser.email)));
        }
    }, [communities, isTue])

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
                <SearchBar/>
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