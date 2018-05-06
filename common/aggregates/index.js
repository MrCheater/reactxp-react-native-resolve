import * as EventTypes from '../eventTypes'

export default [
  {
    name: 'Todo',
    initialState: {},
    projection: {
      [EventTypes.ITEM_CREATED]: (state, { timestamp, payload: { id } }) => {
        return {
          ...state,
          [id]: {
            createdAt: timestamp
          }
        }
      },
      [EventTypes.ITEM_REMOVED]: (state, { timestamp, payload: { id } }) => {
        return {
          ...state,
          [id]: {
            ...state[id],
            removedAt: timestamp
          }
        }
      }
    },
    commands: {
      createItem: (state, { payload: { id, text } }) => {
        if (state[id]) {
          throw new Error('Item already exist')
        }

        return {
          type: EventTypes.ITEM_CREATED,
          payload: { id, text }
        }
      },
      toggleItem: (state, { payload: { id } }) => {
        if (!state[id]) {
          throw new Error('Item does not exist')
        }

        if (state[id].removedAt) {
          throw new Error('Item already removed')
        }

        return {
          type: EventTypes.ITEM_TOGGLED,
          payload: { id }
        }
      },
      removeItem: (state, { payload: { id } }) => {
        if (!state[id]) {
          throw new Error('Item does not exist')
        }

        if (state[id].removedAt) {
          throw new Error('Item already removed')
        }

        return {
          type: EventTypes.ITEM_REMOVED,
          payload: { id }
        }
      }
    }
  }
]
