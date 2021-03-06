'use strict';

// handlebars

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};

// OPTS DECLARATION

const opts = {
  articles: {
    selector: '.post',
    tagsSelector: '.post-tags .list',
  },
  titles: {
    selector: '.post-title',
    listSelector: '.titles',
    linksSelector: '.titles a',
    active: '.titles a.active',
  },
  links: {
    active: 'active',
  },
  tags: {
    selector: '.tags',
    attribute: 'data-tags',
    links: 'a[href^="#tag-"]',
    activeLinks: 'a.active[href^="#tag-"]'
  },
  authors: {
    attribute: 'data-author',
    selector: '.post-author',
    listSelector: '.list.authors',
    links: 'a[href^="#author-"]',
    activeLinks: 'a.active[href^="#author-"]',
  },
  cloud: {
    classCount: 5,
    classPrefix: 'tag-size-',
  },
  posts: {
    active: '.posts .post.active',
  },
};

// FUNCTIONS

function titleClickHandler(event){

  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLink = document.querySelector(opts.titles.active);
  if (activeLink) {
    activeLink.classList.remove(opts.links.active);
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add(opts.links.active);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(opts.posts.active);
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove(opts.links.active);
  }
  /* get 'href' attribute from the clicked link */
  const hrefAttr = clickedElement.getAttribute('href');
  document.querySelector(hrefAttr).classList.add(opts.links.active);
}

// GENERATE LINK LIST

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titles.listSelector);
  titleList.innerHTML = '';
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(opts.articles.selector + customSelector);
  /* create empty html variable */
  let html ='';

  /* for each article */
  for(let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titles.selector).innerHTML;
    /* create HTML of the link  - TITLES IN LEFT SIDEBAR*/
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll(opts.titles.linksSelector);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {
  const numberArray = [];

  for(let tag in tags) {
    numberArray.push(tags[tag]);
  }

  const minimum = Math.min(...numberArray);
  const maximum = Math.max(...numberArray);

  return {
    min: minimum,
    max: maximum
  };

}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloud.classCount - 1) + 1 );

  return opts.cloud.classPrefix + classNumber;

}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articles.selector);

  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.articles.tagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute(opts.tags.attribute);
    /* split tags into array */
    const tagsArray = tags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of tagsArray) {
      /* generate HTML of the link - TAGS UNDER ARTICLES*/
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tags.selector);
  const tagsParams = calculateTagsParams(allTags);
  /*[NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML - TAGS CLOUD*/
    allTagsData.tags.push({
      tag: tag,
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /*[NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll(opts.tags.activeLinks);

  /* remove active */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove(opts.links.active);
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let tagLink of tagLinks) {
    tagLink.classList.add(opts.links.active);
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll(opts.tags.links);

  /* START LOOP: for each link */
  for(let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }

}

addClickListenersToTags();

function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articles.selector);

  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find authors wrapper */
    const authorWrapper = article.querySelector(opts.authors.selector);
    /* find author */
    const author = article.getAttribute(opts.authors.attribute);
    /* create html of the link - ARTICLE AUTHOR*/
    const linkHTMLData = {author: author};
    const authorHTML = templates.authorLink(linkHTMLData);
    /* add html of the link to wrapper */
    authorWrapper.innerHTML = authorHTML;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(author)){
      /* [NEW] add tag to allTags object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }

  //let authorHtml = '';
  const allAuthorsData = {authors: []};

  for(let author in allAuthors) {
    /* AUTHORS LIST IN RIGHT COLUMN */
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    });
  }
  document.querySelector(opts.authors.listSelector).innerHTML = templates.authorListLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeLinks = document.querySelectorAll(opts.authors.activeLinks);

  /* remove active */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove(opts.links.active);
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.add(opts.links.active);
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorLinks = document.querySelectorAll(opts.authors.links);

  /* START LOOP: for each link */
  for(let authorLink of authorLinks) {
    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }

}

addClickListenersToAuthors();
