import ava1 from '../assets/avatars/ava1.jpg'
import ava2 from '../assets/avatars/ava2.jpg'
import ava3 from '../assets/avatars/ava3.jpg'
import ava4 from '../assets/avatars/ava4.jpg'
import {ADD_POST, TOGGLE_LIKED} from '../actions/types';

const initialState = {
    posts: [
        {id: 1, ava: ava1, text: `React or Angular?`, likes: 12, date: 'Mon Nov 04 2019 11:42:46', liked: false},
        {id: 2, ava: ava2, text: `Like, if you use Node.js`, likes: 1, date: 'Mon Nov 04 2019 11:42:46', liked: false},
        {id: 3, ava: ava3, text: `Did you watch React conf`, likes: 4, date: 'Mon Nov 04 2019 11:42:46', liked: false},
        {id: 4, ava: ava4, text: `I watch 'Silicon Valley'`, likes: 3, date: 'Mon Nov 04 2019 11:42:46', liked: false}
    ]
};

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };
        case TOGGLE_LIKED:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.id === action.payload) {
                        if(post.liked === false) {
                            post.likes++
                        } else {
                            post.likes--
                        }
                        post.liked = !post.liked
                    }
                    return post
                })
            };
        default:
            return state
    }
};
