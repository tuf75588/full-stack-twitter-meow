console.log(`hello world!`);
const form = document.querySelector('.mew-form');
const loading = document.querySelector('.loading');
const mewSection = document.querySelector('.mews');
const API_URL =
  window.location.hostname === 'localhost' ? 'http://localhost:5000/mews' : 'https://server-qrsmfjgkqz.now.sh/mews';
//show the spinner by default while we grab all of the mew objects from the database.
loading.style.display = '';
listAllMews();

form.addEventListener('submit', () => {
  event.preventDefault();
  console.log('clicked!');
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');
  const mew = {
    name,
    content
  };

  form.style.display = 'none';
  loading.style.display = '';
  fetch(API_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(mew)
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      form.reset();
      setTimeout(() => {
        form.style.display = '';
      }, 5000);
      listAllMews();
    });
});
function listAllMews() {
  mewSection.innerHTML = '';
  fetch(API_URL)
    .then((response) => {
      return response.json();
    })
    .then((mews) => {
      mews.reverse();
      loading.style.display = 'none';
      mews.forEach((mew) => {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        const contents = document.createElement('p');
        const date = document.createElement('small');
        date.textContent = new Date(mew.created);
        header.textContent = mew.name;
        contents.textContent = mew.content;
        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);
        mewSection.appendChild(div);
      });
      loading.style.display = 'none';
    });
}
