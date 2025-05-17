import {useEffect, useState} from "react";

export default function SearchBar({sendSearch}) {

    const [search, setSearch] = useState("")

    useEffect(() => {

    }, [search])

    return (
        <div className={"search-bar mx-auto"}>
            <input
                type={"text"}
                placeholder={"Cerca"}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
            />
            <button onClick={() => {/*sendSearch(search)*/}}>
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22.4166 27.5834C17.5416 22.7084 17.5416 14.7917 22.4166 9.89587C27.2916 5.02087 35.2083 5.02087 40.1041 9.89587C44.9791 14.7709 44.9791 22.6875 40.1041 27.5834C35.2291 32.4584 27.3125 32.4584 22.4166 27.5834Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21.875 28.125L6.25 43.75" stroke="white" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    )
}