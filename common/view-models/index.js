import * as EventTypes from '../eventTypes'

export default [
  {
    name: 'Todos',
    projection: {
      Init: () => ({}),
      [EventTypes.ITEM_CREATED]: (state, { payload: { id, text } }) => {
        return {
          ...state,
          [id]: {
            text,
            checked: false
          }
        }
      },
      [EventTypes.ITEM_TOGGLED]: (state, { payload: { id } }) => {
        if (!state[id]) {
          return state
        }

        return {
          ...state,
          [id]: {
            ...state[id],
            checked: !state[id].checked
          }
        }
      },
      [EventTypes.ITEM_REMOVED]: (state, { payload: { id } }) => {
        const nextState = { ...state }
        delete nextState[id]
        return nextState
      }
    },
    serializeState: state => JSON.stringify(state),
    deserializeState: state => JSON.parse(state)
  }
]
