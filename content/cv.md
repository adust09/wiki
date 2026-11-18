---
title: CV
date: 2026-11-18
---

Shouki Tsuda is a research engineer based in Tokyo working on zero-knowledge proofs, MPC, FHE, and Ethereum's transition to post-quantum security. He has worked in the blockchain industry since 2018, building protocol layers for several projects.

## Current

- **[Nyx Foundation](https://nyx.foundation)** — Research engineer, 2025–
  Leads research and development on protocol safety and cryptographic implementation: formal verification of post-quantum signature schemes for Ethereum upgrades and bug discovery in Ethereum clients.
- **[MynaWallet](https://mynawallet.jp)** — Software engineer, 2025–
  Blockchain and backend development.
- **[Ethereum Foundation](https://ethereum.foundation)** — Grantee, 2025–
  Research on VOLE-based zero-knowledge proofs.
- **Independent** — 2024–
  Applied R&D combining Ethereum and cryptographic theory.

## Previous

- **[Hana Network](https://www.hana.network)** — Interim CTO, 2024; Project Manager, 2023–2024
  Hana is a decentralized privacy layer with trustless interoperability.
- **[Rakuten](https://global.rakuten.com/corp/)** — Software engineer, 2022–2023

## Selected Work

- **Formal verification of Ethereum**
  - [formal-leanSpec](https://github.com/NyxFoundation/formal-leanSpec): Lean 4 formalization of Ethereum's lean consensus specification.
  - [cl-asm](https://github.com/NyxFoundation/cl-asm) and [LeanAsm](https://github.com/NyxFoundation/LeanAsm): a prototype consensus-layer state transition function in Lean 4-verified RISC-V assembly, built on a reusable verified-assembly foundation (RV64, with an x86-64 backend), plus the companion SSZ library [ssz-asm](https://github.com/NyxFoundation/ssz-asm).
  - [ethereum-proof-atlas](https://github.com/NyxFoundation/ethereum-proof-atlas): a catalogue of Ethereum-related formal proofs that can be verified locally.
  - [formal-eth](https://github.com/NyxFoundation/formal-eth): a curated overview of formal verification work on Ethereum.
- **[Verity](https://github.com/NyxFoundation/verity)** ([@verityclient](https://x.com/verityclient)): Nyx Foundation's formally verified Ethereum consensus-layer client. Rust code is translated to Lean with Aeneas and proved there ([proofs](https://github.com/NyxFoundation/verity-aeneas-proofs)), with a Lean core called over FFI and Kani model checking. It has found specification bugs in leanSpec and a u64 overflow.
- **libp2p**
  - [hs-libp2p](https://github.com/adust09/hs-libp2p): author and maintainer of a Haskell implementation of libp2p, with more than 1,400 tests and interoperability tests against other implementations, developed with outside contributors.
  - [libp2p-fv](https://github.com/NyxFoundation/libp2p-fv) and [p2p-asm](https://github.com/NyxFoundation/p2p-asm): cross-layer formal verification of Ethereum's GossipSub over QUIC, and a Lean 4 formalization of a verified libp2p implementation over QUIC.
- **SSZ and consensus clients**: [nyx-ssz](https://github.com/NyxFoundation/nyx-ssz) (a Rust SSZ implementation with Aeneas/Lean refinement proofs), and [bend-ssz](https://github.com/adust09/bend-ssz) and [bend-client](https://github.com/adust09/bend-client) (an SSZ layer and a 3SF-mini consensus client with fork choice, written in Bend).
- **Writing and curation**
  - [Mastering Ethereum, 2nd edition, Japanese translation](https://adust09.github.io/ethereumbook-develop-jp/) ([repository](https://github.com/adust09/ethereumbook-develop-jp)), co-translated with Yukishige Nakajo and Wataru Shinohara.
  - [awesome-vole](https://github.com/adust09/awesome-vole): a curated list of VOLE (vector oblivious linear evaluation) research and implementations.

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

## Links

- [GitHub](https://github.com/adust09)
- [LinkedIn](https://www.linkedin.com/in/shouki/)
- [RSS](/index.xml)
