まずはEthereumの現状と課題を整理し、適切なアプローチを策定する。
現在のPQCの議論は[ここ](https://ethresear.ch/t/so-you-wanna-post-quantum-ethereum-transaction-signature/21291)にまとまっている。
さらに2022年の段階ですでに [NIST Post-Quantum-Cryptography Standardization Process and What it means for Ethereum](https://crypto.ethereum.org/blog/nist-pqc-standard)というブログを公開している。


そもそもの課題とはECDLPがショアのアルゴリズムによって解かれてしまう点にあり、Ethereum の署名方式を変える必要がある。そこで格子ベースの署名方式であるFalconはその効率性とコンパクトなサイズから有力な候補として浮上している。

問題はこれをどのように現在のEthereumに展開するかという点にあり、以下のような手法が提案されている。
- The Account Abstraction
- Hard fork
- Hybrid

FalconをEthereumに統合する上でのメリットデメリットは[ここ](https://ethresear.ch/t/falcon-as-an-ethereum-transaction-signature-the-good-the-bad-and-the-gnarly/21512)で議論されている。
