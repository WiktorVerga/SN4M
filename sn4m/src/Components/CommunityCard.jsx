import TagDisplayer from "./TagDisplayer";
import {getLoggedUser, getUsers, setUsers, updateUser} from "../utilities/users";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

    export default function CommunityCard({community, esplora, update}) {        // scheda di una community a cui un utente può unirsi e modificare/abbandonare
    const loggedUser = getLoggedUser()

    const navigate = useNavigate();

    const [isUnito, setIsUnito] = useState(false);              //Stato per sapere se l'utente è già unito alla community oppure deve ancora unirsi
    const [isTua, setIsTua] = useState(false);                  //Stato per sapere se la community è stata creata dall'utente loggato oppure se l'utente si è iscritto alla community


    const handleUnisciti = () => {              //funzione per unirsi alla community
        if (loggedUser && !isUnito) {
            const existingUsers = getUsers()            //ottiene tutti gli utenti registrati
            const users = existingUsers?.filter(item => item.email !== loggedUser.email)        //toglie l'utente loggato dalla lista degli utenti
            loggedUser.communities.push(community.idCommunity)      //Aggiunge l'ID della community alla lista delle community dell'utente loggato
            setUsers([...users, loggedUser])                    //aggiorna la lista degli utenti salvandola nello localStorage
            //mostra notifica di successo
            toast.success("Unito alla Community", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            })
            setIsUnito(true)
        }
    }

    const handleAbbandona = () => {             //funzione per abbandonare la community
        //rimuove la community dalla lista di quelle a cui l'utente è iscritto
        const communitiesAggiornate = loggedUser.communities.filter(item => item !== community.idCommunity)

        //crea una copia con le community aggiornate dell'utente
        const utenteAggiornato = {
            ...loggedUser,
            communities: communitiesAggiornate
        }

        updateUser(utenteAggiornato)            //aggiorna dati dell'utente nello storage

        // Chiama la funzione passata come prop per aggiornare la UI esterna
        update()

        toast.success("Uscito dalla Community", {
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

    const handleModifica = () => {              //funzione per modificare la community soltanto se l'utente loggato è il creatore
        navigate("/modificaCommunity?idCommunity=" + community.idCommunity)
    }

    //verifica se la community è stata creata dall'utente loggato
    useEffect(() => {
        setIsTua(community.autore === loggedUser.idUtente);
    }, [community]);


    return (
        <div className={esplora? "card mt-5 community-card-bg text-white w-75 m-auto shadow text-decoration-none " : "card mt-5 community-card-bg text-white w-75 m-auto shadow text-decoration-none cursor-pointer"}
            onClick={() => {!esplora && navigate(`/communities/${community.idCommunity}`)}}
        >
            <div className={"card-body p-5"}>
                <div className={"row flex-row align-items-center"}>
                    <h2 className={"col text-capitalize"}>
                        {community.titolo}
                    </h2>
                    {/* Pulsante che cambia in base alla modalità:
                        - Se 'esplora' è true: mostra "Unisciti" e appena l'utente si unisce iscritto
                        - Altrimenti: mostra "Modifica" se propria, oppure "Esci" */}

                    {esplora? <button className={"col-2 btn btn-primary text-uppercase  z-2"}
                             onClick={(e) => {
                                 e.preventDefault(); // blocca la navigazione del Link
                                 e.stopPropagation(); // blocca il click sul Link
                                 handleUnisciti()
                             }}
                             disabled={isUnito}
                    >
                        {isUnito ? "iscritto" : "unisciti"}
                    </button> :
                        <button className={"col-2 btn btn-primary text-uppercase"}
                                onClick={isTua? (e) => {
                                    e.preventDefault(); // blocca la navigazione del Link
                                    e.stopPropagation(); // blocca il click sul Link
                                    handleModifica()
                                } : (e) => {
                                    e.preventDefault(); // blocca la navigazione del Link
                                    e.stopPropagation(); // blocca il click sul Link
                                    handleAbbandona()
                                }}
                        >
                            {isTua ? <i className="bi bi-pencil"></i> : "esci"}
                        </button>
                    }
                </div>
                <div className={"row"}>
                    <p className={"w-50"}>
                        {community.descrizione}
                    </p>
                </div>
                <TagDisplayer
                    tags={community.tags}
                    withDelete={false}
                    clear={true}
                />
            </div>
        </div>
    )
}