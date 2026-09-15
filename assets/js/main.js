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

  // Work tree: clean file-explorer layout, collapsed by default, one category open at a time.
  const workCategories=[...document.querySelectorAll('.work-category')];
  function updateWorkTreeLine(){
    const tree=document.querySelector('.work-tree');
    if(!tree)return;
    const folders=[...tree.querySelectorAll('.work-category .work-toggle')];
    if(!folders.length)return;
    const first=folders[0].getBoundingClientRect();
    const last=folders[folders.length-1].getBoundingClientRect();
    const treeRect=tree.getBoundingClientRect();
    const top=first.top+first.height/2-treeRect.top;
    const height=Math.max(0,last.top+last.height/2-(first.top+first.height/2));
    tree.style.setProperty('--work-main-line-top',Math.max(0,top)+'px');
    tree.style.setProperty('--work-main-line-height',height+'px');
  }
  function setWorkCategory(category,open){
    const button=category.querySelector('.work-toggle');
    const items=category.querySelector('.work-items');
    if(!button)return;
    category.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',`${open?'Close':'Open'} ${button.dataset.label||button.textContent.trim()}`);
    if(items){items.hidden=!open;items.setAttribute('aria-hidden',String(!open))}
  }
  workCategories.forEach(category=>{
    const folder=category.querySelector('.work-folder');
    const items=category.querySelector('.work-items');
    if(!folder)return;
    const label=folder.querySelector('span')?.textContent.trim()||folder.textContent.trim();
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
      items.querySelectorAll('.work-item').forEach(item=>{
        const name=item.querySelector('.work-name');
        if(!name||name.querySelector('.work-file-icon'))return;
        const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');
        icon.classList.add('work-file-icon');
        icon.setAttribute('viewBox','0 0 16 16');
        icon.setAttribute('aria-hidden','true');
        icon.innerHTML='<path d="M3 1.75h6.1L13 5.65v8.6H3z"/><path d="M9 1.75v4h4"/>';
        name.prepend(icon);
      });
    }
    button.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const open=!category.classList.contains('is-open');
      if(open)workCategories.forEach(other=>{if(other!==category)setWorkCategory(other,false)});
      setWorkCategory(category,open);
      requestAnimationFrame(updateWorkTreeLine);
    });
  });

  const style=document.createElement('style');
  style.textContent=`
    /* Work — plain Git/file-tree, never cards or boxes */
    .projects-section::before{display:none!important}
    .work-toggle{padding:0;margin:0;border:0!important;outline:0;background:none;font:inherit;text-align:left;cursor:pointer;color:inherit;appearance:none;-webkit-appearance:none;display:flex;align-items:center;width:100%;text-transform:inherit;letter-spacing:inherit}
    .work-toggle:focus-visible{outline:1px solid currentColor!important;outline-offset:3px;border-radius:2px}
    .work-items[hidden]{display:none!important}
    .work-category.is-open .work-items{display:block}
    .work-tree{position:relative;margin-top:0;padding:0 0 0 18px;font-family:'IBM Plex Mono','Inter',system-ui,sans-serif}
    .work-tree:before{content:'';position:absolute;left:18px;top:var(--work-main-line-top,18px);height:var(--work-main-line-height,0px);width:1px;background:#d9dee7;pointer-events:none}
    .work-category{position:relative;padding-left:34px;margin:0 0 8px}
    .work-category:last-child{margin-bottom:0}
    .work-category:before{content:'';position:absolute;left:0;top:18px;width:34px;height:1px;background:#d9dee7}
    .work-folder{display:flex;align-items:center;gap:7px;min-height:36px;font-size:12px;line-height:1.2;font-weight:500;letter-spacing:0;text-transform:none}
    .work-folder svg{width:17px;height:17px;flex:0 0 17px;stroke:currentColor;stroke-width:1.7}
    .work-folder.apps{color:#c56b20}.work-folder.tools{color:#5b31d4}
    .work-chevron{display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px;margin-left:2px;color:#9299a6;font:500 12px/1 Inter,system-ui,sans-serif;transform:rotate(0);transition:transform .16s ease}
    .work-category.is-open .work-chevron{transform:rotate(180deg)}

    .work-items{position:relative;margin:2px 0 2px 18px;padding:0 0 0 18px;border:0!important}
    .work-items:before{content:'';position:absolute;left:0;top:0;bottom:17px;width:1px;background:#d9dee7}
    .work-item{position:relative;display:flex;align-items:flex-start;gap:7px;min-height:32px;padding:5px 0 5px 13px;margin:0;text-decoration:none;color:inherit;background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;transition:color .14s,transform .14s}
    .work-item:before{content:'';position:absolute;left:0;top:15px;width:13px;height:1px;background:#d9dee7}
    .work-item:hover{transform:translateX(2px)}
    .work-item:hover .work-name{color:#2563eb}
    .work-main{display:block;min-width:0;flex:1}
    .work-name{display:flex;align-items:center;gap:6px;font-size:11px;line-height:1.3;font-weight:500;color:#252936;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .14s}
    .work-file-icon{width:13px;height:13px;flex:0 0 13px;stroke:#9aa1ad;stroke-width:1;fill:none}
    .work-desc{display:block;margin:2px 0 0 19px;color:#8a92a1;font-size:9.5px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .work-tag{display:inline-block;flex:0 0 auto;align-self:flex-start;margin:2px 0 0 auto;padding:0;background:none!important;border:0!important;border-radius:0!important;color:#9aa1ad!important;font:400 8px/1.3 'IBM Plex Mono',monospace;letter-spacing:.03em;white-space:nowrap}
    .work-tag.telegram,.work-tag.mobile,.work-tag.linux{background:none!important;color:#9aa1ad!important}

    @media(max-width:700px){
      .work-tree{padding-left:8px}
      .work-tree:before{left:8px}
      .work-category{padding-left:29px;margin-bottom:7px}
      .work-category:before{width:29px}
      .work-folder{min-height:34px;font-size:11px;gap:6px}
      .work-folder svg{width:16px;height:16px;flex-basis:16px}
      .work-items{margin-left:13px;padding-left:16px}
      .work-item{gap:6px;padding:5px 0 5px 12px}
      .work-item:before{width:12px}
      .work-name{font-size:10.5px}
      .work-file-icon{width:12px;height:12px;flex-basis:12px}
      .work-desc{margin-left:18px;font-size:9px;white-space:normal}
      .work-tag{font-size:7.5px}
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