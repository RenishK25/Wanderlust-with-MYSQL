(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

let show_gst_btn = document.getElementById("show_gst_btn");

  show_gst_btn.addEventListener("click", () => {

    let taxes = document.getElementsByClassName("taxes");
    for(taxe of taxes){
      if(show_gst_btn.checked){
        taxe.style.display = "inline-block";
      }else{
        taxe.style.display = "none";
      }
    }
  })