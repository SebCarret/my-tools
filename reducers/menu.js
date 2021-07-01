export default function menu(state = null, action){
    if (action.type === 'selectMenu'){
        return action.menu
    } else {
        return state
    }
};