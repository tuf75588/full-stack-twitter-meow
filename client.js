console.log(`hello world!`);
const form = document.querySelector('.mew-form');
const loading = document.querySelector('.loading');
loading.style.display = 'none';
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
  console.log(mew);
  form.style.display = 'none';
  loading.style.display = '';
  fetch('http://localhost:5000/mews?origin=*', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(mew)
  });
});
