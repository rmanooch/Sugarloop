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

- Replace the emoji placeholders with real cake photos in `images/`.
- Update prices, flavours and the contact email.
- Connect the order form to a form service (e.g. Formspree) so submissions reach you.

## Deploying with GitHub Pages

Settings → Pages → Source: "Deploy from a branch" → `main` / root. GitHub Pages on a free plan requires the repository to be public.
