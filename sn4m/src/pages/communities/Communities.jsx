import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";

export default function Communities() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Esplora COMMUNITIES
            </h1>
            <h3>
                Scopri Tutte le Communities
            </h3>
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar/>
            </div>


            {/*Nessuna community trovata*/}
            <div className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"} style={{height: "50vh"}}>
                <h3 className={"mb-5"}>
                    Non ho trovato Nulla!<br/>
                    Inizia a Creare
                </h3>
                <FloatingAddBtn navigateTo={"/creaCommunity"}/>
            </div>
        </div>
    )
}