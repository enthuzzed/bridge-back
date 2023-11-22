## Requirements

- docker, docker-compose
- npm, yarn

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# run all microservices ecosystem
docker-compose up

# Stop running microservices
docker-compose down

# watch mode still requires locally installed postgres
yarn start:dev

# rebuild docker after changes is code:
yarn docker:build
```

## Configuration app



It is necessary to add the local.yml file to the /config folder, with the following content:

```
core_db:
  type: 'postgres'
  host: 'postgres'
  port: 5432
  database: 'df-bridge'
  username: 'postgres'
  password: 'postgres'
  synchronize: false

blockchain:
  polygonUrl: 'wss://ws-matic-mumbai.chainstacklabs.com'
  dfinityUrl": 'https://ic0.app'
  abiFilesDir: './files/abi_files'
  didFilesDir: './files/did_files'

polygon_bridge:
  contractAddress: '0x6e9b5E5D44D09f0c86aF2e6fED622F97246C700a'
  owner: '0xcB8d35D7da40e216ADa2ecD822340b6A1b748e67'
  privateKey: 'd2faf2a303d27a260df496bc00475a36bfaa42c187ddc5fef60b253cb85836d8'

polygon_token:
  contractAddress: '0x8BC753423c58feEacE949000c9Cf4A9C9CD4909A'
  owner: '0xcB8d35D7da40e216ADa2ecD822340b6A1b748e67'
  privateKey: 'd2faf2a303d27a260df496bc00475a36bfaa42c187ddc5fef60b253cb85836d8'

dfinity_bridge:
  contractAddress: 'oa67n-laaaa-aaaai-qfm3q-cai'

dfinity_token:
  contractAddress: 'oh7zz-gyaaa-aaaai-qfm3a-cai'
```

## Swagger docs

In browser: localhost:3000/api/v1/docs

