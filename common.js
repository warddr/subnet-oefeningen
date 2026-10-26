// ---------- IPv4 helpers ----------
function ipToInt(ip){
  if(!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip.trim())) return null;
  const p = ip.trim().split('.').map(Number);
  if(p.some(n=>n>255)) return null;
  return ((p[0]<<24)>>>0) + (p[1]<<16) + (p[2]<<8) + p[3];
}
function intToIp(i){return[(i>>>24)&255,(i>>>16)&255,(i>>>8)&255,i&255].join('.');}
function to8bit(n){return n.toString(2).padStart(8,'0');}
function ipIntToBin(i){return[(i>>>24)&255,(i>>>16)&255,(i>>>8)&255,i&255].map(to8bit);}
function ipIntToOctets(i){return[(i>>>24)&255,(i>>>16)&255,(i>>>8)&255,i&255];}
function cidrToMaskInt(c){return c===0?0:(0xFFFFFFFF<<(32-c))>>>0;}
function maskIntToDotted(m){return intToIp(m);}
// geeft de prefixlengte, of null als het geen geldig masker is (enen niet aaneensluitend)
function maskIntToCidr(m){
  let c=0; while(c<32 && ((m>>>(31-c))&1)) c++;
  return cidrToMaskInt(c)===(m>>>0) ? c : null;
}
const MASK_OCTETS=[0,128,192,224,240,248,252,254,255];

// ---------- random ----------
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}

// ---------- feedback ----------
function mark(el, status){
  // status: 'ok' | 'bad' | 'empty' | 'reset'
  if(status==='ok') el.style.borderColor = '#22c55e';
  else if(status==='empty') el.style.borderColor = '#f59e0b';
  else if(status==='reset') el.style.borderColor = '';
  else el.style.borderColor = '#ef4444';
}
function showFeedback(html){
  const fb=document.getElementById('feedback');
  fb.style.display='block';
  fb.innerHTML=html;
}
function hideFeedback(){
  document.getElementById('feedback').style.display='none';
  document.getElementById('details').style.display='none';
}
function openDetails(html){
  document.getElementById('explanation').innerHTML=html;
  const det=document.getElementById('details'); det.style.display='block'; det.open=true;
}

// modusknoppen: <div class="modes"><button data-mode="..." aria-pressed="true|false">
function setupModes(container, onChange){
  const btns=[...container.querySelectorAll('button[data-mode]')];
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
    onChange(b.dataset.mode);
  }));
}

// ---- Binaire tabel helpers ----
// diff (optioneel): int met bits die rood gemarkeerd worden (enkel in het netwerkdeel)
function bitCell(bit, idxGlobal, prefix, diff){
  let cls=(idxGlobal<prefix)?'nbit':'hbit';
  if(diff && idxGlobal<prefix && ((diff>>>(31-idxGlobal))&1)) cls+=' dbit';
  return `<span class="b ${cls}">${bit}</span>` + (idxGlobal%4===3 && idxGlobal%8!==7 ? `<span class="gap"></span>` : '');
}
function octetCell(bitsStr, octIndex, prefix, diff){
  let html='';
  for(let bi=0; bi<8; bi++){
    const gi=octIndex*8+bi;
    html += bitCell(bitsStr[bi], gi, prefix, diff);
  }
  return `<td class="octcell">${html}</td>`;
}
function rowBits(label, octetsBits, prefix, diff){
  return `<tr><td><span class="mono">${label}</span></td>` +
    octetsBits.map((b,i)=>octetCell(b,i,prefix,diff)).join('') + `</tr>`;
}
