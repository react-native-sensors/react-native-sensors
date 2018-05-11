import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Gyroscope } from "react-native-sensors";
const Dimensions = require('Dimensions');
const PixelRatio = require('PixelRatio');
const window = Dimensions.get('window');

const kitten = require("./img/kitten.jpeg");

const deviceWidth = window.width;
const deviceHeight = window.height;

const imageWidth = 8 * deviceWidth;
const imageHeight = deviceHeight;

const middleOfTheScreenX = (imageWidth - deviceWidth) / 2;
const middleOfTheScreenY = (imageHeight - deviceHeight) / 2;

export default class App extends Component {
  constructor(props) {
    super(props);

    new Gyroscope({
      updateInterval: 50
    })
      .then(observable => {
        observable
          .subscribe(({x,y,z}) => {
            this.setState(state => ({
              x: x + state.x,
              y: y + state.y,
              z: z + state.z
            }));
          });
      })
      .catch(error => {
        console.log("The sensor is not available");
      });
      
    this.state = {
      image: `https://placeimg.com/${PixelRatio.getPixelSizeForLayoutSize(imageWidth)}/${PixelRatio.getPixelSizeForLayoutSize(imageHeight)}/any`,
      x: 0, 
      y: 0, 
      z: 0
    };
  }


  render() {
    console.log("State", this.state);
    const positionOnScreenX = -imageWidth / 2;
    const positionOnScreenY = 0;

    const movementX = (-this.state.y / 10) * imageWidth;
    const movementY = 0;

    return (
      <View style={styles.container}>
        <Image
          translateX={positionOnScreenX + movementX}
          style={styles.image}
          source={{uri: this.state.image}}
        />
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
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: imageHeight,
    width: imageWidth,
  },
});
