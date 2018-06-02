import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { componentFromStreamWithConfig } from "recompose";
import rxjsConfig from "recompose/rxjsObservableConfig";
import { Observable, Subject } from "rxjs";

import Ball, { BALL_SIZE } from "./Ball";
import Table, { TABLE_SIZE } from "./Table";
import GameOverScreen from "./GameOver";

const reset$ = new Subject();
const componentFromStream = componentFromStreamWithConfig(rxjsConfig);
const neutralData = {
  x: 0,
  y: 0
};

const hasFallenFromTable = (x, y) =>
  Math.abs(x) > TABLE_SIZE / 2 || Math.abs(y) > TABLE_SIZE / 2;

export default componentFromStream(props$ =>
  props$
    .switchMap(props => props.data)
    .startWith(neutralData)
    .scan(
      (acc, value) => ({ x: acc.x - value.x, y: acc.y + value.y }),
      neutralData
    )
    .do(({ x, y }) => {
      if (hasFallenFromTable(x, y)) {
        console.log("Marking the game as done");
        throw "game lost";
      }
    })
    .map(({ x, y }) => (
      <Table>
        <Ball x={x} y={y} />
      </Table>
    ))
    .catch(() =>
      Observable.of(
        <GameOverScreen
          onNewGame={() => console.log("We should start a new game")}
        />
      )
    )
);
