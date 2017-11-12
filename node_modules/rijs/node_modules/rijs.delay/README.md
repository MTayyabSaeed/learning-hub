# Ripple | Delay
[![Coverage Status](https://coveralls.io/repos/rijs/delay/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/delay?branch=master)
[![Build Status](https://travis-ci.org/rijs/delay.svg)](https://travis-ci.org/rijs/delay)

Extends the [rendering pipeline]() to delay rendering a view by a specified time (ms)

```js
<component-name delay="500">
```

This is useful to make your app feel more responsive. If you are rendering a long list/feed of things, consider turning it asynchronous to give your page breathing space to run smoother.