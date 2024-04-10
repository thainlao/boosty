import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store/hoocs";
import { createLinkedSub } from "../store/reducers/subSlice";
import { useState } from "react";

export interface ModalCreateSign {
    onCloseSignModal: () => void;
}
const CreateSign: React.FC<ModalCreateSign> = ({onCloseSignModal}) => {

    const dispatch = useAppDispatch();
    const params = useParams();
    const subNameParams: any = params.subname;

    const [linkedSubName, setLinkedSubName] = useState('');
    const [linkedSubPrice, setLinkedSubPrice] = useState<number>(0);
    const [linkedSubAbout, setLinkedSubAbout] = useState('');

    const handleCreateLinkedSub = async () => {
        try {
            await dispatch(createLinkedSub({ add_sub_about: linkedSubAbout ,subNameParams, add_sub_name: linkedSubName, add_sub_price: linkedSubPrice}))
            onCloseSignModal();
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="modal">
            CreateSign
            <div className="modal_linked">
                <div>
                    <h2>Название</h2>
                    <input placeholder="Название" value={linkedSubName} onChange={(e) => setLinkedSubName(e.target.value)}/>
                </div>

                <div>
                    <h2>Описание</h2>
                    <input placeholder="Описание" value={linkedSubAbout} onChange={(e) => setLinkedSubAbout(e.target.value)}/>
                </div>

                <div>
                    <h2>Цена</h2>
                    <input placeholder="Цена" value={linkedSubPrice} onChange={(e: any) => setLinkedSubPrice(e.target.value)} />
                </div>
                <button onClick={handleCreateLinkedSub}>Создать</button>
            </div>
            <button onClick={onCloseSignModal} className='close_modal'></button>
        </div>
    )
}

export default CreateSign;