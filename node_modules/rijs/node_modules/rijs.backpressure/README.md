# Ripple | Backpressure
[![Coverage Status](https://coveralls.io/repos/rijs/backpressure/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/backpressure?branch=master)
[![Build Status](https://travis-ci.org/rijs/backpressure.svg)](https://travis-ci.org/rijs/backpressure)

By default, [the Sync module](https://github.com/rijs/sync#ripple--sync) sends all resources to all clients. Users can limit this or change the representation sent to clients for each resource using the `to` transformation function. This module alters the default behaviour to only send resources and updates to clients for resources that they are using to eliminate over-fetching. You can still use the `to` hook to add extra business logic on top of this.

This works with both the declarative usage:

```html
<twitter-feed data="tweets" css="styles.css">
```
```js
// you will be sent twitter-feed, tweets, and styles.css
```

And the imperative usage:

```js
ripple('object') // will eventually resolve to value from server
```

# TODO 

* [ ] Explore subresource tracking
* [ ] Explore untracking 