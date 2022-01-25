import { Stakeinfo, Unstake } from './types/schema'
import { Stake, StartUnstake, DoUnstake } from './types/StakeManager/StakeManager'

export function handleStake(event: Stake): void {
  const from = event.transaction.from
  const validator = event.params.validator
  const id = `${from.toHex()}-${validator.toHex()}`
  let instance = Stakeinfo.load(id)
  if (instance) {
    return
  }
  instance = new Stakeinfo(id)
  instance.from = from
  instance.validator = validator
  instance.timestamp = event.block.timestamp
  instance.save()
}

export function handleStartUnstake(event: StartUnstake): void {
  const id = event.params.id.toString()
  let instance = Unstake.load(id)
  if (instance) {
    return
  }
  instance = new Unstake(id)
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
  let instance = Unstake.load(id)
  if (!instance) {
    return
  }
  instance.state = true
  instance.amount = event.params.amount
  instance.save()
}
