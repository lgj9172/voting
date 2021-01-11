import { combineReducers } from "redux";
import main from "./main"

const rootReducer = combineReducers({
    main,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;