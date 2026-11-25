# TIBE PHOTO & VIDEO STUDIO — v4

## Included
- Responsive black-and-gold studio landing page
- Services, sample gallery and contact sections
- Browser-only 3 × 4 cm passport photo crop/export tool
- Simple admin setup notes

## Passport photo tool
1. If the source photo has a background that needs removal, use a background-removal service such as https://rmbg.me/ and download a transparent PNG.
2. Open the website and go to **Passport Maker**.
3. Choose the transparent PNG, adjust zoom and position, then download.
4. Output is 354 × 472 pixels. Print at 300 DPI for approximately 3 × 4 cm.

The tool composites the uploaded image over white. It does not itself remove a background, detect a face, retouch skin, or certify official passport-photo compliance. It runs in the browser and does not upload the image.

## Deploy with GitHub Pages
Upload/replace the files in the repository root. In GitHub, open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.

## Important
GitHub Pages is static hosting. The included admin page is a setup note only; there is no secure admin login, shared database, payment system, or real AI inference backend. Do not store secrets or private customer uploads in this public repository.

## Customize
Edit contact details in `index.html`, replace sample gallery images, and adjust colors in `style.css`.
