# Solana Program Deployment Guide

This guide provides step-by-step instructions for deploying a Solana program written in Rust to the **Devnet**. The instructions are tailored for macOS but can be adjusted slightly for Windows.

---

## Prerequisites

1. **Install Solana CLI and Anchor**
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

---

## Build and Test the Smart Contract on Localnet

1. **Build the Program**:
   ```bash
   anchor build
   ```

2. **Run Tests on Localnet**:
   ```bash
   anchor test
   ```

---

## Solana Program Deployment on Devnet

### **Step 1: Install Solana's SBF Toolchain**

Install the Solana toolchain if not already done:
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.16.1/install)"
```

Add the Solana CLI to your PATH:
```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### **Step 2: Build the Program**

Use the Solana toolchain to build your program using the `cargo-build-sbf` command:
```bash
cargo-build-sbf
```
This will generate the compiled `.so` file in the `target/deploy` directory.

### **Step 3: Deploy to Devnet**

#### 3.1 Set the Devnet Cluster
Configure your Solana CLI to use the Devnet cluster:
```bash
solana config set --url https://api.devnet.solana.com
```

#### 3.2 Fund Your Wallet
Request free SOL tokens for deployment:
```bash
solana airdrop 2
```
Verify your wallet balance:
```bash
solana balance
```

#### 3.3 Deploy the Program
Deploy the program using the following command:
```bash
solana program deploy target/deploy/<PROGRAM_NAME>.so
```
Replace `<PROGRAM_NAME>` with the name of your program file, e.g., `usdt_test.so`.

---

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
