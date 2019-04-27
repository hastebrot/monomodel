import React, { Fragment } from "react"
import createStore from "storeon"
import StoreContext from "storeon/react/context"
import { check, checkNotNil } from "../helpers/utils"
import forms from "./forms"

export const StoreContextProvider = ({ children, store = defaultStore }) => {
  checkNotNil(store, () => "store context needs a store.")
  return (
    <StoreContext.Provider value={store}>
      <Fragment>{children}</Fragment>
    </StoreContext.Provider>
  )
}

const devtoolsOptions = {
  features: {
    pause: false,
    lock: false,
    import: false,
    export: false,
  },
}

export const createDefaultStore = (...stores) => {
  return createStore([
    ...stores,
    process.env.NODE_ENV !== "production" &&
      require("storeon/devtools")(devtoolsOptions),
    process.env.NODE_ENV !== "production" && require("storeon/devtools/logger"),
  ])
}

export const defaultStore = createDefaultStore(forms)
