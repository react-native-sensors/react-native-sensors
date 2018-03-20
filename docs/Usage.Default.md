---
id: Usage.Default
title: The Default Syntax of React Native Sensors
sidebar_label: Default Syntax
---

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
