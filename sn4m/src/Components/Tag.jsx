//Componente che mostra un "tag" senza pulsante di chiusura.
export default function TagConChiusura({value}) {
    return (
        <div className={"tag"}>
            {/* testo del tag */}
            <span>
                {value}
            </span>
        </div>
    )
}