---
date: 2024-12-25
title: VOLE in the Head
---
# Overview

Previously, VOLE ZK was a designed verifier; VOLE in the Head follows MPC in the Head and makes it Public Verifiable.
This would theoretically enable Onchain Verification on Ethereum, but VOLE ZK is difficult to implement at a realistic cost due to the larger Proof size compared to SNARK and others.
![](https://scrapbox.io/files/676a655c3038c65e8e0354ec.png)
 Scholl et al. propose [FAEST](https://faest.info/) as a quantum-tolerant signature scheme in their VOLE itH paper.
 The zkTLS project [zkPass](https://medium.com/zkpass/introducing-the-hybrid-mode-of-zktls-a-zkpass-innovation-9ec18b36f397) has also adopted VOLE itH.

# Building Blocks
VLE itH is based on the VOLE ZK protocol called QuickSilver and the Oblivious Transfer protocol called SoftSpoken.
With SoftSpoken+GGM Construction, Single Point VOLE (SPVOLE) is achieved. This reduces the Communication Cost from O(N) to O(log N).

# Reference
https://eprint.iacr.org/2023/996
https://youtu.be/tbsy9Jik3IQ?feature=shared
https://csrc.nist.gov/csrc/media/Projects/post-quantum-cryptography/documents/pqc-seminars/presentations/15-vole-in-the-head-06182024.pdf
