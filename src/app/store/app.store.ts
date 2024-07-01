import { ActionReducerMap } from "@ngrx/store";
import * as AuthStore from "./auth.store";

export interface AppState {
  auth: AuthStore.State,
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: AuthStore.authReducer,
};