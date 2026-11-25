const canvas=document.getElementById('passportCanvas');
const ctx=canvas.getContext('2d');
const input=document.getElementById('photoInput');
const zoom=document.getElementById('zoom');
const horizontal=document.getElementById('horizontal');
const vertical=document.getElementById('vertical');
const zoomValue=document.getElementById('zoomValue');
const downloadBtn=document.getElementById('downloadBtn');
const statusEl=document.getElementById('toolStatus');
let photo=null;
function paint(){
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!photo)return;
  const scale=Math.max(canvas.width/photo.width,canvas.height/photo.height)*(Number(zoom.value)/100);
  const w=photo.width*scale,h=photo.height*scale;
  const x=(canvas.width-w)/2+(Number(horizontal.value)/100)*canvas.width*.35;
  const y=(canvas.height-h)/2+(Number(vertical.value)/100)*canvas.height*.35;
  ctx.drawImage(photo,x,y,w,h);
}
input.addEventListener('change',e=>{
 const file=e.target.files&&e.target.files[0];if(!file)return;
 if(!file.type.startsWith('image/')){statusEl.textContent='Please choose an image file.';return;}
 const url=URL.createObjectURL(file);const img=new Image();
 img.onload=()=>{photo=img;paint();downloadBtn.disabled=false;statusEl.textContent='Photo ready. Adjust the crop, then download.';URL.revokeObjectURL(url);};
 img.onerror=()=>{statusEl.textContent='Could not open this image. Try another file.';URL.revokeObjectURL(url);};
 img.src=url;
});
[zoom,horizontal,vertical].forEach(el=>el.addEventListener('input',()=>{zoomValue.textContent=zoom.value+'%';paint();}));
document.getElementById('resetBtn').addEventListener('click',()=>{zoom.value=100;horizontal.value=0;vertical.value=0;zoomValue.textContent='100%';paint();});
downloadBtn.addEventListener('click',()=>{
 if(!photo)return;
 const a=document.createElement('a');a.download='TIBE-passport-photo-3x4.png';a.href=canvas.toDataURL('image/png');a.click();
 statusEl.textContent='PNG prepared. Print at 300 DPI for approximately 3 × 4 cm.';
});
document.getElementById('year').textContent=new Date().getFullYear();
paint();