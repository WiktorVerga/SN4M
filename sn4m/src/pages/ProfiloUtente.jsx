import TagSelector from "../Components/TagSelector";
import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";
import 'bootstrap-icons/font/bootstrap-icons.css';
import TagDisplayer from "../Components/TagDisplayer";


export default function ProfiloUtente() {

    const [utenteLoggato, setUtenteLoggato] = useState({
        email: "wiktor.verga@gmail.com",
        username: "WiktorVerga5",
        password: "GiorgiaBella1?",
        cantantiPreferiti: [
            "Martin Garrix",
            "Skrillex",
            "Marshmello",
            "Travis Scott",
            "21 Savage",
            "Metro Boomin"
        ],
        generiPreferiti: [],
        playlistProprie: [],
        playlistSalvate: [],
        communities: []
    })

    /* Dati Form */
    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [nuoviArtistiPreferiti, setNuoviArtistiPreferiti] = useState([])
    const riceviNuoviArtisti = (array) => {
        setArtistiPreferiti(array);
    }

    const [generiPreferiti, setGeneriPreferiti] = useState([]);

    const [newUsername, setNewUsername] = useState("");

    const passwordInput = document.getElementById("password");

    /*Dati presi dal localStorage*/
    let usernameUtente = "giorgia";
    let passwordUtente = "1234";

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

    useEffect(() => {
        const loginSession = JSON.parse(sessionStorage.getItem("loginSession"))

        const utenti = JSON.parse(localStorage.getItem("utenti"))

        const utenteLogged = utenti.filter(item => item.email === loginSession.email)

        setUtenteLoggato(utenteLogged);


    }, []);

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Profilo Utente
            </h1>
            <h2 className={"text-capitalize"}>
                Ciao, {usernameUtente}
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
                            style={{height: 'calc(3.5rem + 2px)'}}
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
                                style={{height: 'calc(3.5rem + 2px)'}}
                                onClick={handleSaveUsername}
                            >
                                <i className="bi bi-floppy"></i>
                            </button>
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
                                            type="text"
                                            className="form-control"
                                            id="new-password"
                                            autoComplete="off"
                                            required
                                            placeholder="Nuova Password"
                                            onChange={(e) => {
                                                setShowNewPassword(e.target.value);
                                                e.target.classList.remove("is-invalid");
                                            }}
                                        />
                                        <label htmlFor="new-password">Nuova Password</label>
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex align-items-center justify-content-end">
                                    <div className="form-floating flex-grow-1 me-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ripeti-new-password"
                                            autoComplete="off"
                                            required
                                            placeholder="Ripeti Password"
                                            onChange={(e) => {
                                                setShowNewPassword(e.target.value);
                                                e.target.classList.remove("is-invalid");
                                            }}
                                        />
                                        <label htmlFor="ripeti-new-password">Ripeti Password</label>
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{height: 'calc(3.5rem + 2px)'}}
                                        //onClick={handleSavePassword}
                                    >
                                        <i className="bi bi-floppy"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/*Riga Generi Displayer*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className="col-5 d-flex">
                        <TagDisplayer
                            tags={generi}
                            emsg={"Nessun Genere Presente"}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>

                {/*Riga Artisti Selector*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className="col-5 d-flex">
                        <TagSelector
                            label={"Artisti Preferiti"}
                            placeholder={"Cerca artisti preferiti"}
                            floatingLabel={"Cerca Artisti"}
                            optionTitle={"Artisti"}
                            returnData={riceviNuoviArtisti}
                            type={"artist"}
                        />
                    </div>
                </div>

                <input type={"button"} value="Salva Modifiche" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                />
                <input type={"button"} value="Annulla"
                       className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}/>

            </form>
        </div>
    )
}