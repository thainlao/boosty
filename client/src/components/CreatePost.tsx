export interface ModalCreatePost {
    onCloseModal: () => void;
}
const CreatePost: React.FC<ModalCreatePost> = ({onCloseModal}) => {
    return (
        <div className="modal">
            CreatePost
            <button onClick={onCloseModal} className='close_modal'></button>
        </div>
    )
}

export default CreatePost;