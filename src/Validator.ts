import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { Validator, ValidatorInfo } from './types/schema'
import { stakemanager } from './utils/helper'

function createValidatorInfo(address: Address, blocknumber: BigInt) {
  const validator = stakemanager.validators(address)
  const id = `${address.toHex()}-${blocknumber.toHex()}`
  const ValidatorInfoInstance = new ValidatorInfo('id')
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
  const activeAddresses: Address[] = []
  const indexedAddresses: Address[] = []
  for (let i = new BigInt(0); i.lt(activeValidatorsLengthResult.value); i.plus(new BigInt(1))) {
    activeAddresses.push(stakemanager.activeValidators(i).value0)
  }
  for (let i = new BigInt(0); i.lt(indexedValidatorsLength); i.plus(new BigInt(1))) {
    indexedAddresses.push(stakemanager.indexedValidatorsByIndex(i))
  }
  const unactiveAddresses = indexedAddresses.filter(item => {
    return activeAddresses.indexOf(item) == -1
  })
  const activeValidators = []
  const unactiveValidators = []
  for (let i = 0; i < activeAddresses.length; i++) {
    activeValidators.push(createValidatorInfo(activeAddresses[i], block.number))
  }
  for (let i = 0; i < unactiveAddresses.length; i++) {
    unactiveValidators.push(createValidatorInfo(unactiveAddresses[i], block.number))
  }
  const Validators = activeValidators.concat(unactiveValidators)
  ValidatorInstance.activeValidators = activeValidators
  ValidatorInstance.unactiveValidators = unactiveValidators
  ValidatorInstance.validators = Validators
  ValidatorInstance.save()
}
