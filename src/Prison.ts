import { Unjail } from './types/Prison/Prison'
import { JailRecord, MinerInfo } from './types/schema'
import { ethereum, BigInt } from '@graphprotocol/graph-ts'
import { prison } from './utils/helper'

export function handlePrisonBlock(block: ethereum.Block): void {
  const jailedContracts = prison.try_getJailedMinersLength()
  if (jailedContracts.reverted) {
    return
  }
  const jailedContractsLength = jailedContracts.value
  if (jailedContractsLength.gt(BigInt.fromI32(0))) {
    for (let i = BigInt.fromI32(0); i.lt(jailedContractsLength); i = i.plus(BigInt.fromI32(1))) {
      const minerAddress = prison.getJailedMinersByIndex(i)
      let minerInfo = MinerInfo.load(minerAddress.toHex())
      if (!minerInfo) {
        minerInfo = new MinerInfo(minerAddress.toHex())
        const jailRecord = new JailRecord(`${minerAddress.toHex()}-${block.number.toHex()}`)
        jailRecord.address = minerAddress
        jailRecord.timestamp = block.timestamp
        jailRecord.blockNumber = block.number
        jailRecord.save()
        minerInfo.jailedRecord = [jailRecord.id]
        minerInfo.lastJailedId = jailRecord.id
        minerInfo.lastJailedNumber = block.number
        minerInfo.jailed = true
      } else if (!minerInfo.jailed) {
        const jailRecord = new JailRecord(`${minerAddress.toHex()}-${block.number.toHex()}`)
        jailRecord.address = minerAddress
        jailRecord.timestamp = block.timestamp
        jailRecord.blockNumber = block.number
        jailRecord.save()
        const jailedRecord = minerInfo.jailedRecord
        jailedRecord.push(jailRecord.id)
        minerInfo.jailedRecord = jailedRecord
        minerInfo.lastJailedId = jailRecord.id
        minerInfo.lastJailedNumber = block.number
        minerInfo.jailed = true
      } else {
        continue
      }
      minerInfo.save()
    }
  }
}

export function handleUnjail(event: Unjail): void {
  const minerAddress = event.params.miner
  const minerInfo = MinerInfo.load(minerAddress.toHex())
  if (minerInfo && minerInfo.jailed) {
    const recordId = minerInfo.lastJailedId
    const jailRecord = JailRecord.load(recordId)
    if (jailRecord) {
      minerInfo.jailed = false
      jailRecord.unjailedTimestamp = event.block.timestamp
      jailRecord.unjailedBlockNumber = event.block.number
      jailRecord.unjailedForfeit = event.params.forfeit
      jailRecord.save()
    }
    minerInfo.save()
  }
}
