import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Gyroscope } from "react-native-sensors";
const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const kitten = require("./img/kitten.jpeg")

const imageWidth = 1000;
const imageHeight = 500;

const deviceWidth = window.width;
const deviceHeight = window.height;

const middleOfTheScreenX = (imageWidth - deviceWidth) / 2;
const middleOfTheScreenY = (imageHeight - deviceHeight) / 2;

export default class App extends Component {
  constructor(props) {
    super(props);

    new Gyroscope({
      updateInterval: 400 // defaults to 100ms
    })
      .then(observable => {
        observable
          // .filter(({x,y}) => x >= 1 || y >= 1)
          // .debounceTime(10)
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
      image: `https://placekitten.com/${imageWidth}/${imageHeight}`,
      x: 0, 
      y: 0, 
      z: 0
    };
  }


  render() {
    console.log("State", this.state);
    const positionOnScreenX = 0;
    const positionOnScreenY = 0;

    return (
      <View style={styles.container}>
        <Image
          translateX={positionOnScreenX + (this.state.y * 10)}
          translateY={positionOnScreenY + (this.state.x * 10)}
          style={styles.image}
          source={kitten}
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
