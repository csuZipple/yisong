import { SET_TOKEN, SET_STORE, SET_STORE_NAME } from '../action/ActionType';

var reducer = (state = false, action) => {
    switch(action.type){
        case SET_TOKEN:
            return Object.assign({}, state, {token: action.token});
        case SET_STORE:
            return Object.assign({}, state, {storeId: action.storeId});
        case SET_STORE_NAME:
            return Object.assign({}, state, {storeName: action.storeName});
        default:
            return state === undefined ? [] : state;
    }
}

export default reducer;