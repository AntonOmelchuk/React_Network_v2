import {dialogsAPI} from '../api/api';
import {dialogsTypes} from './types';

type ToggleIsLoadingType = {
    type: typeof dialogsTypes.TOGGLE_IS_LOADING,
    payload: boolean
};

type SetCurrentIdType = {
    type: typeof dialogsTypes.SET_CURRENT_ID,
    payload: number
};

type GetDialogsSuccessType = {
    type: typeof dialogsTypes.GET_DIALOGS_SUCCESS,
    payload: object
};

type GetMessagesSuccessType = {
    type: typeof dialogsTypes.GET_MESSAGES_SUCCESS,
    payload: object
};

type SendMessageSuccessType = {
    type: typeof dialogsTypes.SEND_MESSAGE_SUCCESS,
    payload: string
};

type ToggleShowModal = {
    type: typeof dialogsTypes.TOGGLE_SHOW_MODAL
};

type SetCurrentUser = {
    type: typeof dialogsTypes.SET_CURRENT_USER,
    payload: object
};

type ShowSendMessageSuccessModal = {
    type: typeof dialogsTypes.SHOW_SENT_MESSAGE_SUCCESS_MODAL
};

type HideSendMessageSuccessModal = {
    type: typeof dialogsTypes.HIDE_SENT_MESSAGE_SUCCESS_MODAL
};

export const toggleIsLoading = (value: boolean): ToggleIsLoadingType => ({
    type: dialogsTypes.TOGGLE_IS_LOADING,
    payload: value
});

export const setCurrentId = (id: number): SetCurrentIdType => ({
    type: dialogsTypes.SET_CURRENT_ID,
    payload: id
});

export const getDialogsSuccess = (data: any): GetDialogsSuccessType => ({
    type: dialogsTypes.GET_DIALOGS_SUCCESS,
    payload: data
});

export const getMessagesSuccess = (data: object): GetMessagesSuccessType => ({
    type: dialogsTypes.GET_MESSAGES_SUCCESS,
    payload: data
});

export const sendMessageSuccess = (message: string): SendMessageSuccessType => ({
    type: dialogsTypes.SEND_MESSAGE_SUCCESS,
    payload: message
});

export const toggleShowModal = (): ToggleShowModal => ({type: dialogsTypes.TOGGLE_SHOW_MODAL});

export const setCurrentUser = (user: object): SetCurrentUser => ({
    type: dialogsTypes.SET_CURRENT_USER,
    payload: user
});

export const showSendMessageSuccessModal = (): ShowSendMessageSuccessModal => ({type: dialogsTypes.SHOW_SENT_MESSAGE_SUCCESS_MODAL});
export const hideSendMessageSuccessModal = (): HideSendMessageSuccessModal => ({type: dialogsTypes.HIDE_SENT_MESSAGE_SUCCESS_MODAL});

export const getDialogs = () => async (dispatch: any) => {
    try {
        dispatch(toggleIsLoading(true));
        const response = await dialogsAPI.getDialogs();
        dispatch(toggleIsLoading(false));
        if(response.status === 200) {
            dispatch(getDialogsSuccess(response.data));
        }
    } catch(err) {
        console.log(err);
    }
};

export const getMessages = (userId: number) => async (dispatch: any) => {
    try {
        const response = await dialogsAPI.getMessages(userId);
        dispatch(setCurrentId(userId));
        if(response.status === 200) {
            dispatch(getMessagesSuccess(response.data.items));
        }
    } catch(err) {
        console.log(err);
    }
};

export const sendMessage = (userId: number, message: string, fromModal = false) => async (dispatch: any) => {
    try {
        const response = await dialogsAPI.sendMessage(userId, message);
        if(response.status === 200) {
            if(fromModal) {
                dispatch(showSendMessageSuccessModal());
                setTimeout(() => dispatch(hideSendMessageSuccessModal()), 5400);
            }
            dispatch(sendMessageSuccess(response.data.data.message));
        }
    } catch(err) {
        console.log(err);
    }
};

export const getInitDialogs = (id: number) => async (dispatch: any, getState: Function) => {
    try {
        await dispatch(getDialogs());
        const state = await getState();
        const currentId = id || state.dialogs.dialogs[0].id;
        dispatch(setCurrentId(currentId));
        dispatch(getMessages(currentId));
    } catch(err) {
        console.log(err);
    }
};

export const startNewDialog = (user: object) => async (dispatch: any) => {
    dispatch(toggleShowModal());
    dispatch(setCurrentUser(user));
};

export const deleteMessages = (messages: Array<number>, userId: number) => async (dispatch: any) => {
    try {
        await messages.map((id: number) => dialogsAPI.deleteMessage(id));

        dispatch(getMessages(userId));
    } catch(err) {
        console.log(err);
    }
};