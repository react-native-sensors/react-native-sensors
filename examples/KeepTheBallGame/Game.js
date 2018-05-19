import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const TABLE_SIZE = 250;
const BALL_SIZE = 50;

function Table({ children }) {
  return <View style={[styles.table, styles.centeredContent]}>{children}</View>;
}

function Ball({ x, y }) {
  return (
    <View
      style={[
        styles.ball,
        { transform: [{ translateX: x }, { translateY: y }] }
      ]}
    />
  );
}

function GameOverScreen({ onNewGame }) {
  return (
    <Button onPress={onNewGame} title="You lost. Click here to start again" />
  );
}

const neutralData = {
  x: 0,
  y: 0
};

const hasFallenFromTable = (x, y) =>
  Math.abs(x) > TABLE_SIZE / 2 || Math.abs(y) > TABLE_SIZE / 2;

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = { ...neutralData };
  }

  componentDidMount() {
    this.startGameEventListener();
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  startGameEventListener() {
    this.subscription = this.props.data
      .startWith(neutralData)
      .scan(
        (acc, value) => ({ x: acc.x - value.x, y: acc.y + value.y }),
        neutralData
      )
      .subscribe(({ x, y }) => {
        if (hasFallenFromTable(x, y)) {
          this.setState({ gameOver: true });
        } else {
          this.setState({ x, y });
        }
      });
  }

  startNewGame() {
    console.log("Starting a new game");
    this.subscription.unsubscribe();
    this.setState({ gameOver: false });
    this.startGameEventListener();
  }

  render() {
    if (this.state.gameOver) {
      return <GameOverScreen onNewGame={this.startNewGame.bind(this)} />;
    }

    return (
      <Table>
        <Ball {...this.state} />
      </Table>
    );
  }
}

const styles = StyleSheet.create({
  centeredContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  table: {
    height: TABLE_SIZE,
    width: TABLE_SIZE,
    backgroundColor: "rgb(50,50,180)"
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "red"
  }
});
