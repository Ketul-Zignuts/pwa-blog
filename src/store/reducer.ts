import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import authReducer from "@/store/slices/authSlice";
import homeReducer from "@/store/slices/homeSlice";
import filterReducer from "@/store/slices/filterSlice";
import storage from "@/lib/storage";

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage,
      keyPrefix: "blog-master-",
      debug: false,
      whitelist: ["user", "token", "isAdminLoggedIn"],
      timeout: 20000,
    },
    authReducer
  ),

  home: persistReducer(
    {
      key: "home",
      storage,
      keyPrefix: "blog-master-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    homeReducer
  ),
  filter: persistReducer(
    {
      key: "filter",
      storage,
      keyPrefix: "blog-master-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    filterReducer
  ),
});

export default reducer;