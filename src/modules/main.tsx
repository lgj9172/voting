const LOGIN = 'main/LOGIN' as const;

export const login = (newId:string) => ({
    type: LOGIN,
    newId: newId
});
type ActionTypes = 
    | ReturnType<typeof login>;

interface InitionStateType{
    id: string,
}
const initialState:InitionStateType = {
    id: 'admin',
};

function main(state = initialState, action:ActionTypes){
    switch(action.type){
        case LOGIN:
            return {
                id: action.newId
            };
        default:
            return state;
    }
}

export default main;