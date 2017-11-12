# Ripple | Shadow DOM
[![Coverage Status](https://coveralls.io/repos/rijs/shadow/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/shadow?branch=master)
[![Build Status](https://travis-ci.org/rijs/shadow.svg)](https://travis-ci.org/rijs/shadow)

Extends the [rendering pipeline]() to append a shadow root before rendering a custom element. If the browser does not support shadow roots, it sets the `host`/`shadowRoot` pointers so that a component implementation depending on them works both in the context of a shadow root or without.