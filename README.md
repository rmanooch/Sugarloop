# Sugarloop Co

Static website for Sugarloop Co, a cake business. Plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html   Home page
cakes.html   Menu with prices (cakes, cupcakes, baklava, Swiss rolls)
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

- Add your cake photos to `images/` using the file names below. Until a photo is added, the page shows a blush frame labeled with the missing file name.
- Update the menu descriptions and flavors as needed.

## Order form

The order builder on `order.html` lists each item with its price in `data-price` attributes. **Prices live in two places: the Menu page (`cakes.html`) and the order builder (`order.html`) — update both.** The Swiss roll add-on price is `ADDON_PRICE` in `js/main.js`.

The form on `order.html` is sent through [FormSubmit](https://formsubmit.co), which emails each inquiry to sugarloopcollc@gmail.com and then shows `thanks.html`.

- **Activation:** the first time the form is submitted from the live site, FormSubmit emails an activation link to sugarloopcollc@gmail.com. Click it once; inquiries are only delivered after that.
- **Hiding the address (optional):** after activating, FormSubmit sends a random alias. Replace the email in the form's `action` with it so the address isn't visible in the page source.
- The form only works on the live site (GitHub Pages), not when opening the file directly on your computer.
- **Inspiration photos:** customers can attach up to 3 photos, which arrive as email attachments. Large photos are shrunk in the browser first (FormSubmit allows 10 MB per inquiry). Inquiries without photos are sent in the background; inquiries with photos are posted normally, because FormSubmit's background endpoint doesn't reliably deliver attachments. Both go straight to `thanks.html`.

## Photos

| File | Where it appears |
|---|---|
| `hero.jpg` | Top of the home page |
| `celebration.jpg`, `cupcakes.jpg`, `baklava.jpg` | "Our treats" tiles on the home page (portrait) |
| `baker.jpg` | "Made with love" section on the home page (portrait) |
| `about.jpg`, `story-baklava.jpg` | Our Story page (portrait) |
| `menu-cakes.jpg`, `cake-6.jpg`, `menu-baklava-photo.jpg`, `menu-swiss-roll.jpg` | Menu page: Custom Cakes, Cupcakes, Baklava and Swiss Roll sections |
| `cake-*.jpg` | Menu page: cake photos under Custom Cakes |
| `roll-vanilla.jpg`, `roll-coffee.jpg` | Menu page: photos under Swiss Roll |
| `share-*.jpg` | Link previews when the site is shared |
| `sugarloop-menu.jpg` (+ `full/`) | "Share our menu" card on the Menu page; replace both to update the shareable menu |

## Deploying

The site is hosted on GitHub Pages (Settings → Pages → branch `main`, folder `/ (root)`) at **https://www.sugarloopco.com** (`sugarloopco.com` and the old `rmanooch.github.io/Sugarloop` address redirect there). The `CNAME` file tells GitHub Pages which domain to serve; don't delete it.

The domain is registered with Wix, and its DNS records (managed in Wix) point to GitHub Pages: four `A` records for `sugarloopco.com` (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` for `www` → `rmanooch.github.io`.

## Link previews

Each page has Open Graph tags so links shared in messages and social apps show a title, description and a 1200 × 630 image (`images/share-*.jpg`). These tags use full `https://www.sugarloopco.com/...` addresses — update them if the domain ever changes.

## Local search

`index.html` includes Bakery structured data (JSON-LD) describing the business, its service area (Maryland), email and Instagram. `sitemap.xml` lists the public pages and `robots.txt` points search engines to it. Add new pages to the sitemap when you create them.
