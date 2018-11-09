
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

