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

  // Compact expandable Tools folder in the Work tree.
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
      style.textContent='.work-tree{margin-top:2px;padding-left:8px}.work-tree:before{left:8px}.work-category{padding-left:32px;margin-bottom:12px}.work-category:before{left:8px;top:15px;width:22px}.work-folder{gap:6px;min-height:29px;font-size:15px}.work-folder svg{width:20px;height:20px;flex-basis:20px}.work-items{margin-left:5px;padding-left:14px}.work-item{gap:4px 8px;padding:5px 0 5px 9px}.work-item:before{width:10px;top:15px}.work-name{font-size:12px;line-height:1.2}.work-desc{margin-top:2px;font-size:9px;line-height:1.3}.work-tag{padding:3px 5px;border-radius:4px;font-size:7px}.tools-toggle{border:0;padding:0;background:none;font:inherit;text-align:left;cursor:pointer;width:auto}.tools-toggle:focus-visible{outline:1px solid currentColor;outline-offset:3px;border-radius:3px}.tools-popup{position:absolute;z-index:20;left:32px;top:31px;width:145px;padding:7px;background:#fff;border:1px solid #e2e6ed;border-radius:6px;box-shadow:0 6px 18px rgba(20,30,50,.08);opacity:0;transform:translateY(-3px) scale(.98);pointer-events:none;transition:opacity .14s ease,transform .14s ease}.work-category.is-open .tools-popup{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.tools-popup-title{padding:1px 5px 5px;color:#737b8c;font:500 8px/1.2 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase}.tools-popup a{display:block;padding:5px;text-decoration:none;border-radius:4px;color:#171b2b}.tools-popup a:hover{background:#f5f3ff}.tools-popup span{display:block;font:500 11px/1.2 "IBM Plex Mono",monospace}.tools-popup small{display:block;margin-top:2px;color:#737b8c;font:8.5px/1.2 "IBM Plex Mono",monospace}@media(max-width:700px){.work-tree{padding-left:4px}.work-tree:before{left:4px}.work-category{padding-left:27px;margin-bottom:9px}.work-category:before{left:4px;top:13px;width:19px}.work-folder{font-size:14px;gap:5px;min-height:26px}.work-folder svg{width:18px;height:18px;flex-basis:18px}.work-items{margin-left:4px;padding-left:12px}.work-item{padding:4px 0 4px 8px}.work-item:before{width:9px;top:13px}.work-name{font-size:11px}.work-desc{font-size:8.5px}.work-tag{padding:2px 4px;font-size:6.5px}.tools-popup{left:27px;top:28px;width:135px}.tools-popup span{font-size:10px}.tools-popup small{font-size:8px}}';
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
