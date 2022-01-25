import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Validator, ValidatorInfo } from './types/schema'
import { stakemanager } from './utils/helper'

function createValidatorInfo(address: Address, blocknumber: BigInt, active: boolean): string {
  const validator = stakemanager.validators(address)
  const id = `${address.toHex()}-${blocknumber.toHex()}`
  let ValidatorInfoInstance = ValidatorInfo.load(id)
  if (ValidatorInfoInstance) {
    return id
  }
  ValidatorInfoInstance = new ValidatorInfo(id)
  ValidatorInfoInstance.address = address
  ValidatorInfoInstance.commissionRate = validator.value2
  ValidatorInfoInstance.commissionAddress = validator.value1
  ValidatorInfoInstance.votingPower = stakemanager.getVotingPowerByAddress(address)
  ValidatorInfoInstance.active = active
  ValidatorInfoInstance.save()
  return id
}

export function handleValidatorBlock(block: ethereum.Block): void {
  const activeValidatorsLengthResult = stakemanager.try_activeValidatorsLength()
  if (activeValidatorsLengthResult.reverted) {
    return
  }
  const id = block.number.toString()
  const ValidatorInstance = new Validator(id)
  const indexedValidatorsLength = stakemanager.indexedValidatorsLength()
  const activeAddress: Address[] = []
  const indexedAddress: Address[] = []
  for (let i = BigInt.fromU32(0); i.lt(activeValidatorsLengthResult.value); i = i.plus(BigInt.fromU32(1))) {
    activeAddress.push(stakemanager.activeValidators(i).value0)
  }
  for (let i = BigInt.fromU32(0); i.lt(indexedValidatorsLength); i = i.plus(BigInt.fromU32(1))) {
    indexedAddress.push(stakemanager.indexedValidatorsByIndex(i))
  }

  if (indexedAddress.length != 0) {
    for (let i = indexedAddress.length - 1; i >= 0; i--) {
      for (let j = 0; j < activeAddress.length; j++) {
        if (indexedAddress[i].toHexString() == activeAddress[j].toHexString()) {
          indexedAddress.splice(i, 1)
        }
      }
    }
  }

  const activeValidators: string[] = []
  const indexedValidators: string[] = []

  for (let i = 0; i < activeAddress.length; i++) {
    activeValidators.push(createValidatorInfo(activeAddress[i], block.number, true))
  }
  for (let i = 0; i < indexedAddress.length; i++) {
    indexedValidators.push(createValidatorInfo(indexedAddress[i], block.number, false))
  }
  let validators = activeValidators.concat(indexedValidators)
  ValidatorInstance.Validator = validators
  ValidatorInstance.save()
}
