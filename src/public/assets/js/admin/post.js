// const inputThumbnail = document.querySelector('#inputThumbnail')
// const inputTitle = document.getElementById('inputTitle')
// const inputContent = document.getElementById('inputContent')

// window.addEventListener('click', (btn) => {
//   if (btn.target.classList.contains('btn_post')) {
//     fetch('localhost:8000/admin/post', {
//       method: 'post',
//       body: new URLSearchParams(`image=${inputThumbnail.files[0]}&title=${inputTitle.value}&content=${inputContent.value}`)
//     }).then(res => cosole.log(res)).catch(res => console.log(res))
//   }
// })