const input=document.getElementById('photoInput'),canvas=document.getElementById('passportCanvas'),ctx=canvas.getContext('2d');
const zoom=document.getElementById('zoom'),moveX=document.getElementById('moveX'),moveY=document.getElementById('moveY');
const downloadBtn=document.getElementById('downloadBtn'),sheetBtn=document.getElementById('sheetBtn'),emptyState=document.getElementById('emptyState');let photo=null;
document.getElementById('year').textContent=new Date().getFullYear();
function draw(){ctx.fillStyle='#fff';ctx.fillRect(0,0,354,472);if(!photo)return;const scale=Math.max(354/photo.width,472/photo.height)*Number(zoom.value),w=photo.width*scale,h=photo.height*scale,ex=w-354,ey=h-472;ctx.drawImage(photo,(354-w)/2-(Number(moveX.value)/100)*(ex/2),(472-h)/2-(Number(moveY.value)/100)*(ey/2),w,h);}
input.addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Please choose an image file.');return;}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{photo=img;zoom.value=1;moveX.value=0;moveY.value=0;emptyState.style.display='none';downloadBtn.disabled=false;sheetBtn.disabled=false;draw();URL.revokeObjectURL(url);};img.onerror=()=>alert('Could not open this image.');img.src=url;});
[zoom,moveX,moveY].forEach(el=>el.addEventListener('input',draw));
function saveCanvas(c,name){const a=document.createElement('a');a.download=name;a.href=c.toDataURL('image/png');a.click();}
downloadBtn.addEventListener('click',()=>{if(photo){draw();saveCanvas(canvas,'TIBE-passport-photo-3x4cm.png');}});
sheetBtn.addEventListener('click',()=>{if(!photo)return;draw();const sheet=document.createElement('canvas');sheet.width=2480;sheet.height=3508;const s=sheet.getContext('2d');s.fillStyle='#fff';s.fillRect(0,0,sheet.width,sheet.height);
const pw=354,ph=472,gx=30,gy=20,cols=5,rows=7,totalW=cols*pw+(cols-1)*gx,totalH=rows*ph+(rows-1)*gy,startX=Math.round((sheet.width-totalW)/2),startY=Math.round((sheet.height-totalH)/2);
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)s.drawImage(canvas,startX+c*(pw+gx),startY+r*(ph+gy),pw,ph);
saveCanvas(sheet,'TIBE-A4-passport-sheet-35-copies.png');});
