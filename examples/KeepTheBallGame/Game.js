import React, { Component } from "react";
import { Text, View, Button } from "react-native";

import Ball, { BALL_SIZE } from "./Ball";
import Table, { TABLE_SIZE } from "./Table";
import GameOverScreen from "./GameOver";

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
