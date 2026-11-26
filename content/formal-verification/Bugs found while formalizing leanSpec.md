---
date: 2026-11-26
title: Bugs found while formalizing leanSpec
---

While writing a Lean 4 model of [leanSpec](https://github.com/leanEthereum/leanSpec), I found problems in the Python reference itself. The model lives in [formal-leanSpec](https://github.com/NyxFoundation/formal-leanSpec), as part of the work around the Verity client. I filed the issues in July 2026. Thomas Coratger fixed most of them in the reference. I added the check that rejects a manifest whose attestation and proposal keys are the same. A later pass with Kani also found a `u64` overflow in Verity's own attestation-history retention.

Formalization did not invent these cases. It made missing bounds and unstated invariants hard to ignore. Ordinary unit tests had missed them.

# A proof can pass and still show a gap

The empty-slot loop in `process_slots` was proved to terminate:

```lean
termination_by target.toNat - s.slot.toNat
```

"Terminates" only means the loop is finite for a given `target`. It says nothing about `target` itself being bounded. That silence is the missing precondition.

The same kind of gap appeared in fork choice. Modeling the store as a map of blocks and votes, with no arrival order, made "the head is a function of store contents" unprovable: the winner of an equal-slot tie depended on insertion order, which a map does not carry.

# No upper bound on a block's slot

Attestations already had a future-slot horizon. Blocks did not. `process_slots` rejected a block whose slot was too old, then ran this loop up to the block's slot:

```python
while state.slot < target_slot:
    ...
    state = state.model_copy(update={"slot": state.slot + Slot(1)})
```

The proposer of a slot is `slot % num_validators`, so one honest key is the valid proposer for infinitely many slots and can sign a block at slot `2**63`. `on_block` ran no horizon check before the transition, so a single message could force about $2^{63}$ iterations. Every client that transliterated the reference would inherit the same denial of service.

This was [leanSpec#1171](https://github.com/leanEthereum/leanSpec/issues/1171), fixed in [pull request #1182](https://github.com/leanEthereum/leanSpec/pull/1182). The fix adds two checks in `on_block` before the transition: a parent-gap cap of `HISTORICAL_ROOTS_LIMIT` ($2^{18}$), which bounds the loop itself, and a clock horizon of one slot, which still allows the early blocks the spec intends to import.

# Equivocation ties followed arrival order

When a validator signs two different votes for the same slot, fork choice kept whichever vote arrived first. The extraction used a strict `<` on the slot, so an equal-slot tie never overwrote the first vote. Two honest nodes holding the same blocks and votes, received in different orders, could pick different heads and stay diverged. All unit tests passed; the split only appears between nodes.

A lexicographic tie-break already existed between blocks, but it ran too late. By then the equivocator's weight had already landed on different branches, so the branch weights were unequal and the tie-break never fired.

This was [leanSpec#1172](https://github.com/leanEthereum/leanSpec/issues/1172), fixed in [pull request #1181](https://github.com/leanEthereum/leanSpec/pull/1181). The equal-slot tie is now resolved by the largest canonical attestation-data root, so the head is a function of store contents.

# An SSZ decoder accepted a contradictory offset

The variable-length list decoder checked that `first_offset` was in range and a multiple of 4, but not that it was non-zero. For input `00000000aabbccdd` (`scope = 8`, `first_offset = 0`):

```text
num_elements  = first_offset // 4      = 0        "the list is empty"
boundary list = [first_offset, scope]  = [0, 8]   one element spanning the scope
```

The count said 0 and the boundary said 1. The input did fail, but only later, through a short read in a per-element decoder. A more lenient element decoder in another language could have accepted the same bytes. SSZ has to decode identically across clients, so the malformed offset has to be rejected up front.

This was [leanSpec#1175](https://github.com/leanEthereum/leanSpec/issues/1175), fixed in [pull request #1177](https://github.com/leanEthereum/leanSpec/pull/1177) by rejecting `first_offset < BYTES_PER_LENGTH_OFFSET` before the boundary list is built.

# Other gaps in the reference

Not every issue was a remotely triggerable bug. They were still worth filing, because a reference spec is what clients copy.

- [leanSpec#1173](https://github.com/leanEthereum/leanSpec/issues/1173): protocol rejections and internal assertions shared one exception type, `AssertionError`. Running the reference under `python -O` dropped the bare `assert`s and kept the typed rejections, so the accept/reject set depended on an interpreter flag. [Pull request #1180](https://github.com/leanEthereum/leanSpec/pull/1180) moved `SpecRejectionError` off `AssertionError`.
- [leanSpec#1174](https://github.com/leanEthereum/leanSpec/issues/1174): some public functions crashed on broken preconditions with an untyped exception, including on a state rebuilt from untrusted bytes. The honest flow already rejected those blocks; the problem was that the crash type differed by language. [Pull request #1178](https://github.com/leanEthereum/leanSpec/pull/1178) turned them into total functions or typed rejections.
- [leanSpec#1176](https://github.com/leanEthereum/leanSpec/issues/1176): four fork-choice store properties were relied on but never stated. [Pull request #1179](https://github.com/leanEthereum/leanSpec/pull/1179) documents the ones that already hold by construction, and rejects attestations whose head does not descend from the finalized checkpoint. It does not make `latest_finalized` monotone; that would be a fork-choice redesign, not a local fix.
- [leanSpec#1184](https://github.com/leanEthereum/leanSpec/issues/1184): the registry documented that attestation and proposal keys must be distinct, so one validator can sign both in the same slot without reusing XMSS one-time signature state. `from_yaml` never compared the two keys. A same-key manifest is an operator misconfiguration, not a remote attack, but nothing in the node would have surfaced it. I added the check in [pull request #1185](https://github.com/leanEthereum/leanSpec/pull/1185), comparing the two public keys at load time.

# A `u64` overflow in Verity

The findings above are about the reference. Kani, a bounded model checker for Rust, later found a defect in Verity itself.

Attestation-history retention used `seen_slot + retention`. Near `u64::MAX` that addition overflows. In debug builds Rust panics; in release builds it wraps, and a slot that should have expired can be kept, or the other way around.

The predicate now subtracts only after `current > seen`:

```rust
const fn retains_attested_slot(seen: Slot, current: Slot) -> bool {
    // The subtraction is reached only when `current > seen`, avoiding the `seen + retention`
    // overflow that a slot near `u64::MAX` would otherwise trigger.
    seen.0 >= current.0 || current.0 - seen.0 < ATTESTED_SLOT_RETENTION
}
```

A unit test covers the top of the slot range, and the Kani harness `attestation_retention_is_total_at_the_slot_boundary` checks the same boundary for arbitrary slots. This shipped in [Verity pull request #55](https://github.com/NyxFoundation/verity/pull/55). Kani is not run in CI; it is a local check. Python's integers do not wrap, so the same arithmetic is not a leanSpec bug.

This does not prove the client, or the protocol, safe. It shows that one retention predicate no longer overflows.

# What this changed in practice

1. A termination proof is only as strong as the bound on its input.
2. Tests can all pass while honest nodes diverge, if the disagreement depends on arrival order.
3. A wire decoder should reject a bad offset up front, not rely on a later short read.
4. Rust wrapping arithmetic can fail on paths that Python integers never reach.

# Sources

- https://github.com/NyxFoundation/formal-leanSpec
- https://github.com/leanEthereum/leanSpec
- https://github.com/NyxFoundation/verity

The leanSpec issues were filed by [@adust09](https://github.com/adust09). The fixes for `#1171`–`#1176` were written by [Thomas Coratger](https://github.com/tcoratger). The dual-key check in `#1185` is also by [@adust09](https://github.com/adust09).
