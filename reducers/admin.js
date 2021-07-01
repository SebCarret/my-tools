export default function admin(state = {}, action) {
    if (action.type === "login") {
        return action.admin
    } else if (action.type === "update") {
        return action.admin
    } else if (action.type === "logout") {
        return action.admin
    } else {
        return state
    }
};