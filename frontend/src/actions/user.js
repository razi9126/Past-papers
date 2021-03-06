/*
 * action types
 */
export const REQUEST_SIGN_IN = 'REQUEST_SIGN_IN';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGN_OUT = 'SIGN_OUT';

/*
 * action creators
 */ 

export function requestSignIn() {
    return {
        type: REQUEST_SIGN_IN
    }
}

export function signedIn(user,credits,usertype) {
    // console.log("USER PLS" , credits)
    return { 
        type: SIGNED_IN,
        user,
        credits,
        usertype
    }
}

export function signOut() {
    return {
        type: SIGN_OUT
    }
}
