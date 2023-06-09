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
export const hardforkBlock = 9629061
export const blockInterval = 64800
export const genesisValidators = [
  '0x2957879b3831b5ac1ef0ea1fb08dd21920f439b4',
  '0xaa714ecc110735b4e114c8b35f035fc8706ff930',
  '0x1b0885d33b43a696cd5517244a4fcb20b929f79d',
  '0xb7a19f9b6269c26c5ef901bd128c364dd9ddc53a',
  '0x0efe0da2b918412f1009337fe86321d88de091fb',
]
