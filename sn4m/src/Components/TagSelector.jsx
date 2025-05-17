import TagDisplayer from "./TagDisplayer";
import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";

export default function TagSelector({personalizzati, returnData, initialState}) {
    //Get Data to Fill Select
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    //Generic Tags
    const [tags, setTags] = useState([]);

    const tagPersonalizzato = document.getElementById("tag-personalizzato");


    /* Fetch API Spotify per ottenere artisti da ricerca */
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

    /* Aggiusta Artista */
    const addArtist = (elem) => {
        const searchInput = document.getElementById('search')

        setTags([...new Set([...tags, elem])])

        setSearch("")
        searchInput.value = "";
        setData([]);
    }

    /* Aggiunta Tag Personalizzato */
    const handleAddTag = (elem) => {
        if (!tags.includes(elem) && tagPersonalizzato.value !== "")
            setTags(prevSelectedItems => [...prevSelectedItems, elem]);

        tagPersonalizzato.value = "";
    }

    /* Invio dati al componente padre */
    const sendTags = (array) => {
        returnData(array);
    }

    /* Gestione Navigazione Lista di Artisti */
    const handleNavigateList = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) =>
                prev < data.length - 1 ? prev + 1 : prev
            );

        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));

        } else if (e.key === "Enter" && data.length > 0) {
            if (selectedIndex === -1) {
                addArtist(data[0].name);
            } else {
                addArtist(data[selectedIndex].name);
            }
        }
    }

    const handleChoice = (e) => {
        const element = e.target.getAttribute('value')

        addArtist(element);
    }

    /* Gestione Invio per Tag Personalizzati */
    const handleKeyboard = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            handleAddTag(e.target.value);
        }
    }

    const handleDelete = (elem) => {
        setTags(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    /* Use Effects */

    /* Imposta uno stato iniziale per i tags, se c'è */
    useEffect(() => {
        if (initialState?.length > 0) {
            setTags([...initialState])
        }
    }, [initialState]);

    /* Carica dati da API Spotify quando viene digitato un termine di ricerca */
    useEffect(() => {
        if (search !== "") {
            getData(search).then((dati) => {
                //Filtro per rimuovere dalle ricerche gli artisti già inseriti
                const availableArtists = dati.filter(item =>
                    !tags.includes(item.name)
                );
                setData(availableArtists)
                setSelectedIndex(-1)
            })
        } else {
            setData([]);
        }
    }, [search]);


    /* Invio Tags al componente padre, ogni volta che cambiano i tags */

    useEffect(() => {
        sendTags(tags)
        setData([]);
    }, [tags])

    return (
        <div className={"row flex-row justify-content-between mt-5"}>
            <div className={"col-5"}>

                {/* Input per Ricerca Artisti */}
                <div>
                    <label className={"mb-1"} htmlFor="floatingInput">Artisti Preferiti</label>
                    <div className="form-floating mb-3 text-black">
                        <input type="text" className="form-control" id="search"
                               placeholder={"Cerca artisti preferiti"} onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                               onKeyDown={(e) => {
                                   handleNavigateList(e)
                               }}
                        />
                        <label htmlFor="floatingInput">Cerca Artisti</label>
                        <ul className="list-group"
                        >
                            {data?.map((item, index) => (
                                <li
                                    className={`list-group-item flex-row cursor-pointer option ${index === selectedIndex ? "selected" : ""}`}
                                    key={item.id}
                                    value={item.name}
                                    onClick={(e) => {
                                        handleChoice(e);
                                    }}
                                    ref={(el) => {
                                        if (index === selectedIndex) {
                                            el?.scrollIntoView({block: "nearest", behavior: "smooth"});
                                        }
                                    }}
                                >
                                    <img key={index} src={item.images[0] ? item.images[0].url : "https://placehold.co/60x60"}
                                         alt={item.name + "'s Profile Picture"} width={60} height={60}
                                         className={"m-2 rounded-2"}/>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Input per Tag Personalizzati */}
                {personalizzati && <div className="d-flex align-items-center">
                    <div className="form-floating flex-grow-1 me-2">
                        <input
                            type="text"
                            className="form-control"
                            id="tag-personalizzato"
                            autoComplete="off"
                            required={true}
                            placeholder="Es: Estate; Es: Mattino; Es: Chill"
                            onKeyDown={(e) => {
                                handleKeyboard(e)
                            }}
                        />
                        <label htmlFor="username">Personalizzato</label>
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{height: 'calc(3.5rem + 2px)'}}
                        onClick={() => handleAddTag(tagPersonalizzato.value)}
                    >
                        <i className="bi bi-plus"></i>
                    </button>
                </div>}
            </div>

            <div className={"col-5"}>
                <TagDisplayer
                    tags={tags}
                    emsg={personalizzati? "Aggiungi Tags..." : "Aggiungi Artisti..."}
                    handleDelete={handleDelete}
                    withDelete={true}
                />
            </div>


        </div>
    )
}