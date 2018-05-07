
import React from 'react'
import RX from 'reactxp'
import createHistory from 'history/createMemoryHistory'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Routes, createStore } from 'resolve-scripts'


const routes = require($resolve.routes)
const rootPath = $resolve.rootPath

const initialState = {}

const origin = "http://172.22.1.107:3000"

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

