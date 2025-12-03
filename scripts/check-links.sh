#!/bin/bash
# scripts/check-links.sh - Verify all documentation links

set -e

echo "========================================="
echo "Documentation Link Verification"
echo "========================================="

# Check internal markdown links
echo -e "\n📄 Checking internal markdown links..."
broken_count=0

while IFS= read -r file; do
  while IFS= read -r link; do
    # Skip HTTP/HTTPS links (they're checked separately)
    if [[ "$link" =~ ^https?:// ]]; then
      continue
    fi

    # Strip anchor from link (everything after #)
    link_file="${link%%#*}"

    # Handle relative paths
    dir=$(dirname "$file")

    # Resolve the full path
    if [[ "$link_file" = /* ]]; then
      # Absolute path
      full_path="$link_file"
    else
      # Relative path - resolve from the directory of the source file
      full_path="$dir/$link_file"
    fi

    # Check if file exists (realpath would be better but may not be available)
    if [[ -f "$full_path" ]]; then
      continue
    else
      echo "  ❌ $file -> $link"
      ((broken_count++))
    fi
  done < <(grep -o '\[.*\](.*\.md[^)]*)' "$file" 2>/dev/null | grep -o '([^)]*)' | tr -d '()')
done < <(find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*")

# Check external HTTPS links (with timeout)
echo -e "\n🌐 Checking external links (this may take a minute)..."
external_count=0
external_broken=0

while IFS= read -r url; do
  ((external_count++))
  if curl -s -f -L -o /dev/null --max-time 10 "$url" 2>/dev/null; then
    echo "  ✅ $url"
  else
    echo "  ❌ $url"
    ((external_broken++))
  fi
done < <(grep -rh "https\?://[^)\" ]*" --include="*.md" . 2>/dev/null | \
  grep -o "https\?://[^)\" ]*" | \
  grep -v "localhost\|127.0.0.1" | \
  sort -u)

echo -e "\n========================================="
echo "Summary:"
echo "  Internal broken links: $broken_count"
echo "  External links checked: $external_count"
echo "  External broken links: $external_broken"
echo "========================================="

if [ "$broken_count" -gt 0 ] || [ "$external_broken" -gt 0 ]; then
  echo "⚠️  Some links are broken. Please review and fix."
  exit 1
else
  echo "✅ All links verified successfully!"
  exit 0
fi
