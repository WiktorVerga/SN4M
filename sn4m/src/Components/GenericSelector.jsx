import TagSelector from "./TagSelector";
import TagDisplayer from "./TagDisplayer";
import {useEffect, useState} from "react";

export default function GenericSelector({returnData, initialState}) {

    const [tags, setTags] = useState([]);

    const tagPersonalizzato = document.getElementById("tag-personalizzato");

    const [savedArtists, setSavedArtists] = useState([]);

    const riceviArtisti = (array) => {
        setSavedArtists(array);
    }

    const sendTags = (array) => {
        returnData(array);
    }

    const handleAddTag = (elem) => {
        if (!tags.includes(elem))
            setTags(prevSelectedItems => [...prevSelectedItems, elem]);

        tagPersonalizzato.value = "";
    }

    const handleDelete = (elem) => {
        setTags(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    useEffect(() => {
        if (tags)
            setTags([...new Set([...tags, ...savedArtists])])
    }, [savedArtists]);

    useEffect(() => {
        sendTags(tags)
    }, [tags])

    return (
        <div className={"row flex-row justify-content-between mt-5"}>
            <div className={"col-5"}>
                <TagSelector
                    label={"Artisti Preferiti"}
                    floatingLabel={"Cerca Artisti"}
                    placeholder={"Cerca artisti preferiti"}
                    returnData={riceviArtisti}
                    type={"artist"}
                    initialState={initialState}
                />

                <div className="d-flex align-items-center">
                    <div className="form-floating flex-grow-1 me-2">
                        <input
                            type="text"
                            className="form-control"
                            id="tag-personalizzato"
                            autoComplete="off"
                            required={true}
                            placeholder="Es: Estate; Es: Mattino; Es: Chill"
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
                </div>
            </div>

            <div className={"col-5"}>
                <TagDisplayer
                    tags={tags}
                    emsg={"Aggiungi Artisti..."}
                    handleDelete={handleDelete}
                    withDelete={true}
                />
            </div>


        </div>
    )
}