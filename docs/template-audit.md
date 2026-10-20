# Original ZIP audit

Completed and printed before application code on 20 October 2026.

## Full ZIP tree, including hidden files
```text
about.html
choose.html
contact.html
css/
css/.DS_Store
css/animate.min.css
css/bootstrap-grid.css
css/bootstrap-grid.css.map
css/bootstrap-grid.min.css
css/bootstrap-grid.min.css.map
css/bootstrap-reboot.css
css/bootstrap-reboot.css.map
css/bootstrap-reboot.min.css
css/bootstrap-reboot.min.css.map
css/bootstrap.css
css/bootstrap.css.map
css/bootstrap.min.css
css/bootstrap.min.css.map
css/default-skin.css
css/font-awesome.min.css
css/icomoon.css
css/jquery-ui.css
css/jquery.fancybox.min.css
css/jquery.mCustomScrollbar.min.css
css/meanmenu.css
css/nice-select.css
css/normalize.css
css/owl.carousel.min.css
css/responsive.css
css/slick.css
css/style.css
images/
images/banner-bg.png
images/call-icon.png
images/carpet-img.png
images/carpet-img2.png
images/contact-icon.png
images/contact-icon1.png
images/fb-icon.png
images/fb-icon1.png
images/icon-1.png
images/icon-2.png
images/img-1.png
images/img-2.png
images/img-3.png
images/img-4.png
images/img-5.png
images/img-6.png
images/img-7.png
images/instagram-icon.png
images/instagram-icon1.png
images/linkden-icon.png
images/linkden-icon1.png
images/logo.png
images/mail-icon.png
images/map-icon.png
images/play-icon.png
images/search-icon.png
images/tiles-img.png
images/toggle-icon.png
images/twitter-icon.png
images/twitter-icon1.png
index.html
js/
js/.DS_Store
js/bootstrap.bundle.js
js/bootstrap.bundle.js.map
js/bootstrap.bundle.min.js
js/bootstrap.bundle.min.js.map
js/bootstrap.js
js/bootstrap.js.map
js/bootstrap.min.js
js/bootstrap.min.js.map
js/custom.js
js/jquery-3.0.0.min.js
js/jquery.mCustomScrollbar.concat.min.js
js/jquery.min.js
js/jquery.validate.js
js/modernizer.js
js/plugin.js
js/popper.min.js
js/slider-setting.js
services.html
team.html
```

## CSS custom properties
28 declarations in each Bootstrap stylesheet, 56 total. No custom property definitions elsewhere.

### css/bootstrap.css
```css
--blue: #007bff;
--indigo: #6610f2;
--purple: #6f42c1;
--pink: #e83e8c;
--red: #dc3545;
--orange: #fd7e14;
--yellow: #ffc107;
--green: #28a745;
--teal: #20c997;
--cyan: #17a2b8;
--white: #fff;
--gray: #6c757d;
--gray-dark: #343a40;
--primary: #007bff;
--secondary: #6c757d;
--success: #28a745;
--info: #17a2b8;
--warning: #ffc107;
--danger: #dc3545;
--light: #f8f9fa;
--dark: #343a40;
--breakpoint-xs: 0;
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
--breakpoint-xl: 1200px;
--font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
--font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

### css/bootstrap.min.css
```css
--blue:#007bff;
--indigo:#6610f2;
--purple:#6f42c1;
--pink:#e83e8c;
--red:#dc3545;
--orange:#fd7e14;
--yellow:#ffc107;
--green:#28a745;
--teal:#20c997;
--cyan:#17a2b8;
--white:#fff;
--gray:#6c757d;
--gray-dark:#343a40;
--primary:#007bff;
--secondary:#6c757d;
--success:#28a745;
--info:#17a2b8;
--warning:#ffc107;
--danger:#dc3545;
--light:#f8f9fa;
--dark:#343a40;
--breakpoint-xs:0;
--breakpoint-sm:576px;
--breakpoint-md:768px;
--breakpoint-lg:992px;
--breakpoint-xl:1200px;
--font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace
```

## Font faces
### css/font-awesome.min.css
```css
@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}
```

### css/icomoon.css
```css
@font-face {
    font-family: 'IcoMoon-Free';
    src: url('../fonts/IcoMoon-Free.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

## Other findings
- Body Poppins; Rajdhani imported. Both originally imported from Google Fonts. Same families now self hosted, original imports preserved in the archive files.
- No fonts directory in the ZIP. Matching icon fonts added under public/fonts.
- No existing API routes, environment variable references, .env files or Next config.
- No loading screen markup or asset. js/custom.js has an unused .loader_bg hook.
- No cookie consent or CAPTCHA.
- No /legal/privacy-policy, /legal/terms, /legal/cookie-policy, /404, /500.
- Actual template palette: #addaed, #89cbeb, #367d99, #f0faff, #f9fafa, #1f1f1f. The earlier preliminary palette guess was superseded by inspection.
- The original blue curved banner is reused. Original section classes, bordered cards and Poppins retained. Additive styles provide responsive application layouts and the required light footer.
- Missing original references include swiper.min.css, css/css/font-awesome.min.css, js/owl.carousel.js and owl.theme.default.min.css. Legacy plugins are not executed in the React app.
- Every original path is retained. CSS and @font-face declarations remain verbatim. One non-rendered em dash in js/bootstrap.bundle.js is replaced with a comma to comply with the punctuation rule.
