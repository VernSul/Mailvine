import * as types from '../Actions/actionsType';


export const newRecip = data => ({
    type : types.NEW_RECIP,
    payload : { data }
});

export const setAddress = data => ({
    type : types.SET_ADDRESS,
    payload : { data }
});

export const setEmails = data => ({
    type : types.SET_EMAILS,
    payload : { data }
});

export const setTemplate = data => ({
    type : types.SET_TEMPLATE,
    payload : { data }
});

export const updateState = data => ({
    type: types.UPDATE_STATE,
    payload: { data }
})

export const setUserInfo = data => ({
    type: types.SET_USER_INFO,
    payload: { data }
})