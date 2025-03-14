---
date: 2025-03-14
title: All but one Vector Commitment
---

All but one vector commitment is used to create a VOLE Correlation. All but one element of the binary tree can be conveyed to the other party.

The tree is constructed starting from a random seed $r$ of the root node, and the value $k$ of each leaf node is expanded by the PRG and hash function $H_0$ to two values, a seed $sd$ and a commitment $com$. Then the final seed $sd_0, ... , sd_{N-1}$  is computed as $h_{com} = H_1(com_0, ..., com_{N-1})$.　In other words, N-1 seeds are committed to $h_{com}$.
![all-but-one-vc](https://hackmd.io/_uploads/H1xY4Ckhye.png)

>https://csrc.nist.gov/csrc/media/Projects/pqc-dig-sig/documents/round-1/spec-files/FAEST-spec-web.pdf

The overall algorithm is as follows
1. Prover generates $r$ and computes $h_{com}$ using PRG and H0,H1. 
2. Verifier sends challenge j (index of seed) to Prover 
3. Prover sends $h_{com}$, $com_j$, and siblings to Verifier 
4. Verifier computes each $com_i(i\neq j)$ from the received siblings 
5. input $com_j$ received in step 3 and each commitment calculated in step 4 into H1
6. Verifier check that the output value of H1 matches the $h_com$ received in step 3

Example of j=3

1. Prover generates r and calculates h_com using PRG and H0,H1. This is a N-seeds commit
2.  Verifier sends challenge(= 3) to Prover
3. Prover sends $h_{com}$,$com_{3}$, and siblings($k^1_1,k^2_0,k^3_2$) to Verifier
4. Verifier computes each Com_i(i\=j) from the received siblings
	$k^1_1$: $com_4,com_5,com_6,com_7$
	$k^2_0$: $com_0,com_1$
	$k^3_2$: $com_2$
5. Enter the $com_3$ received in step 3 and each of the commitments calculated in step 4 together in H1.
	output = H1(com1~com7)
6. Verifier checks that the output value of H1 matches the $h_{com}$ received in step 3

This vector commitment is repeated multiple times to prepare the number of VOLE correlations needed to evaluate the circuit.

the next step is to convert each vector commitment into a length-l, VOLE correlation.
