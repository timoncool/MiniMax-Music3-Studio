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

cmake --fresh -S "$worktree" -B "$worktree/build" -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_BUILD_WITH_INSTALL_RPATH=ON -DCMAKE_INSTALL_RPATH=@executable_path \
    -DGGML_NATIVE=OFF -DGGML_CPU_ARM_ARCH=armv8.2-a+dotprod+fp16 -DGGML_CUDA_NCCL=OFF -DGGML_METAL=ON \
    -DGGML_METAL_EMBED_LIBRARY=ON
cmake --build "$worktree/build" --config Release --target mm-server \
    -j "$(getconf _NPROCESSORS_ONLN)"

mkdir -p "$output"
cp "$worktree/build/mm-server" "$output/"
# -a keeps the version symlinks of the dylibs; the binary finds them via @rpath.
cp -a "$worktree"/build/*.dylib "$output/"
# the binaries look for their dylibs beside themselves: an absolute build-machine path would only resolve on the runner
for binary in "$output"/*; do
    [ -f "$binary" ] && [ ! -L "$binary" ] || continue
    if otool -l "$binary" | grep -A2 LC_RPATH | grep -q ' path /'; then
        echo "[ERROR] $binary keeps an absolute rpath:" >&2
        otool -l "$binary" | grep -A2 LC_RPATH >&2
        exit 1
    fi
done
echo "mm-server ($commit) built into $output"
