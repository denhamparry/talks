# Contributor Template - Slide Deck

> **For Content Contributors:** This template is designed for you! You don't need to know MARP or any technical details about presentations. Just fill in your content following the examples below, and the system will automatically format it into professional slides.
>
> **Important:** See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
>
> - Speaker notes guidelines (how to add notes for live presentations)
> - Presenter attribution (how to include your contact information)

## How to Use This Template

1. **Copy this file** to the `slides/` directory with your talk name
2. **Fill in each section** with your content (replace the placeholder text)
3. **Keep the special comments** (lines starting with `---` and `<!-- _class:`)
4. **Submit your content** (see CONTRIBUTING_SLIDES.md for submission workflow)

---

<!-- DO NOT MODIFY: These lines configure the presentation system -->
---
marp: true
theme: edera-v2
paginate: true
---
<!-- DO NOT MODIFY END -->

---

<!-- _class: title -->

# [Your Presentation Title]

## [Your Subtitle or Tagline]

[Your Name] | [Event/Conference Name] | [Date]

<!--
INSTRUCTIONS: This is your opening slide
- Replace [Your Presentation Title] with your talk title
- Add a subtitle that describes your talk in 5-10 words
- Fill in your name, event, and date
EXAMPLE: "Building Better Apps" "A practical guide to modern development" "Jane Developer | DevConf 2025 | December 3"
-->

---

<!-- _class: content -->

# Introduction

- [First key point about your topic]
- [Second important concept to introduce]
- [Third main theme you'll cover]

<!--
Speaker Notes:
- Welcome the audience
- Introduce yourself briefly
- Set expectations for talk length (e.g., "This will take about 20 minutes")
- Mention when to ask questions (during or after)

DELETE THIS EXAMPLE and replace with your own notes, or remove entirely if not needed.
-->

<!--
INSTRUCTIONS: Introduce your topic
- Use 3-5 bullet points
- Keep each point to one line
- Focus on what you'll cover

SPEAKER NOTES (Optional):
Add speaker notes in HTML comments like the example above. These are only visible
to you when presenting. See CONTRIBUTING.md for speaker notes best practices.
-->

---

<!-- _class: content -->

# Why This Matters

[Write 2-3 sentences explaining why your topic is important]

- **Problem:** [What challenge or issue are you addressing?]
- **Impact:** [Why should your audience care about this?]
- **Solution:** [What will they learn from your talk?]

<!--
INSTRUCTIONS: Explain the "why" behind your talk
- Make it relevant to your audience
- Connect to real-world problems
- Set expectations for what they'll learn
-->

---

<!-- _class: content -->

# [Main Point 1]

[Describe your first main concept]

- [Supporting detail or example]
- [Another important aspect]
- [Key takeaway from this point]

<!--
INSTRUCTIONS: Your first major topic
- Start with a clear heading
- Use 3-5 bullet points
- Each point should be one line
- Can include multiple slides on same topic
-->

---

<!-- _class: content -->

# Code Example (Optional)

[Brief description of what this code does]

```python
# Replace 'python' with your language: javascript, go, bash, etc.
def example_function():
    """Your code goes here"""
    return "Replace with your actual code"
```

<!--
INSTRUCTIONS: Include code if relevant
- Replace 'python' with your language
- Keep code simple and focused
- Add comments explaining key parts
- Delete this slide if no code needed
-->

---

<!-- _class: two-columns -->

# Comparison or Side-by-Side Content

## Left Side

- [Point A1]
- [Point A2]
- [Point A3]

## Right Side

- [Point B1]
- [Point B2]
- [Point B3]

<!--
INSTRUCTIONS: Use for comparisons or parallel concepts
- Great for "Before/After", "Option A vs B"
- Each side should have similar amount of text
- Use headers to label each column
- Delete if not needed
-->

---

<!-- _class: content -->

# [Main Point 2]

## [Sub-heading if needed]

[Your explanation goes here. You can write sentences or paragraphs for more complex topics.]

**Bold text** for emphasis and *italics* for secondary points.

> Use a blockquote for important quotes or callouts

<!--
INSTRUCTIONS: Continue with your main content
- Mix bullet points and paragraphs as needed
- Use formatting for emphasis
- Blockquotes great for quotes or key insights
-->

---

<!-- _class: content -->

# Data or Tables (Optional)

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| [Data 1] | [Data 2] | [Status] |
| [Data 3] | [Data 4] | [Status] |
| [Data 5] | [Data 6] | [Status] |

[Add explanation of the table data]

<!--
INSTRUCTIONS: Use tables for structured data
- Keep tables simple (3-4 columns max)
- Include header row
- Add brief explanation below
- Delete if not needed
-->

---

<!-- _class: dark -->

# [Important Emphasis Slide]

[Use this dark variant for key messages or transitions]

- [Important point]
- [Critical insight]
- [Major takeaway]

<!--
INSTRUCTIONS: Dark slide for emphasis
- Use sparingly (1-2 times per talk)
- Great for section transitions
- Highlights critical information
-->

---

<!-- _class: content -->

# [Main Point 3]

[Continue with additional main points as needed]

1. [Numbered list option 1]
2. [Numbered list option 2]
3. [Numbered list option 3]

<!--
INSTRUCTIONS: Add as many content slides as you need
- Copy and paste this slide pattern
- Keep consistent structure
- Usually 8-15 slides total is ideal
-->

---

<!-- _class: content -->

# Image Slide (Optional)

![Image description for accessibility](<path/to/image.png>)

[Caption or explanation of the image]

<!--
INSTRUCTIONS: Include images if helpful
- Use ![alt text](path) format
- Images should be in images/ directory
- Add descriptive alt text for accessibility
- Keep file sizes reasonable (<500KB)
- Delete if no images needed
-->

---

<!-- _class: content -->

# Key Takeaways

1. **[First main takeaway]** - [Brief elaboration]
2. **[Second main takeaway]** - [Brief elaboration]
3. **[Third main takeaway]** - [Brief elaboration]

<!--
INSTRUCTIONS: Summarize your talk
- 3-5 key takeaways
- Make them actionable
- Reinforce main messages
-->

---

<!-- _class: content -->

# Resources (Optional)

- [Link to documentation: https://example.com]
- [Related article: https://example.com]
- [Tool or framework: https://example.com]

<!--
INSTRUCTIONS: Share useful links
- Keep to 3-5 most important resources
- Include full URLs
- Brief description for each
- Delete if not needed
-->

---

<!-- _class: title -->

# Thank You

## Questions?

[Your Name]
[your.email@example.com]
[@yourhandle]

<!--
INSTRUCTIONS: Closing slide
- Include contact information
- Email, Twitter/social handles, GitHub
- Optionally add company/organization
-->

---

## Additional Tips for Great Slides

**Content Guidelines:**
- One main idea per slide
- Limit text: 5-7 bullet points maximum per slide
- Use visuals when possible (images, diagrams, code)
- Keep sentences short and impactful

**What to Avoid:**
- Too much text on one slide
- Tiny font sizes (will be handled automatically)
- Complex animations (not supported in markdown)
- Full paragraphs (use bullet points instead)

**Typical Talk Structure:**
1. Title slide (1)
2. Introduction/Why it matters (2-3 slides)
3. Main content (8-12 slides)
4. Key takeaways (1-2 slides)
5. Thank you/contact (1 slide)

**Need Help?**
- See `docs/CONTRIBUTING_SLIDES.md` for submission workflow
- Check `slides/example-contribution.md` for a complete example
- Review existing slides in `slides/` directory for inspiration
- Open an issue if you have questions

---

## About the Technical Stuff (You Can Ignore This)

This template uses MARP (Markdown Presentation Ecosystem) with the Edera V2 theme. The special comments like `<!-- _class: title -->` tell the system how to format each slide. You don't need to understand these - just keep them in place!

**Slide Types Available:**
- `title` - Opening/closing slides (dark background)
- `content` - Standard content slides (light background)
- `dark` - Dark variant for emphasis
- `two-columns` - Side-by-side layout
- `image` - Full-screen image slides
- `image-overlay` - Text overlaid on images

The system will automatically:
- Apply professional formatting
- Use consistent colors and fonts
- Generate HTML and PDF versions
- Handle page numbers and navigation
