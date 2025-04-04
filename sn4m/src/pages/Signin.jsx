import TagSelector from "../Components/TagSelector";
import {useState} from "react";

export default function Signin() {

    //Data for Profile
    const [profilo, setProfiloUtente] = useState(
        {
            email: "email@example.com",
            username: "username",
            password: "password",
            cantantiPreferiti: ["Alec Benjamin"],
            generiPreferiti: ["Rock"],
            playlistProprie: [
                {
                    id: "id-privato",
                    titolo: "titolo",
                    descrizione: "descrizione",
                    tags: ["lavitafaschifa"],
                    songs: ["id-canzone"]
                }
            ],
            playlistSalvate: [
                {
                    "id-community": "id-community",
                    "id-condivisione": "id-condivisione"
                }
            ],
            communities: ["id-communities"]
        }
    );

    const [artistiPreferiti, setArtistiPreferiti] = useState([])

    const riceviArtisti = (array) => {
        setArtistiPreferiti(array);
    }


    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Social Network for Music
            </h1>
            <h3>
                Sign In
            </h3>

            <form name={"signin"} className={"mt-5"}>

                {/*Riga User e Email*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="text" className="form-control" id="username"
                                   placeholder="username"/>
                            <label htmlFor="floatingInput">Username</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="email" className="form-control" id="email"
                                   placeholder="name@example.com"/>
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                    </div>
                </div>

                {/*Riga per Password*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="password"
                                   placeholder="Password"/>
                            <label htmlFor="floatingInput">Password</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="ripeti-password"
                                   placeholder="Ripeti Password"/>
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
                />

                <input type={"button"} onClick={() => {console.log(artistiPreferiti)}} value="Crea Account" className={"btn btn-primary mt-5 text-uppercase"} />
                <input type={"button"} value="Annulla" className={"btn btn-primary mt-5 mx-5 text-uppercase"} />
            </form>
        </div>
    )
};