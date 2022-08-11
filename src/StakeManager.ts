import { StakeInfoMore } from './types/schema'
import { Stake } from './types/StakeManager/StakeManager'

export function handleStake(event: Stake): void {
  const from = event.transaction.from
  const validator = event.params.validator
  const id = `${validator.toHex()}-${from.toHex()}-${event.transaction.hash.toHex()}-${event.logIndex.toHex()}`
  let stakeInfo = StakeInfoMore.load(id)
  if (stakeInfo) {
    return
  }
  stakeInfo = new StakeInfoMore(id)
  stakeInfo.from = from
  stakeInfo.validator = validator
  stakeInfo.timestamp = event.block.timestamp
  stakeInfo.to = event.params.to
  stakeInfo.shares = event.params.shares
  stakeInfo.save()
}
