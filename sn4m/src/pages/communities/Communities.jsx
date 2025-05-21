import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import CommunityCard from "../../Components/CommunityCard";
import {getCommunities, setCommunities} from "../../utilities/communities";

export default function Communities() {
    const navigate = useNavigate();

    const [isTutte, setIsTutte] = useState(false);

    const [communities, setCommunities] = useState(getCommunities()? getCommunities() : []);



    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Esplora COMMUNITIES
            </h1>

            {/* Intestazione Dinamica con Pulsante Filtro */}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {isTutte? "Scopri Tutte le Communities": "Scopri Communities Per Te!"}
                </h3>
                <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => setIsTutte(!isTutte)}>{isTutte? "scopri suggerite" : "scopri tutte"}</button>
            </div>

            {/* SearchBar */}
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar/>
            </div>


            {communities.length === 0?
                <>
                    {/*Nessuna community trovata*/}
                    <div className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"} style={{height: "50vh"}}>
                        <h3 className={"mb-5"}>
                            Non ho trovato Nulla!<br/>
                            Inizia a Creare
                        </h3>
                        <FloatingAddBtn navigateTo={"/creaCommunity"}/>
                    </div>
                </> : <>
                    {/* Mostra le Communities */}
                    <div className={"d-flex flex-column justify-content-center mt-5"}>
                    {communities.map((communiity, index) => (
                        <CommunityCard
                            key={index}
                            commmunity={communiity}
                        />
                    ))

                    }
                </div>
                </>}
        </div>
    )
}