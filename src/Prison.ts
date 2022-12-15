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
  if (jailedContractsLength.equals(BigInt.fromU32(0))) {
    return
  }
  for (let i = BigInt.fromU32(0); i.lt(jailedContractsLength); i = i.plus(BigInt.fromU32(1))) {
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
      minerInfo.save()
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
      minerInfo.save()
    } else {
      continue
    }
  }
}

export function handleUnjail(event: Unjail): void {
  const minerAddress = event.params.miner
  const minerInfo = MinerInfo.load(minerAddress.toHex())
  if (!minerInfo) {
    return
  }
  if (minerInfo.jailed) {
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
