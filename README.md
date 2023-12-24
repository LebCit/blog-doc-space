# Blog-Doc

The Simplest Node.js CMS & SSG!<br />
A tiny flame in the darkness of error...

> [!IMPORTANT]  
> This documentation no longer represents the diverse features of Blog-Doc. Kindly consult the comprehensive [documentation](https://blog-doc.pages.dev/) for up-to-date information on Blog-Doc's functionalities.

## Blazing fast and simple 🚀

-   A zero code configuration static site generator.
-   Ready to use as a Node.js CMS.
-   Without any unnecessary functionalities, loads in a blink of an eye.
-   Easy to install and use.

## Design 🎨

-   Responsive, elegant and simple layout.
-   Ready to use template for blog and/or documentation.
-   Easy to modify if you opt for another design.

## Features

-   Administrate your app from the front-end!
-   [Themes](#themes) to change the look and feel of your site! (**COMING SOON TO SPACE**)
-   [Gallery](#the-gallery) to upload your images
-   Create, Read, Update & Delete your pages and posts
-   Paginated blog with chosen number of posts per page
-   Posts pagination to navigate between your posts
-   Write your content in Markdown
-   Ability to use HTML in Markdown
-   Tag(s) for posts
-   Featured image for posts and pages
-   Archive route for posts
-   Tags list route
-   Individual route for each tag
-   Titles & Meta Descriptions
-   Drag and drop your menu links to sort them
-   [RSS feed](#rss)
-   [Sitemap](#sitemap)
-   [Search](#search)
-   [Code highlighting](#code-highlighting) with [highlight.js](https://highlightjs.org/)
-   [Ids for H2 till H4 in Markdown](#ids-for-h2-till-h4-in-markdown)
-   No need for hot reloading in development mode (**INFO FOR DEVELOPERS**)

## How to install Blog-Doc?

To install Blog-Doc on Space, head over its [installation page](https://deta.space/discovery/@lebcit/blocdoc) and click on the `Install App` button.

Once installed, open the app from your [Horizon](https://deta.space/docs/en/use/interface#horizon) or by [accessing the builder instance](https://deta.space/docs/en/build/fundamentals/development/builder-instance#accessing-a-builder-instance) of the app and clicking on the `Open Builder Instance` button.

You will be redirected to the app's address and see in your browser the following message: `Route Not Found`.<br />
Please don't freak out! I've tried some other ways, but this is the simplest and most secure one.

Now assuming that your instance of Blog-Doc has the following address:<br />
`https://abc-1-x234.deta.app`, in the [address bar](https://en.wikipedia.org/wiki/Address_bar) of your browser.<br />
Add after it `/admin-blog-doc-config`, the address is now:<br />
`https://abc-1-x234.deta.app/admin-blog-doc-config`, hit enter.<br />
You'll be redirected to a page that will guide you on setting the main configuration to begin using Blog-Doc, 2 easy steps of 2 minutes.<br />
At the end you'll submit a form, it takes at most 30 seconds to upload the configuration, then you'll be redirected to the initial address `https://abc-1-x234.deta.app` and see once again: `Route Not Found`.<br />
Again don't panic! Just add `/pages/documentation`` after the address. Browse inside the app for a minute (time for the code to interact with the newly created drive) without visiting the home route, then go to the main route and begin to use your own instance of Blog-Doc 🎉<br />
If it doesn't work from the first time do it again once more and it will.

## RSS!

⚠️ You **MUST** provide the **live URL** of your site in the **Settings page** under the administration by modifying the `siteURL` value before deploying the application.

_Nota Bene : the live URL **MUST** end with a slash `/`_

Of course, you **MUST** also modify `siteTitle`, `siteDescription` and `rssCopyright` in the Settings page.  
You **SHOULD** replace the `siteTitle`, `siteDescription` and `rssCopyright` **values** with the ones of your site.  
You **MAY** replace the `rssSiteLanguage` value with the language of your site.  
A list of available language codes can be found on the [RSS language codes page](https://www.rssboard.org/rss-language-codes).

[⬆️ Back to features](#features)

## Sitemap

Like the RSS feed, you **MUST** provide the **live URL** of your site in the Settings page by modifying the `siteURL` value to generate the correct links for each page, post, tag and template as well as for the blog routes.  
Please remember that the **Site URL** **MUST** end with a slash `/`

You can check the sitemap of your site under the `/sitemap` route.

[⬆️ Back to features](#features)

## Search

Blog-Doc has a built-in search feature.  
The search functionality allows a user to make a research on **the titles** and **the contents** of the posts.

You can check the search of your site under the `/search` route.

You can disable the search in the Node.js app as well as for the generated static site by giving `searchFeature` a value of `false` in the Site Settings page.

[⬆️ Back to features](#features)

## Code highlighting

Blog-Doc uses [highlight.js](https://highlightjs.org/) to highlight **block of code**.

To write **inline code**, surround your code with backticks <code>\`\`</code>.  
To highlight it, provide the language for the **inline code** by putting after it a curly braces with the alias of the language of the code.  
The following examples will give you a better idea.  
Assuming this `css` line `p : color { red }`, to highlight it you'll write <code>\`p { color: red }\`{language=css}</code>.  
The code is surrounded with backticks <code>\`\`</code> and followed by `{language=alias of code language}`.

To write a **block of code**, surround your block with a pair of 3 backticks <code>\`\`\`</code>.  
To highlight it, provide the alias of the language for the block just after the first 3 backticks.  
We'll take the previous example and highlight it as a block :

<pre><code>
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

Visit the [Supported Languages of highlight.js](https://highlightjs.readthedocs.io/en/latest/supported-languages.html) to get the correct alias if you're unsure.

Alternatively, you can write a block of code without providing an alias, highlight.js will automatically detect the language.<br />
If the highlighter fails to detect the correct language for a block of code without an alias, just add the desired language to the block as indicated above.

[⬆️ Back to features](#features)

## Ids for H2 till H4 in Markdown

Adding an `id` attribute to a heading tag, H2 till H4 only, is an optional activated feature by default.

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

To add an `id`, add a curly braces with a hashtag followed by the id's text.  
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

Every Whitespace is automatically replaced by a hyphen and any number of consecutive hyphens are replaced by one hyphen only.  
Any number of hyphen at the beginning or the end of the id's text are removed so the following is also valid :

```markdown
## My awesome H2 title { # ----- My ----- aWEsOMe ----- h2 ----- tITlE ----- }

Whatever the number of whitespace characters / hyphens is at the beginning,
between the words or at the end, the HTML output will still be :

<h2 id="my-awesome-h2-title">My awesome H2 title</h2>
```

Anything before the **last** hashtag is ignored and special characters in the id's text are ignored too :

```markdown
## My awesome H2 title { /!@# a comment ?%^& # -my= awesome+ h2 \ ( title ) | }

The HTML output will be : <h2 id="my-awesome-h2-title">My awesome H2 title</h2>
```

⚠️ Please be aware that the following special characters, if used **inside the id's text** after the **last** hashtag, will not be deleted :

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

If you wish to disable this feature, set the `addIdsToHeadings` value to `false` in the Site Settings page.

[⬆️ Back to features](#features)

## The Gallery!

Since Blog-Doc turned into a CMS, I've planned to add a gallery and a way to retrieve images for the pages and posts directly.  
Now it's almost done. Almost, because there is always space to bring on improvements.  
For now, you can visit the gallery by hitting the `/admin/gallery/images` route, or go to the Administration page and click on the **Gallery** link in the menu or it's card.

In the global spirit of Blog-Doc, The Galley is pretty simple to use.  
You'll find a drop zone where you can drop your image(s) or click on it and choose the image(s) you wish to upload.  
⚠️ Once an image added, it will be directly uploaded to the **images** folder but will not be available yet in the gallery, you **MUST** click on the **Add image(s) ✅** button to add the image(s) to the gallery!

You can also delete an image from the gallery by clicking on it's **&#10008; DELETE** button.

Finally, to assign an image to a page or a post, you can, while creating or updating, choose an image from the gallery by selecting it directly from the page or post.

[⬆️ Back to features](#features)

## Themes

(coming soon to Space)

You can switch between themes and choose the design that suites your needs.

Blog-Doc comes with:

-   A default theme based on the [Responsive Side Menu Layout of Pure.css](https://purecss.io/layouts/side-menu/)
-   A clean-blog theme based on [Clean Blog](https://startbootstrap.com/theme/clean-blog) from [Start Bootstrap](https://startbootstrap.com/)

If a picture is worth a thousand words, a video is worth a million!<br />
[A 30 seconds video](https://youtu.be/qaulkcZ-yu8) showing the ability to instantly change the look and feel of your site with Blog-Doc.

**I'll be adding more themes to Blog-Doc over time.**<br />
If you've coded a theme for Blog-Doc and wish to list it among the available themes, you can let me know in the Discussions of Blog-Doc's repository under the [Ideas](https://github.com/LebCit/blog-doc/discussions/categories/ideas) category.<br />
Please keep in mind that Blog-Doc themes **MUST** only use plain JavaScript and cannot contain any code or image(s) that have publishing and/or distribution restrictions!

[⬆️ Back to features](#features)

## Technical information for developers

### Motivation & Purpose

_With all due respect to the time and hard work of every developer who made a Static Site Generator with Node.js, **including the previous versions of Blog-Doc**, those are gasworks!_<br />
_I offer my sincerest apologies in advance to each one of these developers, but an app is not supposed to be a gasworks..._<br />
While the following posts are no more relevant to the actual version of Blog-Doc they explain quite well my motivation and may shock you.

**Please read** [From 145 to 7 💪](https://lebcit.github.io/posts/from-145-to-7/)<br />
**Also read** [The New Blog-Doc](/posts/the-new-blog-doc)<br />
**Also read** [node_modules is not heavy, developers are lazy!](https://lebcit.github.io/posts/node-modules-is-not-heavy-developers-are-lazy/)

### Solid stack of technologies 🪨

#### Backend (input)

-   Node.js 16.x or higher.
-   [Velocy](https://github.com/ishtms/velocy), A blazing fast, minimal backend framework for Node.js .
-   [Eta](https://eta.js.org/), lightweight, powerful, pluggable embedded JS template engine.
-   [Marked](https://marked.js.org/), Markdown parser and compiler. Built for speed.
-   [formidable](https://github.com/node-formidable/formidable), The most used, flexible, fast and streaming parser for multipart form data.
-   And [deta](https://www.npmjs.com/package/deta) for the [Drive SDK](https://deta.space/docs/en/build/reference/sdk/drive).

**Blog-Doc for Space now uses only 14 modules (1916.1 KB or 1.9161 MB) instead of 131 (10082 KB or 10.082 MB)!**

## FAQ

<details>
	<summary>I have an issue!</summary>
	<p>
		Go to the
		<a href="https://github.com/LebCit/blog-doc-space/issues">Issues page of Blog-Doc Space on GitHub</a>
		and create a New issue by explaining as much as possible the problem you're facing.
	</p>
</details>

<details>
	<summary>I have an idea!</summary>
	<p>
		Go to the
		<a href="https://github.com/LebCit/blog-doc-space/discussions/categories/ideas">
			Ideas of Blog-Doc Space on GitHub
		</a>
		and tell me about it.
	</p>
</details>

<details>
	<summary>Why the SSG is not in Blog-Doc on Space?</summary>
	<p>
		Including the SSG in Blog-Doc on Space requires some architecture modifications.
		<br />
		I'll consider later on to include the SSG or not depending on Blog-Doc's usage and requirements on Space.
	</p>
</details>

<details>
	<summary>When I open the app I get: Route Not Found!</summary>
	<p>
		Please read the
		<a href="#how-to-install-blog-doc">installation section.</a>
	</p>
</details>

## What's next ?

I intend to make a lot of improvements to this app in my short free time.

You can take Blog-Doc as a prototype and modify it totally to use it with another design and/or another template language.

I really hope that this app will be useful in any way for a lot of people out there, I'm considering it as my personal contribution to the Node.js and Markdown communities.

Ideas, comments and suggestions are most welcome.

SYA,
LebCit

Built with ❤️ by [LebCit](https://lebcit.github.io/)
