const input=document.getElementById('photoInput');
const canvas=document.getElementById('passportCanvas');
const ctx=canvas.getContext('2d');
const zoom=document.getElementById('zoom'), moveX=document.getElementById('moveX'), moveY=document.getElementById('moveY');
const downloadBtn=document.getElementById('downloadBtn'), emptyState=document.getElementById('emptyState');
let photo=null;
document.getElementById('year').textContent=new Date().getFullYear();
function draw(){
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!photo)return;
  const cw=canvas.width,ch=canvas.height;
  const scale=Math.max(cw/photo.width,ch/photo.height)*Number(zoom.value);
  const w=photo.width*scale,h=photo.height*scale;
  const extraX=w-cw,extraY=h-ch;
  const x=(cw-w)/2-(Number(moveX.value)/100)*(extraX/2);
  const y=(ch-h)/2-(Number(moveY.value)/100)*(extraY/2);
  ctx.drawImage(photo,x,y,w,h);
}
input.addEventListener('change',e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  if(!file.type.startsWith('image/')){alert('Please choose an image file.');return;}
  const url=URL.createObjectURL(file);const img=new Image();
  img.onload=()=>{photo=img;zoom.value=1;moveX.value=0;moveY.value=0;emptyState.style.display='none';downloadBtn.disabled=false;draw();URL.revokeObjectURL(url);};
  img.onerror=()=>alert('Could not open this image. Please try another photo.');
  img.src=url;
});
[zoom,moveX,moveY].forEach(el=>el.addEventListener('input',draw));
downloadBtn.addEventListener('click',()=>{
  if(!photo)return;
  draw();const a=document.createElement('a');a.download='TIBE-passport-photo-3x4cm.png';a.href=canvas.toDataURL('image/png');a.click();
});
