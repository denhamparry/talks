#!/bin/bash
# scripts/check-links.sh - Verify all documentation links

set -e

echo "========================================="
echo "Documentation Link Verification"
echo "========================================="

# Check internal markdown links
echo -e "\n📄 Checking internal markdown links..."
broken_count=0

find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" | \
  while read file; do
    grep -o '\[.*\](.*\.md[^)]*)' "$file" 2>/dev/null | \
      grep -o '([^)]*)' | tr -d '()' | \
      while read link; do
        # Handle relative paths
        dir=$(dirname "$file")

        # Try both relative and absolute
        if [[ -f "$dir/$link" ]] || [[ -f "$link" ]]; then
          continue
        else
          echo "  ❌ $file -> $link"
          ((broken_count++))
        fi
      done
  done

# Check external HTTPS links (with timeout)
echo -e "\n🌐 Checking external links (this may take a minute)..."
external_count=0
external_broken=0

grep -rh "https\?://[^)\" ]*" --include="*.md" . 2>/dev/null | \
  grep -o "https\?://[^)\" ]*" | \
  grep -v "localhost\|127.0.0.1" | \
  sort -u | \
  while read url; do
    ((external_count++))
    if curl -s -f -L -o /dev/null --max-time 10 "$url" 2>/dev/null; then
      echo "  ✅ $url"
    else
      echo "  ❌ $url"
      ((external_broken++))
    fi
  done

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
