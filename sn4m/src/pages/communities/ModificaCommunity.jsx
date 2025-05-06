import ArtistSelector from "../../Components/ArtistSelector";
import {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import TagDisplayer from "../../Components/TagDisplayer";
import {getLoggedUser, getUser, getUsers, setUsers} from "../../utilities/users";
import {useNavigate} from "react-router-dom";
import {recuperaGeneri} from "../../utilities/recuperaGeneri";
import GenericSelector from "../../Components/GenericSelector";


export default function ModificaCommunity() {

    /* Functional Vars */
    const navigate = useNavigate();

    const [showNewTitolo, setShowNewTitolo] = useState(false);
    const [showNewDescrizione, setShowNewDescrione] = useState(false);

    /* Dati Form */
    const [titolo, setTitolo] = useState("");

    const [descrizione, setDescrizione] = useState("");


    /* Dati Errori Form */
    const [titoloError, setTitoloError] = useState("");
    const [descrizioneError, setDescrizioneError] = useState("");


    const handleDeleteCommunity = () => {
        const validate = prompt("Digita: ELIMINA")

        if (validate === "ELIMINA") {
            //TODO: Elimina community dal LS
            navigate("/")
        }
    }

    const handleAnnulla = () => {
        navigate(-1)
    }

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Modifica la Tua Community
            </h1>
            <h3>
                Informazioni sulla Community
            </h3>

            <form
                name={"signin"}
                className={"mt-5"}
                autoComplete={"off"}
            >

                {/*Riga user e Titolo*/}
                <div className={"row flex-row justify-content-between"}>

                    {/*Primo Gruppo: Titolo + Bottone Modifica */}
                    <div className={"col-5 d-flex align-items-center"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <input type="text" className="form-control" id="titolo"
                                   placeholder="Titolo"
                                   readOnly={true}
                                   value={"titolo momentaneo"}
                            />
                            <label htmlFor="floatingInput">Titolo</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={() => {setShowNewTitolo(true)}}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/*Secondo Gruppo: Nuovo Titolo */}
                    {showNewTitolo && <div className={"col-5 d-flex align-items-center"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <input type="text" className="form-control" id="titolo"
                                   required={true}
                                   placeholder="Titolo"
                                   onChange={(e) => {
                                       setTitolo(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Nuovo Titolo</label>
                            <div className="invalid-feedback">{titoloError}</div>
                        </div>
                    </div>}
                </div>

                {/*Riga per Descrizione*/}
                <div className={"row flex-row justify-content-between mt-5"}>

                    {/*Primo Gruppo: Descrizione + Bottone Modifica */}
                    <div className={"col-5 d-flex"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <textarea className="form-control" placeholder="Scrivi una Descrizione"
                                      id="floatingTextarea2"
                                      style={{height: 100}}
                                      readOnly={true}
                                      value={"Lorem Ipsum"}
                                      maxLength={250}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Descrizione</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={() => {setShowNewDescrione(true)}}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/*Secondo Gruppo: Nuova Descrizione */}
                    {showNewDescrizione && <div className={"col-5 d-flex"}>
                        <div className="form-floating flex-grow-1 me-2">
                            <textarea className="form-control" placeholder="Scrivi una Nuova Descrizione"
                                      id="floatingTextarea2"
                                      style={{height: 100}}
                                      required={true}
                                      maxLength={250}
                                      onChange={(e) => {
                                          setDescrizione(e.target.value)
                                          e.target.classList.remove("is-invalid")
                                      }}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Nuova Descrizione</label>
                            <div className="invalid-feedback">{descrizioneError}</div>
                        </div>
                    </div>}
                </div>


                {/*Riga per Select Artisti*/}
                <h3 className={"mt-5"}>
                    Tags
                </h3>

                <GenericSelector/>

                {/*TODO: handleSubmit*/}
                <input type={"button"} value="Salva Modifiche" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={() => {
                       }}/>

                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={handleAnnulla}/>
            </form>

            <h4 className={"spacer text-danger fw-bold"}>
                Elimina Community
            </h4>
            <button className={"btn btn-danger mt-3 mb-5 text-uppercase"}
                    onClick={handleDeleteCommunity}
            >
                Elimina Community
            </button>
        </div>
    )
}