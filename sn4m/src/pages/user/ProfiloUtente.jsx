import {useEffect, useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {getLoggedUser, getUser, getUsers, logout, setUsers, updateUser} from "../../utilities/users";
import {useNavigate} from "react-router-dom";
import {recuperaGeneri} from "../../utilities/recuperaGeneri";
import {toast} from "react-toastify";
import TagSelector from "../../Components/TagSelector";


export default function ProfiloUtente() {

    /* Functional Vars */
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConf, setShowPasswordConf] = useState(false);

    const [utenteLoggato, setUtenteLoggato] = useState({})

    const [initialArtisti, setInizialeArtisti] = useState([])

    const [artistiPreferiti, setArtistiPreferiti] = useState([])
    const [generiPreferiti, setGeneriPreferiti] = useState([]);
    const riceviNuoviArtisti = (array) => {
        setArtistiPreferiti(array);
    }

    const [newUsername, setNewUsername] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConf, setNewPasswordConf] = useState("");

    const resetState = () => {
        setNewUsername("");
        setNewPassword("");
        setNewPasswordConf("");
        setShowNewPassword(false);
        setShowNewUser(false);
    }

    /*Visibilità inseirmento nuovo utente */
    const [showNewUser, setShowNewUser] = useState(false);

    /*Visibilità inserimento nuova password*/
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleBtnModificaPasswordClick = () => {
        setShowNewPassword(true);
    };

    /*Dati errori Form*/
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("")
    const [hasError, setHasError] = useState(false);

    /* handleFunction Logout */
    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    /*handleFunction Username*/
    const handleSaveUsername = () => {

        const existingUsers = getUsers()

        /* Controlli Form */
        const userInput = document.getElementById("newUsername");

        userInput.classList.remove("is-invalid")

        /* Controllo Username */

        //Controllo Inserimento Username
        if (newUsername.length === 0) {
            //Avviene errore:
            userInput.classList.add("is-invalid")
            setUserError("Inserire Nuovo Username")
            setHasError(true)
            console.log(newUsername)
        }

        //Controllo Unicità Username
        if (existingUsers?.some(item => (item.username === newUsername))) {
            //Avviene errore:
            userInput.classList.add("is-invalid")
            setUserError("Username già in uso")
            setHasError(true)
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
        if (newPassword.length < 8) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password deve essere lunga almeno 8 caratteri")
            setHasError(true)
        }

        //Controllo Password Diverse
        if (newPassword !== newPasswordConf) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password non Uguali")
            setHasError(true)
        }

        //Controllo Password Valida
        if (!validCharactersRegex.test(newPassword)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password può contenere solo lettere, numeri e caratteri speciali")
            setHasError(true)
        }

        //Controllo Struttura Password Valida
        if (!uppercaseRegex.test(newPassword) || !numberRegex.test(newPassword) || !specialCharRegex.test(newPassword)) {
            //Avviene errore:
            passwordInput.classList.add("is-invalid")
            setPasswordError("Password deve contenere almeno una lettera maiuscola, un numero e un carattere speciale")
            setHasError(true)
        }
    }

    const handleSubmit = () => {
        if (showNewUser && newUsername.length !== 0) handleSaveUsername()
        if (showNewPassword) handleSavePassword()

        /* Salvataggio dati Utenti in LocalStorage */

        if (!hasError) {
            const profilo = {
                email: utenteLoggato.email,
                username: (showNewUser && newUsername.length !== 0) ? newUsername : utenteLoggato.username,
                password: (showNewPassword && newPassword !== "" && newPasswordConf !== "") ? newPassword : utenteLoggato.password,
                cantantiPreferiti: artistiPreferiti,
                generiPreferiti: generiPreferiti,
                playlistProprie: utenteLoggato.playlistProprie,
                playlistSalvate: utenteLoggato.playlistProprie,
                communities: utenteLoggato.communities
            }

            updateUser(profilo)
            setUtenteLoggato(getUser(utenteLoggato.email))
            toast.success("Modifiche Salvate", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });

            resetState()
        } else {
            toast.error("Errore nel Salvataggio", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
            })

            setHasError(false)
        }
    }

    const handleDeleteAccount = () => {
        const validate = prompt("Digita: ELIMINA")

        if (validate === "ELIMINA") {
            setUsers(getUsers()?.filter(item => item.email !== utenteLoggato.email))
            navigate("/")
        }
    }

    useEffect(() => {

        /* Recupero dati utente dal localStorage */
        const utenteLogged = getLoggedUser()

        if (utenteLogged == null) return

        setUtenteLoggato(utenteLogged);

        setInizialeArtisti(utenteLogged.cantantiPreferiti);


    }, []);

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Profilo Utente
            </h1>
            <div className={"row d-flex flex-row justify-content-between"}>
                <h2 className={"mx-auto col"}>
                    Ciao, {utenteLoggato.username}
                </h2>
                <button
                    className={"col-1 btn btn-secondary mx-auto w-fit-content text-uppercase"}
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>

            <h4 className={"mt-5"}>
                Informazioni Sul Profilo
            </h4>

            <form
                name={"profiloUtente"}
                className={"mt-5"}
            >

                {/*Riga user e Nuovo user*/}
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
                            onClick={() => setShowNewUser(!showNewUser)}
                        >
                            {showNewUser? <i className="bi bi-x-lg"></i> : <i className="bi bi-pencil"></i>}
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuovo username*/}
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
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword? <i className="bi bi-x-lg"></i> : <i className="bi bi-pencil"></i>}
                        </button>
                    </div>

                    {/* Secondo gruppo: Nuova password + bottone salva */}
                    {showNewPassword && (
                        <div className="col-5">
                            <div className={"row"}>
                                <div>
                                    <div className="form-floating flex-grow-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
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
                                        {newPassword.length > 0 &&
                                            <div className={"position-absolute top-50 end-0 translate-middle-y me-4 cursor-pointer"}
                                                 onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <i className="bi bi-eye-slash text-gray" style={{fontSize: '1.6rem', color: '#626262'}}></i> : <i className="bi bi-eye" style={{fontSize: '1.6rem', color: '#626262'}}></i>}
                                            </div>
                                        }
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex align-items-center justify-content-end">
                                    <div className="form-floating flex-grow-1">
                                        <input
                                            type={showPasswordConf ? "text" : "password"}
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
                                        {newPasswordConf.length > 0 &&
                                            <div className={"position-absolute top-50 end-0 translate-middle-y me-4 cursor-pointer"}
                                                 onClick={() => setShowPasswordConf(!showPasswordConf)}>
                                                {showPasswordConf ? <i className="bi bi-eye-slash text-gray" style={{fontSize: '1.6rem', color: '#626262'}}></i> : <i className="bi bi-eye" style={{fontSize: '1.6rem', color: '#626262'}}></i>}
                                            </div>
                                        }
                                        <div className="invalid-feedback">{passwordError}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/*Riga Artisti Selector*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <TagSelector
                        personalizzati={false}
                        returnData={riceviNuoviArtisti}
                        initialState={initialArtisti}
                        limMax={15}
                        limMin={3}
                    />
                </div>

                <input type={"button"} value="Salva Modifiche"
                       className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={handleSubmit}
                />
                <input type={"button"} value="Annulla"
                       className={"btn btn-secondary mt-5  mx-5 p-2 text-uppercase"}
                       onClick={() => navigate(-1)}
                />
            </form>


            {/*Elimina Account*/}
            <h4 className={"spacer text-danger fw-bold"}>
                Elimina Account
            </h4>
            <button className={"btn btn-danger mt-3 mb-5 text-uppercase"}
                    onClick={handleDeleteAccount}
            >
                Elimina Account
            </button>

        </div>
    )
}