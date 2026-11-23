---
date: 2026-11-23
title: Proving Rust code in Lean with Aeneas
aliases: ["../Bringing-Rust-into-Lean-with-Aeneas"]
---

Aeneas translates Rust into Lean, so proofs can target the code that ships. I used it on two projects: [nyx-ssz](https://github.com/NyxFoundation/nyx-ssz), a Rust library for SSZ (Ethereum's encoding scheme), and [verity-aeneas-proofs](https://github.com/NyxFoundation/verity-aeneas-proofs), proofs about the Verity client. It worked well for small pure functions without hashing. Aeneas only translates code. Writing the theorems and handling the code it cannot translate is still my job.

# Pipeline

Both repositories use the same tools:

```text
Rust source --Charon--> LLBC --Aeneas--> Lean definitions --> handwritten proofs --> Lean kernel
```

- Charon compiles Rust to LLBC, an intermediate language.
- Aeneas translates LLBC to Lean.
- Nobody edits the generated Lean. Proofs live in separate files.

All tool versions are pinned. In nyx-ssz, `sources.lock` records the Rust nightly, Charon, Aeneas and the Lean toolchain, so anyone can regenerate the Lean and compare.

# What worked

## Small Rust, small Lean

This function is from `gindex.rs` in nyx-ssz. A generalized index points to a node in a Merkle tree, and `child` returns the index of its left or right child.

```rust
pub fn child(index: u128, right_side: bool) -> Result<u128, ProofError> {
    let doubled = match index.checked_mul(2) {
        Some(value) => value,
        None => return Err(ProofError::IndexOverflow),
    };
    let turn = if right_side { 1 } else { 0 };
    match doubled.checked_add(turn) {
        Some(value) => Ok(value),
        None => Err(ProofError::IndexOverflow),
    }
}
```

Aeneas generates this Lean:

```lean
def gindex.child
  (index : Std.U128) (right_side : Bool) :
  RustM (core.result.Result Std.U128 merkle.ProofError)
  := do
  let o ← lift (U128.checked_mul index 2#u128)
  match o with
  | none => ok (core.result.Result.Err merkle.ProofError.IndexOverflow)
  | some value =>
    let turn ← if right_side
                 then ok 1#u128
                 else ok 0#u128
    let o1 ← lift (U128.checked_add value turn)
    match o1 with
    | none => ok (core.result.Result.Err merkle.ProofError.IndexOverflow)
    | some value1 => ok (core.result.Result.Ok value1)
```

It has the same structure as the Rust. Integers keep their 128-bit width, and overflow is part of the model.

## The spec uses natural numbers

The spec is plain arithmetic on `Nat`. The Rust result must equal the math result, or the Rust code must return an overflow error when the math result does not fit in 128 bits.

```lean
def gindexResultAgrees {T : Type} (observe : T → Nat) (limit : Nat) :
    core.result.Result T NyxSszRust.merkle.ProofError → Except Ssz.Err Nat → Prop
  | .Ok value, .ok expected => observe value = expected
  | .Err .IndexOverflow, .ok expected => limit < expected
  | .Err error, .error fault => proofFaultAgrees error fault
  | _, _ => False
```

The proof is short:

```lean
@[step] theorem gindex_child_refines (index : U128) (rightSide : Bool) :
    NyxSszRust.gindex.child index rightSide ⦃ actual =>
      gindexResultAgrees UScalar.val U128.max actual (.ok (Ssz.gindexChild index.val rightSide)) ⦄ := by
  cases side : rightSide <;> unfold NyxSszRust.gindex.child <;> step*
  all_goals simp_all [gindexResultAgrees, Ssz.gindexChild]
  all_goals step*
```

It proves $\text{child}(i, b) = 2i + b$ when $2i + b < 2^{128}$, and that the function returns `IndexOverflow` otherwise.

## Proofs follow the production code

nyx-ssz does not copy the Rust into a separate crate for proofs. `verification/current_gindex.rs` includes the production files by path:

```rust
#[path = "../crates/nyx-ssz/src/gindex.rs"]
pub mod gindex;
#[path = "../crates/nyx-ssz/src/merkle/error.rs"]
pub mod merkle;
#[path = "../crates/nyx-ssz/src/multiproof/helpers.rs"]
pub mod multiproof;
```

The generated Lean is committed, and a fresh extraction must match it byte for byte. If someone edits `gindex.rs`, the check fails until the Lean is regenerated and the proofs pass again.

## An axiom audit

Both repositories add a check on top of `lake build`.

- In nyx-ssz, `CurrentAudit.lean` ties each operation to a theorem and rejects any axiom except `propext`, `Classical.choice` and `Quot.sound`.
- In verity-aeneas-proofs, the check rejects handwritten `sorry` and `admit` and requires every public theorem to appear in `proofs/AxiomAudit.lean`.

In a large proof tree it is easy to lose track of what is proved. The audit makes unproved code visible.

## Counterexamples count

verity-aeneas-proofs compares Verity's Rust with `formal-leanSpec`, a Lean version of the `leanSpec` protocol reference. When they disagree, Lean can state the difference. For fork-choice vote replacement, the Rust rule is strict and the reference is not:

```lean
theorem votePrecedence_self_counterexample
    [SSZ.HasHashTreeRoot AttestationData] (vote : AttestationData) :
    voteReplacesModel vote (some vote) = false ∧
      Store.votePrecedence (vote, []) (vote, []) = true := by
  simp [voteReplacesModel, Store.votePrecedence, rootLexLe_refl]
```

Replacing a vote with itself is `false` on one side and `true` on the other. The repository records these cases as `divergence`.

# Limits of Aeneas

"Extracted to Lean and checked by the kernel" does not mean "verified". Aeneas does less than that.

## It does not write theorems

Aeneas outputs definitions, not properties. The tool generated `gindex.child`, but I wrote `gindexResultAgrees`, `Ssz.gindexChild` and `gindex_child_refines` by hand. If the spec is wrong or too weak, Lean still accepts a proof of it. The pipeline cannot tell you whether you proved the right thing.

## It handles only pure code

Aeneas turns Rust into pure functions. Borrows become values passed in and returned, and the only effect is failure. This fits `child`, which takes inputs and returns a result. It does not fit `unsafe` code, interior mutability, I/O or concurrency. Some safe Rust is also unsupported, as the next section shows. Dependencies must be extracted too, or assumed.

## What a human must check

- The spec. Here it is arithmetic on `Nat`, and someone has to confirm it matches the protocol.
- The link to the protocol reference. Whether the Lean spec matches `leanSpec` is a separate question from whether the Rust matches the Lean spec.
- The boundary. Someone has to track which functions are extracted, modeled by hand, skipped or assumed. The proof says nothing about code outside the extracted part.
- The tools. Charon, Aeneas and the Lean model of the Rust standard library are trusted, not proved. Pinning them makes results reproducible, not correct.
- The claim. Someone has to write down what is proved and what is not, so that a green CI check is not read as more.

# Where it got stuck

## Unsupported Rust

For `union_options_agree` in nyx-ssz, Charon produced LLBC, but Aeneas failed with `Returns inside of nested loops are not supported yet` (issue #24). The status page records the tool versions, the source hash and the exact error. Only that combination counts as an expected skip. If a newer Aeneas succeeds, the skip becomes invalid and needs a proof.

Verity's `state_transition` hit the same problem. Aeneas failed on two functions, a deduplication closure in `process_attestations` and `JustificationState::unpack`. The output also used iterator methods such as `count`, `zip`, `map` and `filter` that the pinned Lean library does not model. The repository rejects that output, so the state transition proofs are blocked.

## Hashing

nyx-ssz first proved SSZ node hashing against its own SHA-256 code. Later it switched to the RustCrypto `sha2` crate for speed. Extracting code that calls `sha2` then timed out, after 90 seconds with the crate expanded and 45 seconds with it opaque. Six hash and Merkle APIs went from proved to unproved (issue #27).

The repository did not add a hash axiom, force a portable backend, or add a fallback. It also does not say the problem is impossible or an upstream bug. It only says extraction did not finish within the limits.

To keep the rest provable, the error type and multiproof helpers moved out of the files that hash. The 12 index operations that do not hash are still proved.

## The toolchain matters

Several commits fix the extraction, not the proofs.

- Without Miri, Charon emitted names that the pinned Aeneas did not know. The first fix rewrote one function body. A later commit removed that rewrite and built the standard library MIR with a pinned Miri sysroot instead. If Miri is missing, extraction now fails.
- To get static borrow support, the project pinned a source build of Charon with one small backport instead of upgrading Charon and Rust.
- `sources.lock` lists the items that Charon must translate in full (`ruint`, `core::num::_::div_ceil`).

A proof about generated Lean depends on how that Lean was generated, so the toolchain needs pinning and checks too.

## Optimization outran the proofs

nyx-ssz was optimized after the first proofs, with direct encoding, bulk integer decoding and precomputed layouts. The repository says these changes are tested but not proved. The current numbers:

| | Count |
|---|---|
| Public operations extracted and proved | 12 (index arithmetic and one multiproof helper) |
| Other public APIs, not proved | 105 |
| Codec dictionaries, not proved | 17 |

The README says nyx-ssz is not on crates.io, not fully verified, and not a security audit. A green CI check means only that this limited set of proofs passed.

## Hand-written models

Some fork-choice and storage code in Verity could not be extracted. For those parts the proofs use hand-written Lean models of the Rust, such as `voteReplacesModel` for `verity_db::votes::replaces`. No tool checks that a model matches the Rust, so these proofs are weaker. The repository marks them separately and records, for each theorem, whether it targets Aeneas output or a model.

# Takeaways

1. Aeneas translates. You still write the spec, the theorems and the boundary.
2. Start with small pure functions that do not hash.
3. Write the spec on `Nat` and make overflow explicit.
4. Include production files by path and compare fresh extraction with the committed Lean.
5. Add an axiom audit, and record every skip with its exact error.
6. List what is not proved next to what is.

# Sources

- https://github.com/NyxFoundation/nyx-ssz
- https://github.com/NyxFoundation/verity-aeneas-proofs
- Commits in both repositories are by [@adust09](https://github.com/adust09).
