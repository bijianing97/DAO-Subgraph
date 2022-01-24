import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Usage } from './types/Fee/Fee'
import { Timstamp1, Timstamp2, SavingGas, TotalStake } from './types/schema'
import { feeAddress, getbalance, stakemanager } from './utils/helper'

export function handleUsage(event: Usage) {
  const id = 'SavingGas'
  let Timestamp1Instance = Timstamp1.load(id)
  if (!Timestamp1Instance) {
    Timestamp1Instance = new Timstamp1(id)
    Timestamp1Instance.timestamp = event.block.timestamp
    const SavingGasInstance = new SavingGas(event.block.timestamp.toString())
    SavingGasInstance.timestamp = event.block.timestamp
    SavingGasInstance.feeUsage = event.params.feeUsage
    SavingGasInstance.save()
  } else {
    const oldTimestamp = Timestamp1Instance.timestamp
    const oldSavingGasInstance = SavingGas.load(oldTimestamp.toString())
    if (oldTimestamp.plus(new BigInt(86400)).lt(event.block.timestamp)) {
      Timestamp1Instance.timestamp = event.block.timestamp
      const SavingGasInstance = new SavingGas(event.block.timestamp.toString())
      SavingGasInstance.timestamp = event.block.timestamp
      SavingGasInstance.feeUsage = oldSavingGasInstance!.feeUsage.plus(event.params.feeUsage)
      SavingGasInstance.save()
    } else {
      oldSavingGasInstance!.feeUsage = oldSavingGasInstance!.feeUsage.plus(event.params.feeUsage)
    }
    oldSavingGasInstance!.save()
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
    const feeStakeResult = getbalance.try_balance(Address.fromHexString(feeAddress))
    if (!voteStakeResult.reverted) {
      TotalStakeInstance.voteStake = voteStakeResult.value
    }
    if (!feeStakeResult.reverted) {
      TotalStakeInstance.feeStake = feeStakeResult.value
    }
    TotalStakeInstance.save()
  } else {
    const oldTimestamp = Timestamp2Instance.timestamp
    if (oldTimestamp.plus(new BigInt(86400)).lt(block.timestamp)) {
      const TotalStakeInstance = new TotalStake(block.timestamp.toString())
      TotalStakeInstance.timestamp = block.timestamp
      TotalStakeInstance.blockNumber = block.number
      const voteStakeResult = stakemanager.try_totalLockedAmount()
      const feeStakeResult = getbalance.try_balance(Address.fromHexString(feeAddress))
      if (!voteStakeResult.reverted) {
        TotalStakeInstance.voteStake = voteStakeResult.value
      }
      if (!feeStakeResult.reverted) {
        TotalStakeInstance.feeStake = feeStakeResult.value
      }
      TotalStakeInstance.save()
    }
  }
  Timestamp2Instance.save()
}
