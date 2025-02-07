---
date: 2025-02-07
title: Post-Quantum Cryptography in Ethereum
---
The first step is to sort out the current status and issues of Ethereum and formulate an appropriate approach.
The current PQC discussion is summarized [here](https://ethresear.ch/t/so-you-wanna-post-quantum-ethereum-transaction-signature/21291).
Furthermore, as of 2022, already [NIST Post-Quantum-Cryptography Standardization Process and What it means for Ethereum](https://crypto.ethereum.org/blog/ NIST-pqc-standard).


The challenge is that ECDLP can be solved by Shore's algorithm, which requires a change in Ethereum's signature scheme. Falcon, a lattice-based signature scheme, has emerged as a strong candidate due to its efficiency and compact size.

The problem is how to deploy it in the current Ethereum, and the following methods have been proposed.
- The Account Abstraction
- Hard fork
- Hybrid

The advantages and disadvantages of integrating Falcon into Ethereum are [here](https://ethresear.ch/t/falcon-as-an-ethereum-transaction-signature-the-good-the-bad-and-the- gnarly/21512).
