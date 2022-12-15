import { StakeInfo, StakeInfoMore, UnStakeInfo } from './types/schema'
import { Stake, StartUnstake, DoUnstake } from './types/StakeManager/StakeManager'

export function handleStake(event: Stake): void {
  const from = event.transaction.from
  const validator = event.params.validator
  const id = `${from.toHex()}-${validator.toHex()}`
  const id2 = `${validator.toHex()}-${from.toHex()}-${event.transaction.hash.toHex()}-${event.logIndex.toHex()}`
  let instance = StakeInfo.load(id)
  const instance2 = new StakeInfoMore(id2)
  instance2.from = from
  instance2.validator = validator
  instance2.timestamp = event.block.timestamp
  instance2.to = event.params.to
  instance2.shares = event.params.shares
  instance2.save()
  if (!instance) {
    instance = new StakeInfo(id)
  }
  instance.from = from
  instance.validator = validator
  instance.timestamp = event.block.timestamp
  instance.save()
}

export function handleStartUnstake(event: StartUnstake): void {
  const id = event.params.id.toString()
  let instance = UnStakeInfo.load(id)
  if (instance) {
    return
  }
  instance = new UnStakeInfo(id)
  instance.from = event.transaction.from
  instance.to = event.params.to
  instance.txHash = event.transaction.hash
  instance.values = event.params.value
  instance.shares = event.params.unstakeShares
  instance.validator = event.params.validator
  instance.timestamp = event.params.timestamp
  instance.state = false
  instance.save()
}

export function handleDoUnstake(event: DoUnstake): void {
  const id = event.params.id.toString()
  let instance = UnStakeInfo.load(id)
  if (!instance) {
    return
  }
  instance.state = true
  instance.amount = event.params.amount
  instance.save()
}
