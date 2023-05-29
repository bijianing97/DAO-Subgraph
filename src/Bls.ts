import { BigInt } from '@graphprotocol/graph-ts'
import { BlsSetRecord, BlsValidator } from './types/schema'
import { SetBLSPublicKey } from './types/ValidatorBLS/ValidatorBLS'
import { SetBLSPublicKey as SetBLSPublicKeyOld } from './types/ValidatorBLSOld/ValidatorBLS'

export function handleSetBLSPublicKeyOld(event: SetBLSPublicKeyOld): void {
  const validator = event.params.validator
  const publicKey = event.params.BLSPublicKey
  const recordID = `${validator.toHex()}-${publicKey.toHex()}-${event.transaction.hash.toString()}-${event.logIndex.toString()}`
  let recordInstance = BlsSetRecord.load(recordID)
  if (recordInstance) {
    return
  }
  if (!recordInstance) {
    recordInstance = new BlsSetRecord(recordID)
    recordInstance.validator = validator
    recordInstance.blsPublicKey = publicKey
    recordInstance.transactionHash = event.transaction.hash
    recordInstance.blockNumber = event.block.number
    recordInstance.save()
  }
  const validatorId = validator.toHex()
  let validatorInstance = BlsValidator.load(validatorId)
  if (!validatorInstance) {
    validatorInstance = new BlsValidator(validatorId)
    validatorInstance.lastBLSPublicKey = publicKey
    validatorInstance.lastSetBlockNumber = event.block.number
    validatorInstance.setTime = BigInt.fromI32(1)
    validatorInstance.setRecord.push(recordID)
  } else {
    validatorInstance.lastBLSPublicKey = publicKey
    validatorInstance.lastSetBlockNumber = event.block.number
    validatorInstance.setTime = validatorInstance.setTime.plus(BigInt.fromI32(1))
    validatorInstance.setRecord.push(recordID)
  }
  validatorInstance.save()
}

export function handleSetBLSPublicKey(event: SetBLSPublicKey): void {
  const validator = event.params.validator
  const publicKey = event.params.BLSPublicKey
  const recordID = `${validator.toHex()}-${publicKey.toHex()}-${event.transaction.hash.toString()}-${event.logIndex.toString()}`
  let recordInstance = BlsSetRecord.load(recordID)
  if (recordInstance) {
    return
  }
  if (!recordInstance) {
    recordInstance = new BlsSetRecord(recordID)
    recordInstance.validator = validator
    recordInstance.blsPublicKey = publicKey
    recordInstance.transactionHash = event.transaction.hash
    recordInstance.blockNumber = event.block.number
    recordInstance.save()
  }
  const validatorId = validator.toHex()
  let validatorInstance = BlsValidator.load(validatorId)
  if (!validatorInstance) {
    validatorInstance = new BlsValidator(validatorId)
    validatorInstance.lastBLSPublicKey = publicKey
    validatorInstance.lastSetBlockNumber = event.block.number
    validatorInstance.setTime = BigInt.fromI32(1)
    validatorInstance.setRecord.push(recordID)
  } else {
    validatorInstance.lastBLSPublicKey = publicKey
    validatorInstance.lastSetBlockNumber = event.block.number
    validatorInstance.setTime = validatorInstance.setTime.plus(BigInt.fromI32(1))
    validatorInstance.setRecord.push(recordID)
  }
  validatorInstance.save()
}
