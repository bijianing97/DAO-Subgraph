import { Getbalance } from '../types/DaliyData/Getbalance'
import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'

const balanceAddress = '0xE64Aa44254D9c468019d3Ef5273c1EE157ad28Ad'
const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
export const feeAddress = '0x0000000000000000000000000000000000001005'
export const getbalance = Getbalance.bind(Address.fromHexString(balanceAddress))
export const stakemanager = StakeManager.bind(Address.fromHexString(stakeManagerAddress))
