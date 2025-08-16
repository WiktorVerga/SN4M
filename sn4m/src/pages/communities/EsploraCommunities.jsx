import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CommunityCard from "../../Components/CommunityCard";
import {getCommunities, setCommunities} from "../../utilities/communities";
import {getLoggedUser} from "../../utilities/users";

export default function EsploraCommunities() {
    const navigate = useNavigate();

    const [isTutte, setIsTutte] = useState(false);      //flag per visualizzare tutte le communities oppure solo quelle suggerite

    const [communities, setCommunities] = useState(getCommunities()? getCommunities() : []);        //tutte le communities salvate nel localStorage o array vuoto

    const [visualizzaCommunities, setVisualizzaCommunities] = useState([]);         //stato che conterrà la lista di community filtrate da mostrare a schermo

    const [defaultData, setDefaultData] = useState([]);                      //stato con i dati originali delle community (senza filtri)

    const loggedUser = getLoggedUser()          //recupera utente loggato

    const setDefaultCommunities = () => {
        /* Applico Filtro se è selezionato "Suggerite" */
        if (!isTutte) {

            /* Algoritmo di verifica di Correlazione con Profilo Utente: verifica la correlazione tra i tag della community e i tag cantanti preferiti dell’utente.
                Soglia: almeno il 55% dei tag dell’utente devono combaciare.
                Esclude: community create dall’utente stesso e community a cui l’utente partecipa già */
            const verifyValidity = (community) => {

                if (loggedUser) {
                    const numTagsUser = loggedUser.cantantiPreferiti.length
                    const numMinCorr = Math.round(numTagsUser/100*55);

                    let numCorr = 0
                    for (let i = 0; i < community.tags.length; i++) {
                        if (loggedUser.cantantiPreferiti.includes(community.tags[i])) numCorr++
                    }

                    return numCorr >= numMinCorr
                }

            }
            setDefaultData(communities.filter(community => (verifyValidity(community) && community.autore !== loggedUser.idUtente && !loggedUser.communities.includes(community.idCommunity))));
        } else {
            /*Mostra tutte le community non create né seguite dall’utente, senza filtro di corrispondenza. */
            setDefaultData(communities.filter(community => (community.autore !== loggedUser.idUtente && !loggedUser.communities.includes(community.idCommunity))));
        }
    }

    useEffect(() => {
        //aggiorna lo stato delle community mostrate ogni volta che cambiano i dati di default
        setDefaultCommunities()
    }, [communities, isTutte])

    /* Setup per Ricerca*/

    //Imposta la lista di elementi senza filtri
    useEffect(() => {
        //reimposta lo stato delle community a quello originale
        setVisualizzaCommunities(defaultData)
    }, [defaultData]);

    //Recupera il Termine di Ricerca dalla SearchBar
    const [search, setSearch] = useState("");               //stato per il termine di ricerca
    const sendSearch = (searchTerm) => {
        //aggiorna il termine di ricerca quando la SearchBar invia un valore
        setSearch(searchTerm);
    }

    //Al momento della modifica del termine di ricerca avviene la ricerca e dunque l'applicazione dei filtri
    useEffect(() => {
        // Aggiorna il termine di ricerca quando la SearchBar invia un valore
        if (search !== "") {
            setVisualizzaCommunities(defaultData.filter(community => (
                community.titolo.toLowerCase().includes(search) || community.tags.some(tag => tag.toLowerCase().includes(search))
            )));
        } else {
            //se non c’è ricerca → mostra tutto
            setDefaultCommunities()
        }
    }, [search]);               //si attiva ogni volta che cambia "search"

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Esplora COMMUNITIES
            </h1>

            {/* Intestazione Dinamica con Pulsante Filtro */}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {isTutte? "Scopri Tutte le Communities": "Scopri le Communities Per Te!"}
                </h3>
                <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => setIsTutte(!isTutte)}>{isTutte? "scopri suggerite" : "scopri tutte"}</button>
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
                            Non ho trovato Nulla!<br/>
                            Inizia a Creare
                        </h3>
                        <FloatingAddBtn navigateTo={"/creaCommunity"}
                        dim={5}/>
                    </div>
                </> : <>
                    {/* Mostra le EsploraCommunities */}
                    <div className={"d-flex flex-column justify-content-center mt-5"}>
                    {visualizzaCommunities.map((communiity, index) => (
                        <CommunityCard
                            key={index}
                            community={communiity}
                            esplora={true}
                        />
                    ))
                    }
                </div>
                    {/* Floating Button per creare community */}
                    <div className={"floating-btn-div"}>
                        <FloatingAddBtn navigateTo={"/creaCommunity"}
                        dim={4}/>
                    </div>
                </>}
        </div>
    )
}