# Academic homepage

This is a plain HTML/CSS personal academic website designed for GitHub Pages.

## Pages

- `index.html` - Home
- `cv.html` - CV page
- `research.html` - numbered research list with BibTeX toggle and copy button
- `teaching.html` - teaching page
- `misc.html` - miscellaneous page
- `contact.html` - contact page
- `files/` - place PDFs, slides, notes, and other downloads here

## Edit the content

Open each HTML file and make your own changes.

## Research page (updated)

Each paper has:

- a numbered list item
- title line
- coauthor line
- journal line
- PDF button
- BibTeX toggle button

To add another paper, duplicate one publication block and update:

- the title
- coauthors
- journal line
- PDF filename in `href`
- BibTeX entry
- the BibTeX target id, such as `bibtex-4`

## Files folder

Upload PDFs and other downloadable files into the `files/` folder.
Then link to them using relative paths such as:

- `files/cv.pdf`
- `files/paper-one.pdf`
- `files/sample-note.pdf`

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder.
3. In GitHub, open **Settings -> Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your branch (usually `main`) and the root folder, then save.
6. GitHub Pages will publish the site after a short delay.


## Version note


### V3

Visual improvement, Apple-like round corners, transparent glasses, and hover effects.


### V2 

1. Local Lato font setup

This version loads Lato from `assets/fonts/` using `@font-face` instead of Google Fonts, to avoid display issues on visitors from mainland China. 


2. Research-page rebuild

This package includes the research-page interaction: each paper entry is a light-gray clickable card, the abstract toggles by clicking the entry, and BibTeX/PDF controls remain independent.

### V1

Replace the old site with this new version.
