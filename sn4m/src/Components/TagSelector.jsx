import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";
import TagConChiusura from "./TagConChiusura";

export default function TagSelector({label, floatingLabel, placeholder, returnData, type}) {
    //Get Data to Fill Select
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    //Artists and Genres
    const [savedArtists, setSavedArtists] = useState([]);

    const getData = async (query, type) => {

        const token = await getToken();

        const url = "https://api.spotify.com/v1/search?q=" + query + "&type=" + type

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

    const addElement = (elem) => {
        const searchInput = document.getElementById('search')

        setSavedArtists(prevSelectedItems => {
            const newSelectedItems = [...prevSelectedItems, elem]
            return newSelectedItems
        });

        setSearch("")
        searchInput.value = "";

    }

    const handleChoice = (e) => {
        const element = e.target.getAttribute('value')

        addElement(element);
    }

    const handleDelete = (elem) => {
        setSavedArtists(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    const sendData = () => {
        returnData(savedArtists)
    }

    const handleNavigateList = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) =>
                prev < data.length - 1 ? prev + 1 : prev
            );

        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));

        } else if (e.key === "Enter" && data.length > 0) {
            if (selectedIndex === -1) {
                addElement(data[0].name);
            } else {
                addElement(data[selectedIndex].name);
            }
        }
    }

    useEffect(() => {
        if (search !== "") {
            getData(search, type).then((dati) => {
                //Filtro per rimuovere dalle ricerche gli artisti già inseriti
                const availableArtists = dati.filter(item =>
                    !savedArtists.includes(item.name)
                );
                setData(availableArtists)
                setSelectedIndex(-1)
            })
        } else {
            setData([]);
        }

        sendData()
    }, [search, savedArtists]);

    return (<div className={"row flex-row justify-content-between mt-5"}>
        <div className={"col-5"}>
            <label className={"mb-1"} htmlFor="floatingInput">{label}</label>
            <div className="form-floating mb-3 text-black">
                <input type="text" className="form-control" id="search"
                       placeholder={placeholder} onChange={(e) => {
                    setSearch(e.target.value)
                }}
                       onKeyDown={(e) => {
                           handleNavigateList(e)
                       }}
                />
                <label htmlFor="floatingInput">{floatingLabel}</label>
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
                                    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                                }
                            }}
                        >
                            <img src={item.images[0]?.url} alt={item.name + "'s Profile Image"} width={60} height={60} className={"m-2 rounded-2"}/>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className={"col-5"}>
            <div className={"tag-displayer"}>
                {savedArtists.length > 0 ? savedArtists.map((item) => (
                    <TagConChiusura key={item.id} value={item} handleDelete={() => {
                        handleDelete(item)
                    }}/>
                )) : <p className={"text-white-50"}>Aggiungi Artisti...</p>
                }
            </div>
        </div>
    </div>)
}