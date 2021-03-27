const input_email = document.querySelector('#inputEmail1')
const input_user = document.querySelector('#inputUsername')
const input_pass = document.querySelector('#inputPassword')

window.addEventListener('click', function(btn) {
  if (btn.target.classList.contains('btn_register')) {
    fetch('http://localhost:8000/admin/register', {
      method: 'post',
      body: new URLSearchParams(`email=${input_email.value}&username=${input_user.value}&password=${input_pass.value}`)
    }).then(res => {
      if (res.ok) {
        alert('Berhasil Register')
        window.location.replace("http://localhost:8000/admin/login")
      }
    }).catch(res => {
      if (res) {
        alert('error')
      }
    })
  }
})