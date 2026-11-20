---
title: Shouki Tsuda
date: 2026-11-18
aliases:
  - cv
---

Shouki Tsuda is a software and security engineer based in Tokyo. He builds and verifies systems software, from peer-to-peer networking to mathematically verified code, and reviews the security of web services and cloud infrastructure. His research covers privacy-preserving cryptography and the move to quantum-resistant security, and he has built core blockchain infrastructure since 2018.

## Skills

- **Languages**: Rust, Haskell, Lean 4, Java, Python, TypeScript/JavaScript, C, assembly (RISC-V, x86-64), Solidity
- **Security**: web application and API security review, cloud and internal-control review, penetration testing, bug bounty hunting, AI-assisted security operations
- **Verification**: theorem proving (Lean 4), model checking, interoperability testing
- **Systems**: peer-to-peer networking, data encoding, cryptographic implementation

## Current

- **[Nyx Foundation](https://nyx.foundation)** — Research engineer, 2025–
  Leads research and development on blockchain safety: mathematical verification of quantum-resistant signatures for Ethereum upgrades, and bug discovery in Ethereum's core software.
- **[MynaWallet](https://mynawallet.jp)** — Software engineer, 2025–
  Blockchain and backend development.
- **[Ethereum Foundation](https://ethereum.foundation)** — Grantee, 2025–
  Research on VOLE-based zero-knowledge proofs.
- **Independent** — 2024–
  Applied R&D turning cryptographic theory into working software.

## Previous

- **[Hana Network](https://www.hana.network)** — Interim CTO, 2024; Project Manager, 2023–2024
  Hana is privacy infrastructure connecting multiple blockchains.
- **[Rakuten](https://global.rakuten.com/corp/)** — Software engineer, 2022–2023
  Built web applications for financial services in Java.

## Selected Work

- **Security**
  - Security review of a crypto-asset transfer service through Nyx Foundation, covering the web application and transfer APIs, the custody integration and transaction approval policy, cloud infrastructure, and internal controls (client undisclosed).
  - Bug bounty hunting on general web services.
  - Security verification of web services using model checking.
  - AI automation of security monitoring for web services.
  - An automated penetration testing environment driven by AI agents.
- **Verified Ethereum software**
  - [formal-leanSpec](https://github.com/NyxFoundation/formal-leanSpec): a machine-checked version of Ethereum's next-generation consensus specification.
  - [cl-asm](https://github.com/NyxFoundation/cl-asm) and [LeanAsm](https://github.com/NyxFoundation/LeanAsm): a prototype of Ethereum's core logic in verified low-level code, built on a reusable verification toolkit, plus the companion encoding library [ssz-asm](https://github.com/NyxFoundation/ssz-asm).
  - [ethereum-proof-atlas](https://github.com/NyxFoundation/ethereum-proof-atlas): a catalogue of correctness proofs about Ethereum that anyone can re-check.
  - [formal-eth](https://github.com/NyxFoundation/formal-eth): a curated overview of verification work on Ethereum.
- **[Verity](https://github.com/NyxFoundation/verity)** ([@verityclient](https://x.com/verityclient)): Nyx Foundation's mathematically verified Ethereum node software ([proofs](https://github.com/NyxFoundation/verity-aeneas-proofs)). It has found bugs in the official specification and an integer overflow.
- **Peer-to-peer networking**
  - [hs-libp2p](https://github.com/adust09/hs-libp2p): author and maintainer of a Haskell implementation of libp2p, a peer-to-peer networking stack, with more than 1,400 tests and compatibility tests against other implementations, developed with outside contributors.
  - [libp2p-fv](https://github.com/NyxFoundation/libp2p-fv) and [p2p-asm](https://github.com/NyxFoundation/p2p-asm): verification of Ethereum's message propagation protocol, and a verified peer-to-peer networking implementation.
- **Ethereum's encoding scheme (SSZ)**: [nyx-ssz](https://github.com/NyxFoundation/nyx-ssz) (a verified Rust implementation) and [bend-ssz](https://github.com/adust09/bend-ssz) (an implementation in a parallel programming language).
- **Curation**: [awesome-vole](https://github.com/adust09/awesome-vole), a curated list of VOLE (vector oblivious linear evaluation) research and implementations.

## Writing

- A book on cryptography for computing on private data (in progress).
- [Mastering Ethereum, 2nd edition, Japanese translation](https://adust09.github.io/ethereumbook-develop-jp/) ([repository](https://github.com/adust09/ethereumbook-develop-jp)), co-translated with Yukishige Nakajo and Wataru Shinohara.

## Talks

- Ethereum's post-quantum readiness, [BSAQ 2026](https://bgin-global.org/events/20261130-bsaq2026) (University of Tokyo IIS and BGIN), University of Tokyo, Tokyo, November 2026 (upcoming)
- [Building Resilient Ethereum: Networking, PQ Security & Verified Consensus](https://cfp.devcon.org/devcon8/talk/ER8EHM/), Resilient Networking Hub workshop with Manu Sheel Gupta, Devcon 8, Mumbai, 2026
- [hs-libp2p: A Haskell Implementation of the libp2p Stack](https://cfp.devcon.org/devcon8/talk/MJ7SP9/), Lightning Talk, Devcon 8, Mumbai, 2026
- [CL Client in Lean: Implementing a CL client in Lean with Rust FFI](https://www.youtube.com/watch?v=WCghlOzlaCE&list=PLBMi27NTohJc&t=8780s), session lead in the joint formal verification session, [Ethereum Foundation Fast Finality Workshop](https://consensus.ethereum.foundation/cambridge/) and FV Workshop, Jesus College, Cambridge, 2026
- Definition and Standardization of Post-Quantum Cryptography Readiness in Blockchain, talk, fireside chat and roundtable, Operational Resilience and Network Security of Layer 1 Networks (Ethereum Foundation GPS), King's College, Cambridge, 2026
- Building Community in Asia & Beyond, panel, [ETHTaipei](https://ethtaipei.org), Taipei, 2026 (representing Merkle Japan)
- Verity, [Ethproofs Call #9: Formal Verification](https://forkcast.org/calls/ethproofs/009/), online, 2026
- [Programmable Cryptography and Smart Contract](https://archive.devcon.org/devcon-7/programmable-cryptography-and-smart-contract/), Lightning Talk, Devcon SEA, Bangkok, 2024

[Devcon speaker page](https://app.devcon.org/speakers/shouki-tsuda)

## Community

- Founder and Representative Director of [Merkle Japan](https://merklejapan.eth.limo/), a general incorporated association established in October 2026; co-hosted the Resilient Networking Hub (libp2p Hub) at Devcon 8.
- Organised Advanced Cryptography Program (ACP) 2026, part of the cryptography and blockchain study group at the University of Tokyo.
- Founded [Bitpickers](https://kyutech-bc.connpass.com/), a blockchain research community in Japan.
- Organised [Progcrypto Camp](https://luma.com/1rg8psb1) (2024), a four-day cryptography camp for Ethereum developers.

## Education

- **[Kyushu Institute of Technology](https://www.kyutech.ac.jp)** — B.Eng. in Information Engineering, 2018–2022
- **Ethereum University** — 2022

## Links

- [GitHub](https://github.com/adust09)
- [X](https://x.com/adust09)
- [LinkedIn](https://www.linkedin.com/in/shouki/)
- [RSS](/index.xml)
