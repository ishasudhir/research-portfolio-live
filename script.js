document.getElementById('newPostBtn').addEventListener('click', () => {
  const title = prompt("Enter your research project title:");
  if (!title) return;

  const postDiv = document.createElement('div');
  postDiv.classList.add('post');
  postDiv.textContent = title;

  document.getElementById('postList').appendChild(postDiv);
});
