import TagConChiusura from "./TagConChiusura";
import Tag from "./Tag";

export default function TagDisplayer({tags, emsg, withDelete, handleDelete}) {
    return (
        <div className={"tag-displayer"}>
            {tags?.length > 0 ? tags.map((item, index) => (
                withDelete?
                    <TagConChiusura key={index} value={item} handleDelete={() => {handleDelete(item)}}/>
                    : <Tag key={index} value={item}/>

            )) : <p className={"text-white-50"}>{emsg}</p>
            }
        </div>
    )
}