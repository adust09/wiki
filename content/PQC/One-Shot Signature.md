---
date: 2024-10-30
title: One-Shot Signature
---

# Overview

One-Shot Signature(OSS) is a signature scheme that combines quantum mechanics with conventional cryptology (e.g. public key cryptography).
It is characterized by the following features, which have not been possible with conventional cryptography
The secret key is used to sign only one message and the key is self-destructive.
Prevents multiple messages from being signed and prevents multiple people from sharing the key.
Basic cryptography allows the owner of the private key to sign as many messages as he/she likes.

# Quantum No-cloning Principle

The Quantum No-cloning Principle is one of the fundamental principles in quantum mechanics, with the property that it is impossible to create an identical copy of any unknown quantum state.
OSS is based on this theorem, which guarantees that once a private key is used, it cannot be cloned or reused.
In other words, ‘a chain of secret keys that can never be re-used’ and ‘forward secret signatures’ can be realised from the security based on quantum information theory.

# Applications to blockchain

Let's take back at how the blockchain works. When a new block is created, it is signed by the creator of that block.
This signature serves to verify the authenticity of the block and its position in the chain.

An additional layer of security can be added here by using a unique key for each signature using OSS.
This is because the key at each block time can only be used once, making it impossible to re-use the key to sign another block or to change the order of existing blocks.

![スクリーンショット 2024-10-30 9 49 05](https://github.com/user-attachments/assets/24a3a34d-f87a-48cf-98fe-c9562c31c9d3)


While no blockchain wants to hard fork and replace the consensus algorithm, it does want to increase security, and research is being conducted to see if OSS can be used to increase resistance to certain types of attacks.
The agenda is led by Cardano, who first turned his attention to OSS, and Justin Drake and others at Ethereum.


For example, it could help prevent long-range attacks in PoS, where an attacker tries to rewrite the history of the blockchain using the old key.
It could also prevent double voting, thus eliminating the need for slashing conditions in Ethereum, etc.
Affecting slashing condition could also affect the design of liquid staking and re-staking.

# Reference
https://informatics.ed.ac.uk/sites/default/files/2024-05/Justin%20Drake%20-%20New%20Blockchain%20Paradigm.pdf#page=3.00
https://vitalik.eth.limo/general/2024/10/29/futures6.html
https://cexplorer.io/article/understanding-one-shot-signatures
https://cexplorer.io/article/how-one-shot-signatures-will-strengthen-cardano-s-security
