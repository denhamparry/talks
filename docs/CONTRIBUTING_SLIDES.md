# Contributing Slide Content

Welcome! This guide shows you how to contribute presentation content to this repository **without needing to know MARP or any technical presentation tools**. If you can write markdown, you can create professional slides!

## Quick Start

### Option 1: Create Slides Directly (Recommended)

1. **Get the template:**

   ```bash
   # If you've cloned the repo
   cp templates/contributor-template.md slides/your-talk-name.md
   ```

   Or download it directly: `templates/contributor-template.md`

2. **Fill in your content:**
   - Open `slides/your-talk-name.md` in any text editor
   - Replace placeholder text with your content
   - Follow the instructions in the template comments
   - See `slides/example-contribution.md` for a complete example

3. **Submit your slides:**
   - Commit and push to a new branch
   - Open a pull request
   - The CI/CD system will automatically build your slides
   - Download the generated PDF/HTML from the PR

### Option 2: Submit Content via GitHub Issue

Don't want to use Git? No problem!

1. Open a new GitHub issue
2. Use the title: "Slide Submission: [Your Talk Title]"
3. Paste your content in the issue body
4. A maintainer will convert it to slides for you

### Option 3: External Project Collaboration

If your team wants to submit multiple presentations:

1. Contact the maintainers (open an issue or discussion)
2. Discuss your needs and timeline
3. We'll work with you on the best submission workflow

## Understanding the Template

The contributor template (`templates/contributor-template.md`) is designed to be self-explanatory. Here's what you need to know:

### Special Lines (Keep These!)

```markdown
---
marp: true
theme: edera-v2
paginate: true
---
```

These lines at the top configure the presentation system. **Don't modify or remove them.**

```markdown
<!-- _class: title -->
```

These HTML comments tell the system what type of slide to create. **Keep these in place.**

```markdown
---
```

Three dashes create a new slide. **Use these to separate your slides.**

### You Can Freely Edit

Everything else is yours to customize:

- All headings (`#`, `##`, `###`)
- All bullet points and numbered lists
- All paragraphs and text
- Code blocks
- Tables
- Images
- Blockquotes

## Slide Types Explained

### 1. Title Slide (Dark Background)

```markdown
<!-- _class: title -->

# Your Talk Title

## Your Subtitle

Your Name | Event | Date
```

**When to use:** Opening slide and closing "Thank You" slide

### 2. Content Slide (Light Background - Most Common)

```markdown
<!-- _class: content -->

# Your Heading

- Bullet point one
- Bullet point two
- Bullet point three
```

**When to use:** 90% of your slides - standard content

### 3. Dark Emphasis Slide

```markdown
<!-- _class: dark -->

# Important Message

- Key point
- Critical insight
```

**When to use:** Highlight important information or transitions between sections

### 4. Two-Column Layout

```markdown
<!-- _class: two-columns -->

# Comparison

## Left Column

- Point A
- Point B

## Right Column

- Point X
- Point Y
```

**When to use:** Comparisons, before/after, pros/cons, side-by-side concepts

### 5. Image Slide

```markdown
<!-- _class: content -->

# Your Heading

![Image description](images/your-image.png)

Caption text here
```

**When to use:** When images are central to your point

## Best Practices

### Content Guidelines

1. **One idea per slide**
   - Don't try to fit too much on one slide
   - Split complex topics across multiple slides

2. **Limit text**
   - Maximum 5-7 bullet points per slide
   - Keep bullet points to one line
   - Use short sentences

3. **Use visuals**
   - Images enhance understanding
   - Code examples should be concise
   - Tables work well for comparisons

4. **Structure your talk**
   - Introduction (why it matters)
   - Main content (3-5 key points)
   - Key takeaways
   - Thank you / contact info

### Formatting Tips

**For emphasis:**

```markdown
**Bold text** for important terms
*Italic text* for secondary emphasis
```

**For code:**

````markdown
```python
def example():
    return "Use code blocks for code"
```
````

**For quotes:**

```markdown
> Important quote or callout text
```

**For tables:**

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### What to Avoid

- ❌ Walls of text (use bullet points instead)
- ❌ Too many bullet points (max 7 per slide)
- ❌ Tiny images (minimum 800px wide recommended)
- ❌ Complex nested lists (keep it simple)
- ❌ Removing the special comments (`<!-- _class: -->`)
- ❌ Modifying the MARP frontmatter (lines at the top)

## Working with Images

### Adding Images

1. **Place images in the `images/` directory:**

   ```bash
   images/
     my-talk/
       diagram1.png
       screenshot2.png
   ```

2. **Reference in your markdown:**

   ```markdown
   ![Diagram showing the architecture](images/my-talk/diagram1.png)
   ```

3. **Always include alt text** (the text in brackets) for accessibility

### Image Guidelines

- **Format:** PNG or JPG
- **Size:** Keep under 500KB per image
- **Dimensions:** Minimum 800px wide for quality
- **Optimization:** Use tools like TinyPNG to reduce file size
- **Naming:** Use descriptive filenames (`architecture-diagram.png` not `img1.png`)

## Typical Talk Structure

Here's a recommended structure for a 20-30 minute talk:

1. **Title Slide** (1 slide)
   - Talk title, your name, event, date

2. **Introduction** (2-3 slides)
   - What you'll cover
   - Why it matters
   - Context/background

3. **Main Content** (8-12 slides)
   - 3-5 main points
   - Each point gets 2-3 slides
   - Include examples, code, visuals

4. **Key Takeaways** (1-2 slides)
   - Summarize main points
   - Make them actionable

5. **Closing** (1 slide)
   - Thank you
   - Questions
   - Contact information

**Total:** 12-20 slides for 20-30 minutes (roughly 1-2 minutes per slide)

## Complete Examples

### Example 1: Simple Content Slide

```markdown
---

<!-- _class: content -->

# Why Use Kubernetes?

- **Scalability** - Handle millions of requests
- **Reliability** - Automatic failover and recovery
- **Efficiency** - Optimal resource utilization
- **Portability** - Run anywhere (cloud, on-prem)

---
```

### Example 2: Code Example

````markdown
---

<!-- _class: content -->

# Basic Python Function

Here's how to create a simple greeting function:

```python
def greet(name):
    """Return a personalized greeting."""
    return f"Hello, {name}! Welcome to our talk."

# Usage
message = greet("Developer")
print(message)  # Output: Hello, Developer! Welcome to our talk.
```

---
````

### Example 3: Comparison Slide

```markdown
---

<!-- _class: two-columns -->

# Monolith vs Microservices

## Monolithic Architecture

- Single codebase
- Easier to develop initially
- All-or-nothing deployment
- Scales entire application

## Microservices Architecture

- Multiple independent services
- More complex setup
- Independent deployment
- Scales specific components

---
```

## Submission Workflow

### Via Pull Request (Recommended)

1. **Fork and clone** the repository

   ```bash
   git clone https://github.com/your-username/talks.git
   cd talks
   ```

2. **Create a new branch**

   ```bash
   git checkout -b slides/your-talk-name
   ```

3. **Copy and fill the template**

   ```bash
   cp templates/contributor-template.md slides/your-talk-name.md
   # Edit slides/your-talk-name.md with your content
   ```

4. **Add images if needed**

   ```bash
   # Create directory for your images
   mkdir -p images/your-talk-name
   # Copy your images there
   ```

5. **Commit and push**

   ```bash
   git add slides/your-talk-name.md images/your-talk-name/
   git commit -m "feat(slides): add presentation on [your topic]"
   git push origin slides/your-talk-name
   ```

6. **Open a pull request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

7. **CI/CD builds your slides**
   - GitHub Actions automatically builds HTML and PDF
   - Download artifacts from the Actions tab
   - Review the generated output
   - Make any needed adjustments

### Via GitHub Issue

If you prefer not to use Git:

1. **Open a new issue** in the GitHub repository

2. **Use this template:**

   ```markdown
   Title: Slide Submission: [Your Talk Title]

   ## Talk Information
   - **Title:** Your Talk Title
   - **Event:** Conference/Event Name
   - **Date:** YYYY-MM-DD
   - **Speaker:** Your Name

   ## Slide Content

   [Paste your slide content here using the template format]

   ## Images
   - [Describe any images needed or attach them]

   ## Questions/Notes
   - [Any questions or special requests]
   ```

3. **Submit the issue**
   - A maintainer will review
   - They'll convert to the proper format
   - You'll get a link to the generated slides

## After Submission

### What Happens Next

1. **Automated build** - CI/CD generates HTML and PDF versions
2. **Review** - Maintainer checks formatting and quality
3. **Feedback** - You may get suggestions for improvements
4. **Merge** - Once approved, your slides are merged
5. **Published** - Your slides are available in the repository

### Getting Your Slides

Once merged, your slides will be available:

- **Source:** `slides/your-talk-name.md`
- **HTML:** `dist/your-talk-name.html`
- **PDF:** `dist/your-talk-name.pdf`

You can also download them from the GitHub Actions artifacts during the PR review process.

## Building Locally (Optional)

If you want to preview your slides before submitting:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build your slides:**

   ```bash
   # HTML output
   npm run build

   # PDF output
   npm run build:pdf

   # Watch mode (auto-rebuild on changes)
   npm run watch

   # Local server with live reload
   npm run serve
   ```

3. **View the output:**
   - HTML: `dist/your-talk-name.html`
   - PDF: `dist/your-talk-name.pdf`

## Troubleshooting

### My images aren't showing

- Verify the image path is correct
- Images should be in `images/` directory
- Use forward slashes: `images/my-talk/diagram.png`
- Check image file size (under 500KB)

### The formatting looks wrong

- Make sure you kept the `<!-- _class: -->` comments
- Check that you have `---` between slides
- Verify the MARP frontmatter at the top is intact
- Compare with `slides/example-contribution.md`

### Code blocks aren't formatted

- Make sure you're using triple backticks: ` ``` `
- Specify the language: ` ```python `
- Verify proper spacing around the code block

### Tables aren't aligned

- Check that each row has the same number of columns
- Include the header separator row: `|---|---|`
- Keep tables simple (3-4 columns max)

### I need help

- Check `slides/example-contribution.md` for a complete example
- Review existing slides in `slides/` directory
- See `docs/marp-usage.md` for detailed MARP documentation
- Open an issue with questions
- Tag a maintainer in discussions

## FAQ

### Do I need to know MARP?

No! The template handles all the MARP-specific syntax. Just write markdown and follow the template structure.

### Can I use my own theme or colors?

The Edera V2 theme is applied automatically. If you need custom styling for a specific project, discuss with maintainers.

### What if my talk is shorter/longer?

The template is flexible - add or remove slides as needed. Just copy the slide patterns that fit your content.

### Can I submit slides in other formats?

We prefer markdown for consistency, but if you have slides in another format (Google Slides, PowerPoint), contact the maintainers to discuss conversion options.

### How do I update my slides after submission?

If your slides are already merged, open a new PR with updates to your slide file. If still in review, push new commits to your PR branch.

### Can I present these slides?

Yes! Once generated, you can use the HTML or PDF versions for your presentations. The HTML version works in any web browser.

## Additional Resources

- **Example slides:** `slides/example-contribution.md`
- **Template:** `templates/contributor-template.md`
- **Basic template:** `templates/basic-presentation.md` (for MARP users)
- **MARP documentation:** `docs/marp-usage.md` (advanced)
- **Theme guide:** `docs/theme-guide.md` (customization)
- **Main README:** `README.md` (project overview)

## Edera V2 Theme Reference

Your slides will automatically use the Edera V2 theme:

**Colors:**

- Dark Teal (#013a3b) - Title backgrounds, body text
- Light Mint (#d0fdf2) - Content backgrounds
- Cyan Accent (#02f4d5) - Headings, links

**Fonts:**

- Headings: Clean, modern sans-serif
- Body: Readable sans-serif
- Code: Monospace font

**Accessibility:**

- All color combinations meet WCAG AA standards
- High contrast for readability
- Properly sized fonts

You don't need to worry about any of this - it's all automatic!

## Contact

Questions, suggestions, or need help?

- **Open an issue:** General questions or problems
- **Start a discussion:** Ideas for improvement
- **Tag a maintainer:** `@maintainer-name` in issues or PRs

We're here to help make your slide submission as easy as possible!

---

Thank you for contributing! Your presentations help grow this resource for the entire community.
