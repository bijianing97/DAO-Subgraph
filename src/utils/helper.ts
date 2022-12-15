import { Getbalance } from '../types/DaliyData/Getbalance'
import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'
import { Prison } from '../types/Prison/Prison'

const balanceAddress = '0x56223c34367D366AA2572Cdaa63c88D059288506'
const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
const prisonAddress = '0x0000000000000000000000000000000000001008'
export const feeAddress = '0x0000000000000000000000000000000000001005'
export const getbalance = Getbalance.bind(Address.fromString(balanceAddress))
export const stakemanager = StakeManager.bind(Address.fromString(stakeManagerAddress))
export const prison = Prison.bind(Address.fromString(prisonAddress))
export const GasSaveInterval = 3600
export const TotalStakeInterval = 3600
export const hardforkBlock = 0
export const genesisValidators = [
  '0xFF96A3BfF24DA3d686FeA7BD4bEB5ccFD7868DdE',
  '0x809FaE291f79c9953577Ee9007342cff84014b1c',
  '0x57B80007d142297Bc383A741E4c1dd18e4C75754',
  '0x8d187Ee877EeFF8698De6808568FD9f1415c7f91',
  '0x5eB85b475068F7cAA22B2758D58C4B100A418684',
]
