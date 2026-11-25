(() => {
  const get = id => document.getElementById(id);
  const workspace = document.querySelector('.wrap');
  const toolbar = document.querySelector('header.bar');
  const settings = document.querySelector('.side');
  const credit = document.querySelector('.credit');
  const finder = get('find');
  const contact = credit.querySelector('a').href;

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="food-header">
      <div class="food-header-inner">
        <button type="button" class="food-brand" data-view="home" aria-label="식단표 편집기 홈">
          <img src="design/brand-logo.webp" alt="교행e">
        </button>
        <button type="button" class="btn food-toggle" aria-label="메뉴" aria-expanded="false" aria-controls="food-nav">☰</button>
        <nav id="food-nav" aria-label="주 메뉴">
          <button type="button" data-view="home">홈</button>
          <button type="button" data-view="edit">식단표 작성</button>
          <button type="button" data-view="find">음식 찾기</button>
        </nav>
        <a class="food-contact" href="${contact}" target="_blank" rel="noopener">문의·건의</a>
      </div>
    </header>
    <svg class="food-logo-filter" aria-hidden="true" width="0" height="0"><filter id="food-muted-logo" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues=".118 .118 .325 .325 .325"/><feFuncG type="table" tableValues=".227 .227 .510 .510 .510"/><feFuncB type="table" tableValues=".373 .373 .706 .706 .706"/></feComponentTransfer></filter></svg>
    <main class="food-home">
      <section class="food-hero">
        <h1>교행e의 식단표 편집기</h1>
        <p>식단을 작성하고 겹치는 음식을 확인한 뒤 엑셀이나 PDF로 저장하세요.</p>
        <button type="button" class="btn primary" data-view="edit">식단표 작성 시작</button>
      </section>
      <section aria-labelledby="food-tasks">
        <h2 id="food-tasks">식단표 작업</h2>
        <div class="food-cards">
          <button type="button" data-view="edit"><strong>식단표 작성</strong><span>기간과 끼니를 골라 표에 직접 입력하세요.</span></button>
          <button type="button" data-view="edit" data-action="xlUpload"><strong>엑셀 올리기</strong><span>작성해 둔 엑셀에서 식단을 불러오세요.</span></button>
          <button type="button" data-action="xlTemplate"><strong>양식 받기</strong><span>날짜가 자동으로 채워지는 엑셀 양식을 받아요.</span></button>
        </div>
      </section>
      <div class="food-home-columns">
        <section aria-labelledby="food-news">
          <h2 id="food-news">공지사항</h2>
          <button type="button" class="food-text-button" id="food-all-news">전체 보기</button>
          <div class="food-news-list"></div>
        </section>
        <section aria-labelledby="food-guide-title">
          <h2 id="food-guide-title">사용 방법</h2>
          <ol class="food-guide">
            <li><span aria-hidden="true">①</span> 기간과 끼니를 고르세요.</li>
            <li><span aria-hidden="true">②</span> 표에 입력하거나 엑셀 파일을 올리세요.</li>
            <li><span aria-hidden="true">③</span> 확인하고 인쇄하거나 파일로 받으세요.</li>
          </ol>
        </section>
      </div>
      <section aria-labelledby="food-sites">
        <h2 id="food-sites">교행e 사이트 바로가기</h2>
        <ul class="food-sites">
          <li><a href="https://jeonbuk-gyohaeng.pages.dev/" target="_blank" rel="noopener">전북교행길라잡이</a></li>
          <li><a href="https://law.lynqook.workers.dev/" target="_blank" rel="noopener">법인회계Master</a></li>
          <li><a href="https://lynqook-gif.github.io/budget-guide/" target="_blank" rel="noopener">본예산 길라잡이</a></li>
          <li><a href="https://gyobok-guide.lynqook.workers.dev/" target="_blank" rel="noopener">교복길라잡이</a></li>
          <li><a href="https://lynqook-gif.github.io/meal-check/" target="_blank" rel="noopener">급식췍</a></li>
          <li><a href="https://jaemul.lynqook.workers.dev/" target="_blank" rel="noopener">재물콕</a></li>
        </ul>
      </section>
    </main>
  `);

  const home = document.querySelector('.food-home');
  home.querySelectorAll('.food-sites a').forEach(link => {
    link.insertAdjacentHTML('beforeend', '<span aria-hidden="true">↗</span>');
  });
  const nav = get('food-nav');
  const toggle = document.querySelector('.food-toggle');
  const title = toolbar.querySelector('h1');
  title.firstChild.textContent = '식단표 작성';
  title.tabIndex = -1;
  workspace.prepend(toolbar);
  workspace.after(credit);
  get('pages').before(Object.assign(document.createElement('p'), {
    className: 'food-preview-hint',
    textContent: '표를 옆으로 밀면 나머지 요일이 보여요.'
  }));
  settings.id = 'food-settings';
  settings.tabIndex = -1;

  const labels = {
    xlUpload: '엑셀 올리기', xlTemplate: '양식 받기', xlExport: '식단표 엑셀 받기',
    importBtn: '작업 불러오기', exportBtn: '작업 저장', printBtn: '인쇄 / PDF 저장',
    clearBtn: '메뉴 비우기'
  };
  const actions = toolbar.querySelector('.actions');
  Object.entries(labels).forEach(([id, label]) => {
    const button = get(id);
    button.textContent = label;
    if (id !== 'clearBtn') actions.append(button);
  });
  get('findBtn').hidden = true;
  actions.after(get('xlMsg'));
  const excelBox = Array.from(settings.children).find(section => section.querySelector('h2')?.textContent === '엑셀로 입력');
  const excelHelp = Array.from(excelBox.querySelectorAll('.hint'));
  excelBox.remove();

  const guide = get('guide');
  guide.append(...excelHelp);
  guide.querySelectorAll('li, p').forEach(el => {
    el.innerHTML = el.innerHTML.replace('왼쪽 메뉴의 ', '도구줄의 ').replace('<b>엑셀로 입력</b>', '<b>엑셀 올리기</b>').replace(/[🖨💾📂⬇] /gu, '');
  });
  get('perPage').closest('.box').querySelector('.hint').innerHTML =
    '용지와 줄 수를 고른 뒤 도구줄의 <b>인쇄 / PDF 저장</b>을 누르세요.';

  const settingsLink = document.createElement('a');
  settingsLink.className = 'btn food-settings-link';
  settingsLink.href = '#food-settings';
  settingsLink.textContent = '식단 설정';
  settingsLink.addEventListener('click', event => {
    event.preventDefault();
    settings.focus({preventScroll:true});
    settings.scrollIntoView();
  });
  actions.append(settingsLink);

  const releases = document.createElement('dialog');
  releases.className = 'desk-release food-releases';
  releases.setAttribute('aria-labelledby', 'food-release-title');
  releases.innerHTML = `
    <header><h2 id="food-release-title">공지사항</h2><form method="dialog"><button class="btn">닫기</button></form></header>
    <div class="desk-release-body">
      <article><time datetime="2026-11-25">2026. 11. 25.</time><h3>사이트를 새 모습으로 바꿨어요</h3><ul><li>화면을 깔끔하게 정리했어요.</li><li>식단표 종이와 인쇄는 그대로예요.</li><li>예전 화면이 보이면 <b>Ctrl+F5</b>를 눌러 주세요.</li></ul></article>
      <article><time datetime="2026-11-24">2026. 11. 24.</time><h3>바로가기를 교행e 카드로 바꿨어요</h3><ul><li>사이트 바로가기를 교행e 카드로 바꿨어요.</li></ul></article>
      <article><time datetime="2026-11-24">2026. 11. 24.</time><h3>첫 화면 크리스마스 단장</h3><ul><li>첫 화면을 크리스마스 느낌으로 바꿨어요. 쿠키 굽는 교행e를 만나 보세요.</li><li>교행e 사이트 바로가기를 보기 좋게 정리했어요.</li><li>배너 높이를 줄였어요.</li></ul></article>
      <article><time datetime="2026-11-24">2026. 11. 24.</time><h3>엑셀 올리기 · 되돌리기 · 알레르기 안내</h3><ul><li>엑셀을 올릴 때 지금 식단이 있으면 <b>새 시트로 넣을지</b> 물어봐요. 메뉴 비우기·시트 지우기도 <b>되돌리기</b>가 돼요.</li><li>인쇄 칸에서 용지 아래 <b>알레르기 번호 안내</b>를 넣을 수 있어요(기본 꺼짐). 버튼 이름을 다른 교행e 도구와 같게 맞췄어요.</li><li>엑셀 기능이 인터넷 없이도 돼요. 2028년 설날 날짜를 바로잡았어요.</li></ul></article>
      <article><time datetime="2026-11-16">2026. 11. 16.</time><h3>사이트 바로가기에 급식췍·재물콕 추가</h3><ul><li>교행e 사이트 바로가기에 <b>급식췍</b>(바코드로 급식 체크)과 <b>재물콕</b>(휴대폰으로 재물조사)을 넣었어요.</li><li>바로가기마다 사이트에 맞는 그림을 붙였어요.</li></ul></article>
      <article><time datetime="2026-10-28">2026. 10. 28.</time><h3>첫 화면 배너 · 메뉴 비우기 위치</h3><ul><li>첫 화면 위쪽을 <b>급식실 배너 그림</b>으로 바꿨어요.</li><li><b>메뉴 비우기</b> 버튼을 시트 탭의 <b>+ 새 시트 · 복제</b> 옆으로 옮겼어요. (위쪽 막대 없앰, 두 번 눌러야 비워지는 건 그대로)</li><li>식단표와 입력해 둔 자료는 그대로예요.</li></ul></article>
      <article><time datetime="2026-10-25">2026. 10. 25.</time><h3>디자인 일괄 수정</h3><ul><li>교행e 도구 5개(전북교행길라잡이·법인회계Master·본예산 길라잡이·식단표 편집기·교복길라잡이) 화면을 같은 모양으로 정리했어요.</li><li>글씨를 더 크고 또렷하게, 메뉴와 선택한 칸을 알아보기 쉽게 바꿨어요.</li><li>문의·건의는 카카오 오픈채팅으로 받아요.</li><li>기능과 입력해 둔 자료는 그대로예요.</li></ul></article>
      <article><time datetime="2026-10-15">2026. 10. 15.</time><h3>식단표 기능 추가</h3><ul><li>요일(월~토) 체크로 원하는 요일만 표에 보이게 했어요.</li><li>인쇄 칸에서 글씨 크기를 고를 수 있어요.</li><li>칸보다 긴 메뉴는 그 칸만 글씨가 작아져 다 보여요.</li><li>엑셀 불러오기 때 빈 줄 때문에 줄 수가 늘어나지 않게 했어요.</li></ul></article>
      <article><time datetime="2026-10-12">2026. 10. 12.</time><h3>디자인 수정</h3><ul><li>버튼 글자의 대비를 높이고 찾기 창이 화면 밖으로 나가지 않도록 수정했습니다.</li><li>날짜 표시와 직접 수정, 식단표의 셀 높이를 유지했습니다.</li><li>설정 영역의 글자 크기와 간격을 정리했습니다.</li></ul></article>
    </div>`;
  document.body.append(releases);
  get('food-all-news').addEventListener('click', () => releases.showModal());
  const news = document.querySelector('.food-news-list');
  Array.from(releases.querySelectorAll('time')).slice(0, 5).forEach(date => {
    const row = document.createElement('article');
    const heading = date.nextElementSibling;
    const description = document.createElement('p');
    description.textContent = heading.nextElementSibling.firstElementChild.textContent;
    row.append(date.cloneNode(true), heading.cloneNode(true), description);
    news.append(row);
  });

  function menu(open) {
    toggle.setAttribute('aria-expanded', String(open));
  }

  function setCurrent(view) {
    nav.querySelectorAll('[data-view]').forEach(button => {
      if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function show(view) {
    const atHome = view === 'home';
    if (view !== 'find' && !finder.hidden) get('findClose').click();
    document.body.classList.toggle('food-at-home', atHome);
    home.hidden = !atHome;
    setCurrent(view);
    menu(false);
    window.scrollTo(0, 0);
    if (view === 'find') get('findBtn').click();
    else (atHome ? home.querySelector('h1') : title).focus({preventScroll:true});
  }

  home.querySelector('h1').tabIndex = -1;
  document.querySelectorAll('[data-view], [data-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.view) show(button.dataset.view);
      if (button.dataset.action) get(button.dataset.action).click();
    });
  });
  toggle.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelector('.food-header').addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      menu(false);
      toggle.focus();
    }
  });

  new MutationObserver(() => {
    if (!finder.hidden && !home.hidden) {
      document.body.classList.remove('food-at-home');
      home.hidden = true;
      window.scrollTo(0, 0);
    }
    if (home.hidden) setCurrent(finder.hidden ? 'edit' : 'find');
  }).observe(finder, {attributes:true, attributeFilter:['hidden']});

  document.body.classList.add('food-at-home');
  setCurrent('home');
})();
