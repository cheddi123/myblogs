

tinymce.init({
  selector: '#textArea1'
});

/* const input = document.querySelector('#email');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if(!isValid){
    console.log(e.target.getAttribute("data-error"))
     console.log(e.target.value);
  }
  else{console.log(e.target.value);}
  
 
});  */



setTimeout(()=> {
  const alert= document.querySelector("#alert")
  if(alert){
    console.log("Alert class removed")
   alert.remove();
  }
   
 
}, 5000);  