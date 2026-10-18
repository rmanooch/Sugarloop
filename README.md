# Sugarloop

Static website for Sugarloop, a cake business. Plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html   Home page
cakes.html   Cake menu
about.html   About the business
order.html   Order / contact form
css/         Styles
js/          Scripts
images/      Photos (add your cake photos here)
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Next steps

- Add your cake photos to `images/` using the file names below. Until a photo is added, the page shows a blush frame labelled with the missing file name.
- Update prices, flavours and the contact email.
- Connect the order form to a form service (e.g. Formspree) so submissions reach you.

## Photos

| File | Where it appears |
|---|---|
| `hero.jpg` | Big banner on the home page (wide/landscape works best) |
| `celebration.jpg`, `cupcakes.jpg`, `wedding.jpg` | "Shop by occasion" tiles on the home page (portrait) |
| `baker.jpg` | "Our story" section on the home page (portrait) |
| `about.jpg` | Our Story page (portrait) |
| `cake-1.jpg` … `cake-6.jpg` | Cakes page menu (square) |
| `insta-1.jpg` … `insta-6.jpg` | Instagram strip at the bottom of each page (square) |

## Deploying with GitHub Pages

Settings → Pages → Source: "Deploy from a branch" → `main` / root. GitHub Pages on a free plan requires the repository to be public.
