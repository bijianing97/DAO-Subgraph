import { Deposit as DepositRecord } from './types/schema'
import { Deposit, Withdraw } from './types/Fee/Fee'

export function handleDeposit(event: Deposit): void {
  const by = event.params.by
  const to = event.params.to
  const id = `${by.toHex()}-${to.toHex()}`
  let instance = DepositRecord.load(id)
  if (!instance) {
    instance = new DepositRecord(id)
    instance.by = by
    instance.to = to
    instance.amount = event.params.amount
    instance.timestamp = event.block.timestamp
  } else {
    instance.amount = instance.amount.plus(event.params.amount)
    instance.timestamp = event.block.timestamp
  }
  instance.save()
}

export function handleWithdraw(event: Withdraw): void {
  const by = event.params.by
  const to = event.params.from
  const id = `${by.toHex()}-${to.toHex()}`
  let instance = DepositRecord.load(id)
  if (!instance) {
    return
  }
  instance.amount = instance.amount.minus(event.params.amount)
  instance.save()
}
