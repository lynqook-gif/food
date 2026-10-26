(()=>{const c={"title": "식단표 편집기", "eyebrow": "MEAL PLANNER", "line1": "건강한 한 끼를 위한,", "line2": "꼼꼼한 식단 계획.", "desc": "식단 작성부터 중복 확인, 엑셀과 PDF 출력까지 한곳에서.", "nav": [["식단표 작성", "anchor:tabs"], ["음식 찾기", "click:findBtn"], ["엑셀 서식 받기", "click:xlTemplate"], ["엑셀로 내보내기", "click:xlExport"], ["백업 파일 저장", "click:exportBtn"], ["인쇄 / PDF", "click:printBtn"]], "target": "header.bar", "place": "after", "site": "food"};document.body.classList.add('desk-layout');const rail=document.createElement('aside');rail.className='desk-rail';rail.setAttribute('aria-label',c.title+' 메뉴');rail.innerHTML='<div class="desk-brand">교행<span>e</span></div><div class="desk-product">'+c.title+'</div><div class="desk-label">업무 메뉴</div><nav class="desk-menu" aria-label="주 메뉴"></nav><div class="desk-bottom"><div class="desk-mascot" role="img" aria-label="'+c.title+' 안내 캐릭터"></div><p>복잡한 업무도 차근차근.<br>교행e가 함께합니다.</p></div>';const nav=rail.querySelector('nav');c.nav.forEach(([label,action],i)=>{const el=document.createElement(action.startsWith('file:')?'a':'button');if(el.tagName==='BUTTON')el.type='button';else{el.href=action.slice(5);el.target='_blank';el.rel='noopener';}el.dataset.deskAction=action;el.innerHTML='<span class="desk-icon">'+String(i+1).padStart(2,'0')+'</span><span>'+label+'</span>';if(i===0){el.classList.add('selected');el.setAttribute('aria-current','page')}el.addEventListener('click',()=>{nav.querySelectorAll('.selected').forEach(x=>{x.classList.remove('selected');x.removeAttribute('aria-current')});el.classList.add('selected');el.setAttribute('aria-current','page');const [type,id,label]=action.split(':');if(type==='tab')document.querySelector('#tabs [data-tab="'+id+'"]')?.click();if(type==='click')document.getElementById(id)?.click();if(type==='anchor')document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'center'});if(type==='go')document.querySelector('[data-go="'+id+'"]:not(.desk-rail *)')?.click();if(type==='home')window.goHome?.();if(type==='page')window.showPage?.(id,label);});nav.append(el)});document.body.prepend(rail);const hero=document.createElement('section');hero.className='desk-hero';hero.id='design-hero';hero.innerHTML='<div class="desk-copy"><div class="desk-eyebrow">'+c.eyebrow+'</div><h1>'+c.line1+'<br><span>'+c.line2+'</span></h1><p>'+c.desc+'</p><div class="desk-status">'+c.title+' · 업무를 위한 나만의 데스크</div></div><div class="desk-mascot" role="img" aria-label="'+c.title+' 컨셉의 교행e 캐릭터"></div>';const target=document.querySelector(c.target);if(c.place==='prepend')target.prepend(hero);else target.after(hero);
const workspace=document.createElement('div');workspace.className='desk-workheading';workspace.innerHTML='<div><p class="desk-crumb">'+c.title+' <span>/</span> <span class="desk-current"></span></p><h1></h1><p class="desk-workdesc"></p></div><span class="desk-worktag">'+c.title+'</span>';
if(c.site==='law')document.querySelector('main').prepend(workspace);
const descriptions={acc:'회계연도와 학교 정보를 입력하고 예산을 편성하세요.',sechul:'지출결의부터 지출부·현금출납부까지 이어서 관리하세요.',seip:'징수결의와 수입 내역을 정확하게 기록하세요.',settle:'한 해의 회계를 정리하고 결산 서류를 준비하세요.',board:'이사회 회의와 관련 서류를 한곳에서 작성하세요.'};
function syncWorkspace(){
 let current='';
 if(c.site==='law'){
  const panel=document.querySelector('main > .panel.active');current=panel?.id.replace('panel-','')||'home';
  hero.hidden=current!=='home';workspace.hidden=current==='home';
  const label=c.nav.find(x=>x[1]==='tab:'+current)?.[0]||'법인회계';
  workspace.querySelector('h1').textContent=label;workspace.querySelector('.desk-current').textContent=label;workspace.querySelector('.desk-workdesc').textContent=descriptions[current]||'';
  document.body.classList.toggle('desk-working',current!=='home');
 }else if(c.site==='gyobok-guide'){
  current=document.querySelector('.page:not([hidden])')?.dataset.page||'flow';hero.hidden=current!=='flow';
 }else if(c.site==='jeonbuk-gyohaeng'){
  hero.hidden=document.body.classList.contains('in-page');current=hero.hidden?document.querySelector('.panel.open')?.id||'':'';
 }
 nav.querySelectorAll('button,a').forEach((el,i)=>{
  const action=el.dataset.deskAction||'',chosen=c.site==='law'?action==='tab:'+current:c.site==='gyobok-guide'?action==='go:'+current:c.site==='jeonbuk-gyohaeng'?(current?action.startsWith('page:'+current+':'):action==='home'):el.classList.contains('selected');
  if(el.classList.contains('selected')!==chosen){el.classList.toggle('selected',chosen);if(chosen)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')}
 });
}
const observed=c.site==='law'?document.querySelectorAll('main>.panel'):c.site==='gyobok-guide'?document.querySelectorAll('.page'):c.site==='jeonbuk-gyohaeng'?[document.body,...document.querySelectorAll('.panel')]:[];
const observer=new MutationObserver(syncWorkspace);observed.forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class','hidden']}));syncWorkspace();
if(c.site==='law'){
 const hint=document.querySelector('#inputArea .hint');if(hint){const details=document.createElement('details');details.className='desk-help';const summary=document.createElement('summary');summary.textContent='출력 규칙과 미리보기 안내';hint.before(details);details.append(summary,hint);}
}

const bottom=rail.querySelector('.desk-bottom');bottom.innerHTML='<a class="desk-support" href="https://open.kakao.com/o/g4Tap2Ri" target="_blank" rel="noopener"><img src="design/assistant-face.png" alt="" width="42" height="42"><span><b>도움이 필요하신가요?</b><small>문의·건의하기 ↗</small></span></a>';
document.querySelectorAll('a[href*="open.kakao.com"]').forEach(a=>{if(a.closest('.desk-rail')||a.classList.contains('fab'))return;a.classList.add('desk-contact-link');const img=document.createElement('img');img.src='design/assistant-face.png';img.alt='';img.width=30;img.height=30;a.prepend(img)});

const finder=document.getElementById('find');
function fitFinder(){if(!finder||finder.hidden)return;const desired=document.querySelector('.bar').getBoundingClientRect().bottom+8;const limit=Math.max(12,window.innerHeight-finder.getBoundingClientRect().height-12);const top=Math.round(Math.min(Math.max(12,desired),limit));if(finder.style.top!==top+'px')finder.style.top=top+'px';}
if(finder){new MutationObserver(fitFinder).observe(finder,{attributes:true,attributeFilter:['hidden','style']});window.addEventListener('resize',fitFinder);window.addEventListener('scroll',fitFinder,{passive:true});}

// One persistent support entry; keep author attribution without repeated calls to action.
document.querySelectorAll('.credit').forEach(credit=>{credit.textContent='제작자: 정주고등학교 박지은 / 문의: ican6363@naver.com';});
document.querySelectorAll('a[href*="open.kakao.com"]').forEach(a=>{if(a.closest('.desk-support'))return;const card=a.closest('.chatcta,.askbox,.ls-cta');if(card){card.remove();return;}a.remove();});
document.querySelectorAll('.desk-contact-link img').forEach(img=>img.remove());
document.querySelectorAll('.chatcta,.askbox,.ls-cta').forEach(el=>el.remove());document.querySelectorAll('.bottom').forEach(el=>{if(!el.children.length)el.remove()});

const releaseDialog=document.createElement('dialog');releaseDialog.className='desk-release';releaseDialog.setAttribute('aria-labelledby','desk-release-title');releaseDialog.innerHTML='<div class="desk-release-head"><div><small>변경 내역</small><h2 id="desk-release-title">업데이트 안내</h2></div><button type="button" class="desk-release-close" aria-label="업데이트 안내 닫기">✕</button></div><div class="desk-release-body"><time datetime="2026-10-25">2026. 10. 25.</time><h3>디자인 일괄 수정</h3><ul><li>교행e 도구 5개(전북교행길라잡이·법인회계Master·본예산 길라잡이·식단표 편집기·교복길라잡이) 화면을 같은 모양으로 정리했어요.</li><li>글씨를 더 크고 또렷하게, 메뉴와 선택한 칸을 알아보기 쉽게 바꿨어요.</li><li>문의·건의는 카카오 오픈채팅으로 받아요.</li><li>기능과 입력해 둔 자료는 그대로예요.</li></ul><time datetime="2026-10-15">2026. 10. 15.</time><h3>식단표 기능 추가</h3><ul><li>요일(월~토) 체크로 원하는 요일만 표에 보이게 했어요.</li><li>인쇄 칸에서 글씨 크기를 고를 수 있어요.</li><li>칸보다 긴 메뉴는 그 칸만 글씨가 작아져 다 보여요.</li><li>엑셀 불러오기 때 빈 줄 때문에 줄 수가 늘어나지 않게 했어요.</li></ul><time datetime="2026-10-12">2026. 10. 12.</time><h3>디자인 수정</h3><ul>'+["버튼 글자의 대비를 높이고 찾기 창이 화면 밖으로 나가지 않도록 수정했습니다.", "날짜 표시와 직접 수정, 식단표의 셀 높이를 유지했습니다.", "설정 영역의 글자 크기와 간격을 정리했습니다."].map(t=>'<li>'+t+'</li>').join('')+'</ul><div class="desk-release-history"></div></div>';
document.body.append(releaseDialog);const history=releaseDialog.querySelector('.desk-release-history');const source=document.querySelector('.news');if(source){const copy=source.cloneNode(true);copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.removeAttribute('id');history.append(copy);source.classList.add('desk-release-source');}
const releaseButton=document.createElement('button');releaseButton.type='button';releaseButton.className='desk-update-button';releaseButton.innerHTML='<span aria-hidden="true">↻</span><span>업데이트 안내</span>';releaseButton.addEventListener('click',()=>releaseDialog.showModal());releaseDialog.querySelector('.desk-release-close').addEventListener('click',()=>releaseDialog.close());releaseDialog.addEventListener('click',e=>{if(e.target===releaseDialog){const r=releaseDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)releaseDialog.close()}});

document.querySelectorAll('.news').forEach(el=>{if(!el.closest('.desk-release'))el.classList.add('desk-release-source')});

const homeUpdates=document.createElement('section');homeUpdates.className='desk-home-updates';homeUpdates.setAttribute('aria-labelledby','desk-home-updates-title');homeUpdates.innerHTML='<header><div><small>서비스 소식</small><h2 id="desk-home-updates-title">업데이트 안내</h2><p>새로 추가된 기능과 개선 내용을 확인하세요.</p></div><button type="button" class="desk-all-updates">전체 내역 보기 ↗</button></header><div class="desk-home-update-latest"><time datetime="2026-10-25">2026. 10. 25.</time><div><h3>디자인 일괄 수정</h3><ul></ul></div></div>';
const previewList=homeUpdates.querySelector('ul');releaseDialog.querySelectorAll('.desk-release-body>ul:first-of-type>li').forEach(li=>previewList.append(li.cloneNode(true)));homeUpdates.querySelector('.desk-all-updates').addEventListener('click',()=>releaseDialog.showModal());
if(c.site==='law'){const shortcuts=document.getElementById('cards');shortcuts.classList.add('desk-home-shortcuts');document.querySelector('#panel-home .sec-head')?.classList.add('desk-home-shortcuts');shortcuts.before(homeUpdates);}
if(c.site==='jeonbuk-gyohaeng'){const shortcuts=document.querySelector('#menu .menu2');shortcuts.classList.add('desk-home-shortcuts');shortcuts.before(homeUpdates);document.querySelector('#menu .qhead')?.classList.add('desk-home-shortcuts');document.querySelector('#menu .qlist')?.classList.add('desk-home-shortcuts');}
if(c.site==='gyobok-guide'){const shortcuts=document.querySelector('[data-page="flow"] .reflinks');shortcuts.classList.add('desk-home-shortcuts');shortcuts.before(homeUpdates);}
if(c.site==='food'){homeUpdates.classList.add('desk-food-updates');const home=document.createElement('section');home.className='desk-food-home';home.id='desk-food-home';home.append(homeUpdates);document.getElementById('design-hero').after(home);const work=document.querySelector('body>.wrap');const homeBtn=document.createElement('button');homeBtn.type='button';homeBtn.className='desk-home-button';homeBtn.innerHTML='<span class="desk-icon">01</span><span>홈</span>';nav.prepend(homeBtn);nav.querySelectorAll('.desk-icon').forEach((x,i)=>x.textContent=String(i+1).padStart(2,'0'));const showHome=on=>{home.hidden=!on;if(work)work.style.display=on?'none':'';homeBtn.classList.toggle('selected',on);if(on)homeBtn.setAttribute('aria-current','page');else homeBtn.removeAttribute('aria-current')};nav.querySelectorAll('button,a').forEach(el=>{if(el!==homeBtn)el.addEventListener('click',()=>showHome(false),true)});homeBtn.addEventListener('click',()=>{nav.querySelectorAll('.selected').forEach(x=>{x.classList.remove('selected');x.removeAttribute('aria-current')});showHome(true);scrollTo({top:0,behavior:'smooth'})});nav.querySelectorAll('.selected').forEach(x=>{x.classList.remove('selected');x.removeAttribute('aria-current')});showHome(true);window.addEventListener('beforeprint',()=>{if(!home.hidden){showHome(false);nav.children[1]?.classList.add('selected')}});}

const relatedSites=[["전북교행길라잡이", "https://jeonbuk-gyohaeng.pages.dev/"],["법인회계Master", "https://law.lynqook.workers.dev/"],["본예산 길라잡이", "https://lynqook-gif.github.io/budget-guide/"],["교복길라잡이", "https://gyobok-guide.lynqook.workers.dev/"]];const related=document.createElement('section');related.className='desk-related-sites';related.innerHTML='<h3>교행e 사이트 바로가기</h3><div></div>';relatedSites.forEach(([label,url])=>{const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.innerHTML='<span>'+label+'</span><span aria-hidden="true">↗</span>';related.querySelector('div').append(link)});homeUpdates.after(related);
if(c.site==='jeonbuk-gyohaeng'){document.querySelectorAll('.quick2').forEach(box=>{const heading=box.querySelector('h4,h3');if(heading)heading.textContent='교행e 사이트 바로가기';box.querySelectorAll('a').forEach(a=>a.remove());relatedSites.forEach(([label,url])=>{const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.innerHTML='<span>'+label+'</span><span aria-hidden="true">↗</span>';box.append(link)});});}
})();

/* BRAND-20261024 */
/* Presentation layer only. Preserve original handlers and DOM IDs. */
(()=>{
 const site="food";
 const titles={portal:'전북교행길라잡이',law:'법인회계Master',food:'식단표 편집기',looks:'교복길라잡이',budget:'본예산 길라잡이'};
 const chat='https://open.kakao.com/o/g4Tap2Ri';
 document.body.classList.add('brand-'+site);
 let rail=document.querySelector('.desk-rail');
 if(site==='budget'){
  rail=document.createElement('aside');rail.className='brand-rail desk-rail';rail.setAttribute('aria-label','본예산 길라잡이 메뉴');rail.innerHTML='<div class="desk-brand"></div><nav class="desk-menu" aria-label="주 메뉴"></nav><div class="desk-bottom"></div>';document.body.prepend(rail);
  const home=document.getElementById('home'),view=document.getElementById('view');
  const back=document.getElementById('switchBtn')||[...document.querySelectorAll('button')].find(x=>/처음|홈으로|다시 선택/.test(x.textContent));
  const nav=rail.querySelector('nav');
  [['홈',()=>{if(!view.hidden&&back)back.click();home.scrollIntoView({behavior:'smooth'})}],['학교 유형 선택',()=>{if(!view.hidden&&back)back.click();document.querySelector('.pickcard')?.scrollIntoView({behavior:'smooth',block:'center'})}],['편성 절차',()=>{(view.hidden?document.querySelector('.pickcard'):document.querySelector('.budget-workspace'))?.scrollIntoView({behavior:'smooth',block:'start'})}],['공문 문안',()=>{(view.hidden?document.querySelector('.pickcard'):document.querySelector('.budget-current .budget-doc-column'))?.scrollIntoView({behavior:'smooth',block:'start'})}],['붙임 서식',()=>{(view.hidden?document.querySelector('.pickcard'):document.querySelector('.budget-current .attach'))?.scrollIntoView({behavior:'smooth',block:'center'})}]].forEach(([label,action],i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span class="desk-icon">'+String(i+1).padStart(2,'0')+'</span><span>'+label+'</span>';if(i===0)b.classList.add('selected');b.addEventListener('click',action);nav.append(b)});
  const hero=home.querySelector('.hero');hero.replaceChildren();const copy=document.createElement('div');copy.innerHTML='<div class="desk-eyebrow">교행e와 함께하는 예산 편성</div><h1>새 학년도 예산,<br>차근차근 준비하세요.</h1><p class="brand-budget-desc">학교 유형을 선택하고 편성 절차와 공문 문안을 확인하세요.</p>';const mascot=document.createElement('div');mascot.className='brand-budget-mascot';mascot.setAttribute('role','img');mascot.setAttribute('aria-label','교행e 예산 안내 캐릭터');hero.append(copy,mascot);
 }
 if(!rail)return;
 const logo=rail.querySelector('.desk-brand');logo.replaceChildren();const img=document.createElement('img');img.src='design/brand-logo.png';img.alt='교행e';img.width=158;img.height=79;logo.append(img);
 const bar=document.createElement('div');bar.className='brand-topbar';const title=document.createElement('strong');title.textContent=titles[site];const help=document.createElement('a');help.href=chat;help.target='_blank';help.rel='noopener';help.textContent='문의·건의 ↗';bar.append(title,help);rail.after(bar);
 const bottom=rail.querySelector('.desk-bottom');bottom.replaceChildren();const support=document.createElement('a');support.className='desk-support';support.href=chat;support.target='_blank';support.rel='noopener';support.innerHTML='<span><b>카카오 오픈채팅 문의</b></span>';bottom.append(support);
 const nav=rail.querySelector('.desk-menu');
 const label=el=>el?.querySelector('span:last-child')?.textContent.trim()||el?.textContent.trim();
 function before(text,caption){const node=[...nav.querySelectorAll('button,a')].find(el=>label(el)===text);if(!node)return;const h=document.createElement('div');h.className='brand-menu-group';h.textContent=caption;node.before(h)}
 if(site==='portal'){before('업무 계산기','업무 도구');before('실무 지침','업무 참고');const updates=document.querySelector('#menu>.desk-home-updates'),cards=document.querySelector('#menu .menu2');if(updates&&cards)cards.after(updates)}
 if(site==='law'){const parent=nav.querySelector('.desk-accounting-parent');if(parent)parent.querySelector('span:nth-child(2)').textContent='수입·지출';const settle=[...nav.querySelectorAll('button')].find(x=>label(x)==='결산관리');const group=nav.querySelector('.desk-accounting');if(settle&&group)group.before(settle);before('예산관리','예산·결산');before('수입·지출','회계 업무');before('이사회','문서 업무');const cards=document.getElementById('cards'),updates=document.querySelector('#panel-home .desk-home-updates');if(cards&&updates)cards.after(updates)}
 if(site==='looks'){
  const source=document.querySelector('[data-go="basedata"]:not(.desk-rail *)');
  if(source){const b=document.createElement('button');b.type='button';b.innerHTML='<span class="desk-icon">02</span><span>기초자료 입력</span>';b.addEventListener('click',()=>{source.click();nav.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});nav.querySelector('button')?.after(b)}
  before('기초자료 입력','업무 준비');before('나라장터 입찰','업체 선정');before('서식 다운로드','서식·점검');
 }
 if(site==='food'){
  const find=[...nav.querySelectorAll('button')].find(x=>label(x)==='음식 찾기');const upload=document.getElementById('importBtn');
  if(upload){const b=document.createElement('button');b.type='button';b.innerHTML='<span class="desk-icon">↥</span><span>파일 불러오기</span>';b.addEventListener('click',()=>{[...nav.querySelectorAll('button')].find(x=>label(x)==='식단표 작성')?.click();upload.click()});find?.after(b)}
  before('식단표 작성','식단 작성');before('파일 불러오기','파일 관리');before('인쇄 / PDF','출력');
  const home=document.getElementById('desk-food-home'),launch=document.createElement('div');launch.className='brand-launches';
  [['식단표 작성','기간과 요일을 정하고 식단을 작성하세요.','식단표 작성'],['파일 불러오기','엑셀이나 백업 파일로 이어서 작성하세요.','파일 불러오기'],['엑셀 서식 받기','빈 양식을 받아 식단을 준비하세요.','엑셀 서식 받기']].forEach(([t,desc,target],i)=>{const b=document.createElement('button');b.type='button';b.className='brand-launch';b.innerHTML='<span>0'+(i+1)+'</span><strong>'+t+'</strong><small>'+desc+'</small>';b.addEventListener('click',()=>[...nav.querySelectorAll('button')].find(x=>label(x)===target)?.click());launch.append(b)});home?.prepend(launch);
 }
 if(site==='budget')before('편성 절차','예산 편성');
 // Match the approved photo using existing navigation actions; business handlers remain in source HTML.
 const paths={calc:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8v4H8zM8 14h1m3 0h1m3 0h1M8 18h1m3 0h1m3 0h1"/>',doc:'<path d="M14 2H5v20h14V7zM14 2v6h5M8 12h8M8 16h8M8 19h5"/>',folder:'<path d="M3 6h7l2 3h9v12H3zM3 6V3h7l2 3h8v3"/>',book:'<path d="M3 4c3-1 6-1 9 1 3-2 6-2 9-1v16c-3-1-6-1-9 1-3-2-6-2-9-1zM12 5v16"/>',link:'<path d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l6-6a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-6 6a4 4 0 0 1-6 0" transform="translate(1 0) scale(.9)"/>',money:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v5c0 4 16 4 16 0V5M4 10v5c0 4 16 4 16 0v-5M4 15v4c0 4 16 4 16 0v-4"/>',school:'<path d="m3 9 9-7 9 7v13H3zM9 22v-7h6v7M6 10h2m8 0h2M6 13h2m8 0h2"/>',people:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 21v-5c0-5 12-5 12 0v5zM16 13c4 0 6 2 6 5v3h-5"/>',meal:'<path d="M4 2v7m3-7v7m3-7v7M4 7h6M7 9v13M17 2c-4 4-4 10 0 10h3V2zM18 12v10"/>'};
 const icon=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.doc)+'</svg>';
 nav.querySelectorAll('button,a').forEach(button=>{const holder=button.querySelector('.desk-icon');if(!holder)return;const name=label(button);holder.innerHTML=icon(/계산|예산|결산/.test(name)?'calc':/도구|파일|백업|등록대장/.test(name)?'folder':/사이트/.test(name)?'link':/지침/.test(name)?'book':/수입|지출/.test(name)?'money':/이사회|업체/.test(name)?'people':/학교/.test(name)?'school':/음식|식단/.test(name)?'meal':'doc');holder.setAttribute('aria-hidden','true')});
 const colors=[['#287de6','#e8f2ff'],['#159b78','#e3f7ef'],['#e98a15','#fff1df'],['#8654d5','#f0e9ff']];
 function cards(items){const box=document.createElement('div');box.className='photo-home-cards';items.forEach(([title,desc,symbol,action],i)=>{const b=document.createElement('button');b.type='button';b.className='photo-home-card';b.style.setProperty('--photo-color',colors[i%4][0]);b.style.setProperty('--photo-tint',colors[i%4][1]);b.innerHTML='<span class="photo-home-icon">'+icon(symbol)+'</span><strong>'+title+'</strong><small>'+desc+'</small><span class="photo-home-arrow">→</span>';b.addEventListener('click',action);box.append(b)});return box}
 if(site==='portal'){
  const h=document.querySelector('#design-hero h1');if(h)h.innerHTML='교육행정 업무,<br><span>한곳에서.</span>';
  const p=document.querySelector('#design-hero .desk-copy>p');if(p)p.textContent='계산기 · 도구 · 실무 지침을 쉽고 빠르게 찾아보세요.';
  const names=['업무 계산기','도구함','실무 지침','자주 쓰는 사이트'];document.querySelectorAll('#menu .menu2 .mcard .t').forEach((el,i)=>el.textContent=names[i]);
  document.querySelector('#menu .menu2 .c2 .tile')?.replaceChildren();const folder=document.querySelector('#menu .menu2 .c2 .tile');if(folder)folder.innerHTML=icon('folder');
 }
 if(site==='law'){
  const h=document.querySelector('#design-hero h1');if(h)h.innerHTML='법인회계,<br><span>한눈에 정리하세요.</span>';
  const p=document.querySelector('#design-hero .desk-copy>p');if(p)p.textContent='예산부터 결산, 이사회까지 학교법인 회계업무를 쉽고 정확하게.';
  const source=document.getElementById('cards');source?.classList.add('photo-native-cards');
  const activate=id=>()=>document.querySelector('#tabs [data-tab="'+id+'"]')?.click();
  source?.before(cards([['예산관리','본예산·추경 편성과 총괄표 작성','doc',activate('acc')],['수입·지출','결의서 작성부터 장부 정리까지','money',activate('sechul')],['결산관리','결산서 작성과 보고 자료 확인','calc',activate('settle')],['이사회','명단·회의 서식과 회의록 관리','people',activate('board')]]));
 }
 if(site==='food'){
  const h=document.querySelector('#design-hero h1');if(h)h.innerHTML='건강한 한 끼,<br><span>편리한 식단 작성.</span>';
  const invoke=name=>()=>[...nav.querySelectorAll('button')].find(x=>label(x)===name)?.click();
  document.querySelector('.brand-launches')?.before(cards([['식단표 작성','달력형 식단표를 쉽게 작성하세요.','meal',invoke('식단표 작성')],['파일 불러오기','기존 엑셀·백업 파일로 이어서 작성하세요.','folder',invoke('파일 불러오기')],['엑셀 서식 받기','바로 사용할 수 있는 빈 양식입니다.','doc',invoke('엑셀 서식 받기')]]));
 }
 if(site==='looks'){
  const h=document.querySelector('#design-hero h1');if(h)h.innerHTML='교복 구매,<br><span>절차부터 서식까지.</span>';
  const home=document.querySelector('[data-page="home"] .homepage');
  const go=id=>()=>{const source=document.querySelector('[data-go="'+id+'"]:not(.desk-rail *)');source?.click()};
  home?.prepend(cards([['한 번에 끝내기','공문 문안을 복사하고 붙임 서식까지 준비하세요.','doc',go('docs')],['기초자료 입력','학교·일정·금액을 한 번에 입력하세요.','folder',go('basedata')],['추진 절차','단계별 업무와 준비사항을 확인하세요.','calc',go('flow')],['입찰·계약 안내','나라장터 입찰·수의계약 안내','people',go('g2b')]]));
  const docs=[...nav.querySelectorAll('button')].find(b=>label(b)==='공문 예시');if(docs){docs.querySelector('span:last-child').textContent='한 번에 끝내기';nav.querySelector('button')?.after(docs)}
  document.querySelectorAll('[data-page="docs"] h1,[data-page="docs"]>.phead h2').forEach(el=>el.textContent='한 번에 끝내기');
 }
 if(site==='budget'){document.querySelectorAll('.pickcard').forEach(card=>{const span=document.createElement('span');span.className='photo-choice-icon';span.innerHTML=icon('school');span.setAttribute('aria-hidden','true');card.prepend(span)})}
 document.querySelectorAll('.desk-related-sites a').forEach((a,i)=>{const span=document.createElement('span');span.className='photo-related-icon';span.innerHTML=icon(['calc','school','meal','doc'][i%4]);span.setAttribute('aria-hidden','true');a.prepend(span)});
 document.querySelectorAll('.desk-home-update-history').forEach(history=>{const details=document.createElement('details');details.className='photo-history';const summary=document.createElement('summary');summary.textContent='이전 업데이트 보기';history.before(details);details.append(summary,history)});
 const homeNotice=site==='budget'?document.querySelector('#home .news'):document.querySelector('.desk-home-updates');
 if(homeNotice){
  const paired=document.createElement('div');paired.className='photo-home-bottom';homeNotice.before(paired);paired.append(homeNotice);
  const heading=homeNotice.querySelector('header h2,h3');if(heading)heading.textContent='공지사항';
  const small=homeNotice.querySelector('header small');if(small)small.textContent='업데이트 안내';
  homeNotice.querySelectorAll('.desk-home-update-latest ul').forEach(ul=>{const details=document.createElement('details');details.className='photo-notice-details';const summary=document.createElement('summary');summary.textContent='변경 내용 보기';ul.before(details);details.append(summary,ul)});
  const instructions={portal:['업무 계산기·도구함에서 필요한 업무를 선택하세요.','자료를 입력하거나 엑셀 파일을 불러오세요.','결과를 확인하고 필요한 파일로 저장하세요.'],law:['예산·수입·지출 등 필요한 업무를 선택하세요.','기초자료를 입력하고 작성 내용을 확인하세요.','미리보기에서 검토한 뒤 저장·출력하세요.'],food:['식단표 작성에서 기간과 요일을 정하세요.','식단을 입력하거나 엑셀·백업 파일을 불러오세요.','중복을 확인하고 엑셀·PDF로 저장하세요.'],looks:['한 번에 끝내기에서 필요한 공문을 찾아보세요.','기초자료를 입력하면 문안에 반영됩니다.','제목·본문을 복사하고 붙임 서식을 준비하세요.'],budget:['공립학교·사립학교 중 학교 유형을 선택하세요.','학교 정보와 학년도를 입력하고 단계를 확인하세요.','공문 문안을 복사하고 붙임 서식을 준비하세요.']};
  const guide=document.createElement('section');guide.className='photo-quick-guide';guide.innerHTML='<h2>사용 방법</h2><ol>'+instructions[site].map((t,i)=>'<li><b>'+(i+1)+'</b><span>'+t+'</span></li>').join('')+'</ol>';paired.append(guide);
 }
 const approvedBanner=site==='budget'?document.querySelector('#home>.hero'):document.getElementById('design-hero');
 approvedBanner?.classList.add('photo-live-hero');
 if(site==='portal'){const search=document.querySelector('.hero2 .hsearch');if(search&&approvedBanner)approvedBanner.append(search)}
 if(site==='looks'){const roles=document.querySelector('.roleswitch');if(roles)bar.append(roles)}
 // Source footer content is not a business function. Keep author, use only Kakao for contact.
 document.querySelectorAll('footer.credit,footer#foot>.wrap,footer .desk-credit,.desk-credit').forEach(el=>{el.classList.add('brand-credit');el.replaceChildren(document.createTextNode('제작자: 정주고등학교 박지은'))});
 document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{const p=a.closest('p,div');if(p&&p.textContent.trim().length<85&&!p.querySelector('input,button')){p.textContent='';p.hidden=true}else a.remove()});
})();

/* Readable suite: remove old banner mode, preserve original controls. */
(()=>{
 const hero=document.getElementById('design-hero');hero?.classList.remove('photo-live-hero','photo-fixed-hero');
 const eyebrow=hero?.querySelector('.desk-eyebrow');if(eyebrow)eyebrow.textContent='학교 행정, 교행e와 함께';
 document.querySelectorAll('.photo-notice-details').forEach(x=>x.open=true);
 const nav=document.querySelector('.desk-menu');
 if(document.body.classList.contains('brand-looks')&&nav){
  const docs=nav.querySelector('[data-desk-action="go:docs"]');
  if(docs){docs.querySelector('span:last-child').textContent='한 번에 끝내기';nav.querySelector('button')?.after(docs);}
 }
})();

/* MOBILE-20261026 */
/* Presentation only: fold existing navigation without replacing its actions. */
(() => {
  const rail = document.querySelector('.desk-rail');
  const bar = document.querySelector('.brand-topbar');
  if (!rail || !bar) return;
  const mobile = matchMedia('(max-width:800px)');
  rail.id ||= 'gyohaeng-navigation';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu-toggle';
  toggle.setAttribute('aria-controls', rail.id);
  toggle.innerHTML = '<span aria-hidden="true">☰</span><span>메뉴</span>';
  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.tabIndex = -1;
  backdrop.setAttribute('aria-label', '메뉴 닫기');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'mobile-menu-close';
  closeButton.textContent = '메뉴 닫기 ×';
  rail.prepend(closeButton);
  bar.prepend(toggle);
  rail.after(backdrop);
  const roles = bar.querySelector('.roleswitch');
  const roleAnchor = roles ? document.createComment('desktop role controls') : null;
  if (roles) roles.before(roleAnchor);
  let opened = false;
  function setOpen(value, restoreFocus = false) {
    opened = mobile.matches && value;
    document.body.classList.toggle('mobile-menu-open', opened);
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? '메뉴 닫기' : '메뉴 열기');
    rail.inert = mobile.matches && !opened;
    if (restoreFocus) toggle.focus();
    if (opened) closeButton.focus();
  }
  function syncViewport() {
    setOpen(false);
    if (roles) {
      if (mobile.matches) rail.querySelector('.desk-bottom')?.before(roles);
      else roleAnchor.after(roles);
    }
  }
  toggle.addEventListener('click', () => setOpen(!opened));
  closeButton.addEventListener('click', () => setOpen(false, true));
  backdrop.addEventListener('click', () => setOpen(false, true));
  rail.addEventListener('click', event => {
    const action = event.target.closest('.desk-menu button,.desk-menu a');
    if (action && !action.classList.contains('desk-accounting-parent')) setOpen(false, true);
  });
  document.addEventListener('keydown', event => {
    if (!opened) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
    if (event.key === 'Tab') {
      const items = [...rail.querySelectorAll('button,a[href],input,select,[tabindex="0"]')]
        .filter(el => !el.disabled && el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  mobile.addEventListener('change', syncViewport);
  syncViewport();
})();

/* Match the visible help to the consolidated navigation. */
(()=>{const step=document.querySelector('#guide ol li:nth-child(4)');if(step)step.textContent='왼쪽 메뉴의 인쇄 / PDF로 출력하세요. 휴대폰에서는 위쪽 메뉴 버튼을 여세요.';})();
