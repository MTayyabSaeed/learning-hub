# Ripple | Reactive
[![Coverage Status](https://coveralls.io/repos/rijs/reactive/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/reactive?branch=master)
[![Build Status](https://travis-ci.org/rijs/reactive.svg)](https://travis-ci.org/rijs/reactive)

Reacts to changes in data resources. 

Traditionally in JS Frameworks, you will make a change, then run a different command to signal an update:

```js
ripple('data').push(value)
ripple('data').emit('change')
```

This module makes the second line redundant. More philosophically, as a reactive design pattern, listeners (e.g. views updating) should update themselves as an epiphenomenon of data changing rather than an application developer directly instructing them too. 

```js
ripple('data').push(value)  // triggers ripple('data').emit('change')
```

Uses `Object.observe` in browsers that support it or polling in browsers that don't.