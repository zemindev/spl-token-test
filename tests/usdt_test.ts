import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { sendAndConfirmTransaction, Connection, Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";
import { UsdtTest } from "../target/types/usdt_test";
import { assert } from "chai";
const fs = require('fs');

describe("Test transfers", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  // const connection = new Connection("http://127.0.0.1:8899", 'confirmed');
  const connection = provider.connection;
  const program = anchor.workspace.UsdtTest as Program<UsdtTest>;

  it("usdt_test", async () => {
    // Generate keypairs for the new accounts
    const secretKey = JSON.parse(fs.readFileSync("/Users/maxq/.config/solana/id.json", 'utf8'));
    const providerWallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const fromKp = providerWallet;
    const toKp = Keypair.generate();
    console.log('Sender Address', providerWallet.publicKey.toBase58())
    console.log('Receiver Address', toKp.publicKey.toBase58())

    
    const fromAirdropSignature = await connection.requestAirdrop(
      fromKp.publicKey,
      LAMPORTS_PER_SOL,
    );
  
    await connection.confirmTransaction(fromAirdropSignature);

    const fromAccBalance = await connection.getBalance(fromKp.publicKey);
    console.log('initial Balance: ', fromAccBalance)
  
    // Create a new mint and initialize it
    const mint = await createMint(
      connection,
      providerWallet,
      fromKp.publicKey,
      null,
      0
    );

    // Create associated token accounts for the new accounts
    const fromAta = await createAssociatedTokenAccount(
      connection,
      providerWallet,
      mint,
      fromKp.publicKey
    );
    const toAta = await createAssociatedTokenAccount(
      connection,
      providerWallet,
      mint,
      toKp.publicKey
    );
    // Mint tokens to the 'from' associated token account
    const mintAmount = 1000;
    await mintTo(
      connection,
      providerWallet,
      mint,
      fromAta,
      providerWallet.publicKey,
      mintAmount
    );
    // const fromTokenAccount = await connection.getTokenAccountBalance(fromAta);
    // console.log('From Token Amount:', fromTokenAccount.value.uiAmount);
    const tx0 = <anchor.BN>await program.methods
    .getTokensBalance()
    .accounts({
      tokenAccount: fromAta,
    }).view();
    console.log('before:', tx0.toNumber())
    // Send transaction
    const transferAmount = new anchor.BN(500);
    const tx = await program.methods
      .sendUsdt(transferAmount)
      .accounts({
        from: fromKp.publicKey,
        fromAta: fromAta,
        toAta: toAta,
      })
      .signers([providerWallet, fromKp])
      .transaction();
    const txHash = await sendAndConfirmTransaction(connection, tx, [providerWallet, fromKp]);
    //console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

    //const toTokenAccount = await connection.getTokenAccountBalance(toAta);
    // check blance for receiver token account
    const tx1 = <anchor.BN>await program.methods
    .getTokensBalance()
    .accounts({
      tokenAccount: toAta,
    }).view();
    // check the balance for sender token account
    const tx2 = <anchor.BN>await program.methods
    .getTokensBalance()
    .accounts({
      tokenAccount: fromAta,
    }).view();
    console.log('after:', tx2.toNumber())

    assert.strictEqual(
      //toTokenAccount.value.uiAmount,
      tx1.toNumber(),
      transferAmount.toNumber(),
      "The 'to' token account should have the transferred tokens"
    );
  });
});