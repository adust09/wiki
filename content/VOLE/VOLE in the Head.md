---
date: 2025-02-07
title: VOLE in the Head
---

# Background

Conventional VOLE-based ZKs have limited applications because they are designed verifiers that require interaction to generate VOLE correlations. Therefore, [Petter](https://scholar.google.dk/citations?user=1k1mPNAAAAAJ&hl=en) et al. devised VOLE in the Head, a public verifiable VOLE-based ZK based on [Quicksilver](https://eprint.iacr.org/2021/076.pdf) and [MPC in the Head](https://csrc.nist.gov/csrc/media/Projects/post-quantum-cryptography/documents/pqc-seminars/presentations/13-intro-mpc-in-the-head-05212024.pdf).

The extension to the Public-coin Protocol enabled the use of the Fiat-[Shamir transformation](https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic), transforming it into a NIZK VOLE-based ZK.
Petter et al. propose the PQ Signature scheme: [FAEST](https://faest.info/) as an application of VOLE itH, and its further application to a [quantum distributed ledger system](https://eprint.iacr.org/2025/113.pdf) that is resistant to secret money transfers.

# Novelty

- In the existing VOLE-based ZK, Prover and Verifier cooperate to generate VOLE Correlation based on OT, and then Commit&Open is performed, VOLE itH does not generate VOLE Correlation first, but converts it to VOLE Correlation after Commit&Open.
- In Quicksilver, the following design is used. In Quicksilver, Sender: Verifier, Receiver: Prover, but in VOLE itH, Sender: Prover, Receiver: Verifier.
- In the past, VOLE-based ZKs (e.g. Quicksilver) did not reveal the $\Delta$ to the prover in order to achieve binding in the VOLE Commitment. This is the reason why it is a Designed Verifier. In VOLE itH, the commitment scheme is made VOLE-independent (hash-based vector commitment), which makes the $\Delta$ public. $\Delta$ can be made public, and as a result, it has been transformed into a public verifiable protocol.

# All-but-one Vector Commitment

This section describes Vector Commitment, which is important in VOLE itH.
The protocol proceeds as follows

1. Prover stores the Commitment about wire value:$w\in{\mathbb{F}_n}$ in Leaf of [[GGM Tree]] and commits it.
2. Verifier randomly picks Challenge:$\Delta\in{\mathbb{F}_n}$ and sends it to Prover.
3. Prover sends $i\not = \Delta$ to Verifier and opens $w_i$.
4. Verifier calculates VOLE Correlation $\vec{q}=\vec{w}\Delta+\vec{v}$ and Verify.

where $\vec{w}=w_1+w_2+. .w_n$, and $\vec{v}=-1\cdot v_1-2\cdot v_2-... -n\cdot v_n$.
In Opening, Verifier is given the path of the leaf with $i\not = \Delta$, and Verifier derives the leaf (wire value) from it.
Since $\vec{v}$ is derived from $\vec{w}$, Verifier can calculate $\vec{q}$ directly and obtain VOLE Correlation by performing the following calculation after Opening.

$$
\begin{split}
\vec{q}&=\sum_{i}{w_i\cdot (\Delta-i)} \\
 &=\vec{w}\Delta+\vec{v}
\end{split}
$$

If $i=\Delta$, then the element in low $i$ is missing because $\Delta-i=0$. In other words, $\vec{q}=\vec{w}\Delta-\vec{v}$ is not valid, so the verification fails. 
In other words, we can say that this is evaluated in terms other than $\Delta$ rather than in terms of $\Delta$.

Since $\Delta$ is random, it can be regarded as Public-coin Protocol, and Challenge can be made Non-Interactive by Fiat-Shamir Transformation.Thus, by replacing the Commitment scheme with an All-but-one Vector Commitment based on the [[GGM Tree]], the order of Commitment and VOLE Correlation can be swapped to become Public Verifiable.

Binding-Hiding is secured by a hash function.

# Protocol Overview
The entire protocol is as follows.
Strictly speaking, there will be additional Challenges associated with Consistency Check and Fiat-Shamir, which I did not mention in this blog.
![[vole-ith.png]]
# References
- https://csrc.nist.gov/csrc/media/Projects/post-quantum-cryptography/documents/pqc-seminars/presentations/15-vole-in-the-head-06182024.pdf#page=24.00
- https://youtu.be/9ToR-IfZXb4?feature=shared
- https://eprint.iacr.org/2023/996.pdf#page=34.49
