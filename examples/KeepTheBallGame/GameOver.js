import React from "react";
import { Button } from "react-native";

export default function GameOverScreen({ onNewGame }) {
  return <Button onPress={onNewGame} title="You lost. Click here to start again!" />;
}
