'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors',
  optArticleAuthorSelector = '.post-author';

function titleClickHandler(event){

  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLink = document.querySelector('.titles a.active');
  if (activeLink) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticle = document.querySelector('.posts .post.active');
  activeArticle.classList.remove('active');

  /* get 'href' attribute from the clicked link */
  const hrefAttr = clickedElement.getAttribute('href');
  document.querySelector(hrefAttr).classList.add('active');
}

// GENERATE LINK LIST

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  /* create empty html variable */
  let html ='';
  /* for each article */

  for(let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
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
  const tagsParams = {
    min: minimum,
    max: maximum
  };
  return tagsParams;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    /* split tags into array */
    const tagsArray = tags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of tagsArray) {
      /* generate HTML of the link */
      const linkHtml = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>' + ' ';
      /* add generated code to html variable */
      html = html + linkHtml;
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
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  /*[NEW] create variable for all links HTML code */
  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>';
    allTagsHTML += tagLinkHTML;
    /*[NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
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
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* remove active */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
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
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* find author */
    const author = article.getAttribute('data-author');
    /* create html of the link */
    const authorHtml = '<a href="#author-' + author + '">' + author + '</a>';
    /* add html of the link to wrapper */
    authorWrapper.innerHTML = authorHtml;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(author)){
      /* [NEW] add tag to allTags object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }
  let authorHtml = '';
  for(let author in allAuthors) {
    authorHtml = authorHtml + '<li><a href="#author-' + author + '">' + author + '</a>' + '<span> (' + allAuthors[author] + ')</span></li>';
  }
  document.querySelector(optAuthorsListSelector).innerHTML = authorHtml;
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
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* remove active */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for(let authorLink of authorLinks) {
    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
