const input = document.querySelector('#email');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if(!isValid){
    console.log(e.target.getAttribute("data-error"))
     console.log(e.target.value);
  }
  else{console.log(e.target.value);}
  
 
}); 