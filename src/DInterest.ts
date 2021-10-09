import { BigDecimal, BigInt, Address, ByteArray, crypto, ethereum } from "@graphprotocol/graph-ts";
import {
  DInterest,
  EDeposit,
  EFund,
  EPayFundingInterest,
  ERolloverDeposit,
  ESetParamAddress,
  ESetParamUint,
  ETopupDeposit,
  EWithdraw,
  OwnershipTransferred
} from "../generated/aDAIPool/DInterest";
import { IInterestOracle } from "../generated/aDAIPool/IInterestOracle";
import { DPool } from "../generated/schema";

let YEAR = BigInt.fromI32(31556952); // One year in seconds
let ZERO_DEC = BigDecimal.fromString('0');
let ONE_DEC = BigDecimal.fromString('1');
let NEGONE_DEC = BigDecimal.fromString('-1');
let BLOCK_HANDLER_INTERVAL = BigInt.fromI32(20); // call block handler every 20 blocks

// Note: the addresses below must be in lower case
let POOL_ADDRESSES = new Array<string>(0);

POOL_ADDRESSES.push("0xa78276c04d8d807feb8271fe123c1f94c08a414d"); // aDAI
POOL_ADDRESSES.push("0xf0ca068be757e61cdfa6314bf59f5243767f1bfd"); // aUSDC
POOL_ADDRESSES.push("0x58e65f624c5ecf595824c96b3853ea8da2f9adf1"); // aUSDT
POOL_ADDRESSES.push("0x4f28fc2be45682d1be1d0f155f4a52d4509db629"); // aWAVAX
POOL_ADDRESSES.push("0xbcd1571761c2f3d8e0ae93651753aa968e357425"); // aWBTC
POOL_ADDRESSES.push("0xd1fea1b2dc4e0be1f5f16bacf1dfeb7fc3434b5f"); // aWETH

POOL_ADDRESSES.push("0xd9f46096801799f59f34c95e0b4df0f6a76bfcf3"); // qiDAI
POOL_ADDRESSES.push("0x2252185532317932b1883b3429407296a2c69244"); // qiLINK
POOL_ADDRESSES.push("0xc7cbb403d1722ee3e4ae61f452dc36d71e8800de"); // qiUSDC
POOL_ADDRESSES.push("0x747cdec7d885ca961baec11481cda651bf4d1004"); // qiUSDT
POOL_ADDRESSES.push("0x336c38657837aa2b5fd21d41ea651b6d792291d9"); // qiWBTC
POOL_ADDRESSES.push("0xeb706249f3b4640839e64211336b2063a3cdfbb9"); // qiWETH


let POOL_STABLECOIN_DECIMALS = new Array<i32>(0);

POOL_STABLECOIN_DECIMALS.push(18); // aDAI
POOL_STABLECOIN_DECIMALS.push(6); // aUSDC
POOL_STABLECOIN_DECIMALS.push(6); // aUSDT
POOL_STABLECOIN_DECIMALS.push(18); // aWAVAX
POOL_STABLECOIN_DECIMALS.push(8); // aWBTC
POOL_STABLECOIN_DECIMALS.push(18); // aWETH

POOL_STABLECOIN_DECIMALS.push(18); // qiDAI
POOL_STABLECOIN_DECIMALS.push(18); // qiLINK
POOL_STABLECOIN_DECIMALS.push(6); // qiUSDC
POOL_STABLECOIN_DECIMALS.push(6); // qiUSDT
POOL_STABLECOIN_DECIMALS.push(8); // qiWBTC
POOL_STABLECOIN_DECIMALS.push(18); // qiWETH

let POOL_DEPLOY_BLOCKS = new Array<i32>(0);

POOL_DEPLOY_BLOCKS.push(5354349); // aDAI
POOL_DEPLOY_BLOCKS.push(5354542); // aUSDC
POOL_DEPLOY_BLOCKS.push(5354627); // aUSDT
POOL_DEPLOY_BLOCKS.push(5354448); // aWAVAX
POOL_DEPLOY_BLOCKS.push(5354723); // aWBTC
POOL_DEPLOY_BLOCKS.push(5354810); // aWETH

POOL_DEPLOY_BLOCKS.push(5356355); // qiDAI
POOL_DEPLOY_BLOCKS.push(5356883); // qiLINK
POOL_DEPLOY_BLOCKS.push(5356477); // qiUSDC
POOL_DEPLOY_BLOCKS.push(5356570); // qiUSDT
POOL_DEPLOY_BLOCKS.push(5356692); // qiWBTC
POOL_DEPLOY_BLOCKS.push(5356786); // qiWETH

export function keccak256(s: string): ByteArray {
  return crypto.keccak256(ByteArray.fromUTF8(s));
}

export function tenPow(exponent: number): BigInt {
  let result = BigInt.fromI32(1);
  for (let i = 0; i < exponent; i++) {
    result = result.times(BigInt.fromI32(10));
  }
  return result;
}

export function normalize(i: BigInt, decimals: number = 18): BigDecimal {
  return i.toBigDecimal().div(new BigDecimal(tenPow(decimals)));
}

export function getPool(poolAddress: string): DPool {
  let pool = DPool.load(poolAddress);
  if (pool == null) {
    pool = new DPool(poolAddress);
    let poolContract = DInterest.bind(Address.fromString(poolAddress));

    pool.address = poolAddress;
    pool.moneyMarket = poolContract.moneyMarket().toHex();
    pool.stablecoin = poolContract.stablecoin().toHex();
    pool.interestModel = poolContract.interestModel().toHex();
    pool.oneYearInterestRate = ZERO_DEC;
    pool.oracleInterestRate = ZERO_DEC;
    pool.surplus = ZERO_DEC;

    pool.save();
  }
  return pool as DPool;
}

export function handleEDeposit(event: EDeposit): void {}

export function handleEFund(event: EFund): void {}

export function handleEPayFundingInterest(event: EPayFundingInterest): void {}

export function handleERolloverDeposit(event: ERolloverDeposit): void {}

export function handleESetParamAddress(event: ESetParamAddress): void {
  let pool = getPool(event.address.toHex());
  let paramName = event.params.paramName;
  if (paramName == keccak256("interestModel")) {
    pool.interestModel = event.params.newValue.toHex();
  }
  pool.save();
}

export function handleESetParamUint(event: ESetParamUint): void {}

export function handleETopupDeposit(event: ETopupDeposit): void {}

export function handleEWithdraw(event: EWithdraw): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleBlock(block: ethereum.Block): void {
  if (block.number.mod(BLOCK_HANDLER_INTERVAL).isZero()) {
    let blockNumber = block.number.toI32();
    for (let i = 0; i < POOL_ADDRESSES.length; i++) {
      if (blockNumber >= POOL_DEPLOY_BLOCKS[i]) {

        let poolID = POOL_ADDRESSES[i];
        let pool = getPool(poolID);
        let poolContract = DInterest.bind(Address.fromString(pool.address));
        let stablecoinDecimals: number = POOL_STABLECOIN_DECIMALS[i];
        let oracleContract = IInterestOracle.bind(poolContract.interestOracle());

        let oneYearInterestRate = poolContract.try_calculateInterestAmount(tenPow(18), YEAR);
        pool.oneYearInterestRate = oneYearInterestRate.reverted
          ? ZERO_DEC
          : normalize(oneYearInterestRate.value)

        let oracleInterestRate = oracleContract.try_updateAndQuery();
        pool.oracleInterestRate = oracleInterestRate.reverted
          ? ZERO_DEC
          : normalize(oracleInterestRate.value.value1)

        let surplusResult = poolContract.try_surplus();
        pool.surplus = surplusResult.reverted
          ? ZERO_DEC
          : normalize(surplusResult.value.value1, stablecoinDecimals).times(surplusResult.value.value0 ? NEGONE_DEC : ONE_DEC)

        pool.save();

      }
    }
  }
}
