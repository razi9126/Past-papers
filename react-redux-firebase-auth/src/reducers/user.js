import {
    REQUEST_SIGN_IN,
    SIGNED_IN,
    SIGN_OUT
} from '../actions/user';


const initialState = {
    user: null,
    // credits: null,
    // usertype: "Initial state"
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case REQUEST_SIGN_IN:
            return state;
    
        case SIGNED_IN:
            return Object.assign({}, state, {
                user: action.user,
                credits: action.credits,
                usertype: action.usertype
            });
            
        case SIGN_OUT:
            return Object.assign({}, state, {
                user: null
            });
        default:
            return state;
    }
}