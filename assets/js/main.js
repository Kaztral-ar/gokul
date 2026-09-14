(()=>{
  let audio;
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  function sound(){if(!AudioContext)return;audio||=new AudioContext();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain(),n=audio.currentTime;o.type='sine';o.frequency.setValueAtTime(520,n);o.frequency.exponentialRampToValueAtTime(780,n+.055);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.045,n+.008);g.gain.exponentialRampToValueAtTime(.0001,n+.09);o.connect(g);g.connect(audio.destination);o.start(n);o.stop(n+.1)}
  function split(e){const s=document.createElement('span');s.className='tap-split';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.innerHTML='<i></i><i></i>';document.body.appendChild(s);s.addEventListener('animationend',()=>s.remove(),{once:true})}
  document.addEventListener('pointerdown',e=>{sound();split(e)},{passive:true});

  const control=document.createElement('div');control.className='motion-line';control.innerHTML='<span class="motion-track"><span class="motion-fill"></span></span>';document.querySelector('.intro')?.appendChild(control);
  const fill=control.querySelector('.motion-fill');
  let target=.5,current=.5;
  function setMotion(v){target=Math.max(0,Math.min(1,v))}
  window.addEventListener('pointermove',e=>setMotion(e.clientX/window.innerWidth),{passive:true});
  window.addEventListener('deviceorientation',e=>{if(typeof e.gamma==='number')setMotion((e.gamma+45)/90)},{passive:true});
  function animate(){current+=(target-current)*.12;fill.style.left=(current*100)+'%';requestAnimationFrame(animate)}
  animate();

  // Keep the Code section synced with real programming languages used in all Kaztral-ar repositories, including the portfolio.
  const languageList=document.getElementById('languageList');
  const fallbackLanguages=['Python','JavaScript','HTML','CSS','Shell'];
  const githubUser='Kaztral-ar';
  const ignoredLanguages=new Set(['Procfile','Dockerfile','Makefile','CMake','Nix','Smarty','Git Attributes','Git Config','Git Revision List','Git Shell','Ignore List','Diff','JSON with Comments']);
  const languageAliases={'JavaScript':'JavaScript','TypeScript':'TypeScript','HTML':'HTML','CSS':'CSS','Shell':'Shell'};
  function renderLanguages(languages){
    if(!languageList)return;
    const names=[...languages].filter(name=>!ignoredLanguages.has(name)).sort((a,b)=>a.localeCompare(b));
    languageList.innerHTML=names.map(name=>`<span class="language">${name}</span>`).join('');
  }
  async function loadGithubLanguages(){
    if(!languageList)return;
    renderLanguages(fallbackLanguages);
    try{
      const repos=[];
      for(let page=1;page<=3;page++){
        const response=await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&page=${page}&type=owner&sort=updated`,{headers:{Accept:'application/vnd.github+json'}});
        if(!response.ok)throw new Error(`GitHub repos request failed: ${response.status}`);
        const batch=await response.json();
        repos.push(...batch);
        if(batch.length<100)break;
      }
      const owned=repos.filter(repo=>!repo.fork);
      const languageSets=await Promise.all(owned.map(async repo=>{
        try{
          const response=await fetch(repo.languages_url,{headers:{Accept:'application/vnd.github+json'}});
          if(!response.ok)return [];
          return Object.keys(await response.json());
        }catch{return []}
      }));
      const languages=new Set();
      languageSets.flat().forEach(language=>languages.add(languageAliases[language]||language));
      if(languages.size)renderLanguages(languages);
    }catch(error){
      console.warn('Could not sync GitHub languages:',error);
    }
  }
  loadGithubLanguages();

  // Small popup for the Tools folder in the Work tree.
  const toolsFolder=document.querySelector('.work-folder.tools');
  if(toolsFolder){
    const category=toolsFolder.closest('.work-category');
    const items=category?.querySelector('.work-items');
    if(category){
      const button=document.createElement('button');
      button.type='button';
      button.className='work-folder tools tools-toggle';
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Open tools');
      button.innerHTML=toolsFolder.innerHTML;
      toolsFolder.replaceWith(button);
      const popup=document.createElement('div');
      popup.className='tools-popup';
      popup.setAttribute('role','dialog');
      popup.innerHTML='<div class="tools-popup-title">Tools</div><a href="https://github.com/Kaztral-ar/Termokali" target="_blank" rel="noopener"><span>TermoKali</span><small>Linux / Termux</small></a>';
      category.appendChild(popup);
      items?.remove();
      const style=document.createElement('style');
      style.textContent='.tools-toggle{border:0;padding:0;background:none;font:inherit;text-align:left;cursor:pointer;width:auto}.tools-toggle:focus-visible{outline:1px solid currentColor;outline-offset:4px;border-radius:3px}.tools-popup{position:absolute;z-index:20;left:46px;top:42px;width:180px;padding:9px;background:#fff;border:1px solid #e2e6ed;border-radius:7px;box-shadow:0 8px 24px rgba(20,30,50,.08);opacity:0;transform:translateY(-4px) scale(.98);pointer-events:none;transition:opacity .16s ease,transform .16s ease}.work-category.is-open .tools-popup{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.tools-popup-title{padding:2px 6px 7px;color:#737b8c;font:500 9px/1.2 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase}.tools-popup a{display:block;padding:7px 6px;text-decoration:none;border-radius:5px;color:#171b2b}.tools-popup a:hover{background:#f5f3ff}.tools-popup span{display:block;font:500 13px/1.25 "IBM Plex Mono",monospace}.tools-popup small{display:block;margin-top:3px;color:#737b8c;font:10px/1.3 "IBM Plex Mono",monospace}@media(max-width:700px){.tools-popup{left:36px;top:38px;width:165px}.tools-popup span{font-size:12px}.tools-popup small{font-size:9.5px}}';
      document.head.appendChild(style);
      button.addEventListener('click',e=>{e.stopPropagation();const open=category.classList.toggle('is-open');button.setAttribute('aria-expanded',String(open))});
      document.addEventListener('click',e=>{if(!category.contains(e.target)){category.classList.remove('is-open');button.setAttribute('aria-expanded','false')}});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){category.classList.remove('is-open');button.setAttribute('aria-expanded','false')}});
    }
  }

  const nav=document.getElementById('siteNav');if(!nav)return;const links=[...nav.querySelectorAll('a')],sections=links.map(a=>document.getElementById(a.dataset.section)).filter(Boolean);const setActive=id=>links.forEach(a=>a.classList.toggle('active',a.dataset.section===id));
  const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setActive(v.target.id)},{rootMargin:'-35% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(s=>io.observe(s));links.forEach(a=>a.addEventListener('click',()=>setActive(a.dataset.section)));setActive('intro');
  let timer;function hide(){nav.classList.remove('is-visible');clearTimeout(timer)}function show(){hide();timer=setTimeout(()=>nav.classList.add('is-visible'),450)}window.addEventListener('scroll',show,{passive:true});nav.addEventListener('pointerdown',()=>{nav.classList.add('is-visible');clearTimeout(timer)},{passive:true});
})();
