#!/bin/sh
# Builds the language core: ada/src/*.adb -> WebAssembly -> vendor/uim-core.js
# Toolchain: AdaWebPack (GNAT-LLVM) + wasm-ld, see tools/get-toolchain.sh.
set -e
cd "$(dirname "$0")"
TC=${UIM_TOOLCHAIN:-$PWD/toolchain}
[ -x "$TC/usr/bin/llvm-gcc" ] || TC=/workspace/murmuration-spark/toolchain
T=$TC/usr
[ -x "$T/bin/llvm-gcc" ] || { echo "No toolchain at $TC (run ../tools/get-toolchain.sh)"; exit 1; }
export LD_LIBRARY_PATH="$TC/lib"
LD=${WASM_LD:-$(command -v wasm-ld || ls /usr/bin/wasm-ld-* /tmp/bin/wasm-ld-* 2>/dev/null | tail -1)}
python3 ../tools/gen_texts.py data/texts.tsv src/uim-texts.ads
rm -rf obj && mkdir obj && cd obj
for F in ../src/*.adb; do
  "$T/bin/llvm-gcc" -c --target=wasm32 -O2 -gnat2012 -gnatp -gnatwa \
    --RTS="$T/lib/rts-native" -I../src "$F"
done
ar x "$T/lib/rts-native/adalib/libgnat.a" s-memcop.o s-memmov.o s-memset.o
"$LD" --no-entry --strip-all --export=uim_in --export=uim_out --export=uim_t \
  --export=uim_num --export=uim_qty --export=uim_place --export=uim_version --export=uim_zone \
  -z stack-size=1048576 --initial-memory=4194304 -o uim.wasm *.o
cd ..
python3 ../tools/embed_core.py obj/uim.wasm ../vendor/uim-core.js
echo "Built vendor/uim-core.js ($(wc -c < obj/uim.wasm) bytes of WebAssembly)"
