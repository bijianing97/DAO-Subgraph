# DAOSubgraph
This a subgraph for rei-DAO service

## entity

### GasSave
```ts
type TimestampOne @entity {
  id: ID!
  timestamp: BigInt!
} // This a entity for recording GasSave timestamp, will only has one instance,
  // id is 'GasSave',timestamp will store most recent time
  // timestamp will maintain at least 24 hours until next usage event

type GasSave @entity {
  id: ID! // timestamp toString
  timestamp: BigInt!
  feeUsage: BigInt! // Total free fee usage
}
```
- call example
```sh
curl -X POST -d '{ "query": "{gasSaves{id,timestamp,feeUsage}}"}' http://localhost:8000/subgraphs/name/chainmonitor| json_pp
```
  
```json
{
   "data" : {
      "gasSaves" : [
         {
            "feeUsage" : "0",
            "id" : "1643078756",
            "timestamp" : "1643078756"
         },
         {
            "feeUsage" : "70534000000000",
            "id" : "1643090922",
            "timestamp" : "1643090922"
         },
         {
            "feeUsage" : "70534000000000",
            "id" : "1643090973",
            "timestamp" : "1643090973"
         }
      ]
   }
}
```

---
### TotalStake
```ts
type TimestampTwo @entity {
  id: ID!
  timestamp: BigInt!// This a entity for recording TotalStake timestamp, will only has one instance,
  // id is 'TotalStake',timestamp will store most recent time 
  // timestamp will maintain at least 24 hours according to the block timestamp
}

type TotalStake @entity {
  id: ID! // timestamp toString
  blockNumber: BigInt!// block number of record
  timestamp: BigInt! 
  feeStake: BigInt // Total stake for fee
  voteStake: BigInt // Total stake for vote
}
```

- call example
```sh
curl -X POST \
    -d '{ "query": "{totalStakes {id,blockNumber,timestamp,feeStake,voteStake}}" }' \
    http://localhost:8000/subgraphs/name/chainmonitor | json_pp
```

```json
{
   "data" : {
      "totalStakes" : [
         {
            "blockNumber" : "68",
            "feeStake" : "0",
            "id" : "1643020179",
            "timestamp" : "1643020179",
            "voteStake" : "122400000000000000000"
         },
         {
            "blockNumber" : "69",
            "feeStake" : "0",
            "id" : "1643020182",
            "timestamp" : "1643020182",
            "voteStake" : "124200000000000000000"
         },
         {
            "blockNumber" : "70",
            "feeStake" : "0",
            "id" : "1643020185",
            "timestamp" : "1643020185",
            "voteStake" : "126000000000000000000"
         }
      ]
   }
}
```
---

### StakeInfo
```ts
type StakeInfo @entity {
  id: ID! // stake account address and validator address spliced together,eg, `0x38486e3669a13a8E049C39F271E9318B2Eb18B3b-0x898B84b6a6430EEd36A6cfC14a1cB7DA326c91C4`
  from: Bytes! // address of the account who initiated the stake
  validator: Bytes! // address of validator 
  timestamp: BigInt!
}
```

- call example
```sh
curl -X POST -d '{ "query": "{stakeInfos{id,from,timestamp,validator}}"}' http://localhost:8000/subgraphs/name/chainmonitor| json_pp
```

```json
{
   "data" : {
      "stakeinfos" : [
         {
            "from" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "id" : "0x809fae291f79c9953577ee9007342cff84014b1c-0x809fae291f79c9953577ee9007342cff84014b1c",
            "timestamp" : "1643093189",
            "validator" : "0x809fae291f79c9953577ee9007342cff84014b1c"
         },
         {
            "from" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
            "id" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde-0x3289621709f5b35d09b4335e129907ac367a0593",
            "timestamp" : "1643092424",
            "validator" : "0x3289621709f5b35d09b4335e129907ac367a0593"
         }
      ]
   }
}
```
---
### UnStakeInfo
```ts
type UnStakeInfo @entity {
  id: ID! // unstake unique id
  from: Bytes! // address of the account who initiated the unstake
  to: Bytes!   // address of the account who received the rei
  txHash: Bytes! // transaction hash
  values: BigInt! //
  shares: BigInt! // shares to be unstaked
  validator: Bytes! // validator address
  timestamp: BigInt! // timestamp when the unstake can be retrieved
  state: Boolean! // retrieved or not
  amount: BigInt // really rei amount
}
```
- call example

```sh
curl -X POST -d '{ "query": "{unStakeInfos{id,from,to,txHash,values,shares,validator,timestamp,state,amount}}"}' http://localhost:8000/subgraphs/name/chainmonitor| json_pp
```

```json
{
   "data" : {
      "unStakeInfos" : [
         {
            "amount" : "1000",
            "from" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "id" : "0",
            "shares" : "1000",
            "state" : true,
            "timestamp" : "1644374180",
            "to" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "txHash" : "0x63ff6e970aa53d771fde21d0de828ce553e980b86079623aa8a43457b6e04280",
            "validator" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "values" : "1000"
         },
         {
            "amount" : null,
            "from" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "id" : "1",
            "shares" : "1111",
            "state" : false,
            "timestamp" : "1644374228",
            "to" : "0x8ddc2e1696cef35e905b615bc24e5132c3c1fde4",
            "txHash" : "0xe11c1a42e7d9f8304464ba1ee51b22479cdb9824f91c49abc56a57e4addcc3d4",
            "validator" : "0x809fae291f79c9953577ee9007342cff84014b1c",
            "values" : "1111"
         }
      ]
   }
}
```
---
### Deposit
```ts
type Deposit @entity {
  id: ID! //deposit by account address and to account address spliced together,eg, `0x38486e3669a13a8E049C39F271E9318B2Eb18B3b-0x898B84b6a6430EEd36A6cfC14a1cB7DA326c91C4`
  by: Bytes! //account address of deposit by 
  to: Bytes! // account address of deposit to
  amount: BigInt! // deposit amount
  timestamp: BigInt! //retrievable timestamp
}
```
- call example

```sh
curl -X POST -d '{ "query": "{deposits{id,by,to,timestamp,amount}}"}' http://localhost:8000/subgraphs/name/chainmonitor| json_pp
```

```json
{
   "data" : {
      "deposits" : [
         {
            "amount" : "1000000000000000000",
            "by" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
            "id" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde-0x3289621709f5b35d09b4335e129907ac367a0593",
            "timestamp" : "1643090922",
            "to" : "0x3289621709f5b35d09b4335e129907ac367a0593"
         },
         {
            "amount" : "1000000000000000100",
            "by" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
            "id" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde-0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
            "timestamp" : "1643090973",
            "to" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde"
         }
      ]
   }
}
```
---
### Validator
```ts
type ValidatorInfo @entity { //Record the validator infomation
  id: ID!  //validator address and blocknumber
  address: Bytes! // validator address
  votingPower: BigInt! // votingPower
  commissionRate: BigInt!//commissionRate
  commissionAddress: Bytes!//commissonAddress
  active: Boolean! //active
}

type Validator @entity {
  id: ID!
  Validator: [ValidatorInfo!]!//all validators
}
```

- call example 
```sh
curl -X POST -d '{ "query": "{validators{id,Validator{id,address,votingPower,commissionRate,commissionAddress,active}}}"}' http://localhost:8000/subgraphs/name/chainmonitor| json_pp
```

```json
{
   "data" : {
      "validators" : [
         {
            "Validator" : [
               {
                  "active" : false,
                  "address" : "0x57b80007d142297bc383a741e4c1dd18e4c75754",
                  "commissionAddress" : "0x7c661d3291474375653344732fc67ea90908a9c0",
                  "commissionRate" : "0",
                  "id" : "0x57b80007d142297bc383a741e4c1dd18e4c75754-0x0",
                  "votingPower" : "0"
               },
               {
                  "active" : false,
                  "address" : "0x809fae291f79c9953577ee9007342cff84014b1c",
                  "commissionAddress" : "0x320bbedf9c19c83ea38f86dc510f5c00414b3ff2",
                  "commissionRate" : "0",
                  "id" : "0x809fae291f79c9953577ee9007342cff84014b1c-0x0",
                  "votingPower" : "0"
               },
               {
                  "active" : false,
                  "address" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
                  "commissionAddress" : "0x5691db26156a62f30a98ce05b4b3d46fb016e0ed",
                  "commissionRate" : "0",
                  "id" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde-0x0",
                  "votingPower" : "0"
               }
            ],
            "id" : "0"
         },
         {
            "Validator" : [
               {
                  "active" : true,
                  "address" : "0x57b80007d142297bc383a741e4c1dd18e4c75754",
                  "commissionAddress" : "0x7c661d3291474375653344732fc67ea90908a9c0",
                  "commissionRate" : "0",
                  "id" : "0x57b80007d142297bc383a741e4c1dd18e4c75754-0x1",
                  "votingPower" : "1800000000000000000"
               },
               {
                  "active" : false,
                  "address" : "0x809fae291f79c9953577ee9007342cff84014b1c",
                  "commissionAddress" : "0x320bbedf9c19c83ea38f86dc510f5c00414b3ff2",
                  "commissionRate" : "0",
                  "id" : "0x809fae291f79c9953577ee9007342cff84014b1c-0x1",
                  "votingPower" : "0"
               },
               {
                  "active" : false,
                  "address" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde",
                  "commissionAddress" : "0x5691db26156a62f30a98ce05b4b3d46fb016e0ed",
                  "commissionRate" : "0",
                  "id" : "0xff96a3bff24da3d686fea7bd4beb5ccfd7868dde-0x1",
                  "votingPower" : "0"
               }
            ],
            "id" : "1"
         }  "id" : "10048"
      ]
   }
}
```


Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/chainmonitor
Subscriptions (WS): http://localhost:8001/subgraphs/name/chainmonitor