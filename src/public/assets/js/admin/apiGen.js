const gen_input = document.querySelector('.gen_input')
let btn_gen = document.querySelector('.btn_gen')
const wrap_btn_gen = document.querySelector('.wrap_btn_gen')
const list_group = document.querySelector('.list-group')


window.addEventListener('load', function () {
  fetch('http://localhost:8000/admin/apiGen/gen').then(res => res.json()).then(res => {
    let key_items = ''
    res.forEach(key => {
      key_items += list_key(key.key)
    })
    list_group.innerHTML = key_items
  })
})

function list_key(key) {
  return `
    <li class="list-group-item">
      <span>${key}</span>
      <button type="button" class="btn btn-danger float-end btn_delete">Delete</button>
    </li>
  `
}


document.addEventListener('click', function (el) {
  if (el.target.classList.contains('btn_gen')) {
    wrap_btn_gen.innerHTML = loading
    fetch('http://localhost:8000/admin/apiGen/gen', {
      method: 'post'
    }).then(res => {
      wrap_btn_gen.innerHTML = btn_gen_after
      gen_input.removeAttribute('disabled')
    }).catch(res => console.log(res.json()))

    fetch('http://localhost:8000/admin/apiGen/gen').then(res => res.json()).then(res => {
      let key_items = ''
      res.forEach(key => {
        key_items += list_key(key.key)
        gen_input.value = key.key
      })
      list_group.innerHTML = key_items
    })
  }
})

document.addEventListener('click', function (btn) {
  if (btn.target.classList.contains('btn_delete')) {
    const conf = confirm('Yakin?')
    if (conf) {
      fetch('http://localhost:8000/admin/apiGen/gen', {
        method: 'delete',
        body: new URLSearchParams(`key=${btn.target.parentElement.childNodes[1].textContent.trim()}`)
      }).then(res => console.log(res))
      window.location.reload()
    }
  }
})



const btn_gen_after = `
  <button class="btn btn-dark btn_gen" type="button">Generate</button>
`

const loading = `
  <div class="spinner-border" role="status">
    <button class="visually-hidden">Loading...</button>
  </div>
`