import TagDisplayer from "./TagDisplayer";
import {getLoggedUser, getUsers, setUsers} from "../utilities/users";
import {useState} from "react";
import {setCommunities} from "../utilities/communities";
import {toast} from "react-toastify";

export default function CommunityCard({community}) {        // scheda di una community a cui un utente può unirsi.
    const loggedUser = getLoggedUser()

    const [isUnito, setIsUnito] = useState(false);

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

    return (
        <div className={"card mt-5 bg-primary text-white w-75 m-auto shadow"}>
            <div className={"card-body p-5"}>
                <div className={"row flex-row align-items-center"}>
                    <h2 className={"col"}>
                        {community.titolo}
                    </h2>
                    <button className={"col-2 btn btn-primary text-uppercase"}
                        onClick={handleUnisciti}
                            disabled={isUnito}
                    >
                        {isUnito? "iscritto" : "unisciti"}
                    </button>
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