import { Getbalance } from '../types/DaliyData/Getbalance'
import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'

const balanceAddress = '0xdb53B166e0c2BfcbeF023a50a755A0D6b9531Ffc'
const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
export const feeAddress = '0x0000000000000000000000000000000000001005'
export const getbalance = Getbalance.bind(Address.fromString(balanceAddress))
export const stakemanager = StakeManager.bind(Address.fromString(stakeManagerAddress))
export const GasSaveInterval = 3600
export const TotalStakeInterval = 3600
