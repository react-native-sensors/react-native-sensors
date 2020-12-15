import React from "react";
import { componentFromStreamWithConfig } from "recompose";
import { of, from } from "rxjs";
import { switchMap, startWith, scan, tap, map, catchError } from "rxjs/operators";

import Ball from "./Ball";
import Table, { TABLE_SIZE } from "./Table";
import GameOverScreen from "./GameOver";

const rxjsConfig = {
  fromESObservable: from,
  toESObservable: stream => stream
};

const componentFromStream = componentFromStreamWithConfig(rxjsConfig);
const neutralData = {
  x: 0,
  y: 0
};

const hasFallenFromTable = (x, y) => Math.abs(x) > TABLE_SIZE / 2 || Math.abs(y) > TABLE_SIZE / 2;

export default componentFromStream(props$ =>
  props$.pipe(
    switchMap(props => props.data),
    startWith(neutralData),
    scan((acc, value) => ({ x: acc.x - value.x, y: acc.y + value.y }), neutralData),
    tap(({ x, y }) => {
      if (hasFallenFromTable(x, y)) {
        console.log("Marking the game as done");
        throw "game lost";
      }
    }),
    map(({ x, y }) => (
      <Table>
        <Ball x={x} y={y} />
      </Table>
    )),
    catchError(() => of(<GameOverScreen onNewGame={() => console.log("We should start a new game")} />))
  )
);
