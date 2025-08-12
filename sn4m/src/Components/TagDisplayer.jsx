import TagConChiusura from "./TagConChiusura";
import Tag from "./Tag";

//componente per mostrare una lista di tag, opzionalmente eliminabili
export default function TagDisplayer({tags, emsg, withDelete, handleDelete, limMin, limMax, clear}) {
    return (
        // Contenitore con bordo visibile solo se "clear" è falso
        <div className={!clear? "tag-displayer-outline" : "tag-displayer"}>
            {/* Se ci sono tag, li mostra. Altrimenti mostra un messaggio placeholder */}
            {tags?.length > 0 ? tags.map((item, index) => (
                withDelete?                                                                         //mostra tag con pulsante di rimozione
                    <TagConChiusura key={index} value={item} handleDelete={() => {handleDelete(item)}}/>
                    : <Tag key={index} value={item}/>

            )) : <p className={"text-white-50"}>{emsg}</p>                  //nessun tag → mostra testo in grigio
            }
            {/* Se definito limMax, mostra contatore tag in basso a destra */}
            {limMax && <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                <span
                    className={(tags.length < limMin || tags.length > limMax) ? " text-danger " : "text-secondary"}>{tags?.length}/{limMax}</span>
            </div>}
        </div>
    )
}