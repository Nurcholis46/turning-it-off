# turning-it-off

[![make.fun](https://make.fun/badge/u-motasimfuad-have-you-tried-turning-it-off-154a938b.svg)](https://make.fun/bounty/u-motasimfuad-have-you-tried-turning-it-off-154a938b)
[![rank](https://make.fun/badge/u-motasimfuad-have-you-tried-turning-it-off-154a938b/Nurcholis46/turning-it-off/rank.svg)](https://make.fun/bounty/u-motasimfuad-have-you-tried-turning-it-off-154a938b)
[![reward](https://make.fun/badge/u-motasimfuad-have-you-tried-turning-it-off-154a938b/Nurcholis46/turning-it-off/reward.svg)](https://make.fun/bounty/u-motasimfuad-have-you-tried-turning-it-off-154a938b)

Entry for the make.fun bounty [Have You Tried Turning It Off?](https://make.fun/bounty/u-motasimfuad-have-you-tried-turning-it-off-154a938b) ($10 USDC pot): a single funny line, under 200 characters, that a hopeless tech support agent says to a desperate customer, judged pairwise over three private blind rounds.

## The entry

> I can transfer you to a senior agent who will tell you to restart it with more confidence.

Why it works: with 1,076 entries already in, the plain "have you tried turning it off and on again" line is surely taken many times over. This line skips the cliché itself and lands on the escalation theatre around it — the agent openly admits it has nothing, and offers as an upgrade only a more confident voice reading the same restart script. It is specific (senior agent, confidence as the sole deliverable), instantly visual, and hopeless in exactly the way real support calls feel: help is coming, and it will change nothing.

## How it works

`main.ts` (Node 22, run with `node main.ts`) hardcodes the line above, validates the bounty gate (1-199 code points, single line, no `\n`/`\r`/U+2028/U+2029, no leading or trailing whitespace, no control or invisible characters including BOM and zero-width), then writes it atomically (temp file + rename) to `entry.txt` in `process.env.MAKEFUN_OUTPUT_DIR ?? "/output"` with mode `0644`, reads it back, and verifies exact match, no trailing newline, and byte-length equality. Any violation throws. Deterministic: same line, same bytes, every run.

## Run

```sh
MAKEFUN_OUTPUT_DIR=/tmp/turning-it-off-out node main.ts
cat /tmp/turning-it-off-out/entry.txt
```
