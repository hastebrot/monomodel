import { produce } from "immer"

export const FORMS_CREATE = Symbol("forms/create")
export const FORMS_CREATED = Symbol("forms/created")

export default store => {
  store.on("@init", () => {
    return {
      forms: {
        isReady: false,
      },
    }
  })

  store.on(FORMS_CREATE, async state => {
    store.dispatch(FORMS_CREATED, {})
  })

  store.on(FORMS_CREATED, (state, {}) => {
    return produce(state, state => {
      state.forms.isReady = true
    })
  })
}
