(()=>{
  let audio;
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  function sound(){
    if(!AudioContext)return;
    audio ||= new AudioContext();
    if(audio.state === 'suspended')audio.resume();
    const o = audio.createOscillator();
    const g = audio.createGain();
    const n = audio.currentTime;
    o.type = 'sine';
    o.frequency.setValueAtTime(520,n);
    o.frequency.exponentialRampToValueAtTime(780,n + .055);
    g.gain.setValueAtTime(.0001,n);
    g.gain.exponentialRampToValueAtTime(.045,n + .008);
    g.gain.exponentialRampToValueAtTime(.0001,n + .09);
    o.connect(g);
    g.connect(audio.destination);
    o.start(n);
    o.stop(n + .1);
  }
  function split(e){const s=document.createElement('span');s.className='tap-split';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.innerHTML='<i></i><i></i>';document.body.appendChild(s);s.addEventListener('animationend',()=>s.remove(),{once:true});}
  document.addEventListener('pointerdown',e=>{sound();split(e);},{passive:true});

  const control=document.createElement('div');control.className='motion-line';control.innerHTML='<span class="motion-track"><span class="motion-fill"></span></span>';document.querySelector('.intro')?.appendChild(control);
  const fill=control.querySelector('.motion-fill');let target=.5,current=.5;const setMotion=v=>{target=Math.max(0,Math.min(1,v));};window.addEventListener('pointermove',e=>setMotion(e.clientX/window.innerWidth),{passive:true});window.addEventListener('deviceorientation',e=>{if(typeof e.gamma==='number')setMotion((e.gamma+45)/90);},{passive:true});function animate(){current+=(target-current)*.12;fill.style.left=(current*100)+'%';requestAnimationFrame(animate);}animate();

  const languageList=document.getElementById('languageList');const fallbackLanguages=['Python','JavaScript','HTML','CSS','Shell'];const githubUser='Kaztral-ar';const ignoredLanguages=new Set(['Procfile','Dockerfile','Makefile','CMake','Nix','Smarty','Git Attributes','Git Config','Git Revision List','Git Shell','Ignore List','Diff','JSON with Comments']);const languageAliases={JavaScript:'JavaScript',TypeScript:'TypeScript',HTML:'HTML',CSS:'CSS',Shell:'Shell'};
  function renderLanguages(languages){if(!languageList)return;const names=[...languages].filter(name=>!ignoredLanguages.has(name)).sort((a,b)=>a.localeCompare(b));languageList.innerHTML=names.map(name=>`<span class="language">${name}</span>`).join('');}
  async function loadGithubLanguages(){if(!languageList)return;renderLanguages(fallbackLanguages);try{const repos=[];for(let page=1;page<=3;page++){const response=await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&page=${page}&type=owner&sort=updated`,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw new Error(`GitHub repos request failed: ${response.status}`);const batch=await response.json();repos.push(...batch);if(batch.length<100)break;}const owned=repos.filter(repo=>!repo.fork);const languageSets=await Promise.all(owned.map(async repo=>{try{const response=await fetch(repo.languages_url,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)return [];return Object.keys(await response.json());}catch{return []}}));const languages=new Set();languageSets.flat().forEach(language=>languages.add(languageAliases[language]||language));if(languages.size)renderLanguages(languages);}catch(error){console.warn('Could not sync GitHub languages:',error);}}
  loadGithubLanguages();

  const workTree=document.querySelector('.work-tree');const workCategories=[...document.querySelectorAll('.work-tree > .work-category')];
  function updateWorkTreeLine(){if(!workTree)return;const folders=[...workCategories].map(category=>category.querySelector('.work-folder')).filter(Boolean);if(!folders.length)return;const first=folders[0].getBoundingClientRect();const last=folders[folders.length-1].getBoundingClientRect();const treeRect=workTree.getBoundingClientRect();const top=first.top+first.height/2-treeRect.top;const height=Math.max(0,last.top+last.height/2-(first.top+first.height/2));workTree.style.setProperty('--work-main-line-top',Math.max(0,top)+'px');workTree.style.setProperty('--work-main-line-height',height+'px');}
  function setWorkCategory(category,open){const folder=category.querySelector('.work-folder');const items=category.querySelector('.work-items');if(!folder)return;category.classList.toggle('is-open',open);folder.setAttribute('role','button');folder.setAttribute('tabindex','0');folder.setAttribute('aria-expanded',String(open));folder.setAttribute('aria-label',`${open?'Close':'Open'} ${folder.dataset.workLabel||folder.textContent.trim()}`);if(items){items.hidden=!open;items.setAttribute('aria-hidden',String(!open));}}
  workCategories.forEach(category=>{const folder=category.querySelector('.work-folder');if(!folder)return;folder.dataset.workLabel=folder.querySelector('span')?.textContent.trim()||folder.textContent.trim();setWorkCategory(category,false);});
  workTree?.addEventListener('click',event=>{const folder=event.target.closest('.work-folder');if(!folder||!workTree.contains(folder))return;const category=folder.closest('.work-category');if(!category)return;event.preventDefault();event.stopPropagation();setWorkCategory(category,folder.getAttribute('aria-expanded')!=='true');requestAnimationFrame(updateWorkTreeLine);});
  workTree?.addEventListener('keydown',event=>{const folder=event.target.closest('.work-folder');if(!folder||!workTree.contains(folder))return;if(event.key!=='Enter'&&event.key!==' ')return;const category=folder.closest('.work-category');if(!category)return;event.preventDefault();event.stopPropagation();setWorkCategory(category,folder.getAttribute('aria-expanded')!=='true');requestAnimationFrame(updateWorkTreeLine);});
  requestAnimationFrame(updateWorkTreeLine);window.addEventListener('resize',updateWorkTreeLine,{passive:true});

  const footer=document.querySelector('footer');const contact=document.querySelector('.contact');if(contact&&footer)footer.parentNode.insertBefore(contact,footer);
  function updateFooterClock(){if(!footer)return;footer.style.font='400 10px/1.2 Inter,system-ui,sans-serif';footer.style.letterSpacing='normal';footer.style.whiteSpace='nowrap';footer.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}updateFooterClock();setInterval(updateFooterClock,1000);

  const cryptoTicker=document.querySelector('.crypto-ticker');
  if(cryptoTicker){
    const holdings=document.createElement('section');holdings.className='crypto-holdings';holdings.setAttribute('aria-label','Crypto holdings');holdings.innerHTML=`<div class="crypto-holdings-head"><span>Crypto holdings</span><span>₹3,000</span></div><div class="crypto-holdings-bar" role="img" aria-label="PEPE 60 percent, USDT 25 percent, PI 15 percent"><span class="holding-segment pepe" style="--share:60%" title="PEPE · 60%"></span><span class="holding-segment usdt" style="--share:25%" title="USDT · 25%"></span><span class="holding-segment pi" style="--share:15%" title="PI · 15%"></span></div><div class="crypto-holdings-labels"><span class="pepe-label">🐸 PEPE · 60%</span><span class="usdt-label">₮ USDT · 25%</span><span class="pi-label">π PI · 15%</span></div>`;
    const style=document.createElement('style');style.textContent=`.crypto-holdings{margin:30px 0 0;font-family:'IBM Plex Mono',monospace;color:#111}.crypto-holdings-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:10px;letter-spacing:.03em;text-transform:uppercase}.crypto-holdings-head span:last-child{opacity:.6}.crypto-holdings-bar{display:flex;width:100%;height:12px;overflow:hidden;border:1px solid rgba(0,0,0,.12);border-radius:999px;background:#f5f5f5}.holding-segment{display:block;width:var(--share);height:100%;min-width:2px;border-right:2px solid #fff}.holding-segment:last-child{border-right:0}.holding-segment.pepe{background:#2dbb73}.holding-segment.usdt{background:#2678e8}.holding-segment.pi{background:#7b45d6}.crypto-holdings-labels{display:flex;justify-content:space-between;gap:8px;margin-top:8px;overflow:hidden;white-space:nowrap;font-size:9px}.pepe-label{color:#24965c}.usdt-label{color:#1d64c5}.pi-label{color:#6833bb}@media(max-width:700px){.crypto-holdings{margin-top:24px}.crypto-holdings-bar{height:10px}.crypto-holdings-labels{font-size:7px;gap:5px}.crypto-holdings-head{font-size:9px}}`;document.head.appendChild(style);cryptoTicker.parentNode.insertBefore(holdings,cryptoTicker);
  }

  const nav=document.getElementById('siteNav');if(!nav)return;const links=[...nav.querySelectorAll('a')];const sections=links.map(a=>document.getElementById(a.dataset.section)).filter(Boolean);const setActive=id=>links.forEach(a=>a.classList.toggle('active',a.dataset.section===id));const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setActive(v.target.id);},{rootMargin:'-35% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(s=>io.observe(s));links.forEach(a=>a.addEventListener('click',()=>setActive(a.dataset.section)));setActive('intro');let timer;function hide(){nav.classList.remove('is-visible');clearTimeout(timer);}function show(){hide();timer=setTimeout(()=>nav.classList.add('is-visible'),450);}window.addEventListener('scroll',show,{passive:true});nav.addEventListener('pointerdown',()=>{nav.classList.add('is-visible');clearTimeout(timer);},{passive:true});
})();