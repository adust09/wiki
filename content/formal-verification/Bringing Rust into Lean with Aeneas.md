---
date: 2026-11-23
title: Bringing Rust into Lean with Aeneas
aliases: ["../Bringing-Rust-into-Lean-with-Aeneas"]
---

Aeneas translates Rust code into Lean definitions, so that you can prove theorems about the code you actually ship instead of a hand-written copy of it. This post is a practical write-up of using it on two projects: [nyx-ssz](https://github.com/NyxFoundation/nyx-ssz), a Rust implementation of SSZ (Ethereum's encoding scheme), and [verity-aeneas-proofs](https://github.com/NyxFoundation/verity-aeneas-proofs), Lean proofs about the Verity client. The short version: it works well for small, pure, hash-free code, and the interesting work is deciding what to do at the places where extraction stops.

# The pipeline

Both repositories use the same chain of tools:

```text
Rust source --Charon--> LLBC --Aeneas--> Lean definitions --> handwritten proofs --> Lean kernel
```

- Charon turns Rust into LLBC, an intermediate representation.
- Aeneas turns LLBC into Lean.
- The generated Lean is never edited by hand. Proofs live in separate files and refer to the generated definitions.

Everything is pinned. In nyx-ssz, `sources.lock` records the Rust nightly, the Charon and Aeneas revisions, and the Lean toolchain, so anyone can regenerate the Lean and check that it matches.

# What worked

## A small function becomes a small Lean function

Here is a function from nyx-ssz's `gindex.rs`. A generalized index addresses a node in a Merkle tree; `child` returns the index of the left or right child.

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

Aeneas produces this Lean definition, with the source file and line range recorded in the comment:

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

The shape is the same as the Rust. Integers keep their width (`U128`), and `checked_mul` / `checked_add` are modeled, so overflow is part of the semantics rather than something the proof has to assume away.

## The theorem is stated against natural numbers

The specification side is plain mathematics on `Nat`. The refinement statement says: either the Rust result equals the mathematical result, or the Rust code reported overflow and the mathematical result really does not fit in 128 bits.

```lean
def gindexResultAgrees {T : Type} (observe : T → Nat) (limit : Nat) :
    core.result.Result T NyxSszRust.merkle.ProofError → Except Ssz.Err Nat → Prop
  | .Ok value, .ok expected => observe value = expected
  | .Err .IndexOverflow, .ok expected => limit < expected
  | .Err error, .error fault => proofFaultAgrees error fault
  | _, _ => False
```

The proof for `child` is short:

```lean
@[step] theorem gindex_child_refines (index : U128) (rightSide : Bool) :
    NyxSszRust.gindex.child index rightSide ⦃ actual =>
      gindexResultAgrees UScalar.val U128.max actual (.ok (Ssz.gindexChild index.val rightSide)) ⦄ := by
  cases side : rightSide <;> unfold NyxSszRust.gindex.child <;> step*
  all_goals simp_all [gindexResultAgrees, Ssz.gindexChild]
  all_goals step*
```

In math terms, this proves that $\text{child}(i, b) = 2i + b$ whenever $2i + b < 2^{128}$, and that the Rust function returns `IndexOverflow` exactly otherwise.

## The proof covers the production file

For the current-source pipeline, nyx-ssz does not copy the Rust into a proof-only crate. `verification/current_gindex.rs` includes the production files by path:

```rust
#[path = "../crates/nyx-ssz/src/gindex.rs"]
pub mod gindex;
#[path = "../crates/nyx-ssz/src/merkle/error.rs"]
pub mod merkle;
#[path = "../crates/nyx-ssz/src/multiproof/helpers.rs"]
pub mod multiproof;
```

The three generated Lean modules are checked in, and a fresh extraction must match them byte for byte. This is the main reason to use extraction at all: if someone edits `gindex.rs`, the check fails until the Lean is regenerated and the proofs still go through.

## An audit that rejects shortcuts

Both repositories add a gate on top of `lake build`:

- nyx-ssz's `CurrentAudit.lean` binds each registered operation to a kernel-checked theorem that mentions it, and rejects any axiom other than `propext`, `Classical.choice` and `Quot.sound`.
- verity-aeneas-proofs rejects handwritten `sorry` / `admit` and checks that every public correspondence theorem is listed in an axiom audit (`proofs/AxiomAudit.lean`).

I found this more useful than I expected. With a large proof tree it is easy to lose track of what is actually proved, and the audit makes "unproved" a visible state.

## Counterexamples are results too

In verity-aeneas-proofs, the goal is to compare Verity's Rust with `formal-leanSpec`, a Lean formalization of the upstream leanSpec protocol reference. Sometimes the two disagree, and Lean can state that precisely. For fork-choice vote replacement, Rust's replacement rule is strict, while the formal comparator is non-strict:

```lean
theorem votePrecedence_self_counterexample
    [SSZ.HasHashTreeRoot AttestationData] (vote : AttestationData) :
    voteReplacesModel vote (some vote) = false ∧
      Store.votePrecedence (vote, []) (vote, []) = true := by
  simp [voteReplacesModel, Store.votePrecedence, rootLexLe_refl]
```

Replacing a vote with itself is `false` on one side and `true` on the other. The repository records such cases as `divergence`, and notes that a counterexample can be a successfully checked Lean result while its status is still `divergence`.

# Where it got stuck

## Aeneas does not support every Rust shape

For nyx-ssz's metadata code (`union_options_agree`), Charon produces LLBC but Aeneas reports `Returns inside of nested loops are not supported yet`. In the repository this is issue #24. The status page records the tool revisions, the source hash and the exact diagnostic, and only that combination is allowed to count as an expected skip. If a newer Aeneas succeeds, the skip is invalidated and has to be replaced by a proof.

The Verity side hit the same kind of wall on its state transition. Extracting `state_transition` made Aeneas fail on two function bodies (a deduplication closure in `process_attestations` and `JustificationState::unpack`), and the output also used iterator methods (`count`, `zip`, `map`, `filter`, and others) that the pinned Lean backend's `Iterator` model does not have. The repository concludes that this output is not a sound import candidate, so the state-transition correspondences stay blocked.

## Hashing broke the proof closure

nyx-ssz first proved SSZ node hashing through Aeneas against its own scalar SHA-256 (commit "prove SSZ SHA-256 node hashing through Aeneas"). Later it replaced that with the RustCrypto `sha2` crate for speed (commit "perf: replace scalar SHA-256 with RustCrypto"). Extracting the wrapper around the real dependency then exceeded the bounded probes (90 seconds with the expanded dependency, 45 seconds with it opaque) before producing LLBC. As a result, six hash and Merkle reconstruction APIs went from proved to unproved (issue #27).

The repository is explicit about the choices it did not make: no opaque-hash axiom, no forced portable backend, and no local runtime fallback. It also does not claim this is mathematically impossible or an upstream bug. It only says the attempt did not finish in the allotted resources.

To keep the rest provable, the error type and the multiproof helpers were split out of the hash-dependent files. The 12 hash-independent index operations stay in the checked slice "without a fake hasher".

## The toolchain is part of the semantics

Several fixes in the commit history are about the extractor, not the proofs:

- When Miri is unavailable, Charon emits names that the pinned Aeneas does not know. The first fix normalized one body (`usize` division, `div_ceil`) to checked operators already proved. A later commit removed that "unproved Python body substitution" and instead prepared the pinned standard-library MIR through a pinned Miri sysroot, failing closed when it is unavailable.
- To get static borrow support, the extractor was pinned to a source-built revision with a minimal backport, rather than upgrading Charon and Rust.
- `sources.lock` has an `[extraction]` section listing transparent items (`ruint`, `core::num::_::div_ceil`).

The lesson is that a proof about generated Lean is only as trustworthy as the process that generated it, so the process has to be pinned and checked like the code.

## Optimization and proof move at different speeds

nyx-ssz was optimized heavily after the first proofs (direct encoding, bulk integer decoding, const-folded layouts, and so on). The repository states that these are native-tested changes within the unproved backlog, "not newly proved codec equivalence laws". The current status is therefore narrow and explicit:

| | Count |
|---|---|
| Public operations freshly extracted and kernel-checked | 12 (generalized-index arithmetic and one multiproof helper) |
| Remaining documented public APIs, unproved | 105 |
| Codec dictionaries, unproved | 17 |

The README is careful on this point too: nyx-ssz is "not yet published to crates.io, formally verified in full, or presented as a security audit". A green CI check "means only this bounded proof/status contract passed".

## Some Verity pieces had to be modeled, not extracted

In verity-aeneas-proofs, parts of the fork-choice and storage code could not be extracted into the fixed generated files. For those, the proofs use "source-faithful pure models" of the Rust, for example `voteReplacesModel` for `verity_db::votes::replaces`. This is weaker than extraction, because the link between the Rust and the model is not checked by a tool. The repository marks this path with a dotted arrow in its architecture diagram, and the public proposition inventory records for each theorem whether it targets Aeneas output or an explicit pure model.

# What I would take from this

1. Start with small, pure, hash-free code. That is where extraction plus a short `step*` proof worked best.
2. State the specification on `Nat` and make overflow explicit in the refinement relation.
3. Include the production file by path and compare fresh extraction with the checked-in output.
4. Gate the build with an axiom audit, and record every skip with its exact diagnostic.
5. Write down what is not proved next to what is. Both repositories list the unproved set and the boundaries, and that was the most useful documentation of the two.

# Sources and credits

- [NyxFoundation/nyx-ssz](https://github.com/NyxFoundation/nyx-ssz): `README.md`, `docs/current-verification.md`, `crates/nyx-ssz/src/gindex.rs`, `verification/current_gindex.rs`, `verification/NyxSszRust/Gindex.lean`, `verification/NyxSszVerification/Gindex/`, `verification/NyxSszVerification/CurrentAudit.lean`, `sources.lock`, and the commit history.
- [NyxFoundation/verity-aeneas-proofs](https://github.com/NyxFoundation/verity-aeneas-proofs): `README.md`, `docs/evidence/state-transition.md`, `docs/evidence/fork-choice-storage.md`, `proofs/VerityChain/ForkChoiceStorage.lean`, `docs/inventory/public-propositions.md` (as summarized in the README).
- Both repositories' commits are authored by [@adust09](https://github.com/adust09).
