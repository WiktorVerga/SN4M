//Componente che mostra un "tag" con una "X" per rimuoverlo e ha come props: value: il testo del tag e handleDelete: funzione callback da eseguire quando si clicca sulla "X".
export default function TagConChiusura({value, handleDelete}) {
    return (
        <div className={"tag"}>
            {/* testo del tag */}
            <span>
                {value}
            </span>
            {/* bottone di chiusura (icona a cerchio con X dentro) */}
            <div className={"closing-x-tag"} onClick={handleDelete}>
                {/* sfondo circolare grigio/nero semitrasparente */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="black" fillOpacity="0.3"/>
                </svg>
                {/* icona della X bianca sovrapposta */}
                <svg className={"x"} xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10"
                     fill="none">
                    <path
                        d="M0.664732 10L0.197998 9.43881L3.88968 5L0.197998 0.561192L0.664732 0L4.35641 4.43881L8.0481 0L8.51483 0.561192L4.82315 5L8.51483 9.43881L8.0481 10L4.35641 5.56119L0.664732 10Z"
                        fill="white"/>
                </svg>
            </div>
        </div>
    )
}