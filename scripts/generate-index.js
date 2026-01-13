#!/usr/bin/env node

/**
 * Generate index.html for presentations
 *
 * This script scans the slides/ directory for markdown files,
 * extracts metadata, and generates an index.html listing all presentations.
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const OUTPUT_FILE = path.join(__dirname, '..', 'dist', 'index.html');

/**
 * Extract presentation metadata from markdown file
 */
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let title = null;
  let date = '';
  let footer = '';
  let header = '';

  // Extract from frontmatter
  let inFrontmatter = false;
  let afterFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        inFrontmatter = false;
        afterFrontmatter = true;
        continue;
      }
    }

    if (inFrontmatter) {
      if (line.startsWith('footer:')) {
        footer = line.replace('footer:', '').trim().replace(/['"]/g, '');
      }
      if (line.startsWith('header:')) {
        header = line.replace('header:', '').trim().replace(/['"]/g, '');
      }
    }

    // Extract first H1 title after frontmatter
    if (afterFrontmatter && line.startsWith('# ') && !title) {
      title = line.substring(2).trim();
      break;
    }
  }

  // Fallback to filename if no title found
  if (!title) {
    title = path.basename(filePath, '.md');
  }

  // Try to extract date from filename (format: YYYY-MM-DD-*)
  const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    date = dateMatch[1];
  } else if (footer) {
    date = footer;
  }

  return {
    title,
    date,
    header,
    htmlFile: path.basename(filePath, '.md') + '.html'
  };
}

/**
 * Generate HTML index page
 */
function generateIndex() {
  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Read all markdown files
  const files = fs.readdirSync(SLIDES_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(SLIDES_DIR, file));

  // Extract metadata from each file
  const presentations = files.map(extractMetadata)
    .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending

  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentations - Lewis Denham-Parry</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #013a3b;
            background: linear-gradient(135deg, #d0fdf2 0%, #a8f5e3 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        header {
            margin-bottom: 3rem;
            text-align: center;
            border-bottom: 3px solid #02f4d5;
            padding-bottom: 2rem;
        }

        h1 {
            color: #013a3b;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #666;
            font-size: 1.1rem;
        }

        .presentations {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .presentation-card {
            padding: 1.5rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .presentation-card:hover {
            border-color: #02f4d5;
            box-shadow: 0 4px 12px rgba(2, 244, 213, 0.2);
            transform: translateY(-2px);
        }

        .presentation-title {
            font-size: 1.5rem;
            color: #013a3b;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .presentation-meta {
            color: #666;
            font-size: 0.9rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .presentation-meta span {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
        }

        .presentation-meta span::before {
            content: '📅';
        }

        .presentation-header::before {
            content: '📍';
        }

        footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }

        footer a {
            color: #013a3b;
            text-decoration: none;
        }

        footer a:hover {
            color: #02f4d5;
        }

        @media (max-width: 600px) {
            body {
                padding: 1rem;
            }

            .container {
                padding: 1.5rem;
            }

            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Presentations</h1>
            <p class="subtitle">Conference talks and meetup presentations by Lewis Denham-Parry</p>
        </header>

        <main class="presentations">
${presentations.map(p => `            <a href="${p.htmlFile}" class="presentation-card">
                <h2 class="presentation-title">${p.title}</h2>
                <div class="presentation-meta">
                    ${p.date ? `<span>${p.date}</span>` : ''}
                    ${p.header ? `<span class="presentation-header">${p.header}</span>` : ''}
                </div>
            </a>`).join('\n')}
        </main>

        <footer>
            <p>Built with <a href="https://marp.app/" target="_blank">MARP</a> using the Edera V2 theme</p>
            <p><a href="https://denhamparry.co.uk" target="_blank">denhamparry.co.uk</a></p>
        </footer>
    </div>
</body>
</html>
`;

  fs.writeFileSync(OUTPUT_FILE, html);
  console.log(`✓ Generated index.html with ${presentations.length} presentations`);
}

// Run the script
try {
  generateIndex();
} catch (error) {
  console.error('Error generating index:', error);
  process.exit(1);
}
