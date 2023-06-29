import {getLibs} from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function getForm(ft) {
  const formButton = createTag('button', {}, ft.textContent);
  const nameInput = createTag('input', {type: 'text', placeholder: 'name'});
  const emailInput = createTag('input', {type: 'text', placeholder: 'name'});
  const form = createTag('form', {}, [nameInput, emailInput, formButton]);

  formButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    const data = { name, email };
    const submitData = { data };

    const resp = await fetch('/email-list' , {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( { data} ),
    });
    if (!resp.ok) console.log('Uh oh');
    const x = await resp.json();
    console.log(x);
  }); 

  return form;
}

export default async function init(el) {
  const titles = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p')];
  el.innerHTML = '';
  const masterList = createTag('ul');
  const resp = await fetch('/email-list.json');
  if (!resp.ok) return;
  const json = await resp.json();
  json.data.forEach(element => {
    const person = createTag('li', {}, `${element.name}`);
    masterList.append(person)
  });

  const listTitle = titles.shift();
  const submitTitle = titles.shift();

  const form = getForm(titles.shift());

  el.append(listTitle, masterList, submitTitle, form);
}
