# Anthill Smart Contract

**1. Install foundryup**

```bash
curl -L https://foundry.paradigm.xyz | bash
```

```bash
foundryup
```

**2. Check forge version**

```bash
forge --version
```

If your forge version is below v1.5.0, install it

```bash
foundryup -i nightly
```

```bash
foundryup -u nightly
```

**3. Install dependencies**

```bash
forge install
```

## Deploy Contracts

**Set private key in .env File**

```bash
 export DEPLOYER_PK="0xaa...cc"
```

**Run deployment script**

```bash
forge script ./script/Anthill.s.sol --priority-gas-price 1000000000 --rpc-url insectarium --broadcast --verify
forge script ./script/AnthillMemeCoinFactory.s.sol --priority-gas-price 1000000000 --rpc-url insectarium --broadcast --verify
forge script ./script/ColonyLevelCalculator.s.sol --priority-gas-price 1000000000 --rpc-url insectarium --broadcast --verify
```

- To simulate deployment without broadcasting, remove the `--broadcast` flag.
- To skip contract verification, remove the `--verify` flag.

## Verify Contracts

```bash
forge verify-contract <ContractAddress> <ContractName> --chain insectarium --watch

```