let likeCount;

document.addEventListener("DOMContentLoaded", () => {
  const forumCards = document.querySelectorAll(".card-forum[data-forumslug]");

  forumCards.forEach((card) => {
    card.addEventListener("click", () => {
      const forumSlug = card.getAttribute("data-forumslug");
      window.location.href = `/forum/${forumSlug}`;
    });
  });
});

const unlikeButtons = document.querySelectorAll(".unlike-button");
unlikeButtons.forEach((unlikeButton) => {
  unlikeButton.addEventListener("click", async function () {
    //Mencari elemen induk dari tombol like yaitu span
    const forumSpan = this.parentNode;
    //const forumSpan = this.closest(".forum-id");
    const forumId = forumSpan.dataset.forumid;
    console.log(forumId);

    let data;
    try {
      const response = await fetch("/forum/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forumId,
        }),
      });

      if (response.ok) {
        const likeCount = await response.json();
        unlikeButton.classList.add("d-none");

        const likeButton = forumSpan.querySelector(".like-button");
        likeButton.classList.remove("d-none");

        const likeText = forumSpan.querySelector(".like-count");
        likeText.textContent = likeCount;
      } else {
        console.error("failedd");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

const likeButton = document.querySelectorAll(".like-button");
likeButton.forEach((likeButton) => {
  likeButton.addEventListener("click", async function () {
    //Mencari elemen induk dari tombol like yaitu span
    const forumSpan = this.parentNode;
    //const forumSpan = this.closest(".forum-id");
    const forumId = forumSpan.dataset.forumid;

    const response = await fetch("/forum/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        forumId,
      }),
    });

    if (response.ok) {
      const likeCount = await response.json();

      likeButton.classList.add("d-none");

      const unlikeButton = forumSpan.querySelector(".unlike-button");
      unlikeButton.classList.remove("d-none");
      const likeText = forumSpan.querySelector(".like-count");
      likeText.textContent = likeCount;
      //likeCountDataset = likeCount;
    } else {
      console.error("failed");
    }
  });
});

const unbookmarkButton = document.querySelectorAll(".unbookmark-button");
unbookmarkButton.forEach((unbookmarkButton) => {
  unbookmarkButton.addEventListener("click", async function () {
    //Mencari elemen induk dari tombol like yaitu span
    const forumSpan = this.parentNode;
    //const forumSpan = this.closest(".forum-id");
    const forumId = forumSpan.dataset.forumid;
    console.log(forumId);

    let data;
    try {
      const response = await fetch("/forum/bookmark", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forumId,
        }),
      });

      if (response.ok) {
        const unbookmarkCount = await response.json();
        ununbookmarkButton.classList.add("d-none");

        const unbookmarkButton = forumSpan.querySelector(".unbookmark-button");
        unbookmarkButton.classList.remove("d-none");

        const unbookmarkText = forumSpan.querySelector(".bookmark-count");
        unbookmarkText.textContent = unbookmarkCount;
      } else {
        console.error("failedd");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

const bookmarkButton = document.querySelectorAll(".bookmark-button");
bookmarkButton.forEach((bookmarkButton) => {
  bookmarkButton.addEventListener("click", async function () {
    //Mencari elemen induk dari tombol like yaitu span
    const forumSpan = this.parentNode;
    //const forumSpan = this.closest(".forum-id");
    const forumId = forumSpan.dataset.forumid;

    const response = await fetch("/forum/unbookmark", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        forumId,
      }),
    });

    if (response.ok) {
      const bookmarkCount = await response.json();

      bookmarkButton.classList.add("d-none");

      const bookmarkButton = forumSpan.querySelector(".bookmark-button");
      bookmarkButton.classList.remove("d-none");
      const bookmarkText = forumSpan.querySelector(".bookmark-count");
      bookmarkText.textContent = bookmarkCount;
      //likeCountDataset = likeCount;
    } else {
      console.error("failed");
    }
  });
});

const textareas = document.querySelectorAll(".auto-resize");

textareas.forEach((textarea) => {
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
});

const comment = document.querySelector(".comment-class");
comment.addEventListener("click", function (e) {
  e.preventDefault();
  commentInput = document.querySelector(".comment-form");
  commentInput.focus();
});

// Fungsi untuk memformat tanggal
// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const now = new Date();

//   const diffInSeconds = Math.floor((now - date) / 1000);
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   const diffInDays = Math.floor(diffInHours / 24);

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds} seconds ago`;
//   } else if (diffInMinutes < 60) {
//     return `${diffInMinutes} minutes ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours} hours ago`;
//   } else if (diffInDays < 7) {
//     return `${diffInDays} days ago`;
//   } else {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return date.toLocaleDateString("id-ID", options);
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const dates = document.querySelectorAll(".date");

//   fetch('/forum')
//     .then(response => response.json())
//     .then(forums => {
//       forums.forEach(forum => {
//         const forumElement = createForumElement(forum);
//         forumContainer.appendChild(forumElement);
//       });
//     })
//     .catch(error => {
//       console.error('Error fetching forums:', error);
//     });

//   dates.forEach((date, index) => {
//     console.log(date.textContent);
//     date.textContent = formatDate(date.textContent);
//   });
// });

// const comment = document.querySelector(".comment-class");
// comment.addEventListener("click", function (e) {
//   e.preventDefault();
//   commentInput = document.querySelector(".comment-form");
//   commentInput.focus();
// });
