---
title: Archive and tags
date: 2022/10/20
description: Archive and tags pages
featuredImage: /images/archive-and-tags.webp
tags: [Archive,Tags,Blog-Doc]
---
The archive and tags pages are very similar to the blog as mentioned before, except that they have no pagination. The archive is a reversed chronological list of all the posts in the blog, while the tags is an alphabetical ordered list of all the tags used in all the posts with the number of occurrence for each tag.  
In this post, we'll explore how those pages work behind the scene aka server-side.

## Archive route

Under the **routes** folder, the first file is `archiveRoute.js`{language=markup}. This tiny file collects all the posts and displays them on the `/posts`{language=markup} route using the `base.ejs`{language=markup} template located in the **layouts** folder under the **views** folder.

To understand the archive route file, you'll have to read the following posts :

1. [Express global router for a DRY code](https://lebcit.github.io/posts/express-global-router-for-a-dry-code/)
2. [Markdown blog with EJS](https://lebcit.github.io/posts/markdown-blog-with-ejs/)

The first post shoes us how to parse an express router to a global router variable. The second one is **very important** to understand the logic behind the process of writing in Markdown and rendering it on the front-end.

### Modifying archive's route

To modify the route on which the list of all the posts is displayed, you just have to change `/posts`{language=markup} on line 18 inside `archiveRoute.js`{language=markup} to whatever suits you. As an example, you can change it to `/archive`{language=markup} and the list will now be available on this route instead of the previous one.

> _Nota Bene : whenever you make a change, always check through the whole app for changes to be made according to the one you're making !_

## Tags route

Under the **routes** folder, the last file is `tagsRoute.js`{language=markup}. This file has 2 tasks :

1. Display all the tags in the blog's posts
2. Display all the posts for a particular tag

The first task is accomplished by a function, defined in the `postsByTagCount.js`{language=markup} file under the **functions** folder, that creates an array of the tags from all the posts and sort them alphabetically then count the occurrence of each tag in this tags' array and return the result as an object.  
The function is imported to `tagsRoute.js`{language=markup} on line 4 :

```js
import { postsByTagCount } from "../functions/postsByTagCount.js"
```

The function is then passed to the `/tags`{language=markup} route, `postsByTagCount: postsByTagCount()`{language=markup}, where we loop through the resulting object in `postsByTagCount.ejs`{language=markup} on line 2 :

```js
for (const property in postsByTagCount)
```

Then we check inside the loop, on line 4, if each tag exists and it's value is greater than 0, to avoid displaying a null tag in the list of tags if one or more post have no tag(s) :

```js
if (property !== "null" && property !== "undefined")
```

### Tag route

The second task, leading to the display of all the posts for a particular tag, begins with a simple function living in the `postsByTagList.js`{language=markup} file under the **functions** folder. This function, with a `(tag)`{language=markup} parameter, filters the posts to retrieve an array of post(s) including the requested tag, otherwise it returns an empty array.  
The function is imported in `tagsRoute.js`{language=markup} on line 5 :

```js
import { postsByTagList } from "../functions/postsByTagList.js"
```

This function is used with the requested parameter (the requested tag) on line 33 inside the dynamic route `"/tags/:tag"`{language=markup} :

```js
const tag = req.params.tag
const postsByTag = postsByTagList(tag)
```

Finally `postsByTag`{language=markup} is passed through the dynamic route as a data object :

```js
posts: postsByTag
```

This data object, the array of post(s) related to a single tag, is sent to the `base.ejs`{language=markup} file in the **layout** folder under the **views** folder, where it will be used by the `index.ejs`{language=markup} file living in the same folder :

```js
// index.ejs | line 2
posts.forEach((post, index) => {...})
```

The file `index.ejs`{language=markup} is responsible of the look and feel of each and every post's preview. I'll be talking later on about this file in details.

A last thing to mention in the dynamic route is that if the returned array is empty, not even one post is related to the requested tag, the 404 error page is rendered.  
Try to hit a tag route that doesn't exists, as an example : [inexistent tag](/tags/INEXISTENTTAG).

### Modifying the tags route

Modifying the tags route is quite simple, all you have to do is to change the path `/tags`{language=markup} in `tagsRoute.js`{language=markup} on line 13 to whatever you desire.  
If you change it to `/hashtags`{language=markup}, the list of all available tags will now be displayed on this route instead of the previous one.

### Modifying tags' dynamic route

The route of each individual tag is defined by a parameter `/:tag`{language=markup} in the dynamic route `"/tags/:tag"`{language=markup}. There is absolutely no need to change the parameter by itself !  
Let's say you changed previously `/tags`{language=markup} to `/hashtags`{language=markup}. To keep some logic, you'll have to make the same modification in the dynamic route to `"/hashtags/:tag"`{language=markup}.

> _Nota Bene : whenever you make a change, always check through the whole app for changes to be made according to the one you're making !_

That's all for archive and tags, see you in the next one.
