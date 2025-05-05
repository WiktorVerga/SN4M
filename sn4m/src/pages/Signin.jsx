import TagSelector from "../Components/TagSelector";
import {useState} from "react";
import {getToken} from "../utilities/getToken";
import {useNavigate} from "react-router-dom";
import {getUsers, setUsers, users} from "../utilities/users";
import {recuperaGeneri} from "../utilities/recuperaGeneri";

export default function Signin() {
    /* Functional Vars */
    const navigate = useNavigate();


    /* Dati Form */
    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [ripetiPassword, setRipetiPassword] = useState("");

    const [artistiPreferiti, setArtistiPreferiti] = useState([])

    const riceviArtisti = (array) => {
        setArtistiPreferiti(array);
    }

    /* Dati Errori Form */
    const [emailError, setEmailError] = useState("");
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("")


    /* Handle Functions */
    const handleSubmit = () => {

        const existingUsers = getUsers()

        /* Controlli Form */
        const emailInput = document.getElementById("email");
        const userInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        emailInput.classList.remove("is-invalid")
        userInput.classList.remove("is-invalid")
        passwordInput.classList.remove("is-invalid")

        /* Controllo Email */
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


        /* Controllo Username */

        //Controllo Unicità Username
        if (existingUsers?.some(item => (item.username === username))) {
            //Avviene errore:
            userInput.classList.add("is-invalid")
            setUserError("Username già in uso")
            hasError = true;
        }

        /* Controllo Password */

        //Regex che accetta solo lettere, numeri e caratteri speciali comuni
        const validCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        //Controllo lunghezza password
        if (password.length<8){
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


        /* Creazione Utente con Dati Sicuri */
        if (hasError) return

        //Si attenodno tutti i dati sull'utente
        recuperaGeneri(artistiPreferiti).then(generi => {

            const profilo = {
                email: email,
                username: username,
                password: password,
                //... -> spacchetta array
                cantantiPreferiti: [...artistiPreferiti],
                generiPreferiti: [...generi],
                playlistProprie: [],
                playlistSalvate: [],
                communities: []
            }

            /* Salvataggio dati Utenti in LocalStorage */

            if (existingUsers)
                setUsers([...existingUsers, profilo])
            else
                setUsers([profilo])

            navigate("/login")
        })
    }

    const handleAnnulla = () => {
        navigate(-1)
    }

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Social Network for Music
            </h1>
            <h3>
                Sign In
            </h3>

            <form
                name={"signin"}
                className={"mt-5"}
                autoComplete={"off"}
            >

                {/*Riga User e Email*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black ">
                            <input type="text" className="form-control" id="username"
                                   required={true}
                                   placeholder="username"
                                   onChange={(e) => {
                                       setUsername(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Username</label>
                            <div className="invalid-feedback">{userError}</div>
                        </div>

                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="email" className="form-control" id="email"
                                   required={true}
                                   placeholder="name@example.com"
                                   onChange={(e) => {
                                       setEmail(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}/>
                            <label htmlFor="floatingInput">Email</label>
                            <div className="invalid-feedback">{emailError}</div>
                        </div>
                    </div>
                </div>

                {/*Riga per Password*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="password"
                                   required={true}
                                   placeholder="Password"
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Password</label>
                            <div className="invalid-feedback">{passwordError}</div>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="ripeti-password"
                                   required={true}
                                   placeholder="Ripeti Password"
                                   onChange={(e) => {
                                       setRipetiPassword(e.target.value)
                                       e.target.classList.remove("is-invalid")
                                   }}/>
                            <label htmlFor="floatingInput">Ripeti Password</label>
                        </div>
                    </div>
                </div>


                {/*Riga per Select Artisti*/}
                <TagSelector
                    label={"Artisti Preferiti"}
                    placeholder={"Cerca artisti preferiti"}
                    floatingLabel={"Cerca Artisti"}
                    optionTitle={"Artisti"}
                    returnData={riceviArtisti}
                    type={"artist"}
                />

                <input type={"button"} value="Crea Account" className={"btn btn-secondary mt-5 p-2 text-uppercase"}
                       onClick={handleSubmit}/>
                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}
                onClick={handleAnnulla}/>
            </form>
        </div>
    )
};