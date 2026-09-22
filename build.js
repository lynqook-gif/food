// 식단표양식.xlsx -> 식단표_자동.xlsx
// - '설정' 시트의 시작일 하나로 모든 주의 날짜 자동 생성
// - 중복 음식 조건부 서식 (같은 날: 빨강 / 같은 주: 주황 / 전체: 노랑), 제외 목록 지원
// 사용법: node build.js   (Excel 없이 Node만 필요, 원본 양식은 수정하지 않음)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const SRC = path.join(__dirname, '식단표양식.xlsx');
const OUT = path.join(__dirname, '식단표_자동.xlsx');
const WEEKS = 6;          // 원본 4주 + 2주 추가 (한 달이 6주에 걸치는 경우까지)
const BLOCK = 23;         // 한 주 블록의 행 수 (요일 1 + 날짜 1 + 조/중/석 각 7)
const COLS = ['B', 'C', 'D', 'E', 'F', 'G'];
const DEFAULT_START = new Date(Date.UTC(2026, 9, 1));
const DEFAULT_EXCLUDE = ['쌀밥', '잡곡밥', '배추김치', '깍두기'];

const serial = d => Math.round((d - Date.UTC(1899, 11, 30)) / 86400000);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- unzip ----
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'menu-'));
const ps = (cmd) => execFileSync('powershell.exe', ['-NoProfile', '-Command', cmd], { stdio: 'inherit' });
ps(`Add-Type -A System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::ExtractToDirectory('${SRC}','${work}')`);
const P = (...p) => path.join(work, ...p);
const read = p => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s, 'utf8');

// ---- styles: fills, dxfs, 새 셀 스타일 ----
let styles = read(P('xl', 'styles.xml'));
const newFills = ['FFFF9999', 'FFFFCC80', 'FFFFF59D', 'FFDDEBF7'];
styles = styles.replace(/<fills count="(\d+)">([\s\S]*?)<\/fills>/, (m, n, body) =>
  `<fills count="${+n + newFills.length}">${body}` +
  newFills.map(c => `<fill><patternFill patternType="solid"><fgColor rgb="${c}"/><bgColor indexed="64"/></patternFill></fill>`).join('') +
  '</fills>');
const fillId = { red: 2, orange: 3, yellow: 4, input: 5 };
styles = styles.replace('<numFmts count="1">', '<numFmts count="2">')
  .replace('</numFmts>', '<numFmt numFmtId="177" formatCode="yyyy&quot;-&quot;mm&quot;-&quot;dd&quot; (&quot;aaa&quot;)&quot;"/></numFmts>');
const xfBase = 'xfId="0" applyFont="1" applyBorder="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>';
const newXfs = [
  `<xf numFmtId="177" fontId="3" fillId="${fillId.input}" borderId="1" applyNumberFormat="1" ${xfBase}`, // 32 시작일 입력
  `<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>`, // 33 굵은 제목
  `<xf numFmtId="0" fontId="2" fillId="${fillId.red}" borderId="1" ${xfBase}`,    // 34
  `<xf numFmtId="0" fontId="2" fillId="${fillId.orange}" borderId="1" ${xfBase}`, // 35
  `<xf numFmtId="0" fontId="2" fillId="${fillId.yellow}" borderId="1" ${xfBase}`, // 36
  `<xf numFmtId="0" fontId="2" fillId="0" borderId="1" ${xfBase}`,                // 37 제외 목록 칸
];
styles = styles.replace(/<cellXfs count="(\d+)">([\s\S]*?)<\/cellXfs>/, (m, n, body) =>
  `<cellXfs count="${+n + newXfs.length}">${body}${newXfs.join('')}</cellXfs>`);
const dxf = c => `<dxf><font><b/></font><fill><patternFill><bgColor rgb="${c}"/></patternFill></fill></dxf>`;
styles = styles.replace('<dxfs count="0"/>',
  `<dxfs count="4">${dxf('FFFF9999')}${dxf('FFFFCC80')}${dxf('FFFFF59D')}<dxf><font><color rgb="FFB0B0B0"/></font></dxf></dxfs>`);
write(P('xl', 'styles.xml'), styles);
const DXF = { day: 0, week: 1, all: 2, grey: 3 };

// ---- 식단표 시트 ----
let sheet = read(P('xl', 'worksheets', 'sheet1.xml'));

// 5주차: 4주차 블록(72~94행)을 복제
const rowRe = /<row r="(\d+)"[\s\S]*?<\/row>/g;
const rows = {};
for (const m of sheet.matchAll(rowRe)) rows[+m[1]] = m[0];
let extra = '';
for (let w = 4; w < WEEKS; w++) {
  const shift = BLOCK * (w - 3);
  for (let r = 72; r <= 94; r++) {
    extra += rows[r]
      .replace(/<row r="\d+"/, `<row r="${r + shift}"`)
      .replace(/ r="([A-G])(\d+)"/g, (m, c, n) => ` r="${c}${+n + shift}"`);
  }
}
sheet = sheet.replace('</sheetData>', extra + '</sheetData>');
const lastRow = 3 + BLOCK * WEEKS;
sheet = sheet.replace('<dimension ref="A1:G94"/>', `<dimension ref="A1:G${lastRow}"/>`);
let merges = '';
for (let w = 4; w < WEEKS; w++) {
  const b = 3 + BLOCK * w;
  merges += `<mergeCell ref="A${b}:A${b + 1}"/><mergeCell ref="A${b + 2}:A${b + 8}"/>` +
    `<mergeCell ref="A${b + 9}:A${b + 15}"/><mergeCell ref="A${b + 16}:A${b + 22}"/>`;
}
sheet = sheet.replace(/<mergeCells count="(\d+)">/, (m, n) => `<mergeCells count="${+n + 4 * (WEEKS - 4)}">`)
  .replace('</mergeCells>', merges + '</mergeCells>');

// 제목
const startSerial = serial(DEFAULT_START);
const monday = DEFAULT_START.getUTCDay() === 0 ? startSerial + 1 : startSerial - ((DEFAULT_START.getUTCDay() + 6) % 7);
sheet = sheet.replace('<c r="A1" s="31" t="s"><v>9</v></c>',
  `<c r="A1" s="31" t="str"><f>${esc('TEXT(시작일,"yyyy""년"" m""월""")&" 식단표"')}</f>` +
  `<v>${DEFAULT_START.getUTCFullYear()}년 ${DEFAULT_START.getUTCMonth() + 1}월 식단표</v></c>`);

// 날짜 행
const dateRows = [];
for (let w = 0; w < WEEKS; w++) {
  const r = 4 + BLOCK * w;
  dateRows.push(r);
  COLS.forEach((col, d) => {
    const s = col === 'G' ? 7 : 6;
    const f = (w === 0 && d === 0) ? '시작일-WEEKDAY(시작일,3)+IF(WEEKDAY(시작일)=1,7,0)' : `$B$4+${7 * w + d}`;
    const cell = `<c r="${col}${r}" s="${s}"><f>${f}</f><v>${monday + 7 * w + d}</v></c>`;
    sheet = sheet.replace(new RegExp(`<c r="${col}${r}" s="\\d+"/>`), cell);
  });
}

// 조건부 서식
let pr = 1;
const rule = (dxfId, formula) =>
  `<cfRule type="expression" dxfId="${dxfId}" priority="${pr++}"><formula>${esc(formula)}</formula></cfRule>`;
let cf = `<conditionalFormatting sqref="${dateRows.map(r => `B${r}:G${r}`).join(' ')}">` +
  rule(DXF.grey, 'MONTH(B4)<>MONTH(시작일)') + '</conditionalFormatting>';
const allRange = `$B$5:$G$${lastRow}`;
for (let w = 0; w < WEEKS; w++) {
  const top = 5 + BLOCK * w, bot = top + 20;
  const cond = `LEN(TRIM(B${top}))>0,COUNTIF(제외목록,TRIM(B${top}))=0`;
  cf += `<conditionalFormatting sqref="B${top}:G${bot}">` +
    rule(DXF.day, `AND(${cond},COUNTIF(B$${top}:B$${bot},B${top})>1)`) +
    rule(DXF.week, `AND(${cond},COUNTIF($B$${top}:$G$${bot},B${top})>1)`) +
    rule(DXF.all, `AND(${cond},COUNTIF(${allRange},B${top})>1)`) +
    '</conditionalFormatting>';
}
sheet = sheet.replace('<phoneticPr fontId="1" type="noConversion"/><pageMargins',
  `<phoneticPr fontId="1" type="noConversion"/>${cf}<pageMargins`);
write(P('xl', 'worksheets', 'sheet1.xml'), sheet);

// ---- 설정 시트 ----
const is = (ref, s, text) => `<c r="${ref}" s="${s}" t="inlineStr"><is><t>${esc(text)}</t></is></c>`;
const EX_TOP = 10, EX_BOT = 59;
let srows = '';
srows += `<row r="1" ht="30" customHeight="1">${is('B1', 33, '식단표 설정')}</row>`;
srows += `<row r="3" ht="30" customHeight="1">${is('B3', 4, '시작일')}<c r="C3" s="32"><v>${startSerial}</v></c>` +
  is('D3', 4, '← 아무 날짜나 입력하면 그 주 월요일부터 날짜가 채워집니다') + '</row>';
srows += `<row r="5" ht="24" customHeight="1">${is('B5', 33, '중복 표시 색상')}</row>`;
srows += `<row r="6" ht="24" customHeight="1">${is('B6', 34, '같은 날 중복')}${is('C6', 4, '하루(조·중·석) 안에서 겹침')}</row>`;
srows += `<row r="7" ht="24" customHeight="1">${is('B7', 35, '같은 주 중복')}${is('C7', 4, '같은 주(월~토) 안에서 겹침')}</row>`;
srows += `<row r="8" ht="24" customHeight="1">${is('B8', 36, '한 달 중복')}${is('C8', 4, `${WEEKS}주 전체에서 겹침`)}</row>`;
srows += `<row r="9" ht="30" customHeight="1">${is('B9', 33, '중복 검사 제외 음식')}${is('C9', 4, '매일 나오는 밥·김치 등은 여기에 적으면 표시되지 않습니다')}</row>`;
for (let r = EX_TOP; r <= EX_BOT; r++) {
  const v = DEFAULT_EXCLUDE[r - EX_TOP];
  srows += `<row r="${r}" ht="22" customHeight="1">${v ? is(`B${r}`, 37, v) : `<c r="B${r}" s="37"/>`}</row>`;
}
write(P('xl', 'worksheets', 'sheet2.xml'),
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
  `<dimension ref="B1:D${EX_BOT}"/><sheetViews><sheetView workbookViewId="0"><selection activeCell="C3" sqref="C3"/></sheetView></sheetViews>` +
  '<sheetFormatPr defaultRowHeight="17.4"/><cols><col min="1" max="1" width="3" customWidth="1"/>' +
  '<col min="2" max="2" width="24" customWidth="1"/><col min="3" max="3" width="26" customWidth="1"/><col min="4" max="4" width="60" customWidth="1"/></cols>' +
  `<sheetData>${srows}</sheetData>` +
  '<dataValidations count="1"><dataValidation type="date" operator="greaterThan" allowBlank="1" showErrorMessage="1" errorTitle="날짜 입력" error="날짜 형식으로 입력하세요 (예: 2026-10-01)" sqref="C3"><formula1>1</formula1></dataValidation></dataValidations>' +
  '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>');

// ---- workbook / rels / content types ----
let wb = read(P('xl', 'workbook.xml'));
wb = wb.replace('</sheets>', '<sheet name="설정" sheetId="5" r:id="rId5"/></sheets>')
  .replace('</definedNames>',
    `<definedName name="시작일">설정!$C$3</definedName><definedName name="제외목록">설정!$B$${EX_TOP}:$B$${EX_BOT}</definedName></definedNames>`)
  .replace('<calcPr calcId="191029"/>', '<calcPr calcId="191029" fullCalcOnLoad="1"/>');
write(P('xl', 'workbook.xml'), wb);
let rels = read(P('xl', '_rels', 'workbook.xml.rels'));
rels = rels.replace('</Relationships>',
  '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/></Relationships>');
write(P('xl', '_rels', 'workbook.xml.rels'), rels);
let ct = read(P('[Content_Types].xml'));
ct = ct.replace('</Types>',
  '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
write(P('[Content_Types].xml'), ct);

// ---- zip (항목 경로는 '/' 구분자로) ----
if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
ps(`Add-Type -A System.IO.Compression; Add-Type -A System.IO.Compression.FileSystem;
$z=[IO.Compression.ZipFile]::Open('${OUT}','Create');
Get-ChildItem -LiteralPath '${work}' -Recurse -File | % {
  $n=$_.FullName.Substring(${work.length + 1}).Replace('\\','/');
  [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z,$_.FullName,$n) };
$z.Dispose()`);
fs.rmSync(work, { recursive: true, force: true });
console.log('생성 완료:', OUT);

// 식단표.html의 '엑셀 서식 받기'용으로 방금 만든 엑셀을 넣어 둠
const HTML = path.join(__dirname, '식단표.html');
if (fs.existsSync(HTML)) {
  const b64 = fs.readFileSync(OUT).toString('base64');
  const html = fs.readFileSync(HTML, 'utf8')
    .replace(/(<script id="tplData" type="application\/octet-stream">)[\s\S]*?(<\/script>)/, `$1${b64}$2`);
  fs.writeFileSync(HTML, html, 'utf8');
  console.log('서식 넣음:', HTML);
}
