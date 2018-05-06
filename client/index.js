import React from 'react'
import RX from 'reactxp'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'

import { Routes, createStore, deserializeInitialState } from 'resolve-scripts'

const routes = require($resolve.routes)
const rootPath = $resolve.rootPath

const initialState = deserializeInitialState(window.__INITIAL_STATE__)

const origin = window.location.origin

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
