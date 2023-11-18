# EOA Claim & Swap

Env file requires `PRIVATE_KEY`

```sh
yarn
source .env
```

```sh
yarn run-eoa
```

We can also post app data with this (works but not generalized). See methods

- `mixedEoaSafeAppData`
- `safeOnlyAppData`

This should be called from the Safe App when user triggers a claim and swap!