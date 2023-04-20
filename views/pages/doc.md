---
title: Install Blog-Doc
description: Installing and using the app
featuredImage: 
---
## Blog-Doc {# Blog-Doc}

The Simplest Node.js CMS & SSG !

### Features ⚡{# Features }

-   Administrate your app from the front-end ! <img src="/icons/settings.svg" />
-   [Gallery](#gallery) to upload your images <img src="/icons/photo-up.svg" />
-   Create, Read, Update & Delete your pages and posts <img src="/icons/pencil.svg" />
-   Paginated blog with chosen number of [posts per page](/admin-config-site#posts-per-page) <img src="/icons/arrows-left-right.svg" />
-   Posts pagination to navigate between your posts <img src="/icons/arrow-left-right.svg" />
-   Write your content in Markdown <img src="/icons/markdown.svg" />
-   Ability to use HTML in Markdown <img src="/icons/brand-html5.svg" />
-   Tag(s) for posts <img src="/icons/tags.svg" />
-   Featured image for pages & posts <img src="/icons/photo.svg" />
-   Archive route for posts <img src="/icons/archive.svg" />
-   Tags list route <img src="/icons/bookmarks.svg" />
-   Individual route for each tag <img src="/icons/bookmark.svg" />
-   Titles & Meta Descriptions <img src="/icons/h-1.svg" />
-   Drag and drop your [menu links](/admin-config-menu#menuLink_1) to sort them <img src="/icons/menu-order.svg" />
-   [RSS feed](#rss) <img src="/icons/rss.svg" />
-   [Sitemap](#sitemap) <img src="/icons/sitemap.svg" />
-   [Search](#search-feature) <img src="/icons/search.svg" />
-   [Code highlighting](#code-highlighting) with Prism <img src="/icons/highlight.svg" />
-   [Ids for H2 till H4 in Markdown](#ids-in-markdown) <img src="/icons/hash.svg" />
-   Hot reloading in development mode <img src="/icons/flame.svg" />

### Solid stack of technologies 🪨 {# stack of technologies}

#### Backend (input) {# Backend}

-   Node.js 16.x or higher.
-   EJS is 100% JavaScript.
-   Markdown to focus on your content.

#### Frontend (output) {# Frontend}

-   HTML, CSS and a tiny JS file.

### Blazing fast and simple 🚀 {# fast and simple}

-   A zero configuration static site generator.
-   Ready to use on your Node.js server as a Node.js CMS.
-   Ready to use, after build, as a static site.
-   Without any unnecessary functionalities, loads in a blink of an eye.
-   Easy to install and use.

### Design 🎨 {# design}

-   Responsive, elegant and simple layout.
-   Ready to use template for blog and/or documentation.
-   Easy to modify if you opt for another design.

## How to install Blog-Doc ? {# installing Blog-Doc}

Blog-Doc is a Deta Space application.  
You can install it on your Personal Cloud by visiting the [Discovery page of Blog-Doc](https://deta.space/discovery/@lebcit/blocdoc) and click on the **Install on Space** button.

Blog-Doc is also a `Node.js`{language=markup} app. You should have [Node.js](https://nodejs.org/en/) on your machine.  
Always go for the **LTS** version. At the time of writing those lines it's 18.12.1 !

If you want to try Blog-Doc, head over it's [Github repository](https://github.com/LebCit/blog-doc-space) and download it.  
You can also download it's zip by clicking on the following link : [Blog-Doc ZIP](https://github.com/LebCit/blog-doc-space/archive/refs/heads/master.zip).

Once downloaded, extract the zipped folders and files to a new folder and open it in your IDE (I use the one and only [VS Code](https://code.visualstudio.com/)).  
Then type in the terminal :

```bash
npm install
```

After the install, to see what Blog-Doc looks like, type in your terminal the following command :

```bash
npm run watch
```

This command will allow you to explore the app in the browser of your choice by visiting [localhost on port 3000](http://localhost:3000).

Blog-Doc comes with some posts and pages. You can now begin to create your own pages and posts from the administration, then remove the existing ones also from the administration.

In Space or locally, I wish you an enjoyable trip with Blog-Doc 🚀

## Generate a static site {# Generate a static site}

### How is it done ?!

When you try to reproduce an idea like a CMS or an SSG, you learn a lot and especially to respect and appreciate the great and hard work of the developers who made applications used by thousand of people !

Rendering a static file out of a template is an easy task, but turning different routes working together to produce a Node.js app into some folders and a lot of files to generate a static site is not an easy one !

The file behind this trick in Blog-Doc is `build.js`{language=markup} You can find this file under the `functions`{language=markup} folder. It's very similar to the [filesRoute.js](/posts/the-files-route). The difference between the two is that `filesRoute.js`{language=markup} renders the posts, pages and templates in the Node.js app while `build.js`{language=markup} generates out of those posts, pages and templates a ready to use static site.

### How does it work ?

If you're using Blog-Doc on Space or on a Node.js server, head over the [Administration page](/admin) and click on the **Build Static Site** card. A zipped folder named `_site.zip`{language=markup} will be available for you to download. The content of this folder is your static site. Read how to use in it the next section.

If you're using Blog-Doc locally, you can generate the static site from the CMS as described above, or type the following command in your terminal :

```bash
npm run build
```

This command will create a **\_site** folder in which all the necessary folders and files are created. You can now copy the entire content of the **\_site** folder to the server of your choice or just test it locally.

_**Nota Bene : in both cases, the administration part and all of it's components will be removed from the generated static site !**_

## How to use it ? {# using Blog-Doc}

### Test it locally

Copy the content of the **\_site** folder to a new folder and open it in your IDE, I use [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.  
Launch the local server and you'll be able to explore the static site.

### Host it !

Push the content of the **\_site** folder to a host of your choice.  
There are many free hosts for static sites. The most known are :

-   [Netlify](https://www.netlify.com/)
-   [Vercel](https://vercel.com/)
-   [Cloudflare Pages](https://pages.cloudflare.com/)
-   [Render](https://render.com/)
-   [Surge](https://surge.sh/)
-   [GitHub Pages](https://pages.github.com/)
-   [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/#gitlab-pages)
-   [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static/)

_Nota Bene : the above list can be much longer with the different services out there to host a static site !_

### Push it to Deta Space !

You can push the content of the **\_site** folder to [Deta Space](https://deta.space/) as a Node.js app !  
It took me less than 5 minutes to do it !  
[Space Docs](https://deta.space/docs/en/introduction/start) are great and straightforward !  
THE FOLLOWING WILL BE REPLACED BY AN EXAMPLE ON SPACE !  
You can take a look at the result by visiting [Blog-Doc static with Express](https://blog-doc-static-express.deta.dev/).  
The implementation can be found on the following [GitHub repository](https://github.com/LebCit/blog-doc-static-express).

## RSS ! {# RSS}

⚠️ You **MUST** provide the **live URL** of your site in the [Settings page](/admin-config-site#site-url) by modifying the `siteURL` value before deploying the application.

At build time, a `rss.xml`{language=markup} file is generated in the **\_site** folder.  
This file takes the live URL that you provided to generate the correct links for your feed.  
_Nota Bene : the live URL **MUST** end with a slash `/`{language=markup} !_

Of course, you **MUST** also modify `siteTitle`{language=markup}, `siteDescription`{language=markup} and `rssCopyright`{language=markup} in the [Settings page](/admin-config-site).  
You **SHOULD** replace the `siteTitle`{language=markup}, `siteDescription`{language=markup} and `rssCopyright`{language=markup} **values** with the ones of your site.  
You **MAY** replace the `rssSiteLanguage`{language=markup} value with the language of your site.  
A list of available language codes can be found on the [RSS language codes page](https://www.rssboard.org/rss-language-codes).

Bellow is a screenshot of the RSS feed of Blog-Doc in [Vivaldi browser](https://vivaldi.com/)

<style>
    .pure-img-responsive {
        border-style: dashed;
    }
</style>
<img class="pure-img-responsive" src="/images/blog-doc-rss.xml.png">

## Sitemap {# sitemap}

Like the RSS feed, you **MUST** provide the **live URL** of your site in the [Settings page](/admin-config-site#site-url) by modifying the `siteURL`{language=markup} value to generate the correct links for each page, post, tag and template as well as for the blog routes.  
Please remember that the **Site URL** **MUST** end with a slash `/`{language=markup} !

You can check the sitemap of your site under the `/sitemap`{language=markup} route.  
At build time, a `sitemap.xml`{language=markup} is generated in the **\_site** folder.

## Search {# search feature}

Blog-Doc has a built-in search feature.  
The search functionality allows a user to make a research on **the titles** and **the contents** of the posts.

You can check the search of your site under the `/search`{language=markup} route.  
At build time, a `posts.json`{language=markup} and a `search.js`{language=markup} are generated in **\_site/js**.  
Also, at build time, an `index.html`{language=markup} is generated under the **search** folder in the **\_site** folder.

You can disable the search in the Node.js app as well as for the generated static site by giving `searchFeature`{language=markup} a value of `false`{language=markup} in the [Settings page](/admin-config-site#search-feature).

To see it in action, take a look at :

-   [Search in Node.js app](https://blocdoc-1-v3476171.deta.app/search)
-   [Search in static site](https://blog-doc-static-express.deta.dev/search.html) THIS WILL BE REPLACED BY AN EXAMPLE ON SPACE !

## Code highlighting {# code highlighting}

Blog-Doc uses [Prism](https://prismjs.com/) to highlight **inline code** and **block of code**.

To write **inline code**, surround your code with backticks <code class="language-markup">\`\`</code>.  
To highlight it, provide the language for the **inline code** by putting after it a curly braces with the alias of the language of the code.  
The following examples will give you a better idea.  
Assuming this `css`{language=markup} line `p : color { red }`{language=markup}, to highlight it you'll write <code class="language-markup">\`p { color: red }\`{language=css}</code> and you'll get the following output `p { color: red }`{language=css}  
The code is surrounded with backticks <code class="language-markup">\`\`</code> and followed by `{language=alias of code language}`{language=markup}.

To write a **block of code**, surround your block with a pair of 3 backticks <code class="language-markup">\`\`\`</code>.  
To highlight it, provide the alias of the language for the block just after the first 3 backticks.  
We'll take the previous example and highlight it as a block :

<pre><code class="language-markup">
```css
p { color: red }
```
</code></pre>

We'll get the following output :

```css
p {
	color: red;
}
```

⚠️ **The alias of the code language**, inline or block, **is always lowercase** ⚠️

Visit the [supported languages by Prism](https://prismjs.com/#supported-languages) to get the correct alias if you're unsure.

## Ids for H2 till H4 in Markdown {# ids in markdown}

Adding an `id`{language=markup} attribute to a heading tag, H2 till H4 only, is an optional activated feature by default.

This feature was built with edge cases and typing typos in mind :

-   Regex to match curly braces ignoring everything before the last hashtag
-   Replace accented characters, by their non accented letter
-   Replace upper case letters by lower case one
-   Remove special characters except hyphen and underscore
-   Replace any number of underscore by one hyphen
-   Replace any number of space by one hyphen
-   Remove any number of hyphen at the beginning
-   Replace any number of hyphen by one hyphen only
-   Remove any number of hyphen at the end

To add an `id`{language=markup}, add a curly braces with a hashtag followed by the id's text.  
The following examples will give you a better idea :

```markdown
<!-- Heading tags with an id property -->

## My awesome H2 title {# my-awesome-h2-title}

The HTML output will be : <h2 id="my-awesome-h2-title">My awesome H2 title</h2>

### My awesome H3 title {# my awesome h3 title}

The HTML output will be : <h3 id="my-awesome-h3-title">My awesome H3 title</h3>

#### My awesome H4 title {# My awesome H4 title}

The HTML output will be : <h4 id="my-awesome-h4-title">My awesome H4 title</h4>
```

Every White-space is automatically replaced by a hyphen and any number of consecutive hyphens are replaced by one hyphen only.  
Any number of hyphen at the beginning or the end of the id's text are removed so the following is also valid :

```markdown
## My awesome H2 title { # ----- My ----- aWEsOMe ----- h2 ----- tITlE ----- }

Whatever the number of white-space characters / hyphens is at the beginning,
between the words or at the end, the HTML output will still be :

<h2 id="my-awesome-h2-title">My awesome H2 title</h2>
```

Anything before the **last** hashtag `#`{language=markup} is ignored and special characters in the id's text are ignored too :

```markdown
## My awesome H2 title { /!@# a comment ?%^& # -my= awesome+ h2 \ ( title ) | }

The HTML output will be : <h2 id="my-awesome-h2-title">My awesome H2 title</h2>
```

⚠️ Please be aware that the following special characters, if used **inside the id's text** after the **last** hashtag `#`{language=markup}, will not be deleted :

```txt
& will be parsed to amp (ampersand)
" will be parsed to quot (quotation)
> will be parsed to gt (greater then)
< will be parsed to lt (less then)
```

As an example :

```markdown
## Honey & Bees {#Honey & Bees}

The HTML output will be : <h2 id="honey-amp-bees">Honey & Bees</h2>
```

At build time, predefined ids will be generated into the HTML of the static site.

If you wish to disable this feature, set the `addIdsToHeadings`{language=markup} value to `false`{language=markup} in the [Settings page](/admin-config-site#ids-for-headings).

## The Gallery ! {# gallery }

Finally here !  
Since Blog-Doc turned into a CMS, I've planned to add a gallery and a way to retrieve images for the pages and posts directly.  
Now it's almost done. Almost, because there is always space to bring on improvements.  
For now, you can visit the gallery by hitting the `/admin-gallery`{language=markup} route, or go to the [Administration page](/admin) and click on the **Gallery** link in the menu or it's card.

In the global spirit of Blog-Doc, [The Galley](/admin-gallery) is pretty simple to use.  
You'll find a drop zone where you can drop your image(s) or click on it and choose the image(s) you wish to upload.  
⚠️ Once an image added, it will be directly uploaded to the **images** folder but will not be available yet in the gallery, you **MUST** click on the **Add image(s) ✅** button to add the image(s) to the gallery !

You can also delete an image from the gallery by clicking on it's **&#10008; DELETE** button.

Finally, to assign an image to a page or a post, you can, while creating or updating, choose an image from the gallery by selecting it directly from the page or post.

## What's next ?

I intend to make a lot of improvements to this app in my short free time.

You can take Blog-Doc as a prototype and modify it totally to use it with another design and/or another template language (I use the one and only plain JavaScript [EJS](https://ejs.co/)).

I really hope that this app will be useful in any way for a lot of people out there, I'm considering it as my personal contribution to the Node.js, Express, EJS and Markdown communities.

Ideas, comments and suggestions are most welcome.

SYA,
LebCit
