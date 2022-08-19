import { validatorFirstVote } from './types/schema'
import { Stake } from './types/StakeManager/StakeManager'

export function handValidatorFirstVote(event: Stake): void {
  const from = event.transaction.from
  const validator = event.params.validator
  const id = `${validator.toHex()}`
  let instance = validatorFirstVote.load(id)
  if (instance) {
    return
  }
  instance = new validatorFirstVote(id)
  instance.validator = validator
  instance.timestamp = event.block.timestamp
  instance.save()
}
