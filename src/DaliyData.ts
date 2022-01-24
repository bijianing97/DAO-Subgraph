import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Usage } from './types/Fee/Fee'
import { Timstamp1, Timstamp2, GasSave, TotalStake } from './types/schema'
import { feeAddress, getbalance, stakemanager } from './utils/helper'

export function handleUsage(event: Usage): void {
  const id = 'GasSave'
  let Timestamp1Instance = Timstamp1.load(id)
  if (!Timestamp1Instance) {
    Timestamp1Instance = new Timstamp1(id)
    Timestamp1Instance.timestamp = event.block.timestamp
    const GasSaveInstance = new GasSave(event.block.timestamp.toString())
    GasSaveInstance.timestamp = event.block.timestamp
    GasSaveInstance.feeUsage = event.params.feeUsage
    GasSaveInstance.save()
  } else {
    const oldTimestamp = Timestamp1Instance.timestamp
    const oldGasSaveInstance = GasSave.load(oldTimestamp.toString())
    if (oldTimestamp.plus(new BigInt(86400)).lt(event.block.timestamp)) {
      Timestamp1Instance.timestamp = event.block.timestamp
      const GasSaveInstance = new GasSave(event.block.timestamp.toString())
      GasSaveInstance.timestamp = event.block.timestamp
      GasSaveInstance.feeUsage = oldGasSaveInstance!.feeUsage.plus(event.params.feeUsage)
      GasSaveInstance.save()
    } else {
      oldGasSaveInstance!.feeUsage = oldGasSaveInstance!.feeUsage.plus(event.params.feeUsage)
    }
    oldGasSaveInstance!.save()
  }
  Timestamp1Instance.save()
}

export function handleBlock(block: ethereum.Block): void {
  const id = 'TotalStake'
  let Timestamp2Instance = Timstamp2.load(id)
  if (!Timestamp2Instance) {
    Timestamp2Instance = new Timstamp2(id)
    Timestamp2Instance.timestamp = block.timestamp
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
    const oldTimestamp = Timestamp2Instance.timestamp
    if (oldTimestamp.plus(new BigInt(86400)).lt(block.timestamp)) {
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
  Timestamp2Instance.save()
}
