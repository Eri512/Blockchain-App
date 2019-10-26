const sha256 = require("sha256");
const uuid = require("uuid/v1");
const currenNodeUrl = process.argv[3];
//building data structure
function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currenNodeUrl = currenNodeUrl;
  this.networkNodes = [];
  //genesis block
  this.createNewBlock(100, "0", "0");
}
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};
Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid()
      .split("-")
      .join("")
  };
  // this.pendingTransactions.push(newTransaction);
  return newTransaction;
};
Blockchain.prototype.addTransactionToPendingTransaction = function(
  transactionObj
) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()["index"] + 1;
};
//hash method
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const nonceString = nonce.toString();
  const dataAsString =
    previousBlockHash + nonceString + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
};
module.exports = Blockchain;
