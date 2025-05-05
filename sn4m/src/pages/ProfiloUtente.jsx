import TagSelector from "../Components/TagSelector";
import {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import TagDisplayer from "../Components/TagDisplayer";
import {getUser} from "../utilities/users";
import {useNavigate} from "react-router-dom";


export default function ProfiloUtente() {

    /* Functional Vars */
    const navigate = useNavigate();

    const [utenteLoggato, setUtenteLoggato] = useState({})

    const [initialArtisti, setInizialeArtisti] = useState([])

    const [artistiPreferiti, setArtistiPreferiti] = useState([])
    const riceviNuoviArtisti = (array) => {
        setArtistiPreferiti(array);
    }

    const [generiPreferiti, setGeneriPreferiti] = useState([]);


    const [newUsername, setNewUsername] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConf, setNewPasswordConf] = useState("");

    /*Visibilità inseirmento nuovo utente */
    const [showNewUser, setShowNewUser] = useState(false);

    const handleBtnModificaUserClick = () => {
        setShowNewUser(true);

    };

    /*Visibilità inserimento nuova password*/
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleBtnModificaPasswordClick = () => {
        setShowNewPassword(true);
    };

    /*Dati errori Form*/
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("")

    /*handleFunction Username*/
    const handleSaveUsername = () => {

        const existingUsers = JSON.parse(localStorage.getItem("utenti"))

        /* Controlli Form */
        const userInput = document.getElementById("newUsername");

        userInput.classList.remove("is-invalid")

        /* Controllo Username */

        //Controllo Unicità Username
        if (existingUsers?.some(item => (item.username === newUsername))) {
            //Avviene errore:
            userInput.classList.add("is-invalid")
            setUserError("Username già in uso")
        }

    }

    /*HandleFunction Password*/

    function handleSavePassword() {
        /* Controlli Form */
        const passwordInput = document.getElementById("newPassword");


        //Regex che accetta solo lettere, numeri e caratteri speciali comuni
           const validCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
           const uppercaseRegex = /[A-Z]/;
           const numberRegex = /[0-9]/;
           const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            //Controllo lunghezza password
            if (newPassword.length<8){
                //Avviene errore:
                passwordInput.classList.add("is-invalid")
                setPasswordError("Password deve essere lunga almeno 8 caratteri")
            }

           //Controllo Password Diverse
           if (newPassword !== newPasswordConf) {
               //Avviene errore:
               passwordInput.classList.add("is-invalid")
               setPasswordError("Password non Uguali")
           }

           //Controllo Password Valida
           if (!validCharactersRegex.test(newPassword)) {
               //Avviene errore:
               passwordInput.classList.add("is-invalid")
               setPasswordError("Password può contenere solo lettere, numeri e caratteri speciali")
           }

           //Controllo Struttura Password Valida
           if (!uppercaseRegex.test(newPassword) || !numberRegex.test(newPassword) || !specialCharRegex.test(newPassword)) {
               //Avviene errore:
               passwordInput.classList.add("is-invalid")
               setPasswordError("Password deve contenere almeno una lettera maiuscola, un numero e un carattere speciale")
           }
       }

    const handleDelete = (elem) => {
        setGeneriPreferiti(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }
    const handleSubmit = () => {
        handleSaveUsername();
        handleSavePassword();
    }

    useEffect(() => {

        /* Recupero dati utente dal localStorage */
        const loginSession = JSON.parse(sessionStorage.getItem("loginSession"))

        const utenteLogged = getUser(loginSession.user)

        setUtenteLoggato(utenteLogged);

        setGeneriPreferiti(utenteLogged.generiPreferiti);
        setInizialeArtisti(utenteLogged.cantantiPreferiti);

    }, []);

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Profilo Utente
            </h1>
            <h2 className={"text-capitalize"}>
                Ciao, {utenteLoggato.username}
            </h2>
            <h4>
                Informazioni Sul Profilo
            </h4>

            <form
                name={"profiloUtente"}
                className={"mt-5"}
            >

                {/*Riga User e Nuovo User*/}
                <div className={"row flex-row justify-content-between align-items-center"}>
                    {/* Primo gruppo: Username + bottone modifica */}
                    <div className="col-5 d-flex align-items-center">
                        <div className="form-floating flex-grow-1 me-2">
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                autoComplete="off"
                                required={true}
                                value={utenteLoggato.username}
                                readOnly={true}
                                placeholder="Username" // necessario per form-floating
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={handleBtnModificaUserClick}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuovo username + bottone salva */}
                    {showNewUser && (
                        <div className="col-5 d-flex align-items-center justify-content-end">
                            <div className="form-floating flex-grow-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newUsername"
                                    autoComplete="off"
                                    required={true}
                                    placeholder="Nuovo username"
                                    onChange={(e) => {
                                        setNewUsername(e.target.value);
                                        e.target.classList.remove("is-invalid");
                                    }}
                                />
                                <label htmlFor="newUsername">Nuovo Username</label>
                                <div className="invalid-feedback">{userError}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/*Riga Password e Nuova Password*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    {/* Primo gruppo: Password + bottone modifica */}
                    <div className="col-5 d-flex">
                        <div className="form-floating flex-grow-1 me-2">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                autoComplete="off"
                                required={true}
                                value={utenteLoggato.password}
                                readOnly={true}
                                placeholder="Password" // necessario per form-floating
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: 'calc(3.5rem + 2px)'}}
                            onClick={handleBtnModificaPasswordClick}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuova password + bottone salva */}
                    {showNewPassword && (
                        <div className="col-5">
                            <div className={"row"}>
                                <div>
                                    <div className="form-floating flex-grow-1">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            autoComplete="off"
                                            required={true}
                                            placeholder="Nuova Password"
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                e.target.classList.remove("is-invalid");
                                            }}
                                        />
                                        <label htmlFor="newPassword">Nuova Password</label>
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex align-items-center justify-content-end">
                                    <div className="form-floating flex-grow-1">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPasswordConf"
                                            autoComplete="off"
                                            required={true}
                                            placeholder="Ripeti Password"
                                            onChange={(e) => {
                                                setNewPasswordConf(e.target.value);
                                                e.target.classList.remove("is-invalid");
                                            }}
                                        />
                                        <label htmlFor="newPasswordConf">Ripeti Password</label>
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/*Riga Generi Displayer*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className="col-5 d-flex flex-column">
                        <label className={"m-1"}>Generi Preferiti</label>
                        <TagDisplayer
                            tags={generiPreferiti}
                            emsg={"Nessun Genere Presente"}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>

                {/*Riga Artisti Selector*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <TagSelector
                        label={"Artisti Preferiti"}
                        placeholder={"Cerca artisti preferiti"}
                        floatingLabel={"Cerca Artisti"}
                        optionTitle={"Artisti"}
                        returnData={riceviNuoviArtisti}
                        type={"artist"}
                        initialState={initialArtisti}
                    />
                </div>

                <input type={"button"} value="Salva Modifiche" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={handleSubmit}
                />
                <input type={"button"} value="Annulla"
                       className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                       onClick={() => navigate(-1)}
                />

            </form>
        </div>
    )
}