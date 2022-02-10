import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Usage } from './types/Fee/Fee'
import { TimestampOne, TimestampTwo, GasSave, TotalStake } from './types/schema'
import { feeAddress, getbalance, stakemanager } from './utils/helper'

export function handleUsage(event: Usage): void {
  const id = 'GasSave'
  let TimestampOneInstance = TimestampOne.load(id)
  if (!TimestampOneInstance) {
    TimestampOneInstance = new TimestampOne(id)
    TimestampOneInstance.timestamp = event.block.timestamp
    const GasSaveInstance = new GasSave(event.block.timestamp.toString())
    GasSaveInstance.timestamp = event.block.timestamp
    GasSaveInstance.feeUsage = event.params.feeUsage
    GasSaveInstance.save()
  } else {
    const oldTimestamp = TimestampOneInstance.timestamp
    const oldGasSaveInstance = GasSave.load(oldTimestamp.toString())
    if (oldTimestamp.plus(BigInt.fromU32(86400)).lt(event.block.timestamp)) {
      TimestampOneInstance.timestamp = event.block.timestamp
      const GasSaveInstance = new GasSave(event.block.timestamp.toString())
      GasSaveInstance.timestamp = event.block.timestamp
      GasSaveInstance.feeUsage = oldGasSaveInstance!.feeUsage.plus(event.params.feeUsage)
      GasSaveInstance.save()
    } else {
      oldGasSaveInstance!.feeUsage = oldGasSaveInstance!.feeUsage.plus(event.params.feeUsage)
    }
    oldGasSaveInstance!.save()
  }
  TimestampOneInstance.save()
}

export function handleBlock(block: ethereum.Block): void {
  const id = 'TotalStake'
  let TimestampTwoInstance = TimestampTwo.load(id)
  if (!TimestampTwoInstance) {
    TimestampTwoInstance = new TimestampTwo(id)
    TimestampTwoInstance.timestamp = block.timestamp
    const TotalStakeInstance = new TotalStake(block.timestamp.toString())
    TotalStakeInstance.blockNumber = block.number
    TotalStakeInstance.timestamp = block.timestamp
    const voteStakeResult = stakemanager.try_totalLockedAmount()
    if (voteStakeResult.reverted) {
      return
    }
    const feeStakeResult = getbalance.try_balance(Address.fromString(feeAddress))
    if (feeStakeResult.reverted) {
      return
    }
    TotalStakeInstance.voteStake = voteStakeResult.value
    TotalStakeInstance.feeStake = feeStakeResult.value
    TotalStakeInstance.save()
  } else {
    const oldTimestamp = TimestampTwoInstance.timestamp
    if (oldTimestamp.plus(BigInt.fromU32(86400)).lt(block.timestamp)) {
      TimestampTwoInstance.timestamp = block.timestamp
      TimestampTwoInstance.save()
      const TotalStakeInstance = new TotalStake(block.timestamp.toString())
      TotalStakeInstance.timestamp = block.timestamp
      TotalStakeInstance.blockNumber = block.number
      const voteStakeResult = stakemanager.try_totalLockedAmount()
      if (voteStakeResult.reverted) {
        return
      }
      const feeStakeResult = getbalance.try_balance(Address.fromString(feeAddress))
      if (feeStakeResult.reverted) {
        return
      }
      TotalStakeInstance.voteStake = voteStakeResult.value
      TotalStakeInstance.feeStake = feeStakeResult.value
      TotalStakeInstance.save()
    }
  }
  TimestampTwoInstance.save()
}
