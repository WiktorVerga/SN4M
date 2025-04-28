import TagSelector from "../Components/TagSelector";
import {useState} from "react";
import {getToken} from "../utilities/getToken";
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function ProfiloUtente(){

    /*Dati form*/
    const [newUsername, setNewUsername] = useState("");

    const passwordInput = document.getElementById("password");

    /*Dati presi dal localStorage*/
    let usernameUtente="giorgia";
    let passwordUtente="1234";

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
    /*
    function handleSavePassword() {
*/
        /* Controllo Password */


        //Regex che accetta solo lettere, numeri e caratteri speciali comuni
 /*       const validCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        //Controllo Password Diverse
        if (password !== ripetiPassword) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password non Uguali")
        }

        //Controllo Password Valida
        if (!validCharactersRegex.test(password)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password può contenere solo lettere, numeri e caratteri speciali")
        }

        //Controllo Struttura Password Valida
        if (!uppercaseRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password deve contenere almeno una lettera maiuscola, un numero e un carattere speciale")
        }
    }*/


    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Profilo Utente
            </h1>
            <h2>
                Ciao {usernameUtente}
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
                                required
                                value={usernameUtente}
                                readOnly
                                placeholder="Username" // necessario per form-floating
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ height: 'calc(3.5rem + 2px)' }}
                            onClick={handleBtnModificaUserClick}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuovo username + bottone salva */}
                    {showNewUser && (
                        <div className="col-5 d-flex align-items-center justify-content-end">
                            <div className="form-floating flex-grow-1 me-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newUsername"
                                    autoComplete="off"
                                    required
                                    placeholder="Nuovo username"
                                    onChange={(e) => {
                                        setNewUsername(e.target.value);
                                        e.target.classList.remove("is-invalid");
                                    }}
                                />
                                <label htmlFor="newUsername">Nuovo Username</label>
                                <div className="invalid-feedback">{userError}</div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ height: 'calc(3.5rem + 2px)' }}
                                onClick={handleSaveUsername}
                            >
                                <i className="bi bi-floppy"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/*Riga Password e Nuova Password*/}
                <div className={"row flex-row justify-content-between mt-5 align-items-center"}>
                    {/* Primo gruppo: Password + bottone modifica */}
                    <div className="col-5 d-flex align-items-center">
                        <div className="form-floating flex-grow-1 me-2">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                autoComplete="off"
                                required
                                value={passwordUtente}
                                readOnly
                                placeholder="Password" // necessario per form-floating
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ height: 'calc(3.5rem + 2px)' }}
                            onClick={handleBtnModificaPasswordClick}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuova password+ bottone salva */}
                    {showNewPassword && (
                        <div className="col-5 d-flex align-items-center justify-content-end">
                            <div className="form-floating flex-grow-1 me-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newPassword"
                                    autoComplete="off"
                                    required
                                    placeholder="Nuova Password"
                                    onChange={(e) => {
                                        setShowNewPassword(e.target.value);
                                        e.target.classList.remove("is-invalid");
                                    }}
                                />
                                <label htmlFor="newPassword">Nuova Password</label>
                                <div className="invalid-feedback">{passwordError}</div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ height: 'calc(3.5rem + 2px)' }}
                                //onClick={handleSavePassword}
                            >
                                <i className="bi bi-floppy"></i>
                            </button>
                        </div>
                    )}
                </div>
                

                <input type={"button"} value="Crea Account" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       />
                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}/>

                </form>
        </div>
    )
}