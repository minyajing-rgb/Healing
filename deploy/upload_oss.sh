#!/usr/bin/env bash
# Requires ossutil already installed and authenticated with a restricted RAM identity.
# Does not create buckets, enable public access, change DNS, delete objects or buy services.
set -euo pipefail
SITE_DIR="${SITE_DIR:-_site}"
: "${OSS_BUCKET:?Set OSS_BUCKET to the dedicated public website bucket name}"
[[ "$OSS_BUCKET" =~ ^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$ ]] || { echo 'Invalid bucket name'; exit 2; }
[[ -f "$SITE_DIR/index.html" && -f "$SITE_DIR/release.json" && -f "$SITE_DIR/map-experience.js" ]] || { echo 'Use the validated _site directory, not the source repository'; exit 2; }
[[ ! -d "$SITE_DIR/.git" && ! -d "$SITE_DIR/.github" ]] || { echo 'Refusing to upload a repository'; exit 2; }
command -v ossutil >/dev/null || { echo 'Install and configure ossutil first'; exit 2; }
echo "Website source: $SITE_DIR"
echo "Destination: oss://$OSS_BUCKET/"
echo 'Only explicitly listed public website resources will be uploaded. Existing same-name files will be replaced; other objects are not deleted.'
if [[ "${1:-}" != '--apply' ]]; then
  echo 'DRY RUN. Review the source directory and bucket, then rerun with --apply.'
  find "$SITE_DIR" -type f | sort
  exit 0
fi
# Publish resources before HTML; release.json is the last marker. This is not a transactional release.
for directory in assets vendor data; do
  [[ ! -d "$SITE_DIR/$directory" ]] || ossutil cp -r -f "$SITE_DIR/$directory/" "oss://$OSS_BUCKET/$directory/"
done
for file in site.js site.css map-experience.js map-experience.css ASSET-LICENSES.txt; do
  [[ ! -f "$SITE_DIR/$file" ]] || ossutil cp -f "$SITE_DIR/$file" "oss://$OSS_BUCKET/$file"
done
for file in "$SITE_DIR"/*.html; do ossutil cp -f "$file" "oss://$OSS_BUCKET/$(basename "$file")"; done
ossutil cp -f "$SITE_DIR/release.json" "oss://$OSS_BUCKET/release.json"
echo 'Upload completed. Verify the HTTPS custom domain, content types, cache policy, map.html and release.json before switching DNS.'
