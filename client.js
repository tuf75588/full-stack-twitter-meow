console.log('Hello World!');

const form = document.querySelector('form'); // grabbing an element on the page
const errorElement = document.querySelector('.error-message');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const loadMoreButton = document.querySelector('#loadMoreButton');
let skip = 0;
let limit = 10;

const API_URL = `https://server-tbmnmbtjlt.now.sh/v2/mews`;

errorElement.style.display = 'none';

listAllMews();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  if (name.trim() && content.trim()) {
    errorElement.style.display = 'none';
    form.style.display = 'none';
    loadingElement.style.display = '';

    const mew = {
      name,
      content
    };

    fetch('https://server-tbmnmbtjlt.now.sh/mews', {
      method: 'POST',
      body: JSON.stringify(mew),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType.includes('json')) {
            return response.json().then((error) => Promise.reject(error.message));
          } else {
            return response.text().then((message) => Promise.reject(message));
          }
        }
      })
      .then(() => {
        form.reset();
        setTimeout(() => {
          form.style.display = '';
        }, 3000);
        listAllMews();
      })
      .catch((errorMessage) => {
        form.style.display = '';
        errorElement.textContent = errorMessage;
        errorElement.style.display = '';
        loadingElement.style.display = 'none';
      });
  } else {
    errorElement.textContent = 'Name and content are required!';
    errorElement.style.display = '';
  }
});

function listAllMews() {
  mewsElement.innerHTML = '';
  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then((response) => response.json())
    .then(({ mews }) => {
      mews.forEach((mew) => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = mew.name;

        const contents = document.createElement('p');
        contents.textContent = mew.content;

        const date = document.createElement('small');
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });

      loadingElement.style.display = 'none';
      loadMoreButton.style.visibility = 'visible';
    });
}
