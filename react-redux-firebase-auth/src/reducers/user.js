import {
    REQUEST_SIGN_IN,
    SIGNED_IN,
    SIGN_OUT
} from '../actions/user';

import { db } from '../firebase/firebase';

const initialState = {
    user: null,
    // credits: null,
    // usertype: "Initial state"
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case REQUEST_SIGN_IN:
            return state;
        // case REQUEST_SIGN_IN:
        //     return Object.assign({}, state, {
        //         credits: 12,
        //         usertype: "from REQUEST_SIGN_IN action"
        //     });


        case SIGNED_IN:
            // let c='initial credits'
            // let t = 'uobou'

            // if(action.user !== null){
            
            //     let userRef = db.collection('users')
            //     let query = userRef.where('email','==',action.user.email).get()
            //       .then(snapshot => {
            //         if (snapshot.empty) {
            //           console.log('User does not exist in Database');
            //           return;
            //         }  
            //         snapshot.forEach(doc => {
            //             let temp = doc.data()
            //             console.log("sadcd")
            //             // console.log(temp)
            //             return Object.assign({}, state, {
            //                 user: action.user,
            //                 credits: c,
            //                 usertype: t
            //             });

            //         });
            //       })
            //       .catch(err => {
            //         console.log('Error getting documents', err);
            //       });
            //   }

            //     c=14
            //     t="re"
            // }

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