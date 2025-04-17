import TagSelector from "../Components/TagSelector";
import {useState} from "react";
import {getToken} from "../utilities/getToken";

export default function Signin() {

    {/* Dati Form */}
    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [ripetiPassword, setRipetiPassword] = useState("");

    const [artistiPreferiti, setArtistiPreferiti] = useState([])
    const riceviArtisti = (array) => {
        setArtistiPreferiti(array);
    }

    const [generiPreferiti, setGeneriPreferiti] = useState([]);
    const recuperaGeneri = () => {
        const generi = new Set()

        const getData = async (query) => {

            const token = await getToken();

            const url = "https://api.spotify.com/v1/search?q=" + query + "&type=artist"

            try {
                const response = await fetch(url, {
                    method: 'GET', headers: {
                        'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                    }
                })

                const dati = await response.json();

                return dati.artists.items
            } catch (error) {
                console.log(error.message);
            }

        }

        artistiPreferiti.forEach((item) => {
            getData(item).then(data => {
                data[0].genres.forEach((genre) => {
                    generi.add(genre)

                })

                setGeneriPreferiti(Array.from(generi))
            })
        })



    }

    const handleSubmit = () => {

        const existingUsers = JSON.parse(localStorage.getItem("utenti"))

        /* Controlli Form */

        /*Ricorda di usare il punto di domanda quando usi 'existingUsers'*/
        existingUsers?.forEach((item) => {
            console.log(item)
        })

        /* Creazione Utente con Dati Sicuri */
        recuperaGeneri()

        const profilo = {
            email: email,
            username: username,
            password: password,
            cantantiPreferiti: [...artistiPreferiti],
            generiPreferiti: [...generiPreferiti],
            playlistProprie: [
            ],
            playlistSalvate: [
            ],
            communities: []
        }

        /* Salvataggio dati Utenti in LocalStorage */
        if (existingUsers)
            localStorage.setItem("utenti", JSON.stringify([...existingUsers, profilo]))
        else
            localStorage.setItem("utenti", JSON.stringify([profilo]))
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
            >

                {/*Riga User e Email*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="text" className="form-control" id="username"
                                   autoComplete={"off"}
                                   required={true}
                                   placeholder="username"
                                   onChange={(e) => {setUsername(e.target.value)}}
                            />
                            <label htmlFor="floatingInput">Username</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="email" className="form-control" id="email"
                                   required={true}
                                   placeholder="name@example.com"
                                   onChange={(e) => {setEmail(e.target.value)}}/>
                            <label htmlFor="floatingInput">Email</label>
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
                                   onChange={(e) => {setPassword(e.target.value)}}
                            />
                            <label htmlFor="floatingInput">Password</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="ripeti-password"
                                   required={true}
                                   autoComplete={"off"}
                                   placeholder="Ripeti Password"
                                   onChange={(e) => {setRipetiPassword(e.target.value)}}/>
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

                <input type={"button"} value="Crea Account" className={"btn btn-secondary mt-5 p-2 text-uppercase"} onClick={handleSubmit}/>
                <input type={"button"} value="Annulla" className={"btn btn-secondary mt-5 mx-5 p-2 text-uppercase"}/>
            </form>
        </div>
    )
};