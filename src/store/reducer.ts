import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import authReducer from "@/store/slices/authSlice";
import storage from "redux-persist/lib/storage";

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage: storage,
      keyPrefix: "estate-master-",
      debug: false,
      whitelist: ["user", "token", "isAdminLoggedIn"],
      timeout: 20000,
    },
    authReducer
  ),
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;
