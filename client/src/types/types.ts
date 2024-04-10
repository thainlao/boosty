export interface modalHeaderProps {
    handleRegisterClick: () => void;
    handleLoginClick: () => void;
    closeModal: () => void;
    changeModal: () => void;
    showRegisterModal: boolean,
    showLoginModal: boolean,
}

export interface mainbodyProp {
    handleLoginClick: () => void;
}

export interface IUser {
    id: null | string;
    email: null | string;
    username: null | string;
    followers: any[];
    subscriptions: any[];
    avatar: string;
    createdsubscription: any[];
    isactivated: boolean;
}

export interface ISub {
    id: null | string;
    subname: null | string;
    creator_id: null | string;
    buyers: any[];
    sub_about: any[];
    content18plus: boolean;
    description: string | null;
    sub_avatar: string | null;
    sub_background: string | null;
    additionalsubs: AddiSUB[] | null;
}

export interface AddiSUB {
    id: null | string;
    add_sub_name: string | null;
    add_sub_about: string | null;
    add_sub_price: number | null;
    add_sub_relatedsub: number | null;
    add_sub_buyers: IUser[] | null;
}

export interface ModalProps {
    close: () => void;
    changemodal: () => void
}

export interface subState {
    status: string | null;
    user: IUser | null;
    isLoading: boolean;
    sub: ISub | null
    issubnameAvalible: boolean
}

export interface AuthState {
    token: string | null;
    status: string | null;
    user: IUser | null;
    isLoading: boolean;
    avatar: string | null
}

export interface RegisterUserParams {
    username: string;
    password: string;
    name: string;
    surname: string;
}

export interface RegisterUserResponse {
    user: IUser;
    token: string;
    message: string;
    name: string;
    surname: string
}

export interface AuthorPros {
    close: () => void
}