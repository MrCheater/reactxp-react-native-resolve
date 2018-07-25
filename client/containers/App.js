import { View, Text, Styles } from 'reactxp'

import React, { Component } from 'react'

import { Page } from '../components/page/Page'
import { Todo } from '../components/Todo'
import { TextInput } from '../components/TextInput'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectViewModel } from 'resolve-redux'


const styles = {
  view: Styles.createViewStyle({
    flex: 1,
    alignItems: 'center'
  }),

  title: Styles.createTextStyle({
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 20
  }),

  list: Styles.createViewStyle({})
}

const viewModelName = 'Todos'
const aggregateId = 'root-id'

export class App extends Component {
  createTodo = text => {
    this.props.createItem(aggregateId, { id: Date.now(), text })
  }

  toggleTodo = id => {
    this.props.toggleItem(aggregateId, { id })
  }

  removeTodo = id => {
    this.props.removeItem(aggregateId, { id })
  }

  sortTodos = todos => {
    const arrTodos = Object.keys(todos).map(id => ({ id, ...todos[id] }))
    arrTodos.sort((a, b) => a.checked - b.checked)
    return arrTodos
  }

  render() {
    const { todos } = this.props

    return (
      <Page style={styles.view}>
        <Text style={styles.title}>TODO List</Text>
        <View accessibilityLabel="todos" style={styles.list}>
          {todos &&
            this.sortTodos(todos).map(todo => (
              <Todo
                key={todo.id}
                todo={todo}
                onToggle={this.toggleTodo}
                onRemove={this.removeTodo}
              />
            ))}
          <TextInput
            key="add-todo"
            placeholder="New TODO"
            onSubmit={this.createTodo}
          />
        </View>
      </Page>
    )
  }
}

const mapStateToOptions = () => ({
  viewModelName,
  aggregateIds: [aggregateId]
})

const mapStateToProps = (state, { data }) => ({
  todos: data
})

const mapDispatchToProps = (dispatch, { aggregateActions }) => bindActionCreators(aggregateActions, dispatch)

export default connectViewModel(mapStateToOptions)(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
