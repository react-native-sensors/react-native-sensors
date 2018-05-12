---
id: Usage.RxJS
title: The RxJS Syntax of React Native Sensors
sidebar_label: RxJS Syntax
---

You can access your sensor data through a [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html). This way you have the maximum of control over your data stream. You can add the values up, filter them, only react if a certain value is reached: You have the choice. Here is a small example showing the relatively small API interface. If you would like to learn more, please see the [API specification](/docs/API.html).

```javascript
import { Accelerometer, Gyroscope } from "react-native-sensors";

let accelerationObservable = null;
new Accelerometer({
	updateInterval: 400 // defaults to 100ms
})
	.then(observable => {
		accelerationObservable = observable;

		// Normal RxJS functions
		accelerationObservable
			.map(({ x, y, z }) => x + y + z)
			.filter(speed => speed > 20)
			.subscribe(speed => console.log(`You moved your phone with ${speed}`));
	})
	.catch(error => {
		console.log("The sensor is not available");
	});

setTimeout(() => {
	accelerationObservable.stop();
}, 1000);
```
