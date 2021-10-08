import { BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/DInterest/DInterest"
import { ExampleEntity } from "../generated/schema"

export function handleEDeposit(event: EDeposit): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.sender = event.params.sender
  entity.depositID = event.params.depositID

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.GlobalDepositCap(...)
  // - contract.MaxDepositPeriod(...)
  // - contract.MinDepositAmount(...)
  // - contract.calculateInterestAmount(...)
  // - contract.deposit(...)
  // - contract.deposit(...)
  // - contract.depositNFT(...)
  // - contract.depositsLength(...)
  // - contract.feeModel(...)
  // - contract.fund(...)
  // - contract.fund(...)
  // - contract.fundingListLength(...)
  // - contract.fundingMultitoken(...)
  // - contract.getDeposit(...)
  // - contract.getFunding(...)
  // - contract.interestModel(...)
  // - contract.interestOracle(...)
  // - contract.moneyMarket(...)
  // - contract.mphMinter(...)
  // - contract.multicall(...)
  // - contract.owner(...)
  // - contract.payInterestToFunders(...)
  // - contract.pendingOwner(...)
  // - contract.rolloverDeposit(...)
  // - contract.rolloverDeposit(...)
  // - contract.stablecoin(...)
  // - contract.sumOfRecordedFundedPrincipalAmountDivRecordedIncomeIndex(...)
  // - contract.surplus(...)
  // - contract.topupDeposit(...)
  // - contract.topupDeposit(...)
  // - contract.totalDeposit(...)
  // - contract.totalFeeOwed(...)
  // - contract.totalFundedPrincipalAmount(...)
  // - contract.totalInterestOwed(...)
  // - contract.withdraw(...)
}

export function handleEFund(event: EFund): void {}

export function handleEPayFundingInterest(event: EPayFundingInterest): void {}

export function handleERolloverDeposit(event: ERolloverDeposit): void {}

export function handleESetParamAddress(event: ESetParamAddress): void {}

export function handleESetParamUint(event: ESetParamUint): void {}

export function handleETopupDeposit(event: ETopupDeposit): void {}

export function handleEWithdraw(event: EWithdraw): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
