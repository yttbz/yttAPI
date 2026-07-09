#!/bin/bash
# 打包 PicAPI 项目，排除大文件和无关文件
set -e

cd /home/z
OUT=/home/z/my-project/download/PicAPI.tar.gz

# 排除列表
tar czf "$OUT" \
  --exclude='my-project/node_modules' \
  --exclude='my-project/.next' \
  --exclude='my-project/.git' \
  --exclude='my-project/skills' \
  --exclude='my-project/*.log' \
  --exclude='my-project/prisma/dev.db' \
  --exclude='my-project/prisma/dev.db-journal' \
  --exclude='my-project/db' \
  --exclude='my-project/preview-*.png' \
  --exclude='my-project/download' \
  --exclude='my-project/scripts/gen-samples.ts' \
  --exclude='my-project/tmp' \
  --exclude='my-project/loliapi_*.json' \
  --exclude='my-project/m1f_doc.json' \
  --exclude='my-project/examples' \
  --exclude='my-project/mini-services' \
  --exclude='my-project/.zscripts' \
  --exclude='my-project/Caddyfile' \
  my-project

ls -lh "$OUT"
echo "=== 打包完成 ==="
echo "包含文件数: $(tar tzf "$OUT" | wc -l)"
