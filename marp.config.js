// MARP Configuration
// Configuration for Marp CLI to build presentations

module.exports = {
  // Input directory containing markdown slides
  inputDir: './slides',

  // Output directory for built presentations
  output: './dist',

  // Theme directory (custom CSS themes)
  themeSet: './themes',

  // Enable HTML in markdown content and HTML output format
  html: true,

  // Enable PDF output
  pdf: true,

  // PDF export options
  pdfOptions: {
    format: 'A4',         // Paper format
    landscape: true,      // Landscape orientation for 16:9 slides
    printBackground: true, // Include background colors
    preferCSSPageSize: true, // Use CSS page size
  },

  // Use Marp Core engine
  engine: '@marp-team/marp-core',

  // Allow local files
  allowLocalFiles: true,

  // Enable Marp features
  options: {
    markdown: {
      breaks: true,        // Convert line breaks to <br>
      typographer: true,   // Enable typographic replacements
    },
  },
};
