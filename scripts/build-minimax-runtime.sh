#!/bin/bash
# macOS counterpart of build-minimax-runtime.ps1: builds the pinned
# minimaxmusic.cpp `mm-server` with the Metal backend and copies it, with its
# ggml libraries, into OUTPUT_DIRECTORY.
set -euo pipefail

output="${1:?usage: build-minimax-runtime.sh OUTPUT_DIRECTORY}"
root="$(cd "$(dirname "$0")/.." && pwd)"
repository="$(sed -n 's/.*"repository": "\(.*\)".*/\1/p' "$root/engines/minimaxmusic-cpp-source.json")"
commit="$(sed -n 's/.*"commit": "\(.*\)".*/\1/p' "$root/engines/minimaxmusic-cpp-source.json")"
worktree="${MM3_ENGINE_BUILD_ROOT:-${TMPDIR:-/tmp}}/mm3-engine"

if [ ! -d "$worktree/.git" ]; then
    git clone "$repository" "$worktree"
fi
git -C "$worktree" fetch --quiet origin "$commit" || git -C "$worktree" fetch --quiet origin
git -C "$worktree" checkout --quiet "$commit"
git -C "$worktree" submodule update --init --recursive

cmake -S "$worktree" -B "$worktree/build" -DCMAKE_BUILD_TYPE=Release \
    -DGGML_METAL=ON -DGGML_METAL_EMBED_LIBRARY=ON
cmake --build "$worktree/build" --config Release --target mm-server \
    -j "$(getconf _NPROCESSORS_ONLN)"

mkdir -p "$output"
cp "$worktree/build/mm-server" "$output/"
# -a keeps the version symlinks of the dylibs; the binary finds them via @rpath.
cp -a "$worktree"/build/*.dylib "$output/"
echo "mm-server ($commit) built into $output"
