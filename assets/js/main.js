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

  // Work tree: every category starts collapsed and toggles its projects on tap.
  const workCategories=[...document.querySelectorAll('.work-category')];
  workCategories.forEach(category=>{
    const folder=category.querySelector('.work-folder');
    const items=category.querySelector('.work-items');
    if(!folder)return;

    const button=document.createElement('button');
    button.type='button';
    button.className=folder.className+' work-toggle';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label',`Open ${folder.textContent.trim()}`);
    button.innerHTML=folder.innerHTML;
    folder.replaceWith(button);

    if(items){
      items.hidden=true;
      items.setAttribute('aria-hidden','true');
    }

    button.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const open=category.classList.toggle('is-open');
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',`${open?'Close':'Open'} ${button.textContent.trim()}`);
      if(items){
        items.hidden=!open;
        items.setAttribute('aria-hidden',String(!open));
      }
      requestAnimationFrame(updateWorkTreeLine);
    });
  });

  const style=document.createElement('style');
  style.textContent='.work-toggle{border:0;padding:0;margin:0;background:none;font:inherit;text-align:left;cursor:pointer;color:inherit}.work-toggle:focus-visible{outline:1px solid currentColor;outline-offset:3px;border-radius:3px}.work-items[hidden]{display:none!important}.work-category.is-open .work-toggle{font-weight:600}.work-category.is-open .work-items{display:block}.work-tree:before{display:block!important;top:0!important;bottom:auto!important;height:var(--work-main-line-height,0px)!important}.work-items{border-left:0!important;position:relative!important}.work-item:not(:last-child){border-left:1px solid #dfe4ec!important}.work-item:last-child{border-left:0!important}.work-item:last-child:after{content:"";position:absolute;left:-1px;top:0;width:1px;height:15px;background:#dfe4ec}.work-category:last-child .work-item:last-child:after{height:15px}.work-item:last-child:before{z-index:1}

  /* Match Work content to the compact Code chip system without changing behavior. */
  .work-tree{font-family:'Inter',system-ui,sans-serif;margin-top:0}
  .work-category{padding-left:0;margin-bottom:18px}
  .work-category:before{display:none}
  .work-folder{display:inline-flex;align-items:center;gap:7px;min-height:36px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
  .work-folder svg{width:18px;height:18px;flex-basis:18px}
  .work-items{margin:0;padding:0;border:0!important}
  .work-item{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:7px 10px;min-height:36px;padding:8px 11px;margin:0 0 7px;border:1px solid #e2e2e2;border-radius:8px;background:#fff}
  .work-item:last-child{margin-bottom:0}
  .work-item:before,.work-item:last-child:after{display:none!important}
  .work-item:hover{border-color:#cfd5df;box-shadow:0 6px 14px rgba(25,35,55,.05);transform:translateY(-2px)}
  .work-main{display:flex;align-items:center;gap:8px;min-width:0}
  .work-name{display:block;font-size:11px;line-height:1.2;font-weight:500;letter-spacing:normal;color:#252936;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .work-desc{display:block;margin:0;color:#8a92a1;font-size:10px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .work-tag{align-self:center;margin:0;padding:8px 11px;border-radius:8px;background:#edf3ff;color:#2563eb;font:500 9px/1 'IBM Plex Mono',monospace;letter-spacing:.04em;white-space:nowrap}
  .work-tag.telegram{background:#e7f8ef;color:#188453}.work-tag.mobile{background:#fff0f0;color:#c43d4c}.work-tag.linux{background:#f0ebff;color:#6445cf}
  .work-category.is-open .work-items{display:block}
  @media(max-width:700px){.work-category{margin-bottom:16px}.work-folder{min-height:36px;font-size:11px}.work-folder svg{width:18px;height:18px;flex-basis:18px}.work-item{grid-template-columns:minmax(0,1fr) auto;gap:6px;padding:8px 11px}.work-main{display:block}.work-name{font-size:11px}.work-desc{margin-top:3px;font-size:10px}.work-tag{justify-self:end;padding:8px 9px;font-size:8.5px}}
';
  document.head.appendChild(style);

  function updateWorkTreeLine(){
    const tree=document.querySelector('.work-tree');
    const folders=[...document.querySelectorAll('.work-category .work-toggle')];
    if(!tree||!folders.length)return;
    const last=folders[folders.length-1];
    const treeRect=tree.getBoundingClientRect();
    const folderRect=last.getBoundingClientRect();
    const height=Math.max(0,folderRect.top+folderRect.height/2-treeRect.top);
    tree.style.setProperty('--work-main-line-height',height+'px');
  }
  requestAnimationFrame(updateWorkTreeLine);
  window.addEventListener('resize',updateWorkTreeLine,{passive:true});

  // Minimal footer clock: same typography and line box as the original footer text.
  const footer=document.querySelector('footer');
  function updateFooterClock(){
    if(!footer)return;
    const now=new Date();
    footer.style.font='400 10px/1.2 Inter,system-ui,sans-serif';
    footer.style.letterSpacing='normal';
    footer.style.whiteSpace='nowrap';
    footer.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
  }
  updateFooterClock();
  setInterval(updateFooterClock,1000);

  const nav=document.getElementById('siteNav');if(!nav)return;const links=[...nav.querySelectorAll('a')],sections=links.map(a=>document.getElementById(a.dataset.section)).filter(Boolean),setActive=id=>links.forEach(a=>a.classList.toggle('active',a.dataset.section===id));
  const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setActive(v.target.id)},{rootMargin:'-35% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(s=>io.observe(s));links.forEach(a=>a.addEventListener('click',()=>setActive(a.dataset.section)));setActive('intro');
  let timer;function hide(){nav.classList.remove('is-visible');clearTimeout(timer)}function show(){hide();timer=setTimeout(()=>nav.classList.add('is-visible'),450)}window.addEventListener('scroll',show,{passive:true});nav.addEventListener('pointerdown',()=>{nav.classList.add('is-visible');clearTimeout(timer)},{passive:true});
})();