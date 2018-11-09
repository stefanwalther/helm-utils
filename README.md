# helm-utils

> Some missing utils when working with helm (as node.js library + CLI).

---

## Purpose

_helm-utils_ provides some complementary utilities for [helm](https://helm.sh), both as CLI-tool and node.js library.

_Note: The author of this library/CLI-tool is everything else than a helm expert. It might be that I have re-implemented something which is anyhow already available in helm. If this is the case, please shoot me a message and raise an [issue](https://github.com/stefanwalther/helm-utils/issues). Thx._

## Install

```bash
$ npm install -g helm-utils
```

## Usage as CLI tool

### `get-charts <repo-uri>`

> Return all charts from either an online or local chart repository.

_Note:_ This basically does the same as `helm search`, but with some additional sugar functionality.

<details>
  <summary>Details & Example</summary>
  
  ```bash
  $ helm-utils get-charts https://qlik.bintray.com/stable
  ```
  
</details>

### `get-images <chart-url>`

> Return all docker images from a given helm-chart.

<details>
  <summary>Details & Example</summary>

  ```bash
  $ helm-utils get-images https://qlik.bintray.com/stable/qsefe-0.1.36.tgz
  ```
  
  returns
  
  ```bash
  Images being used in https://qlik.bintray.com/edge/qsefe-0.1.99.tgz:
  (18 images)
  
  - bitnami/mongodb:3.7.1-r0
  - bitnami/redis:4.0.10
  - bitnami/redis:4.0.9
  - qlik-docker-qsefe.bintray.io/collections:0.1.16
  - qlik-docker-qsefe.bintray.io/edge-auth:0.6.3
  - qlik-docker-qsefe.bintray.io/engine:12.216.0
  - qlik-docker-qsefe.bintray.io/feature-flags:0.2.1
  - qlik-docker-qsefe.bintray.io/hub:1.0.4
  - qlik-docker-qsefe.bintray.io/licenses:1.0.5
  - qlik-docker-qsefe.bintray.io/locale:1.0.0
  - qlik-docker-qsefe.bintray.io/policy-decision-service:1.1.2
  - qlik-docker-qsefe.bintray.io/qix-sessions:0.1.6
  - qlik-docker-qsefe.bintray.io/resource-library:1.6.1
  - qlik-docker-qsefe.bintray.io/sense-client:5.43.0
  - qlik-docker-qsefe.bintray.io/tenants:0.3.2
  - qlik-docker-qsefe.bintray.io/users:0.1.6
  - qlikcore/mira:0.3.1
  - traefik
  ```  
</details>

### `help`

<details>
  <summary>Details & Example</summary>
Show the help for `helm-utils`.

```
$ helm-utils hellp
```  
</details>

## Usage as node.js library

See [API docs](./docs/api.md)

## About

### Author
**Stefan Walther**

* [twitter](http://twitter.com/waltherstefan)  
* [github.com/stefanwalther](http://github.com/stefanwalther) 
* [LinkedIn](https://www.linkedin.com/in/stefanwalther/) 
* [stefanwalther.io](http://stefanwalther.io) - Private blog
* [qliksite.io](http://qliksite.io) - Qlik related blog

### Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/stefanwalther/helm-utils/issues). The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.

### License
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on November 06, 2018._

