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
- Update the menu descriptions and flavours as needed.

## Order form

The form on `order.html` is sent through [FormSubmit](https://formsubmit.co), which emails each enquiry to sugarloopcollc@gmail.com and then shows `thanks.html`.

- **Activation:** the first time the form is submitted from the live site, FormSubmit emails an activation link to sugarloopcollc@gmail.com. Click it once; enquiries are only delivered after that.
- **Hiding the address (optional):** after activating, FormSubmit sends a random alias. Replace the email in the form's `action` with it so the address isn't visible in the page source.
- The form only works on the live site (GitHub Pages), not when opening the file directly on your computer.

## Photos

| File | Where it appears |
|---|---|
| `hero.jpg` | Top of the home page |
| `celebration.jpg`, `cupcakes.jpg`, `baklava.jpg` | "Our treats" tiles on the home page (portrait) |
| `baker.jpg` | "Made with love" section on the home page (portrait) |
| `about.jpg`, `story-baklava.jpg` | Our Story page (portrait) |
| `cake-1.jpg` … `cake-6.jpg` | Menu page, cakes section (square) |
| `baklava-1.jpg` … `baklava-3.jpg` | Menu page, baklava section (square) |

## Deploying

The site is hosted on GitHub Pages (Settings → Pages → branch `main`, folder `/ (root)`) at **https://rmanooch.github.io/Sugarloop/**.

A custom domain (sugarloopco.com, registered with Wix) can be connected later: add it under Settings → Pages → Custom domain, point its DNS at GitHub Pages (four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` for `www` → `rmanooch.github.io`), and update the `_next` URL in `order.html`.
