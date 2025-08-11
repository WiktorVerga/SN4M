import TagConChiusura from "./TagConChiusura";
import Tag from "./Tag";

export default function TagDisplayer({tags, emsg, withDelete, handleDelete, limMin, limMax, clear}) {
    return (
        <div className={!clear? "tag-displayer-outline" : "tag-displayer"}>
            {tags?.length > 0 ? tags.map((item, index) => (
                withDelete?
                    <TagConChiusura key={index} value={item} handleDelete={() => {handleDelete(item)}}/>
                    : <Tag key={index} value={item}/>

            )) : <p className={"text-white-50"}>{emsg}</p>
            }

            {limMax && <div className={"position-absolute bottom-0 end-0 me-2 mb-1"}>
                <span
                    className={(tags.length < limMin || tags.length > limMax) ? " text-danger " : "text-secondary"}>{tags?.length}/{limMax}</span>
            </div>}
        </div>
    )
}