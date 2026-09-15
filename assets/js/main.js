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

  const languageList=document.getElementById('languageList');
  const fallbackLanguages=['Python','JavaScript','HTML','CSS','Shell'];
  const githubUser='Kaztral-ar';
  const ignoredLanguages=new Set(['Procfile','Dockerfile','Makefile','CMake','Nix','Smarty','Git Attributes','Git Config','Git Revision List','Git Shell','Ignore List','Diff','JSON with Comments']);
  const languageAliases={'JavaScript':'JavaScript','TypeScript':'TypeScript','HTML':'HTML','CSS':'CSS','Shell':'Shell'};
  function renderLanguages(languages){if(!languageList)return;const names=[...languages].filter(name=>!ignoredLanguages.has(name)).sort((a,b)=>a.localeCompare(b));languageList.innerHTML=names.map(name=>`<span class="language">${name}</span>`).join('')}
  async function loadGithubLanguages(){
    if(!languageList)return;renderLanguages(fallbackLanguages);
    try{
      const repos=[];
      for(let page=1;page<=3;page++){
        const response=await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&page=${page}&type=owner&sort=updated`,{headers:{Accept:'application/vnd.github+json'}});
        if(!response.ok)throw new Error(`GitHub repos request failed: ${response.status}`);
        const batch=await response.json();repos.push(...batch);if(batch.length<100)break;
      }
      const owned=repos.filter(repo=>!repo.fork);
      const languageSets=await Promise.all(owned.map(async repo=>{try{const response=await fetch(repo.languages_url,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)return [];return Object.keys(await response.json())}catch{return []}}));
      const languages=new Set();languageSets.flat().forEach(language=>languages.add(languageAliases[language]||language));if(languages.size)renderLanguages(languages);
    }catch(error){console.warn('Could not sync GitHub languages:',error)}
  }
  loadGithubLanguages();

  // Work tree: one semantic folder toggle per category; collapsed by default and only one opens at a time.
  const workCategories=[...document.querySelectorAll('.work-category')];
  function updateWorkTreeLine(){
    const tree=document.querySelector('.work-tree');
    if(!tree)return;
    const folders=[...tree.querySelectorAll('.work-category .work-toggle')];
    if(!folders.length)return;
    const first=folders[0].getBoundingClientRect();
    const last=folders[folders.length-1].getBoundingClientRect();
    const treeRect=tree.getBoundingClientRect();
    const height=Math.max(0,last.top+last.height/2-(first.top+first.height/2));
    tree.style.setProperty('--work-main-line-top',Math.max(0,first.top+first.height/2-treeRect.top)+'px');
    tree.style.setProperty('--work-main-line-height',height+'px');
  }
  function setWorkCategory(category,open){
    const button=category.querySelector('.work-toggle');
    const items=category.querySelector('.work-items');
    if(!button)return;
    category.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',`${open?'Close':'Open'} ${button.dataset.label||button.textContent.trim()}`);
    if(items){
      items.hidden=!open;
      items.setAttribute('aria-hidden',String(!open));
    }
  }
  workCategories.forEach(category=>{
    const folder=category.querySelector('.work-folder');
    const items=category.querySelector('.work-items');
    if(!folder)return;

    const label=folder.textContent.trim();
    const button=document.createElement('button');
    button.type='button';
    button.className=folder.className+' work-toggle';
    button.dataset.label=label;
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label',`Open ${label}`);
    button.innerHTML=folder.innerHTML+'<span class="work-chevron" aria-hidden="true">⌄</span>';
    folder.replaceWith(button);

    if(items){
      items.hidden=true;
      items.setAttribute('aria-hidden','true');
    }

    button.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const open=!category.classList.contains('is-open');
      if(open){
        workCategories.forEach(other=>{if(other!==category)setWorkCategory(other,false)});
      }
      setWorkCategory(category,open);
      requestAnimationFrame(updateWorkTreeLine);
    });
  });

  const style=document.createElement('style');
  style.textContent=`
    .work-toggle{padding:0;margin:0;background:none;font:inherit;text-align:left;cursor:pointer;color:inherit;appearance:none;-webkit-appearance:none;display:flex;align-items:center;width:100%;text-transform:inherit;letter-spacing:inherit}
    .work-toggle:focus-visible{outline:1px solid currentColor;outline-offset:3px;border-radius:3px}
    .work-items[hidden]{display:none!important}
    .work-category.is-open .work-items{display:block}

    .work-tree{position:relative;font-family:'Inter',system-ui,sans-serif;margin-top:0;padding:0 0 0 18px}
    .work-tree:before{content:'';position:absolute;left:18px;top:var(--work-main-line-top,18px);width:1px;height:var(--work-main-line-height,0px);background:#dfe4ec;display:block!important}
    .work-category{position:relative;padding-left:34px;margin-bottom:14px}
    .work-category:last-child{margin-bottom:0}
    .work-category:before{content:'';position:absolute;left:0;top:18px;width:34px;height:1px;background:#dfe4ec;display:block}
    .work-folder{display:inline-flex;align-items:center;gap:7px;min-height:36px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
    .work-folder svg{width:18px;height:18px;flex:0 0 18px;stroke:currentColor}
    .work-folder.apps{color:#c56b20}.work-folder.tools{color:#5b31d4}
    .work-chevron{display:inline-grid;place-items:center;width:13px;height:13px;margin-left:1px;color:#8a92a1;font:500 13px/1 Inter,system-ui,sans-serif;transform:rotate(0deg);transition:transform .16s ease}
    .work-category.is-open .work-chevron{transform:rotate(180deg)}

    .work-items{position:relative;margin:4px 0 0 18px;padding:0 0 0 18px;border-left:0!important}
    .work-items:before{content:'';position:absolute;left:0;top:0;bottom:18px;width:1px;background:#dfe4ec}
    .work-item{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:7px 10px;min-height:34px;padding:7px 0 7px 13px;margin:0;text-decoration:none;color:inherit;transition:color .14s,transform .14s}
    .work-item:before{content:'';position:absolute;left:0;top:50%;width:13px;height:1px;background:#dfe4ec;transform:translateY(-50%)}
    .work-item:last-child{padding-bottom:7px}
    .work-item:hover{transform:translateX(2px)}
    .work-item:hover .work-name{color:#2563eb}
    .work-main{display:block;min-width:0}
    .work-name{display:block;font-size:11px;line-height:1.25;font-weight:500;color:#252936;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .14s}
    .work-desc{display:block;margin-top:2px;color:#8a92a1;font-size:10px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .work-tag{align-self:center;margin:0;padding:5px 8px;border-radius:5px;background:#edf3ff;color:#2563eb;font:500 8px/1 'IBM Plex Mono',monospace;letter-spacing:.04em;white-space:nowrap}
    .work-tag.telegram{background:#e7f8ef;color:#188453}.work-tag.mobile{background:#fff0f0;color:#c43d4c}.work-tag.linux{background:#f0ebff;color:#6445cf}

    @media(max-width:700px){
      .work-tree{padding-left:8px}
      .work-tree:before{left:8px}
      .work-category{padding-left:29px;margin-bottom:12px}
      .work-category:before{width:29px}
      .work-folder{min-height:34px;font-size:11px;gap:6px}
      .work-folder svg{width:17px;height:17px;flex-basis:17px}
      .work-items{margin-left:13px;padding-left:16px}
      .work-item{grid-template-columns:minmax(0,1fr) auto;gap:6px;padding:7px 0 7px 12px}
      .work-item:before{width:12px}
      .work-name{font-size:10.5px}
      .work-desc{font-size:9.5px}
      .work-tag{padding:5px 7px;font-size:7.5px}
    }
  `;
  document.head.appendChild(style);

  requestAnimationFrame(updateWorkTreeLine);
  window.addEventListener('resize',updateWorkTreeLine,{passive:true});

  const footer=document.querySelector('footer');
  function updateFooterClock(){if(!footer)return;const now=new Date();footer.style.font='400 10px/1.2 Inter,system-ui,sans-serif';footer.style.letterSpacing='normal';footer.style.whiteSpace='nowrap';footer.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)}
  updateFooterClock();setInterval(updateFooterClock,1000);

  const nav=document.getElementById('siteNav');if(!nav)return;const links=[...nav.querySelectorAll('a')],sections=links.map(a=>document.getElementById(a.dataset.section)).filter(Boolean),setActive=id=>links.forEach(a=>a.classList.toggle('active',a.dataset.section===id));
  const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setActive(v.target.id)},{rootMargin:'-35% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(s=>io.observe(s));links.forEach(a=>a.addEventListener('click',()=>setActive(a.dataset.section)));setActive('intro');
  let timer;function hide(){nav.classList.remove('is-visible');clearTimeout(timer)}function show(){hide();timer=setTimeout(()=>nav.classList.add('is-visible'),450)}window.addEventListener('scroll',show,{passive:true});nav.addEventListener('pointerdown',()=>{nav.classList.add('is-visible');clearTimeout(timer)},{passive:true});
})();