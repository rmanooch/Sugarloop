# Sugarloop Co

Static website for Sugarloop Co, a cake business. Plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html   Home page
cakes.html   Menu (cakes, cupcakes, baklava)
about.html   About the business
order.html   Order / contact form
thanks.html  Shown after the order form is sent
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

## Order form

The form on `order.html` is sent through [FormSubmit](https://formsubmit.co), which emails each enquiry to sugarloopcollc@gmail.com and then shows `thanks.html`.

- **Activation:** the first time the form is submitted from the live site, FormSubmit emails an activation link to sugarloopcollc@gmail.com. Click it once; enquiries are only delivered after that.
- **Hiding the address (optional):** after activating, FormSubmit sends a random alias. Replace the email in the form's `action` with it so the address isn't visible in the page source.
- The form only works on the live site (GitHub Pages), not when opening the file directly on your computer.

## Photos

| File | Where it appears |
|---|---|
| `hero.jpg` | Big banner on the home page (wide/landscape works best) |
| `celebration.jpg`, `cupcakes.jpg`, `baklava.jpg`, `wedding.jpg` | "Our treats" tiles on the home page (portrait) |
| `baker.jpg` | "Our story" section on the home page (portrait) |
| `about.jpg` | Our Story page (portrait) |
| `cake-1.jpg` … `cake-6.jpg` | Menu page, cakes section (square) |
| `baklava-1.jpg` … `baklava-3.jpg` | Menu page, baklava section (square) |
| `insta-1.jpg` … `insta-6.jpg` | Instagram strip at the bottom of each page (square) |

## Deploying with GitHub Pages

Settings → Pages → Source: "Deploy from a branch" → `main` / root. GitHub Pages on a free plan requires the repository to be public.
