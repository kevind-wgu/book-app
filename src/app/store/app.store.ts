import { ActionReducerMap } from "@ngrx/store";
import * as AuthStore from "./auth.store";
import * as SeriesStore from "./series.store";
import * as UserStore from "./userdata.store";
import * as GlobalStore from "./global.store";

export interface AppState {
  auth: AuthStore.State,
  series: SeriesStore.State,
  userdata: UserStore.State,
  global: GlobalStore.State,
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: AuthStore.authReducer,
  series: SeriesStore.SeriesReducer,
  userdata: UserStore.UserDataReducer,
  global: GlobalStore.GlobalReducer,
};