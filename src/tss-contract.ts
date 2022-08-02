import {
  Transfer as TransferEvent,
  AddBlacklistEvent,
  RemoveBlacklistEvent,
  TSSContract as TSSContract
 } from "../generated/TSSContract/TSSContract"

import {
  Token, User
 } from '../generated/schema'

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    //token.creator = event.params.to.toHexString();
    token.creator = event.transaction.from.toHexString();
    token.tokenID = event.params.tokenId;
    token.createdAtTimestamp = event.block.timestamp; 
    // let tssContract = TSSContract.bind(event.address);
    // token.metadataURI = tssContract.tokenURI(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();
 
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.isBlacklist = false;
    user.save();
  }
}

export function handleAddBlacklist(event: AddBlacklistEvent): void { 
  let listAddressInput = event.params.addresses;
  listAddressInput.forEach(element => {
    let user = User.load(element.toHexString());
    if (user) {
      user.isBlacklist = true;
      user.save();
    }
    else {
      user = new User(element.toHexString());
      user.isBlacklist = true;
      user.save();
    }
  });
}

export function handleRemoveBlacklist(event: RemoveBlacklistEvent): void { 
  let listAddressInput = event.params.addresses;
  listAddressInput.forEach(element => {
    let user = User.load(element.toHexString());
    if (user) {
      user.isBlacklist = false;
      user.save();
    }
    else {
      user = new User(element.toHexString());
      user.isBlacklist = false;
      user.save();
    }
  });
}