import {useState} from "react";
import loginsx from "../media/loginsx.png"
import logindx from "../media/logindx.png"
import {Link, useNavigate} from "react-router-dom";
import {getUsers} from "../utilities/users";

export default function Login() {

    /* Functional Vars */
    const navigate = useNavigate()

    /* Dati Form */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /* Errori Form */
    const [error, setError] = useState("");

    const handleSubmit = () => {
        const existingUsers = getUsers()

        const userInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (existingUsers.some(item => (item.username === username && item.password === password))) {
            navigate("/profiloUtente")
            sessionStorage.setItem("loginSession",  JSON.stringify({user: username}))
        } else {
            setError("Credenziali non valide")
            userInput.classList.add("is-invalid")
            passwordInput.classList.add("is-invalid")
        }
    }
    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Social Network for Music
            </h1>
            <div className={"row flex-row justify-content-center mt-5"}>
                {/* Immagine Log In SX */}
                <div className={"col d-flex justify-content-center align-items-center"}><img className={"mx-auto"} src={loginsx}/></div>

                {/* Card Log In */}
                <div className={"col"}>
                    <div className={"card p-5 text-white bg-primary rounded-3 shadow-lg"}>
                        <div className={"card-body"}>
                            <h2 className={"w-100 text-center mb-5"}>Log In</h2>
                            <div>
                                <form>
                                    <div className={"col"}>
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
                                        </div>
                                    </div>
                                    <div className={"col"}>
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
                                            <div className="invalid-feedback">{error}</div>
                                        </div>
                                    </div>

                                    <div className={"row mt-5"}>
                                        <Link className={"btn btn-secondary mt-2 p-2 text-uppercase"}
                                               to={"/"}>Registrati</Link>
                                        <input type={"button"} value="Accedi" className={"btn btn-secondary mt-2 p-2 text-uppercase"}
                                               onClick={handleSubmit}
                                        />
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Immagine Log In DX */}
                <div className={"col d-flex justify-content-center align-items-center"}><img className={"mx-auto"} src={logindx}/></div>

            </div>
        </div>
    )
}