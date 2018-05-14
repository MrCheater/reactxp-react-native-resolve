import React from 'react'
import RX from 'reactxp'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Routes, createStore } from 'resolve-scripts'

import routes from '$resolve.routes'
import createHistory from '$resolve.crossplatform.history'

const rootPath = $resolve.rootPath

const origin = $resolve.crossplatform.origin

const initialState = {}

const history = createHistory({
  basename: rootPath
})

const store = createStore({
  initialState,
  history,
  origin,
  rootPath
})

RX.App.initialize(true, true)
RX.UserInterface.setMainView(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes routes={routes} />
    </ConnectedRouter>
  </Provider>
)

