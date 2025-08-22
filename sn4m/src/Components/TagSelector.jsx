import TagDisplayer from "./TagDisplayer";
import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";

//consente agli utenti di selezionare artisti o inserire tag personalizzati, con vincoli di quantità (min/max)
export default function TagSelector({personalizzati, returnData, initialState, limMin, limMax}) {
    //Varibili funzionali
    const [data, setData] = useState([]);               //lista di artisti trovati da API
    const [search, setSearch] = useState("");           //testo inserito nella barra di ricerca
    const [selectedIndex, setSelectedIndex] = useState(-1);         //indice artista evidenziato in lista

    //Tags Generici
    const [tags, setTags] = useState([]);            //lista di artisti/tag selezionati

    const tagPersonalizzato = document.getElementById("tag-personalizzato");        //input tag personalizzato

    //Var di Controllo
    const [limitExceeded, setLimitExceeded] = useState(false);          //flag limite massimo
    const [searchError, setSearchError] = useState("");         //stato che memorizza un messaggio di errore nella ricerca

    /* Fetch API Spotify per ottenere artisti da ricerca */
    const getData = async (query) => {

        const token = await getToken();         //ottiene token Spotify

        const url = "https://api.spotify.com/v1/search?q=" + query + "&type=artist"

        try {
            // Effettua la richiesta GET all’API di Spotify
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            })

            // Converte la risposta in formato JSON
            const dati = await response.json();

            return dati.artists.items             //ritorna lista artisti
        } catch (error) {
            console.log(error.message);
        }

    }

    /* Aggiunta Artista alla lista dei Tag */
    const addArtist = (elem) => {
        const searchInput = document.getElementById('search')       // recupera il campo input della barra di ricerca

        //Controllo sul Limite Massimo dei Tags
        setLimitExceeded(tags.length >= limMax)
        if (tags.length >= limMax) {
            searchInput.classList.add("is-invalid")
            setSearchError("Limite raggiunto")
        } else {
            searchInput.classList.remove("is-invalid")
            //Aggiunge il nuovo artista alla lista dei tag, evitando duplicati con "new Set"
            setTags([...new Set([...tags, elem])])
        }

        //Reset input e risultati ricerca
        setSearch("")
        searchInput.value = "";
        setData([]);
    }

    /* Aggiunta Tag Personalizzato */
    const handleAddTag = (elem) => {
        //Aggiunge un tag personalizzato solo se non è già presente e il campo non è vuoto
        if (!tags.includes(elem) && tagPersonalizzato.value !== "")
            setTags(prevSelectedItems => [...prevSelectedItems, elem]);

        //Reset campo di input
        tagPersonalizzato.value = "";
    }

    /* Invio dati al componente padre */
    const sendTags = (array) => {
        returnData(array);
    }

    /* Gestione Navigazione Lista di Artisti */
    const handleNavigateList = (e) => {
        if (e.key === "ArrowDown") {
            // Se viene premuta la freccia giù, sposta la selezione sull'elemento successivo della lista
            setSelectedIndex((prev) =>
                prev < data.length - 1 ? prev + 1 : prev
            );

        } else if (e.key === "ArrowUp") {
            // Se viene premuta la freccia su, sposta la selezione sull'elemento precedente
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));

        } else if (e.key === "Enter" && data.length > 0) {       // Se viene premuto "Enter"
            if (selectedIndex === -1) {
                //Se nessun elemento è selezionato, aggiunge il primo artista della lista
                addArtist(data[0].name);
            } else {
                //Altrimenti aggiunge l’artista attualmente selezionato
                addArtist(data[selectedIndex].name);
            }
        }
    }

    /* Selezione artista cliccando sulla lista */
    const handleChoice = (e) => {
        //Recupera il valore (nome artista) dall’attributo HTML
        const element = e.target.getAttribute('value')

        addArtist(element);    // Aggiunge l’artista ai tag
    }

    /* Gestione Invio per Tag Personalizzati */
    const handleKeyboard = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            //Se viene premuto "Enter" e il campo non è vuoto, aggiunge un tag personalizzato
            handleAddTag(e.target.value);
        }
    }

    /* Rimuove un tag dalla lista */
    const handleDelete = (elem) => {
        //Filtra la lista dei tag mantenendo solo quelli diversi dall’elemento da eliminare
        setTags(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    /* Use Effects */

    /* Imposta uno stato iniziale per i tags, se c'è */
    useEffect(() => {
        if (initialState?.length > 0) {
            //Se il componente riceve un "initialState" con uno o più tag, li copia nello stato `tags`
            setTags([...initialState])
        }
    }, [initialState]);

    /* Carica dati da API Spotify quando viene digitato un termine di ricerca */
    useEffect(() => {
        if (search !== "") {
            //Se il campo di ricerca non è vuoto, chiama l'API Spotify
            getData(search).then((dati) => {
                //Filtro per rimuovere dalle ricerche gli artisti già inseriti
                const availableArtists = dati?.filter(item =>
                    !tags.includes(item.name)
                );
                //Aggiorna la lista di risultati disponibili
                setData(availableArtists)
                //Resetta l’indice della selezione nella lista (nessun elemento evidenziato)
                setSelectedIndex(-1)
            })
        } else {
            //Se la ricerca è vuota, pulisce i risultati
            setData([]);
        }
    }, [search]);


    /* Invio Tags al componente padre, ogni volta che cambiano i tags */
    useEffect(() => {
        sendTags(tags)      //Passa la lista aggiornata dei tag al componente genitore
        setData([]);    //Pulisce i risultati della ricerca
        //Aggiorna lo stato per verificare se è stato raggiunto il limite massimo
        setLimitExceeded(tags.length >= limMax)
        if (!(tags.length >= limMax)) {
            document.getElementById('search').classList.remove("is-invalid")
        }
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
                               disabled={limitExceeded}
                               onKeyDown={(e) => {
                                   handleNavigateList(e)
                               }}
                        />
                        <label htmlFor="floatingInput">Cerca Artisti</label>
                        <div className="invalid-feedback">{searchError}</div>
                        {/* Lista risultati ricerca */}
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
                                    {/* Immagine artista o placeholder */}
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
                            disabled={limitExceeded}
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
            {/* Colonna che mostra i tag selezionati */}
            <div className={"col-5"}>
                <TagDisplayer
                    tags={tags}
                    emsg={personalizzati? "Aggiungi Tags..." : "Aggiungi Artisti..."}
                    handleDelete={handleDelete}
                    withDelete={true}
                    limMin={limMin}
                    limMax={limMax}
                />
            </div>
        </div>
    )
}