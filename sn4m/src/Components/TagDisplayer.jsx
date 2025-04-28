import TagConChiusura from "./TagConChiusura";

export default function TagDisplayer({tags, emsg, handleDelete}) {
    return (
        <div className={"tag-displayer"}>
            {tags.length > 0 ? tags.map((item) => (
                <TagConChiusura key={item.id} value={item} handleDelete={() => {
                    handleDelete(item)
                }}/>
            )) : <p className={"text-white-50"}>{emsg}</p>
            }
        </div>
    )
}