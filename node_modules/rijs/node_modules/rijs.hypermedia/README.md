# Ripple | Hypermedia
[![Coverage Status](https://coveralls.io/repos/rijs/hypermedia/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/hypermedia?branch=master)
[![Build Status](https://travis-ci.org/rijs/hypermedia.svg)](https://travis-ci.org/rijs/hypermedia)

Extends [core](https://github.com/rijs/core#ripple--core) to register a HATEOAS API as a resource, traverse links to other resources, and cache them.

Normally, you can register some array/object/function/whatever against a key:

```js
ripple('key', { value })
```

This module lets you load a remote resource if the body is a URL:

```js
ripple('github', 'https://api.github.com')
// ripple('github') would then return the root object with all the links
```

and it lets you follow deep links (from the nearest resolved link):

```js
ripple('github.current_user_url.id')
ripple('github.current_user_url.repos_url.0')
ripple('github.current_user_url.repos_url.0.owner.login')
```

If it hits a property whose value is a URL (in the GitHub API, all those suffixed with `*_url`), it resolves and caches them as an intermediate resource. So accessing `ripple('github.current_user_url.id')`, would also populate the resource `ripple('github.current_user_url')`.

You can pass any extra headers you want (in this case, basic auth) to be used in the request by setting the `http` header (accessing subresource will automatically inherit headers). 

```js
ripple('github', 'https://api.github.com', { http })
```

You can expand parameterised routes and also alias resources:

```js
ripple('repo', { owner: 'pemrouz', repo: 'ripple' }, { link: 'github.repository_url' })
```

Or even traverse multiple parameterised links:

```js
ripple('issue', { owner: 'pemrouz', repo: 'ripple', number: 1 }, { link: 'github.repository_url.issues_url' })
```

# TODO

* [ ] Add profiles for dot notation to be able to traverse other hypermedia formats (HTML, HAL, Siren, Collection, etc) - see [Jon Moore's presentation](http://www.infoq.com/presentations/web-api-html) for HTML example.
* [ ] Test use in declarative usage `<visualise-repos data="github.repos">` 
* [ ] Alias subresources `ripple('repos', 'github.current_user_url.repos_url')`
* [ ] Use same syntax to `POST` messages back: `ripple('github.current_user_url.repos_url', { body: new repo details })`