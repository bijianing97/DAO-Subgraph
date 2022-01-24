import { Getbalance } from '../types/DaliyData/Getbalance'
import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'

const balanceAddress = '0xD4811fbC3FC5356F8A8e842410C88c0847EE8ED6'
const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
export const feeAddress = '0x0000000000000000000000000000000000001005'
export const getbalance = Getbalance.bind(Address.fromString(balanceAddress))
export const stakemanager = StakeManager.bind(Address.fromString(stakeManagerAddress))
