'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const hrefAttr = clickedElement.getAttribute('href').replace("#", "");

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const articles = document.querySelectorAll('.posts .post');

  for(let article of articles) {
    if (article.getAttribute('id') == hrefAttr) {   /* add class 'active' to the correct article */
      article.classList.add('active');
    }
  }
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}

// GENERATE LINK LIST

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector);

  /* for each article */

    /* get the article id */

    /* find the title element */

    /* get the title from the title element */

    /* create HTML of the link */

    /* insert link into titleList */

}

generateTitleLinks();
