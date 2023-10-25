// https://jsonplaceholder.typicode.com/guide/

async function downloadPosts(page = 1) {
 const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
 const response = await fetch(postsURL);
 const articles = await response.json();
 return articles;
}

async function downloadComments(postId) {
 const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
 const response = await fetch(commentsURL);
 const comments = await response.json();
 return comments;
}

async function getUserName(userId) {
 const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
 const response = await fetch(userURL);
 const user = await response.json();
 return user.name;
}

function getArticleId(comments) {
 const article = comments.previousElementSibling;
 const data = article.dataset;
 return data.postId;
}

const details = document.getElementsByTagName("details");
for (const detail of details) {
 detail.addEventListener("toggle", async (event) => {
  if (detail.open) {
   const asides = detail.getElementsByTagName("aside");
   const commentsWereDownloaded = asides.length > 0;
   if (!commentsWereDownloaded) {
    const articleId = getArticleId(detail);
    const comments = await downloadComments(articleId);
    console.log(comments);
   }
  }
 });
}

function articles(post) {
 const article = document.createElement("article");
 article.dataset.postId = post.id;

 const h2 = document.createElement("h2");
 h2.innerHTML = post.title;

 const aside = document.createElement("aside");
 const span = document.createElement("span");

 getUserName(post.userId)
  .then((name) => {
   span.innerHTML = name;
  });

 const p = document.createElement("p");
 p.innerHTML = post.body.replaceAll("\n", "<br>");

 aside.appendChild(span);
 article.appendChild(h2);
 article.appendChild(aside);
 article.appendChild(p);

 return article;
}

function detail(postId) {
 const details = document.createElement("details");
 const summary = document.createElement("summary");
 summary.innerHTML = "See what our readers had to say...";
 const section = document.createElement("section");
 const header = document.createElement("header");
 const h3 = document.createElement("h3");

 h3.innerHTML = "Comments";

 header.appendChild(h3);
 section.appendChild(header);
 details.appendChild(summary);
 details.appendChild(section);

 details.addEventListener("toggle", async (event) => {
  if (details.open) {
   const comments = await downloadComments(postId);
   comments.forEach((comment) => {
    section.appendChild(createComment(comment));
   });
  }
 });

 return details;
}

function createComment(comment) {
 const aside = document.createElement("aside");
 const p1 = document.createElement("p");
 p1.innerHTML = comment.body.replaceAll("\n", "<br>");
 const p2 = document.createElement("p");
 p2.innerHTML = `${comment.name}`;
 aside.appendChild(p1);
 aside.appendChild(p2);
 return aside;
}

(async () => {
 const main = document.querySelector("main");
 const posts = await downloadPosts(5);
 console.log(posts);

 posts.forEach((post) => {
  main.appendChild(articles(post));
  main.appendChild(detail(post.id));
 });
})();
