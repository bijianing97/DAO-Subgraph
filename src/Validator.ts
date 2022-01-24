import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { Validator, ValidatorInfo } from './types/schema'
import { stakemanager } from './utils/helper'

function createValidatorInfo(address: Address, blocknumber: BigInt): string {
  const validator = stakemanager.validators(address)
  const id = `${address.toHex()}-${blocknumber.toHex()}`
  let ValidatorInfoInstance = ValidatorInfo.load(id)
  if (ValidatorInfoInstance) {
    return id
  }
  ValidatorInfoInstance = new ValidatorInfo('id')
  ValidatorInfoInstance.address = address
  ValidatorInfoInstance.commissionRate = validator.value2
  ValidatorInfoInstance.commissionRateAddress = validator.value1
  ValidatorInfoInstance.votingPower = stakemanager.getVotingPowerByAddress(address)
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
  const activeValidators: string[] = []
  const indexedValidators: string[] = []
  for (let i = new BigInt(0); i.lt(activeValidatorsLengthResult.value); i.plus(new BigInt(1))) {
    activeValidators.push(createValidatorInfo(stakemanager.activeValidators(i).value0, block.number))
  }
  for (let i = new BigInt(0); i.lt(indexedValidatorsLength); i.plus(new BigInt(1))) {
    indexedValidators.push(createValidatorInfo(stakemanager.indexedValidatorsByIndex(i), block.number))
  }
  ValidatorInstance.activeValidators = activeValidators
  ValidatorInstance.indexedValidators = indexedValidators
  ValidatorInstance.save()
}
