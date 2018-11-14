
### get-charts &lt;repo-uri&gt; \[format]

Return all charts from either an online or local chart repository.
This basically does the same as `helm search`, but with some additional sugar functionality.

<details>
  <summary>Example</summary>
  
  ```bash
  $ helm-utils get-charts https://charts.jfrog.io/
  ```
  
  Options: 
  - `--format` - How to format the output, `table` or `json`. Defaults to `table`.
  
</details>

### get-images &lt;chart-url&gt; \[format]

Return all docker images from a given helm-chart.

<details>
  <summary>Example</summary>

  ```bash
  $  helm-utils get-images https://charts.jfrog.io/artifactory/helm/xray-0.5.2.tgz
  ```
  
  returns
  
  ```bash
  Images being used in https://charts.jfrog.io/artifactory/helm/xray-0.5.2.tgz:
  (3 images)
  
  - bitnami/mongodb:3.6.4
  - postgres
  - rabbitmq:3.7-alpine
  ```  
  
  Options: 
    - `--format` - How to format the output, `list` or `json`. Defaults to `list`.
</details>


### help

<details>
  <summary>Example</summary>
Show the help for `helm-utils`.

```
$ helm-utils help
```  
</details>

