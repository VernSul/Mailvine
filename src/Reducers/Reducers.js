import * as types from '../Actions/actionsType';
import State from '../models/Store';


const mainReducer = (state = new State(), action) => {
    const { type } = action;
    let updatedState = {...state};
    switch(type){
        case types.NEW_RECIP: {
            let recip = {...action.payload.data };
            updatedState.recipient = recip;
            return updatedState;
        }
        case types.SET_EMAILS: {
            updatedState.emails = action.payload.data;
            return updatedState;
        }

        case types.SET_ADDRESS: {
            updatedState.selAddress = action.payload.data;
            return updatedState;
        }

        case types.SET_TEMPLATE: {
            updatedState.templateID = action.payload.data;
            return updatedState;

        }
        case types.UPDATE_STATE: {
            console.log(action.payload.data);
            updatedState[action.payload.data[0]] = action.payload.data[1];
            return updatedState;
        }
        case types.SET_USER_INFO: {
            let _ = action.payload.data
            let info = {};

            info.picUrl = _.Paa;
            info.email = _.U3;
            info.fullName = _.ig;
            info.firstName = _.ofa;
            info.lastName = _.wea;
            
            updatedState.userInfos = info;

            return updatedState;
            // Eea: "117581033458174390170"
            // Paa: "https://lh4.googleusercontent.com/-l8srXxEs-Bs/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3req18hX9uRF-AnSIvcGUVUyanJLow/s96-c/photo.jpg"
            // U3: "vicfaucon@gmail.com"
            // ig: "Victor Faucon"
            // ofa: "Victor"
            // wea: "Faucon"

        }
        default : {
            return state;
        }
    }


}

export default mainReducer;