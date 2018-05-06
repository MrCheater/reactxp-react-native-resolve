import React from 'react'
import uuid from 'uuid/v4'
import { connectViewModel } from 'resolve-redux'
import { bindActionCreators } from 'redux'
import { View, Text, TextInput, Button, Styles } from 'reactxp'

const viewModelName = 'Todos'
const aggregateId = 'root-id'

const styles = {
  header: Styles.createViewStyle({
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ccdddd',
    paddingHorizontal: 8,
    paddingVertical: 16,
    fontSize: 20
  }),
  listContainer: Styles.createViewStyle({
    padding: 0,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'stretch'
  }),
  container: Styles.createViewStyle({
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#eeeeee'
  }),
  submitButton: Styles.createViewStyle({
    margin: 8,
    borderRadius: 6,
    backgroundColor: '#666666'
  }),
  buttonText: Styles.createTextStyle({
    fontSize: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    color: '#ffffff'
  }),
  listScroll: Styles.createViewStyle({
    flexDirection: 'column',
    alignSelf: 'stretch',
    backgroundColor: '#eeeeee'
  }),
  itemCell: Styles.createViewStyle({
    flex: 1,
    justifyContent: 'center'
  }),
  itemText: Styles.createTextStyle({
    fontSize: 20,
    marginHorizontal: 8,
    alignSelf: 'stretch',
    color: '#666'
  }),

  editTodoItem: Styles.createTextStyle({
    margin: 8,
    fontSize: 20,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4
  })
}

export class App extends React.PureComponent {
  state = {
    text: ''
  }

  updateText = text => {
    this.setState({
      text
    })
  }

  createItem = () => {
    this.props.createItem(this.props.aggregateId, {
      text: this.state.text === '' ? 'New Task' : this.state.text,
      id: uuid()
    })

    this.setState({
      text: ''
    })
  }

  toggleItem = id => {
    this.props.toggleItem(this.props.aggregateId, { id })
  }

  removeItem = id => {
    this.props.removeItem(this.props.aggregateId, { id })
  }

  render() {
    const { todos } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.header}>Task's List</View>
        <View style={styles.listContainer}>
          <View style={styles.listScroll}>
            {Object.keys(todos).map(id => (
              <Text style={styles.itemCell} key={id}>
                <Text
                  style={{
                    ...styles.itemText,
                    textDecorationLine: todos[id].checked
                      ? 'line-through'
                      : 'none'
                  }}
                  onPress={this.toggleItem.bind(null, id)}
                >
                  {todos[id].text}
                </Text>
                <Text onPress={this.removeItem.bind(null, id)}>[X]</Text>
              </Text>
            ))}
          </View>
        </View>
        <View>
          <TextInput
            style={styles.editTodoItem}
            onChangeText={this.updateText}
            value={this.state.text}
            autoFocus={true}
          />
          <Button style={styles.submitButton} onPress={this.createItem}>
            <Text style={styles.buttonText}>Add Task</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  viewModelName,
  aggregateId,
  todos: state.viewModels[viewModelName][aggregateId]
})

const mapDispatchToProps = (dispatch, props) =>
  bindActionCreators(props.aggregateActions, dispatch)

export default connectViewModel(mapStateToProps, mapDispatchToProps)(App)
