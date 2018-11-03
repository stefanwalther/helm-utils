# qsefe

## Introduction

This chart bootstraps a Qlik Sense Enterprise For Elastic deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

- [Installing the Chart](#installing-the-chart)
- [Uninstalling the Chart](#uninstalling-the-chart)
- [Configuration](#configuration)
    - [Identity provider, authentication and tenant configuration](#Identity-provider-authentication-and-tenant-configuration)
    - [K8s RBAC support](#k8s-rbac-support)

## Installing the Chart

To install the chart with the release name `qsefe`:

```console
helm install --name my-release qlik/qsefe
```

For a local development install, do the following:

```shell
helm upgrade --install my-release qlik/qsefe --set devMode.enabled=true,engine.acceptEULA="yes"
```

The command deploys qsefe on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

## Uninstalling the Chart

To uninstall/delete the `qsefe` deployment:

```console
helm delete qsefe
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists some of the configurable parameters of the qsefe chart and their default values. For the full list of available options, see `values.yaml`.

| Parameter                    | Description                                                                                   | Default                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- |
| engine.acceptEULA            | Agree to the Qlik sense engine EULA in order to activate it                                   | `"no"`                                       |
| engine.replicaCount          | The number of replicas of the Qlik Sense Engine to deploy                                     | `"no"`                                       |
| engine.persistence           | Defines the persistence layer of the engine - ReadWriteMany is required for multiple engines  |                                              |
| devMode.enabled              | activates "devMode" for local development and deploys a mongodb chart (e.g. with minikube)    | `false`                                      |
| mongodb.uri                  | The uri (with credentials) to the mongodb to use. Not used if `devMode` is active.            |                                              |

### Identity provider, authentication and tenant configuration

The following table lists the authentication, tenant and identity provider configurations. You will need to configure an identity provider to be able to login and use QSEfE.

| Parameter                                                  | Description                                                                                                                                                                                           | Default                                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `edge-auth.loginStateLifetime`                                       | The length of time between initiating and completing login is allowed to take                                                                                                                         | `5m`                                                                            |
| `edge-auth.secrets.create`                                           | Create the secret resource from the following values. _See [Secrets](#Secrets)_                                                                                                                       | `true`                                                                          |
| `edge-auth.secrets.cookieKeys[]`                                     | Array of strings used for signing cookies                                                                                                                                                             | `["A secret key"]`                                                              |
| `edge-auth.secrets.jwtPrivateKey`                                    | RSA or EC Private signing key for internal JWTs                                                                                                                                                       | Generate EC 384 private key `ssh-keygen -t ecdsa -b 384 -f jwtPrivateKey -N ''` |
| `edge-auth.secrets.jwtPublicKeys`                                    | Array of RSA or EC public keys for verifying internal JWTs                                                                                                                                            | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs`                                       | Array of configs for Identity providers                                                                                                                                                               | _See following_                                                                 |
| `edge-auth.secrets.idpConfigs[].allowedClientIds`                    | An array of the IDs of allowed API clients, only client tokens with these client IDs will be allowed access, if no value is provided then any client with the correct claims will be allowed access   | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].audience`                            | The audience value that tokens from the IdP will be asserted to be issued for, default is `qlik.api`                                                                                                  | `qlik.api`                                                                      |
| `edge-auth.secrets.idpConfigs[].claimsMapping`                       | How to map the IdP's `userinfo` to internal fields (_See [Claims Mappings](#claims-mappings)_)                                                                                                        | `{sub: "sub", name: "name"}`                                                    |
| `edge-auth.secrets.idpConfigs[].claimsMapping.name`                  | `userinfo` field to be mapped to internal name field                                                                                                                                                  | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].claimsMapping.sub`                   | `userinfo` field to be mapped to internal sub field                                                                                                                                                   | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].clientId`                            | IdP client ID                                                                                                                                                                                         | `foo`                                                                           |
| `edge-auth.secrets.idpConfigs[].clientSecret`                        | IdP client secret                                                                                                                                                                                     | `bar`                                                                           |
| `edge-auth.secrets.idpConfigs[].clockToleranceSec`                   | The clock tolerance in seconds, this is to compensate for clock skew between the IdP and this service, default is 5                                                                                   | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].discoveryUrl`                        | IdP discovery URL                                                                                                                                                                                     | `http://localhost:32123/.well-known/openid-configuration`                       |
| `edge-auth.secrets.idpConfigs[].hostname`                            | Requests to this hostname will use this IdP                                                                                                                                                           | `elastic.example`                                                                 |
| `edge-auth.secrets.idpConfigs[].issuerConfig`                        | IdP issuer config                                                                                                                                                                                     | _See following_                                                                 |
| `edge-auth.secrets.idpConfigs[].issuerConfig.authorization_endpoint` | IdP authorization_endpoint URI                                                                                                                                                                        | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].issuerConfig.end_session_endpoint`   | IdP end_session_endpoint URI                                                                                                                                                                          | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].issuerConfig.introspection_endpoint` | IdP introspection_endpoint URI                                                                                                                                                                        | `nil`                                                                           |
| `edge-auth.secrets.idpConfigs[].issuerConfig.issuer`                 | IdP issuer URI                                                                                                                                                                                        |                                                                                 |
| `edge-auth.secrets.idpConfigs[].issuerConfig.jwks_uri`               | IdP jwks_uri URI                                                                                                                                                                                      |                                                                                 |
| `edge-auth.secrets.idpConfigs[].issuerConfig.token_endpoint`         | IdP token_endpoint URI                                                                                                                                                                                |                                                                                 |
| `edge-auth.secrets.idpConfigs[].issuerConfig.userinfo_endpoint`      | IdP userinfo_endpoint URI                                                                                                                                                                             |                                                                                 |
| `edge-auth.secrets.idpConfigs[].postLogoutRedirectUri`               | URI to redirect to on logout, this only takes effect when `end_session_endpoint` is not configured                                                                                                    |                                                                                 |
| `edge-auth.secrets.idpConfigs[].primary`                             | Boolean denoting if this IdP is the primary one for the hostname. Primary IdPs are those for which will be used for the interactive login, non-primary IdPs can only exchange tokens, default is true |                                                                                 |
| `edge-auth.secrets.idpConfigs[].realm`                               | realm name to associate with IdP users                                                                                                                                                                | `simple`                                                                        |
| `edge-auth.secrets.idpConfigs[].staticKeys`                          | An array of public keys. This allows IdP JWT verifier to use a static set (one or more) of public keys to verify external JWTs (identity token)                                                       | `[]`                                                                            |
| `edge-auth.secrets.idpConfigs[].staticKeys[].kid`                    | The key id                                                                                                                                                                                            |                                                                                 |
| `edge-auth.secrets.idpConfigs[].staticKeys[].pem`                    | The pem format key                                                                                                                                                                                    |                                                                                 |
| `edge-auth.secrets.login.stateKey`                                   | The key with which to sign the state parameter (encoded in base64), must be larger than 256 bits                                                                                                      | To generate use `openssl rand -base64 32`                                       |
| `edge-auth.secureCookies`                                            | Restrict cookies to only be sent over SSL                                                                                                                                                             | `false`                                                                         |

### K8s RBAC support

There are three components of QSEfE that require configuration if RBAC is enabled:

- `elastic-infra.nginx-ingress`
- `elastic-infra.traefik`
- `mira`

See the `values.yaml` file for descriptions of the available configurations for those scenarios.

`devMode` example of RBAC deployment:

```shell
helm upgrade --install qsefe qlik/qsefe --set devMode.enabled=true,engine.acceptEULA="yes",elastic-infra.nginx-ingress.rbac.create=true,elastic-infra.traefik.rbac.enabled=true,mira.rbac.create=true,mira.serviceAccount.create=true
```

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`.

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```console
helm install --name qsefe -f values.yaml qlik/qsefe
```

> **Tip**: You can use the default [values.yaml](values.yaml)
