import { Getbalance } from '../types/DaliyData/Getbalance'
import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'
import { Prison } from '../types/Prison/Prison'

const balanceAddress = '0x35656D8002448B68199d219c597eA35159B69099'
const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
const prisonAddress = '0x0000000000000000000000000000000000001008'
export const feeAddress = '0x0000000000000000000000000000000000001005'
export const getbalance = Getbalance.bind(Address.fromString(balanceAddress))
export const stakemanager = StakeManager.bind(Address.fromString(stakeManagerAddress))
export const prison = Prison.bind(Address.fromString(prisonAddress))
export const GasSaveInterval = 3600
export const TotalStakeInterval = 3600
export const hardforkBlock = 7216473
export const blockInterval = 216000
export const genesisValidators = [
  '0x4779af7e65c055979c8100f2183635e5d28c78f5',
  '0x116f46eb05d5e42b4cd10e70b1b49706942f5948',
  '0x7d8f270d34a2b78ed7e64c173f82919ac1006374',
]
