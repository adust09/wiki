---
date: 2024-10-02
title: Collaborative Coin Flipping
---
Collaborative Coin Flipping is used in MPC and game theory as a protocol for multiple participants to generate random outcomes fairly and securely without a trusted third party.
For example, Alice and Bob toss a coin to decide something important.
At this point, they both have coins and have to decide which one to use.
However, they need to trust the other's coin, and if they lose, they can't be told that they are cheating.
In other words, a consensus needs to be reached on which coin to use.
An idea to resolve this dispute is to use both coins, and if they are both the same combination (both heads or both tails), then they are ‘heads’, and if they are different combinations (one head and one tails), then they are ‘tails’.
This allows the result to have the same probability as a coin toss without having to trust one of the coins.

Looking at this idea mathematically, it can be seen as a 2PC XOR operation.
That is, if (1,1) or (0,0), it returns 0, if (1,0) or (0,1), it returns 1

Synthesis using XOR allows one participant to control his bit but the overall result still retains its random nature.
However, countermeasures are needed against last mover attacks, such as protocols that do not immediately disclose random bits, but first share commitments and then open commitments after everyone has disclosed their random bits (Commit-and-Reveal schemes)
