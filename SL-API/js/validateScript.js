var form = document.getElementById("myForm");
function handleForm(event) { event.preventDefault(); test();} 
form.addEventListener('submit', handleForm);

const test = () => {
    alert("HELLO!");
}