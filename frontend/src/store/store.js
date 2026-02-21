import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "./workspaceSlice";

import { persistStore, persistReducer } from "redux-persist";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import storage from "redux-persist/lib/storage/index.js";
import storageImport from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const storage =
  storageImport?.default ? storageImport.default : storageImport;


// console.log(storage);

// const storage =
//   typeof window !== "undefined"
//     ? createWebStorage("local")
//     : {
//         getItem: () => Promise.resolve(null),
//         setItem: () => Promise.resolve(),
//         removeItem: () => Promise.resolve(),
//       };

const rootReducer = combineReducers({
  workspace: workspaceReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["workspace"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST","persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
