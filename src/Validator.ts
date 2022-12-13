import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { Validator, ValidatorInfo } from './types/schema'
import { stakemanager, genesisValidators, hardforkBlock } from './utils/helper'

function createValidatorInfo(address: Address, blocknumber: BigInt): string {
  const validator = stakemanager.validators(address)
  const id = `${address.toHex()}-${blocknumber.toHex()}`
  let ValidatorInfoInstance = ValidatorInfo.load(id)
  if (ValidatorInfoInstance) {
    ValidatorInfoInstance.active = true
    ValidatorInfoInstance.save()
    return 'pass'
  }
  ValidatorInfoInstance = new ValidatorInfo(id)
  ValidatorInfoInstance.address = address
  ValidatorInfoInstance.commissionRate = validator.value2
  ValidatorInfoInstance.commissionAddress = validator.value1
  ValidatorInfoInstance.votingPower = stakemanager.getVotingPowerByAddress(address)
  ValidatorInfoInstance.active = false
  ValidatorInfoInstance.save()
  return id
}

function validatorsDecode(data: Bytes) {
  const ids = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item >= 233) {
      const length = 255 - item
      const bytes = data.slice(i + 1, i + 1 + length)
      BigInt.fromUnsignedBytes(bytes as any)
      i += length
    } else {
      ids.push(BigInt.fromU32(item))
    }
    const prioritySign = data[i + 1]
    const isNeg = prioritySign >> 7 === 1
    const length = isNeg ? prioritySign - 128 : prioritySign
    i += length + 1
  }
  return ids
}

export function handleValidatorBlock(block: ethereum.Block): void {
  const id = block.number.toString()
  let ValidatorInstance = Validator.load(id)
  if (!ValidatorInstance) {
    ValidatorInstance = new Validator(id)
  }
  let validators: string[] = []
  const indexedValidatorsLength = stakemanager.indexedValidatorsLength()
  const activeAddress: Address[] = []
  const indexedAddress: Address[] = []
  if (block.number.lt(BigInt.fromU32(hardforkBlock))) {
    const activeValidatorsLengthResult = stakemanager.try_activeValidatorsLength()
    if (activeValidatorsLengthResult.reverted) {
      return
    }
    for (let i = BigInt.fromU32(0); i.lt(activeValidatorsLengthResult.value); i = i.plus(BigInt.fromU32(1))) {
      activeAddress.push(stakemanager.activeValidators(i).value0)
    }
  } else {
    const validatorsInfo = stakemanager.try_getActiveValidatorInfos()
    if (validatorsInfo.reverted) {
      return
    }
    const ids = validatorsDecode(validatorsInfo.value)
    for (let i = 0; i < ids.length; i++) {
      if (ids[i].lt(BigInt.fromU32(genesisValidators.length))) {
        activeAddress.push(Address.fromString(genesisValidators[ids[i].toU32()]))
      } else {
        activeAddress.push(stakemanager.indexedValidatorsById(ids[i]))
      }
    }
  }

  for (let i = BigInt.fromU32(0); i.lt(indexedValidatorsLength); i = i.plus(BigInt.fromU32(1))) {
    indexedAddress.push(stakemanager.indexedValidatorsByIndex(i))
  }

  for (let i = 0; i < indexedAddress.length; i++) {
    validators.push(createValidatorInfo(indexedAddress[i], block.number))
  }

  for (let i = 0; i < activeAddress.length; i++) {
    const result = createValidatorInfo(activeAddress[i], block.number)
    if (result != 'pass') {
      validators.push(result)
    }
  }

  ValidatorInstance.Validator = validators
  ValidatorInstance.save()
}
