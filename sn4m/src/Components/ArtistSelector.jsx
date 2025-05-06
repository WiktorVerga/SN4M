import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";
import TagDisplayer from "./TagDisplayer";
import TagSelector from "./TagSelector";

export default function ArtistSelector({initialState, returnData}) {

    const [savedArtists, setSavedArtists] = useState([]);

    const sendArtisti = (array) => {
        setSavedArtists(array);
        returnData(array);
    }

    const handleDelete = (elem) => {
        setSavedArtists(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    return (
        <div className={"row flex-row justify-content-between mt-5"}>
            <div className={"col-5"}>
                <TagSelector
                    label={"Artisti Preferiti"}
                    floatingLabel={"Cerca Artisti"}
                    placeholder={"Cerca artisti preferiti"}
                    returnData={sendArtisti}
                    type={"artist"}
                    initialState={initialState}
                />
            </div>

            <div className={"col-5"}>
                <TagDisplayer
                    tags={savedArtists}
                    emsg={"Aggiungi Artisti..."}
                    handleDelete={handleDelete}
                    withDelete={true}
                />
            </div>
        </div>
    )
}