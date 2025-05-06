import ArtistSelector from "../../Components/ArtistSelector";
import {useState} from "react";
import {getToken} from "../../utilities/getToken";
import {useNavigate} from "react-router-dom";
import {getUsers, setUsers, users} from "../../utilities/users";
import {recuperaGeneri} from "../../utilities/recuperaGeneri";
import GenericSelector from "../../Components/GenericSelector";

export default function CreaCommunity() {
    /* Functional Vars */
    const navigate = useNavigate();

    /* Dati Form */
    const [titolo, setTitolo] = useState("");

    const [descrizione, setDescrizione] = useState("");


    /* Dati Errori Form */
    const [titoloError, setTitoloError] = useState("");
    const [descrizioneError, setDescrizioneError] = useState("");


    /* Handle Functions
    const handleSubmit = () => {

        const existingUsers = getUsers()

        /* Controlli Form
        const emailInput = document.getElementById("email");
        const userInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        emailInput.classList.remove("is-invalid")
        userInput.classList.remove("is-invalid")
        passwordInput.classList.remove("is-invalid")

        /* Controllo Email
        let hasError = false

        //Controllo Formato Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailInput.classList.add("is-invalid")
            setEmailError("Email non Valida")
            hasError = true;
        }

        //Controllo Unicità Email
        if (existingUsers?.some(item => (item.email === email))) {
            //Avviene errore:
            emailInput.classList.add("is-invalid")
            setEmailError("Email già collegata ad un Account Esistente")
            hasError = true;
        }


        /* Controllo Username

        //Controllo Unicità Username
        if (existingUsers?.some(item => (item.username === username))) {
            //Avviene errore:
            userInput.classList.add("is-invalid")
            setUserError("Username già in uso")
            hasError = true;
        }

        /* Controllo Password

        //Regex che accetta solo lettere, numeri e caratteri speciali comuni
        const validCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        //Controllo lunghezza password
        if (password.length < 8) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password deve essere lunga almeno 8 caratteri")
            hasError = true;
        }


        //Controllo Password Diverse
        if (password !== ripetiPassword) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password non Uguali")
            hasError = true;
        }

        //Controllo Password Valida
        if (!validCharactersRegex.test(password)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password può contenere solo lettere, numeri e caratteri speciali")
            hasError = true;
        }

        //Controllo Struttura Password Valida
        if (!uppercaseRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password deve contenere almeno una lettera maiuscola, un numero e un carattere speciale")
            hasError = true;
        }


        /* Creazione Utente con Dati Sicuri
        if (hasError) return

        //Si attenodno tutti i dati sull'utente
        recuperaGeneri(artistiPreferiti).then(generi => {

            const profilo = {
                email: email,
                username: username,
                password: password, //... -> spacchetta array
                cantantiPreferiti: [...artistiPreferiti],
                generiPreferiti: [...generi],
                playlistProprie: [],
                playlistSalvate: [],
                communities: []
            }

            /* Salvataggio dati Utenti in LocalStorage

            if (existingUsers) setUsers([...existingUsers, profilo])
            else setUsers([profilo])

            navigate("/login")
        })
    }
    */

    const handleAnnulla = () => {
        navigate(-1)
    }

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Crea la Tua Community
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
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black ">
                            <input type="text" className="form-control" id="titolo"
                                   required={true}
                                   placeholder="Titolo"
                                   onChange={(e) => {
                                       setTitolo(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Titolo</label>
                            <div className="invalid-feedback">{titoloError}</div>
                        </div>

                    </div>
                    <div className={"col-5"}>
                    </div>
                </div>

                {/*Riga per Descrizione*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className={"col-5"}>
                        <div className="form-floating">
                            <textarea className="form-control" placeholder="Scrivi una Descrizione"
                                      id="floatingTextarea2"
                                      style={{height: 100}}
                                      required={true}
                                      maxLength={250}
                                      onChange={(e) => {
                                          setDescrizione(e.target.value)
                                          e.target.classList.remove("is-invalid")
                                      }}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Descrizione</label>
                            <div className="invalid-feedback">{titoloError}</div>
                        </div>

                    </div>
                    <div className={"col-5"}>
                    </div>
                </div>


                {/*Riga per Select Artisti*/}
                <h3 className={"mt-5"}>
                    Tags
                </h3>

                <GenericSelector/>

                {/*TODO: handleSubmit*/}
                <input type={"button"} value="Crea Community" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={() => {
                       }}/>

                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={handleAnnulla}/>
            </form>
        </div>
    )
};