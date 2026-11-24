// Add your studio WhatsApp number with country code, digits only (example: 2519XXXXXXXX).
const STUDIO_WHATSAPP = "";
const menu=document.getElementById("menu"),nav=document.getElementById("nav");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
const fileInput=document.getElementById("photo"),canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),placeholder=document.getElementById("placeholder");
let image=new Image();
fileInput.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);image.onload=()=>{canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;placeholder.hidden=true;draw();URL.revokeObjectURL(url)};image.src=url});
function draw(){if(!image.src)return;ctx.filter=`brightness(${bright.value}%) contrast(${contrast.value}%) saturate(${sat.value}%)`;ctx.drawImage(image,0,0,canvas.width,canvas.height);ctx.filter="none"}
["bright","contrast","sat"].forEach(id=>document.getElementById(id).addEventListener("input",draw));
document.getElementById("download").addEventListener("click",()=>{if(!canvas.width){alert("Please upload a photo first.");return}const a=document.createElement("a");a.download="tibe-edited-preview.png";a.href=canvas.toDataURL("image/png");a.click()});
document.getElementById("bookingForm").addEventListener("submit",e=>{e.preventDefault();if(!STUDIO_WHATSAPP){alert("Booking demo: add your WhatsApp number in script.js to enable sending.");return}const msg=`Booking request%0AName: ${name.value}%0APhone: ${phone.value}%0AService: ${service.value}%0ADetails: ${message.value}`;window.open(`https://wa.me/${STUDIO_WHATSAPP}?text=${msg}`,"_blank")});