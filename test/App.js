import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';


export default class App extends Component {
  state = {
    view: null
  };

  render() {
    if (this.state.view === "default") {
      return (
        <View style={styles.container}>
        <Text testID="headline-default" style={styles.welcome}>
          Default usage
        </Text>
        <TouchableHighlight testID="nav-back" onPress={() => this.setState({view: null})}>
          <Text>Go Back</Text>
        </TouchableHighlight>
      </View>
      )
    }

    if (this.state.view === "decorator") {
      return (
        <View style={styles.container}>
        <Text testID="headline-decorator" style={styles.welcome}>
          Decorator usage
        </Text>
        <TouchableHighlight testID="nav-back" onPress={() => this.setState({view: null})}>
          <Text>Go Back</Text>
        </TouchableHighlight>
      </View>
      )
    }

    return (
      <View style={styles.container}>
        <Text testID="headline-main" style={styles.welcome}>
          Main
        </Text>
        <TouchableHighlight testID="nav-default" onPress={() => this.setState({view: 'default'})}>
          <Text>GoTo Default</Text>
        </TouchableHighlight>
        <TouchableHighlight testID="nav-decorator" onPress={() => this.setState({view: 'decorator'})}>
          <Text>GoTo Decorator</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
