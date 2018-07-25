import React from 'react'
import RX from 'reactxp'
import { AppContainer, createStore } from 'resolve-redux'

import createHistory from './crossplatform/history'

import routes from '$resolve.routes'
import rootPath from '$resolve.rootPath'
import staticPath from '$resolve.staticPath'
import aggregateActions from '$resolve.aggregateActions'
import viewModels from '$resolve.viewModels'
import readModels from '$resolve.readModels'
import aggregates from '$resolve.aggregates'
import subscribeAdapter from '$resolve.subscribeAdapter'
import redux from '$resolve.redux'

const origin = $crossplatform.origin

const initialState = {}

const history = createHistory({
  basename: rootPath
})

const isClient = true

const store = createStore({
  redux,
  viewModels,
  readModels,
  aggregates,
  subscribeAdapter,
  initialState,
  history,
  origin,
  rootPath,
  isClient
})

RX.App.initialize(true, true)
RX.UserInterface.setMainView(
  <AppContainer
    origin={origin}
    rootPath={rootPath}
    staticPath={staticPath}
    aggregateActions={aggregateActions}
    store={store}
    history={history}
    routes={routes}
  />
)

