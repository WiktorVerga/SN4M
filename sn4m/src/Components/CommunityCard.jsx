import TagDisplayer from "./TagDisplayer";
import {getLoggedUser, getUsers, setUsers, updateUser} from "../utilities/users";
import {useEffect, useState} from "react";
import {setCommunities} from "../utilities/communities";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function CommunityCard({community, esplora, update}) {        // scheda di una community a cui un utente può unirsi.
    const loggedUser = getLoggedUser()

    const navigate = useNavigate();

    const [isUnito, setIsUnito] = useState(false);
    const [isTua, setIsTua] = useState(false);


    const handleUnisciti = () => {
        if (loggedUser && !isUnito) {
            const existingUsers = getUsers()
            const users = existingUsers?.filter(item => item.email !== loggedUser.email)
            loggedUser.communities.push(community.idCommunity)
            setUsers([...users, loggedUser])
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

    const handleAbbandona = () => {
        const communitiesAggiornate = loggedUser.communities.filter(item => item !== community.idCommunity)

        const utenteAggiornato = {
            ...loggedUser,
            communities: communitiesAggiornate
        }

        updateUser(utenteAggiornato)

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

    const handleModifica = () => {
        navigate("/modificaCommunity?idCommunity=" + community.idCommunity)
    }

    useEffect(() => {
        setIsTua(community.autore === loggedUser.email);
    }, [community]);


    return (
        <div className={"card mt-5 bg-primary text-white w-75 m-auto shadow"}>
            <div className={"card-body p-5"}>
                <div className={"row flex-row align-items-center"}>
                    <h2 className={"col"}>
                        {community.titolo}
                    </h2>
                    {esplora? <button className={"col-2 btn btn-primary text-uppercase"}
                             onClick={handleUnisciti}
                             disabled={isUnito}
                    >
                        {isUnito ? "iscritto" : "unisciti"}
                    </button> :
                        <button className={"col-2 btn btn-primary text-uppercase"}
                                onClick={isTua? handleModifica : handleAbbandona}
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
                />
            </div>
        </div>
    )
}