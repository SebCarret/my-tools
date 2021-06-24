export default function list(state = [], action){
    let stateCopy = [...state];
    if (action.type === 'loadList'){
        return action.lists
    } else if (action.type === 'addNewList'){
        if (!stateCopy.includes(action.newList)){
            stateCopy.push(action.newList)
        };
        return stateCopy
    } else {
        return state
    }
};