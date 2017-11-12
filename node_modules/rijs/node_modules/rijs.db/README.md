# Ripple | Database
[![Coverage Status](https://coveralls.io/repos/rijs/db/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/db?branch=master)
[![Build Status](https://travis-ci.org/rijs/db.svg)](https://travis-ci.org/rijs/db)

Allows connecting a node to external services. For example, when a resource changes, it could update a database, synchronise with other instances over AMQP, or pump to Redis. 

```js
ripple = require('rijs')({ db: 'type://user:password@host:port/database' })
```

It destructures the connection string into an object, looks up the `type` in `ripple.adaptors`, then passes that function the connection string as an object, and stores the result under `ripple.connections`. 

```js
ripple.connections.push(
  ripple.adaptors[type]({ type, user, database, port, host, password })
)
```

You must register any adaptors you wish to use separate to this module. An adaptor is a constructor function that takes the connection string as an object, creates an active connection and returns an object of functions for each possible change type: `{ add, update, remove }`. These hooks will be invoked when the corresponding event occurs.

```js
ripple.on('change', ({ key, value, type }) => 
  ripple.connections.map(con => 
    con[type](res, key, value)))
```