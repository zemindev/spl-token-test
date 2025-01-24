# Solana Program Deployment Guide

This guide provides step-by-step instructions for deploying a Solana program written in Rust to the **Devnet**. The instructions are tailored for macOS but can be adjusted slightly for Windows.

---

## Prerequisites

1. **Install Solana CLI, Anchor and Node**
   Follow the official installation guide: [Solana Installation Documentation](https://solana.com/docs/intro/installation).

2. **Verify Installation**:
   - Ensure `solana` is installed:
     ```bash
     solana --version
     ```
   - Ensure `anchor` is installed:
     ```bash
     anchor --version
     ```
   - Ensure `node` is installed:
     ```bash
     node --version
     ```

---

## Build and Test the Smart Contract on Localnet

1. **Update Anchor.toml to specify network**:
   - Modify the [provider] section in your Anchor.toml file:
   ```toml
   [provider]
   cluster = "Localnet"
   wallet = "<your-authority--keypair.json>"
   ```

2. **Build the Program**:
   ```bash
   anchor build
   ```

3. **Run Tests on Localnet**:
   ```bash
   anchor test
   ```

---

## Solana Program Deployment on Devnet

1. **Update Anchor.toml to specify network**:
   - Modify the [provider] section in your Anchor.toml file:
   ```toml
   [provider]
   cluster = "Devnet"
   wallet = "<your-authority--keypair.json>"
   ```

2. **Build the Program**:
   ```bash
   anchor build
   ```

3. **Request free SOL amount for deployment the Program**:
   Configure your Solana CLI to use the Devnet cluster:
   ```bash
   solana config set --url https://api.devnet.solana.com
   solana airdrop 2 <authority_address>
   ```

3. **Deploy to Devnet**:
   ```bash
   anchor deploy
   ```

## Verify Deployment

### Check Deployment Status
Run the following command to verify the program details:
```bash
solana program show <PROGRAM_ID>
```
Replace `<PROGRAM_ID>` with the ID returned during deployment. You should see output similar to the following:
```plaintext
Program Id: <PROGRAM_ID>
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Executable: true
Rent Epoch: 272
```
If `Executable` is `true`, the program has been deployed successfully.

### View on Solana Explorer
1. Open [Solana Explorer](https://explorer.solana.com).
2. Switch to the **Devnet** cluster.
3. Search for your **Program ID** to view its details.

---

## Notes
- For Windows users, some commands may require adjustments. Ensure Docker is running if building within a Dockerized environment.
- Ensure you have sufficient SOL balance in your wallet for deployment and rent.

---

For further questions or troubleshooting, refer to the [Solana Documentation](https://solana.com/docs).
