import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Gyroscope } from "react-native-sensors";
const Dimensions = require("Dimensions");
const PixelRatio = require("PixelRatio");
const window = Dimensions.get("window");

const deviceWidth = window.width;
const deviceHeight = window.height;

const imageWidth = 8 * deviceWidth;
const imageHeight = deviceHeight;

const gyro$ = new Gyroscope({
  updateInterval: 50
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: `https://placeimg.com/${PixelRatio.getPixelSizeForLayoutSize(
        imageWidth
      )}/${PixelRatio.getPixelSizeForLayoutSize(imageHeight)}/any`,
      y: 0
    };
  }

  componentDidMount() {
    const subscription = gyro$.subscribe(({ y }) => {
      this.setState(state => ({
        y: y + state.y
      }));
    });

    this.setState({ subscription });
  }

  componentWillUnmount() {
    this.state.subscription.unsubscribe();
  }

  render() {
    const positionOnScreenX = -imageWidth / 2;
    // The y axis of the sensor data resembles what we need for the x axis
    // in the image
    const movementX = -this.state.y / 1000 * imageWidth;

    return (
      <View style={styles.container}>
        <Image
          translateX={positionOnScreenX + movementX}
          style={styles.image}
          source={{ uri: this.state.image }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    height: imageHeight,
    width: imageWidth
  }
});
