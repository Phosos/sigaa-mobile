/* ===== SIGAA Mobile v2 (redesign a partir dos testes do Seminário 3) =====
   Mudanças em relação à v1: ver REDESIGN.md. Dados fictícios (Ciência da Computação, UFRRJ). */
const VERSION='v2';
const TURMAS=[
 {id:'sd',n:'Sistemas Distribuídos',c:'IC768',f:8,l:15},
 {id:'cp',n:'Compiladores',c:'IC741',f:1,l:15},
 {id:'rc',n:'Redes de Computadores',c:'IC732',f:3,l:15},
 {id:'sc',n:'Seminários em Computação',c:'AA401',f:0,l:8},
 {id:'ia',n:'Inteligência Artificial',c:'IC755',f:2,l:15},
 {id:'tc',n:'Teoria da Computação',c:'IC719',f:3,l:15},
 {id:'bd',n:'Banco de Dados II',c:'IC662',f:1,l:15},
 {id:'es',n:'Engenharia de Software',c:'IC650',f:0,l:15}];
const GRUPOS=[
 {id:'mat',t:'Matrícula',s:'Fazer, acompanhar, trancar',items:['Realizar matrícula','Matrícula em turma de férias','Matrícula em período suplementar','Matrícula extraordinária','Matrícula com flexibilização','Meu plano de matrículas','Resultado do processamento','Comprovante de matrícula','Orientações','Trancar ou suspender','Cancelar matrícula']},
 {id:'doc',t:'Documentos',s:'Histórico, atestados',items:['Histórico','Atestado de matrícula','Declaração de vínculo','Comprovante de integralização','Estrutura curricular']},
 {id:'not',t:'Notas e desempenho',s:'Notas, índices, reposição',items:['Consultar notas','IRA e índices','Reposição de prova','Revisão de nota','Boletim','Calendário de provas']},
 {id:'cal',t:'Calendário e turmas',s:'Datas e oferta',items:['Calendário acadêmico','Oferta de turmas','Horários','Locais de aula']},
 {id:'for',t:'Formatura',s:'Colação, diploma, TCC',items:['Colação de grau','Diploma','Entrega de TCC','Banca de defesa','Pendências para formatura']},
 {id:'out',t:'Outros módulos',s:'Pesquisa, extensão, bolsas',items:['Iniciação científica','Projetos de extensão','Bolsas','Monitoria','Estágio','Atividades complementares','Eventos']}];
const NOTAS={'2026.1':[
 {n:'Estruturas de Dados',c:'IC601',r:'7,8',f:0,p:['7,2','8,4','—','—']},
 {n:'Org. de Computadores',c:'IC618',r:'8,5',f:2,p:['8,8','8,2','—','—']}]};
const TOPICS_RC=[
 {d:'05/11',h:'Camada de transporte: TCP e controle de congestionamento',f:[['aula9','Redes – Aula 9.pdf'],['lab4','Roteiro do laboratório 4']]},
 {d:'27/10',h:'Camada de rede: IP, sub-redes e roteamento',f:[['aula8','Redes – Aula 8.pdf']]}];
const AVISOS={
 susp:{t:'Aula de 19/11 suspensa',b:'Redes de Computadores · publicado em 17/11. A aula de quinta, 19/11, está suspensa por causa do feriado de 20/11. As aulas voltam na terça, 24/11. A aula suspensa não conta como falta.'},
 sock:{t:'Entrega do trabalho de sockets',b:'Redes de Computadores. O prazo é 24/11, às 23h59, pelo envio na turma virtual. Trabalhos em dupla enviam uma única vez.',go:'atividades'}};
const FAQS=[
 {q:'Onde vejo minhas faltas?',a:'Em cada turma, no cartão “Suas faltas”. Na Início, a próxima aula já mostra a contagem. As faltas são contadas por disciplina.',go:['Ir para Turmas','tabgo','turmas']},
 {q:'O “Andamento da turma” é a minha frequência?',a:'Não. É quantas aulas a turma já teve. As suas faltas ficam no cartão “Suas faltas”.'},
 {q:'Onde baixo o material da aula?',a:'Na turma, aba Materiais. Os arquivos mais recentes também aparecem no Resumo.',go:['Ir para Turmas','tabgo','turmas']},
 {q:'Onde emito meu histórico?',a:'Em Serviços, grupo Documentos. Também está em Meu perfil.',go:['Abrir Histórico','faqgo','historico']},
 {q:'O que acontece se a sessão expirar?',a:'Avisamos 2 minutos antes. Você escolhe continuar conectado ou sair, e o que estava preenchendo fica salvo como rascunho.'}];
const E={'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'};const esc=s=>String(s).replace(/[<>&"]/g,m=>E[m]);
const status=(f,l)=>{const r=f/l;return r>=.75?['bad','Crítico']:r>=.5?['warn','Atenção']:['ok','Em dia']};
const STATE_MSG={ok:'Em dia: você usou menos da metade das faltas permitidas.',warn:'Atenção: você usou mais da metade das faltas permitidas.',bad:'Crítico: você usou 75% ou mais das faltas permitidas.'};
const TBY=id=>TURMAS.find(t=>t.id===id)||TURMAS[2];
const topicsOf=t=>t.id==='rc'?TOPICS_RC:[{d:'05/11',h:'Aula 5',f:[['g'+t.id+'5',`${t.n} – Aula 5.pdf`]]},{d:'27/10',h:'Aula 4',f:[['g'+t.id+'4',`${t.n} – Aula 4.pdf`]]}];
const FALTA_DATAS=['22/10','29/09','25/08','15/10','08/10','01/10','18/09','11/09'];
const plural=(n,s,p)=>n===1?`${n} ${s}`:`${n} ${p}`;
const ICO={
 home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
 book:'<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/></svg>',
 grade:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
 search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/></svg>',
 clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>'};

/* ===== estado ===== */
const S={view:'home',arg:null,stack:[],tab:'resumo',sem:'2026.2',query:'',minutes:25,sheet:false,aviso:null,toast:'',loading:false,error:null,
  sim:{slow:false,err:false},draft:'',savedDraft:false,dl:{},copied:false,seenAtiv:false,faq:-1,emitted:false,focusQ:false,
  test:{mode:'intro',name:'',consentAt:'',consentVersion:'2026-11-21-v3',sessionId:'',sent:false,sending:false,idx:-1,t0:0,taps:0,miss:0,views:new Set(),log:[],cur:null,done:false,rate:0,comment:'',answer:'',stage:'task'},
  timers:{}};
const TASKS=[
 {id:'T1',text:'Descubra quantas faltas você tem em Redes de Computadores.',ask:true,start:()=>go('home',null,true)},
 {id:'T2',text:'Baixe o arquivo “Redes – Aula 8.pdf”.',start:()=>go('home',null,true)},
 {id:'T3',text:'Descubra onde emitir o seu histórico.',start:()=>go('home',null,true)},
 {id:'T4',text:'Você preenche o plano de matrícula e para por alguns minutos. A tela avisa que a sessão vai expirar. Continue de onde parou.',
  start:()=>{S.draft='Priorizar turmas de manhã.';S.savedDraft=false;go('plano',null,true);clearTimeout(S.timers.sess);S.timers.sess=setTimeout(()=>{if(S.test.mode==='task'&&S.test.idx===3&&S.test.stage==='task'){S.sheet=true;render()}},7000)}}];

/* ===== navegação ===== */
const $=id=>document.getElementById(id);
function root(v){return {home:'home',perfil:'home',saiu:'home',turmas:'turmas',turma:'turmas',freq:'turmas',notas:'notas',stub:(S.arg&&S.arg.root)||'home'}[v]||'serv'}
function track(v){if(S.test.mode==='task')S.test.views.add(v+(v==='turma'?':'+S.tab:''))}
function go(v,arg,reset){
  const apply=()=>{
    if(reset)S.stack=[];else S.stack.push({view:S.view,arg:S.arg,tab:S.tab});
    S.view=v;S.arg=arg||null;if(v==='turma')S.tab='resumo';
    S.loading=false;S.faq=-1;track(v);check('view',v);render();
  };
  S.toast='';
  if(S.sim.err){S.sim.err=false;S.error=()=>{S.error=null;go(v,arg,reset)};render();return}
  if(S.sim.slow){S.loading=true;render();setTimeout(apply,1400);return}
  apply();
}
function back(){const p=S.stack.pop();if(!p)return go('home',null,true);S.view=p.view;S.arg=p.arg;S.tab=p.tab;render()}
function tabTo(t){const m={home:'home',turmas:'turmas',notas:'notas',serv:'serv'};S.query='';go(m[t],null,true)}
function toast(m){S.toast=m;render();clearTimeout(S.timers.toast);S.timers.toast=setTimeout(()=>{S.toast='';render()},2200)}

/* ===== peças reutilizáveis ===== */
const sbar=(dark)=>`<div class="sbar${dark?' dark':''}"><span>09:41</span><span>●●● 5G</span></div>`;
const hd=(t,sub,right='')=>`<div class="hd"><div><h1>${t}</h1>${sub?`<small>${sub}</small>`:''}</div>${right}</div>`;
const bk=()=>`<button class="back" data-act="back" aria-label="Voltar">‹</button>`;
const hdBack=(t,sub)=>`<div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<div><h1>${t}</h1>${sub?`<small>${sub}</small>`:''}</div></div></div>`;
const chipOf=(f,l)=>{const [k,t]=status(f,l);return `<span class="chip ${k}">${t}</span>`};
const fileBtn=(id,name)=>`<button class="file" data-act="dl" data-arg="${id}" aria-label="Baixar ${esc(name)}"><span>${esc(name)}</span><span>${S.dl[id]?'Baixado ✓':'⤓'}</span></button>`;
const faltasTxt=t=>`<b style="display:inline;font-size:inherit;color:var(--ink)">${plural(t.f,'falta','faltas')}</b> de ${t.l}`;
const turmaRow=t=>`<button class="item" data-act="turma" data-arg="${t.id}"><div class="grow"><b>${t.n}</b><span class="s">${faltasTxt(t)} · ${t.c}</span></div>${chipOf(t.f,t.l)}</button>`;

/* ===== telas ===== */
function vHome(){
  const rc=TBY('rc'),atencao=TURMAS.filter(t=>status(t.f,t.l)[0]!=='ok');
  return `${sbar()}
  ${hd('Olá, Marina','Terça, 17/11 · Ciência da Computação',`<div class="row" style="flex-wrap:nowrap"><button class="pill avatar" data-act="search" aria-label="Buscar serviços e documentos">${ICO.search}</button><button class="pill avatar" data-act="perfil" aria-label="Meu perfil">MD</button></div>`)}
  <div class="pad">
   <button class="pill sess" data-act="sheet" aria-label="Sessão: ${S.minutes} minutos restantes. Abrir detalhes">${ICO.clock}Sessão: ${S.minutes} min</button>
   <div class="hero"><small>Próxima aula · hoje</small><h2>${rc.n}</h2><div style="font-size:13px;color:var(--on-green2)">14h–16h · Lab 215</div>
    <div class="row" style="justify-content:space-between;flex-wrap:nowrap;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.22)"><div><div style="font-size:13px;color:var(--on-green2)">Suas faltas nesta disciplina</div><div style="font-size:20px;font-weight:700;margin-top:2px">${rc.f} de ${rc.l}</div></div>${chipOf(rc.f,rc.l)}</div>
    <button data-act="turma" data-arg="rc">Abrir turma</button></div>
   ${atencao.length?`<div class="sec">Faltas que pedem atenção</div>${atencao.map(turmaRow).join('')}<div class="note" style="margin-top:-2px">As faltas são contadas por disciplina, cada uma com o seu limite.</div>`:''}
   <div class="sec">Avisos recentes</div>
   <button class="item" data-act="aviso" data-arg="susp"><div class="grow"><b>Aula de 19/11 suspensa</b><span class="s">Redes de Computadores</span></div><span class="chev">›</span></button>
   <button class="item" data-act="aviso" data-arg="sock"><div class="grow"><b>Entrega do trabalho de sockets</b><span class="s">Redes de Computadores</span></div><span class="chev">›</span></button>
   <div class="sec">Seu curso</div>
   <button class="box" style="width:100%;text-align:left" data-act="perfil"><div class="row" style="justify-content:space-between;align-items:flex-end"><div><small class="muted">IRA</small><div class="big" style="font-size:30px">7,48</div></div><div style="flex:1;max-width:150px"><small class="muted">Integralização 39%</small><div class="bar" style="margin:6px 0 0"><i style="width:39%"></i></div></div></div><div class="note" style="margin-top:10px">Matrícula 20250012345</div></button>
  </div>`}

function vTurmas(){
  const rc=TBY('rc'),outras=TURMAS.filter(t=>t.id!=='rc');
  return `${sbar()}${hd('Turmas','2026.2 · faltas contadas por disciplina')}
  <div class="pad"><div class="sec" style="margin-top:6px">Próxima aula, hoje às 14h</div>${turmaRow(rc)}
  <div class="sec">Outras turmas</div>${outras.map(turmaRow).join('')}</div>`}

function turmaHead(t){
  const rc=t.id==='rc';
  return `${sbar(true)}
 <div class="thead"><button class="ib" data-act="back" aria-label="Voltar">‹</button><div class="t"><small>${t.c} · T01 · 2026.2</small><b>${t.n}</b></div><button class="ib" data-act="refresh" aria-label="Atualizar">↻</button></div>
 <div class="tabs" role="tablist">${[['resumo','Resumo'],['materiais','Materiais'],['atividades','Atividades'],['mais','Mais']].map(([k,l])=>`<button role="tab" aria-selected="${S.tab===k}" data-act="tab2" data-arg="${k}">${l}${k==='atividades'&&rc&&!S.seenAtiv?'<span class="dot" aria-label="1 novidade">1</span>':''}</button>`).join('')}</div>`}

function vTurma(){
  const t=TBY(S.arg),rc=t.id==='rc',[k]=status(t.f,t.l),aulas=t.l*4,dadas=rc?45:Math.round(aulas*.7);let b='';
  if(S.tab==='resumo'){
    const recentes=topicsOf(t).flatMap(x=>x.f).slice(0,3);
    b=`<div class="box"><b class="boxt">Suas faltas em ${t.n}</b><div class="row" style="align-items:baseline;gap:8px;margin-top:8px"><span class="big">${t.f}</span><span class="muted">de ${t.l} permitidas</span><span style="margin-left:auto">${chipOf(t.f,t.l)}</span></div><div class="bar ${k}"><i style="width:${t.f/t.l*100}%"></i></div><div class="note" style="margin:0 0 10px">${STATE_MSG[k]} Restam ${plural(t.l-t.f,'falta','faltas')}.</div><button class="btn sm" data-act="freq">Ver faltas por data ›</button></div>
    <div class="box soft"><b class="boxt">Andamento da turma</b><div style="margin-top:4px">${dadas} de ${aulas} aulas dadas (${Math.round(dadas/aulas*100)}%). Esse número é da turma, não das suas faltas.</div></div>
    ${rc?`<div class="box"><b class="boxt">⚠ Aula de 19/11 suspensa</b><div class="note" style="margin:4px 0 10px">Suspensa por causa do feriado de 20/11. Retomamos na terça (24/11).</div><button class="btn sm" data-act="aviso" data-arg="susp">Ler aviso completo</button></div>
    <button class="item" data-act="tab2" data-arg="atividades"><div class="grow"><b>Atividade nova</b><span class="s">Lista 4 – Transporte e congestionamento</span></div><span class="chip new">Nova</span></button>`:`<div class="note">Sem avisos novos nesta turma.</div>`}
    <div class="sec">Materiais recentes</div>
    ${recentes.map(([id,n])=>fileBtn(id,n)).join('')}
    <button class="btn sm" style="margin-top:10px" data-act="tab2" data-arg="materiais">Ver todos os materiais ›</button>`;
  }
  if(S.tab==='materiais')b=`<div class="note" style="margin:2px 0 10px">Mais recente primeiro</div>
   ${topicsOf(t).map(x=>`<div class="topic"><div class="d">${x.d}</div><h4>${x.h}</h4>${x.f.map(([id,n])=>fileBtn(id,n)).join('')}</div>`).join('')}
   <button class="btn wide" data-act="stub" data-arg="Tópicos anteriores">Ver tópicos anteriores</button>`;
  if(S.tab==='atividades')b=(rc?[['Lista 4 – Transporte e congestionamento','Entrega 12/11','new','Nova'],['Trabalho de sockets','Entrega 24/11','warn','Em andamento'],['Lista 3 – IP e roteamento','Entregue em 02/11','ok','Entregue']]:[['Trabalho 2','Entrega 30/11','warn','Em andamento']]).map(a=>`<button class="item" data-act="stub" data-arg="${esc(a[0])}"><div class="grow"><b>${a[0]}</b><span class="s">${a[1]}</span></div><span class="chip ${a[2]}">${a[3]}</span></button>`).join('');
  if(S.tab==='mais')b=[['Frequência','freq'],['Notas da turma','notas'],['Participantes','stub'],['Plano de ensino','stub'],['Avisos','stub'],['Ajuda','ajuda']].map(a=>`<button class="item" data-act="${a[1]==='stub'?'stub':'mais'}" data-arg="${a[1]==='stub'?a[0]:a[1]}"><div class="grow"><b>${a[0]}</b></div><span class="chev">›</span></button>`).join('');
  return turmaHead(t)+`<div class="pad" style="padding-top:12px" id="tbody">${b}</div>`}

function vFreq(){
  const t=TBY(S.arg),rc=t.id==='rc',[k]=status(t.f,t.l),aulas=t.l*4;
  return `${sbar()}${hdBack('Frequência',`${t.n} · 2026.2`)}
 <div class="pad"><div class="box"><b class="boxt">Suas faltas em ${t.n}</b><div class="row" style="align-items:baseline;gap:8px;margin-top:8px"><span class="big">${t.f}</span><span class="muted">faltas · limite de ${t.l}</span><span style="margin-left:auto">${chipOf(t.f,t.l)}</span></div><div class="bar ${k}"><i style="width:${t.f/t.l*100}%"></i></div><div class="note">${STATE_MSG[k]}</div><div class="note">Presença mínima de 75% sobre as ${aulas} aulas.</div></div>
 <div class="sec">Faltas registradas</div>
 ${t.f?FALTA_DATAS.slice(0,t.f).map(d=>`<div class="item static"><div class="grow"><b>${d}</b><span class="s">14h às 16h</span></div><span class="chip warn">Falta</span></div>`).join(''):`<div class="note">Nenhuma falta registrada.</div>`}
 ${rc?`<div class="sec">Aulas que não contam</div><div class="item static"><div class="grow"><b>19/11</b><span class="s">Quinta · suspensa, véspera do feriado</span></div><span class="chip neutral">Não conta</span></div>`:''}</div>`}

function vNotas(){
  const n=NOTAS[S.sem];let body;
  if(!n)body=`<div class="note" style="margin:0 0 12px">As notas aparecem aqui quando o professor lançar.</div>`+TURMAS.slice(0,6).map(t=>`<div class="item static"><div class="grow"><b>${t.n}</b><span class="s">${t.c}</span></div><span class="chip neutral">Aguardando notas</span></div>`).join('');
  else body=n.map(x=>`<div class="box"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div><b>${x.n}</b><div class="note" style="margin:0">${x.c}</div></div><span class="chip ok">Aprovado</span></div><div class="row" style="align-items:baseline;gap:8px;margin-top:8px"><span class="big" style="font-size:38px">${x.r}</span><span class="muted">resultado · ${plural(x.f,'falta','faltas')}</span></div><div class="nota-g">${['1ª','2ª','3ª','Opt.'].map((k,i)=>`<div>${k}<b>${x.p[i]}</b></div>`).join('')}</div></div>`).join('');
  return `${sbar()}${hd('Notas','Resultado e faltas juntos, por semestre')}
  <div class="pad"><div class="semp">${['2026.2','2026.1'].map(s=>`<button data-act="sem" data-arg="${s}" aria-pressed="${S.sem===s}">${s}</button>`).join('')}</div>${body}</div>`}

function results(q){
  q=q.trim().toLowerCase();if(!q)return null;
  const out=[];GRUPOS.forEach(g=>g.items.forEach(i=>{if(i.toLowerCase().includes(q)||g.t.toLowerCase().includes(q)&&q.length>3)out.push([g,i])}));return out}
function resHtml(){
  const r=results(S.query);
  if(r===null)return GRUPOS.map(g=>`<button class="item" data-act="grupo" data-arg="${g.id}"><div class="grow"><b>${g.t}</b><span class="s">${g.s}</span></div><span class="chip neutral">${g.items.length} itens</span></button>`).join('')
   +`<button class="item" data-act="ajuda"><div class="grow"><b>Ajuda</b><span class="s">Dúvidas frequentes</span></div><span class="chev">›</span></button>`
   +`<div style="text-align:center;margin-top:6px"><button class="btn sm ghost" data-act="stub" data-arg="Versão completa do SIGAA">Abrir versão completa do SIGAA</button></div>`;
  if(!r.length)return `<div class="empty">Nada encontrado.<br>Tente histórico, matrícula ou atestado.</div>`;
  return r.map(([g,i])=>`<button class="item" data-act="item" data-arg="${esc(i)}"><div class="grow"><b>${esc(i)}</b><span class="s">${g.t}</span></div><span class="chev">›</span></button>`).join('')}
function vServ(){return `${sbar()}${hd('Serviços','6 grupos por intenção')}
 <div class="pad"><label class="search"><span aria-hidden="true">${ICO.search.replace('<svg','<svg width="20" height="20" style="stroke:var(--mute);fill:none;stroke-width:1.8;stroke-linecap:round"')}</span><input id="q" type="search" placeholder="Buscar: histórico, matrícula…" value="${esc(S.query)}" autocomplete="off" aria-label="Buscar serviços"></label><div style="height:12px"></div><div id="res">${resHtml()}</div></div>`}
function vGrupo(){const g=GRUPOS.find(x=>x.id===S.arg);
  const sec=g.id==='mat'?[['Fazer matrícula',g.items.slice(0,5)],['Acompanhar',g.items.slice(5,8)],['Outros',g.items.slice(8)]]:[[null,g.items]];
  return `${sbar()}${hdBack(g.t,g.s)}
  <div class="pad">${sec.map(([t,its])=>(t?`<div class="sec">${t}</div>`:'')+its.map(i=>`<button class="item" style="min-height:48px" data-act="item" data-arg="${esc(i)}"><div class="grow"><b>${esc(i)}</b></div><span class="chev">›</span></button>`).join('')).join('')}</div>`}
function vHist(){return `${sbar()}${hdBack('Histórico','Documentos')}
 <div class="pad"><div class="box"><b>Marina Duarte</b><div class="note" style="margin:2px 0 10px">Matrícula 20250012345 · Ciência da Computação</div><div class="kv"><span>IRA</span><b>7,48</b></div><div class="kv"><span>Integralização</span><b>39%</b></div></div>
 <button class="btn pri wide" data-act="emit" ${S.emitted?'disabled':''}>${S.emitted?'Histórico emitido ✓':'Emitir histórico (PDF)'}</button></div>`}
function vPlano(){return `${sbar()}${hdBack('Plano de matrículas','2026.2 · rascunho')}
 <div class="pad"><div class="sec" style="margin-top:6px">Turmas escolhidas</div>${PLANO.map(t=>`<div class="item static"><div class="grow"><b>${t}</b></div><span class="chip ok">✓ Incluída</span></div>`).join('')}
 <div class="sec">Observações</div><textarea id="draft" rows="3" aria-label="Observações do plano">${esc(S.draft)}</textarea>
 <div class="note">${S.savedDraft?'Rascunho mantido após a sessão ser estendida.':'Salvo como rascunho neste aparelho.'}</div>
 <button class="btn pri wide" style="margin-top:14px" data-act="review">Revisar e enviar</button></div>`}
const PLANO=['Sistemas Distribuídos · IC768','Compiladores · IC741','Inteligência Artificial · IC755'];
function vRevisao(){return `${sbar()}${hdBack('Revisar envio','Confira antes de enviar')}
 <div class="pad"><div class="box soft"><b class="boxt">O envio não pode ser desfeito neste prazo.</b><div class="note" style="margin:4px 0 0">Depois de confirmar, o plano segue para a coordenação.</div></div>
 <div class="sec">Turmas no plano (${PLANO.length})</div>${PLANO.map(t=>`<div class="item static"><div class="grow"><b>${t}</b></div></div>`).join('')}
 <div class="sec">Observações</div><div class="item static" style="align-items:flex-start"><div class="grow"><span class="s" style="margin:0;color:var(--ink)">${S.draft.trim()?esc(S.draft):'Sem observações.'}</span></div></div>
 <button class="btn pri wide" style="margin-top:16px" data-act="confirm">Confirmar envio</button>
 <button class="btn wide" style="margin-top:8px" data-act="back">Voltar e editar</button></div>`}
function vEnviado(){return `${sbar()}<div class="pad" style="padding-top:60px;text-align:center"><div class="ok-mark" aria-hidden="true">✓</div><h1 style="font-size:22px;margin:0 0 8px">Plano enviado</h1><p class="muted" style="margin:0 0 4px">Comprovante nº 2026-0457 (dado ilustrativo).</p><p class="note">O resultado do processamento aparece em Serviços, grupo Matrícula.</p><button class="btn pri wide" style="margin-top:14px" data-act="home">Voltar à Início</button></div>`}
function vPerfil(){return `${sbar()}${hdBack('Meu perfil','')}
 <div class="pad"><div class="hero" style="display:flex;gap:12px;align-items:center"><div class="pill avatar" style="width:46px;height:46px;color:var(--green);background:#fff">MD</div><div><b style="font-size:16px">Marina Duarte</b><div style="font-size:13px;color:var(--on-green2)">Ciência da Computação · Bacharelado</div></div></div>
 <div class="box" style="margin-top:10px"><small class="muted">Matrícula</small><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b style="font-size:20px;letter-spacing:.02em">20250012345</b><button class="btn sm" data-act="copy" aria-live="polite">${S.copied?'Copiado ✓':'Copiar'}</button></div><small class="muted">Semestre atual 2026.2</small></div>
 <div class="box"><small class="muted">Índices acadêmicos</small><div class="row" style="align-items:baseline;gap:8px"><span class="big" style="font-size:38px">7,48</span><span class="muted">IRA</span></div><div class="row" style="justify-content:space-between;margin-top:8px"><small class="muted">Currículo integralizado</small><small><b>39%</b></small></div><div class="bar"><i style="width:39%"></i></div></div>
 <div class="box"><small class="muted">Carga horária que falta</small>${[['Obrigatória','1.380 h'],['Optativa','330 h'],['Complementar','120 h'],['Total do currículo','3.000 h']].map(a=>`<div class="kv"><span>${a[0]}</span><b>${a[1]}</b></div>`).join('')}</div>
 <div class="sec">Documentos e conta</div>
 <button class="item" data-act="item" data-arg="Histórico"><div class="grow"><b>Histórico</b><span class="s">Emitir em PDF</span></div><span class="chev">›</span></button>
 ${['Atestado de matrícula','Dados pessoais','Alterar senha'].map(x=>`<button class="item" data-act="stub" data-arg="${x}"><div class="grow"><b>${x}</b></div><span class="chev">›</span></button>`).join('')}</div>`}
function vAjuda(){return `${sbar()}${hdBack('Ajuda','Dúvidas frequentes')}
 <div class="pad">${FAQS.map((f,i)=>`<button class="item" data-act="faq" data-arg="${i}" aria-expanded="${S.faq===i}" style="margin-bottom:${S.faq===i?0:8}px"><div class="grow"><b>${f.q}</b></div><span class="chev">${S.faq===i?'⌃':'⌄'}</span></button>${S.faq===i?`<div class="faq-a"><p class="note" style="color:var(--ink);font-size:14px">${f.a}</p>${f.go?`<button class="btn sm" data-act="${f.go[1]}" data-arg="${f.go[2]}">${f.go[0]} ›</button>`:''}</div>`:''}`).join('')}</div>`}
function vStub(){const a=S.arg||{};return `${sbar()}${hdBack(esc(a.t||'Em construção'),'')}
 <div class="pad"><div class="empty">Esta parte do protótipo ainda não tem tela.<br>Volte e continue a tarefa.</div><button class="btn wide" data-act="back">Voltar</button></div>`}
function vSaiu(){return `${sbar()}<div class="pad" style="padding-top:80px;text-align:center"><div class="logo" style="margin:0 auto 14px;width:56px;height:56px;font-size:22px">S</div><h1 style="font-size:20px;margin:0 0 8px">Você saiu</h1><p class="muted">Seu rascunho do plano de matrícula foi mantido.</p><button class="btn pri" style="min-height:46px;margin-top:10px" data-act="relogin">Entrar de novo</button></div>`}
const VIEWS={home:vHome,turmas:vTurmas,turma:vTurma,freq:vFreq,notas:vNotas,serv:vServ,grupo:vGrupo,historico:vHist,plano:vPlano,revisao:vRevisao,enviado:vEnviado,perfil:vPerfil,ajuda:vAjuda,stub:vStub,saiu:vSaiu};

function sheetHtml(){
  if(S.sheet)return `<div class="shade" data-act="noop"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Sua sessão"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h2>Sua sessão vai expirar</h2><button class="back" data-act="closeSheet" aria-label="Fechar">✕</button></div><div class="box" style="margin:0 0 10px">⏱ Faltam 2 minutos para a sessão expirar por falta de uso.</div><p class="note" style="margin:0 0 18px">O que você estava preenchendo está salvo como rascunho.</p><button class="btn pri" data-act="extend">Continuar conectado</button><button class="btn ghost" data-act="logout">Sair e manter rascunho</button></div>`;
  if(S.aviso){const a=AVISOS[S.aviso];return `<div class="shade" data-act="closeAviso"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(a.t)}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h2>${a.t}</h2><button class="back" data-act="closeAviso" aria-label="Fechar">✕</button></div><p style="line-height:1.5;margin:0 0 12px">${a.b}</p>${a.go?`<button class="btn pri" data-act="avisogo" data-arg="${a.go}">Ver atividade</button>`:''}<button class="btn" data-act="closeAviso">Fechar</button></div>`}
  return ''}

function render(){
  const sc=$('screen');
  const keepScroll=sc.querySelector('.body')?sc.querySelector('.body').scrollTop:0;
  let inner;
  if(S.error)inner=`${sbar().replace('●●● 5G','●○○ sem sinal')}<div class="body"><div class="empty" style="padding-top:90px"><div style="font-size:34px" aria-hidden="true">⚠</div><b style="color:var(--ink);font-size:17px">Sem conexão</b><p>Não foi possível abrir esta tela.<br>Seu rascunho foi mantido neste aparelho.</p><button class="btn pri wide" data-act="retry">Tentar de novo</button><button class="btn wide" style="margin-top:8px" data-act="errback">Voltar</button></div></div>`;
  else if(S.loading)inner=`${sbar()}<div class="body" style="padding:16px"><div class="muted" style="margin:6px 0 14px;font-weight:600">Carregando…</div><div class="sk" style="height:70px;margin-bottom:10px"></div><div class="sk" style="height:56px;margin-bottom:10px"></div><div class="sk" style="height:56px;margin-bottom:10px"></div><div class="sk" style="height:56px"></div></div>`;
  else inner=`<div class="body" id="body">${VIEWS[S.view]()}</div>`;
  const r=root(S.view);
  const tabs=[['home','Início','home'],['turmas','Turmas','book'],['notas','Notas','grade'],['serv','Serviços','grid']];
  sc.innerHTML=inner+(S.view!=='saiu'?`<nav class="tabbar" aria-label="Navegação principal">${tabs.map(([k,l,i])=>`<button data-act="tab" data-arg="${k}" ${r===k?'aria-current="page"':''}>${ICO[i]}${l}</button>`).join('')}</nav>`:'')
   +(S.toast?`<div class="toast" role="status">${esc(S.toast)}</div>`:'')+sheetHtml();
  const b=sc.querySelector('.body');if(b)b.scrollTop=(S.keepTop?0:keepScroll);S.keepTop=false;
  if(S.focusQ&&$('q')){S.focusQ=false;$('q').focus()}
}

/* ===== eventos do protótipo ===== */
const live=()=>S.test.mode==='task'&&S.test.stage==='task';
$('screen').addEventListener('click',e=>{
  const T=S.test;
  if(live())T.taps++;
  const el=e.target.closest('[data-act],button,input,textarea,label');
  if(!el){if(live())T.miss++;updateSide();return}
  if(el.matches('input,textarea,label'))return;
  const a=el.dataset.act,g=el.dataset.arg;
  if(!a){if(live())T.miss++;updateSide();return}
  switch(a){
   case'back':back();break;
   case'home':go('home',null,true);break;
   case'tab':tabTo(g);break;
   case'tabgo':tabTo(g);break;
   case'tab2':S.tab=g;if(g==='atividades')S.seenAtiv=true;track('turma');render();break;
   case'turma':go('turma',g);break;
   case'freq':go('freq',S.arg);break;
   case'mais':if(g==='freq')go('freq',S.arg);else if(g==='ajuda')go('ajuda');else tabTo('notas');break;
   case'ajuda':go('ajuda');break;
   case'faq':S.faq=S.faq===+g?-1:+g;render();break;
   case'faqgo':if(g==='historico')go('historico');break;
   case'stub':go('stub',{t:g,root:root(S.view)});break;
   case'refresh':toast('Atualizado agora');break;
   case'perfil':go('perfil');break;
   case'search':S.query='';S.focusQ=true;go('serv',null,true);break;
   case'sheet':S.sheet=true;render();break;
   case'closeSheet':S.sheet=false;render();break;
   case'aviso':S.aviso=g;render();break;
   case'closeAviso':S.aviso=null;render();break;
   case'avisogo':S.aviso=null;go('turma','rc');S.tab=g;S.seenAtiv=true;render();break;
   case'extend':S.sheet=false;S.minutes=25;S.savedDraft=true;check('extend');toast('Sessão estendida por mais 25 minutos');break;
   case'logout':S.sheet=false;go('saiu',null,true);break;
   case'relogin':S.minutes=25;go('plano',null,true);break;
   case'sem':S.sem=g;render();break;
   case'grupo':go('grupo',g);break;
   case'item':
     if(g==='Histórico')go('historico');
     else if(g==='Meu plano de matrículas')go('plano');
     else go('stub',{t:g,root:root(S.view)});break;
   case'review':go('revisao');break;
   case'confirm':go('enviado');break;
   case'emit':S.emitted=true;toast('Histórico emitido (PDF ilustrativo)');break;
   case'dl':S.dl[g]=true;toast('Arquivo baixado');check('dl',g);break;
   case'copy':try{navigator.clipboard.writeText('20250012345').catch(()=>{})}catch(_){}S.copied=true;render();clearTimeout(S.timers.copy);S.timers.copy=setTimeout(()=>{S.copied=false;render()},3000);break;
   case'retry':if(S.error)S.error();break;
   case'errback':S.error=null;render();break;
   case'noop':break;
  }
  updateSide();
});
$('screen').addEventListener('input',e=>{
  if(e.target.id==='q'){S.query=e.target.value;$('res').innerHTML=resHtml();}
  if(e.target.id==='draft'){S.draft=e.target.value}
});

/* ===== teste de usabilidade (mesmas tarefas e métricas da v1) ===== */
function curTask(){return TASKS[S.test.idx]}
function startTask(i){
  const T=S.test;if(i===0){T.sessionId=`${Date.now()}-${Math.random().toString(36).slice(2)}`;T.sent=false;T.sending=false;S.dl={};S.seenAtiv=false;S.emitted=false}T.mode='task';T.idx=i;T.stage='task';T.t0=Date.now();T.taps=0;T.miss=0;T.views=new Set(['home']);T.rate=0;T.comment='';T.answer='';T.cur={outcome:null};
  S.sheet=false;S.aviso=null;S.toast='';TASKS[i].start();clearInterval(S.timers.tick);S.timers.tick=setInterval(tick,1000);updateSide();
}
function tick(){const el=$('tm');if(!el||S.test.mode!=='task')return;const s=Math.floor((Date.now()-S.test.t0)/1000);el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');el.style.color=s>120?'var(--bad-fg)':'';}
function check(kind,v){
  const T=S.test;if(T.mode!=='task'||T.stage!=='task'||!T.cur||T.cur.outcome)return;
  const id=curTask().id;
  if(id==='T2'&&kind==='dl'&&v==='aula8')finish('sucesso');
  if(id==='T3'&&kind==='view'&&v==='historico')finish('sucesso');
  if(id==='T4'&&kind==='extend')finish('sucesso');
}
function finish(outcome){
  const T=S.test;if(T.stage!=='task')return;
  T.cur.outcome=outcome;T.cur.secs=Math.round((Date.now()-T.t0)/1000);clearInterval(S.timers.tick);
  T.stage=(curTask().ask&&outcome!=='desistiu')?'answer':'rate';
  setTimeout(()=>{updateSide()},outcome==='sucesso'?600:0);if(outcome!=='sucesso')updateSide();
}
function saveTask(){
  const T=S.test,t=curTask();
  T.log.push({id:t.id,tarefa:t.text,resultado:T.cur.outcome,segundos:T.cur.secs,toques:T.taps,toquesSemResposta:T.miss,telas:T.views.size,nota:T.rate,comentario:T.comment,resposta:T.answer});
  persist();
  if(T.idx+1<TASKS.length)startTask(T.idx+1);else{T.mode='done';clearInterval(S.timers.tick);S.sheet=false;go('home',null,true)}
  updateSide();
}
function persist(){try{localStorage.setItem('sigaa-proto-resultados-'+VERSION,JSON.stringify({versao:VERSION,nome:S.test.name,consentAt:S.test.consentAt,consentVersion:S.test.consentVersion,sessionId:S.test.sessionId,log:S.test.log,sent:S.test.sent}))}catch(_){}}
function summaryText(){
  const T=S.test;
  let s=`SIGAA Mobile ${VERSION} · teste de usabilidade\nParticipante: ${T.name||'(sem nome)'}\nData: ${new Date().toLocaleString('pt-BR')}\n\n`;
  T.log.forEach(r=>{s+=`${r.id} · ${r.resultado} · ${r.segundos}s · ${r.toques} toques (${r.toquesSemResposta} sem resposta) · ${r.telas} telas · facilidade ${r.nota||'-'}/5${r.resposta?` · respondeu ${r.resposta} faltas`:''}${r.comentario?`\n   Comentário: ${r.comentario}`:''}\n`});
  return s}

function updateSide(){
  const T=S.test,side=$('side');
  const brand=`<div class="brand"><div class="logo">S</div><b>SIGAA Mobile</b><span class="ver">${VERSION}</span></div>`;
  const desk=`<div class="card desk"><h3>Trabalho de IHC</h3><div class="muted" style="line-height:1.5">Interação Humano-Computador · Sistemas de Informação. Grupo: Gustavo Gevú, Lucas Francisco, Nicolas Moreno e Pedro Costa. Protótipo com dados e fluxos fictícios. Versão ${VERSION}: ajustada após os testes do Seminário 3.</div></div>`;
  let main='';
  if(T.mode==='task'){
    const t=curTask();
    if(T.stage==='task')main=`<div class="card"><div class="row" style="justify-content:space-between"><span class="task-n">Tarefa ${T.idx+1} de ${TASKS.length}</span><span class="timer" id="tm">0:00</span></div><div class="task-t">${esc(t.text)}</div><div class="row"><button class="btn pri" data-side="done">Terminei</button><button class="btn" data-side="give">Desisto</button></div></div>`;
    else if(T.stage==='answer')main=`<div class="card"><span class="task-n">Tarefa ${T.idx+1} · resposta</span><div class="task-t">Quantas faltas você tem em Redes de Computadores?</div><div class="row" style="flex-wrap:nowrap"><input id="ans" type="number" min="0" max="60" inputmode="numeric" placeholder="Número de faltas" value="${esc(T.answer)}"><button class="btn pri" data-side="ans">Confirmar</button></div></div>`;
    else main=`<div class="card"><span class="task-n">Tarefa ${T.idx+1} · ${T.cur.outcome==='sucesso'?'concluída ✓':T.cur.outcome==='desistiu'?'encerrada':'registrada'}</span><div class="task-t">Quão fácil foi essa tarefa?</div><div class="stars" role="group" aria-label="Facilidade de 1 a 5">${[1,2,3,4,5].map(n=>`<button data-side="star" data-n="${n}" aria-pressed="${T.rate===n}">${n}</button>`).join('')}</div><div class="row" style="justify-content:space-between;font-size:13px;margin:6px 0 12px" ><span class="muted">1 · muito difícil</span><span class="muted">5 · muito fácil</span></div><textarea id="cm" rows="2" placeholder="O que foi mais fácil e o que foi mais difícil? (opcional)">${esc(T.comment)}</textarea><div class="row" style="margin-top:10px"><button class="btn pri" data-side="next" ${T.rate?'':'disabled'}>${T.idx+1<TASKS.length?'Próxima tarefa':'Ver resultados'}</button></div></div>`;
  }else if(T.mode==='done'){
    main=`<div class="card"><span class="task-n">Teste concluído</span><div class="task-t">Obrigado, ${esc(T.name||'participante')}!</div><div class="row"><button class="btn pri" data-side="results">Ver resultados</button><button class="btn" data-side="restart">Refazer</button></div></div>`;
  }else if(T.mode==='free'){
    main=`<div class="card"><span class="task-n">Exploração livre</span><div class="task-t">Navegue à vontade pelo protótipo.</div><button class="btn pri" data-side="start">Começar o teste com tarefas</button></div>`;
  }
  const fac=`<div class="card desk"><h3>Facilitador</h3><div class="tog"><input type="checkbox" id="slow" ${S.sim.slow?'checked':''}><label for="slow">Simular lentidão (“Carregando…”)</label></div><div class="tog" style="margin-top:8px"><input type="checkbox" id="err" ${S.sim.err?'checked':''}><label for="err">Falhar a próxima navegação (“Sem conexão”)</label></div><div class="row" style="margin-top:12px"><button class="btn sm" data-side="sess">Abrir aviso de sessão</button><button class="btn sm" data-side="results">Resultados</button></div></div>`;
  const focus=document.activeElement&&document.activeElement.id;
  if(focus==='ans'||focus==='cm')return;
  side.innerHTML=brand+main+(T.mode!=='intro'?fac+desk:desk);tick();
}
$('side').addEventListener('click',e=>{
  const b=e.target.closest('[data-side]');if(!b)return;const T=S.test;
  switch(b.dataset.side){
   case'done':finish('terminou');break;
   case'give':finish('desistiu');break;
   case'ans':{const v=($('ans').value||'').trim();T.answer=v;T.cur.outcome=v==='3'?'sucesso':'resposta incorreta';T.stage='rate';updateSide();break}
   case'star':T.rate=+b.dataset.n;T.comment=$('cm')?$('cm').value:T.comment;updateSide();break;
   case'next':T.comment=$('cm')?$('cm').value:'';saveTask();if(T.mode==='done'){showResults();sendResultsToSheet()}break;
   case'results':showResults();break;
   case'restart':T.log=[];startTask(0);break;
   case'start':T.log=[];startTask(0);break;
   case'sess':S.sheet=true;render();break;
  }
});
$('side').addEventListener('change',e=>{if(e.target.id==='slow')S.sim.slow=e.target.checked;if(e.target.id==='err')S.sim.err=e.target.checked});
$('side').addEventListener('input',e=>{if(e.target.id==='cm')S.test.comment=e.target.value});

function showIntro(){
  $('modal').innerHTML=`<div class="modal"><div class="card"><div class="brand" style="margin-bottom:12px"><div class="logo">S</div><b>SIGAA Mobile</b><span class="ver">${VERSION}</span></div><h2>Teste de usabilidade</h2>
  <p>Este prot&#243;tipo foi desenvolvido para a disciplina de IHC (Intera&#231;&#227;o Humano-Computador), por um grupo de Sistemas de Informa&#231;&#227;o, para explorar melhorias na interface de m&#243;dulos do SIGAA. As telas e informa&#231;&#245;es exibidas s&#227;o fict&#237;cias; as respostas e m&#233;tricas deste teste s&#227;o reais. Voc&#234; far&#225; 4 tarefas curtas. Estamos avaliando o prot&#243;tipo, n&#227;o voc&#234;.</p>
  <p>Integrantes: Gustavo Gev&#250;, Lucas Francisco, Nicolas Moreno e Pedro Costa.</p>
  <p>Coletamos o nome ou apelido informado, respostas, notas, coment&#225;rios e m&#233;tricas de uso (tempo, toques e quantidade de telas visitadas). Os dados ficam salvos localmente neste navegador e, ao concluir as tarefas, s&#227;o enviados automaticamente &#224; planilha Google vinculada ao projeto para an&#225;lise acad&#234;mica de usabilidade. Recomendamos usar um apelido em vez do nome completo. N&#227;o informe dados sens&#237;veis nos coment&#225;rios. N&#227;o coletamos senha nem dados de acesso ao SIGAA.</p>
  <label for="nm" style="font-weight:600;display:block;margin:12px 0 6px">Nome ou apelido (obrigat&#243;rio)</label><input id="nm" type="text" autocomplete="nickname" maxlength="80" required>
  <label class="tog" style="align-items:flex-start;margin-top:14px;line-height:1.45"><input id="consent" type="checkbox" required style="margin-top:3px"><span>Li as informa&#231;&#245;es acima e concordo com a coleta e o envio desses dados para a planilha do projeto, conforme descrito. Sei que posso interromper minha participa&#231;&#227;o fechando a p&#225;gina; se j&#225; tiver conclu&#237;do e enviado o teste, posso pedir a remo&#231;&#227;o dos meus dados ao grupo.</span></label>
  <p class="muted" style="font-size:13px">Informe um nome ou apelido e marque o consentimento. Se n&#227;o concordar, feche esta p&#225;gina sem iniciar o teste.</p>
  <div class="row" style="margin-top:16px"><button class="btn pri" id="go1" disabled>Concordar e come&#231;ar</button><button class="btn" id="go2" disabled>Concordar e s&#243; explorar</button></div></div></div>`;
  const accept=mode=>{
    const name=$('nm').value.trim(),consent=$('consent');
    if(!name){$('nm').setCustomValidity('Informe um nome ou apelido para continuar.');$('nm').reportValidity();return}
    $('nm').setCustomValidity('');
    if(!consent.checked){consent.reportValidity();return}
    const T=S.test;T.name=name;T.consentAt=new Date().toISOString();T.consentVersion='2026-11-21-v3';T.log=[];T.sessionId='';T.sent=false;T.sending=false;persist();$('modal').innerHTML='';
    if(mode==='tasks')startTask(0);else{T.mode='free';updateSide()}
  };
  const updateConsentButtons=()=>{const valid=$('nm').value.trim().length>0&&$('consent').checked;$('go1').disabled=!valid;$('go2').disabled=!valid};
  $('nm').addEventListener('input',()=>{$('nm').setCustomValidity('');updateConsentButtons()});$('consent').addEventListener('change',updateConsentButtons);
  $('go1').onclick=()=>accept('tasks');$('go2').onclick=()=>accept('explore');
}
async function sendResultsToSheet(){
  const endpoint=String(window.SIGAA_SHEETS_ENDPOINT||'').trim();
  const T=S.test,status=$('sheet-status'),retry=$('retry-sheet');
  if(!status)return;
  if(!endpoint){status.textContent='Integração não configurada. Os resultados continuam neste navegador.';return}
  if(T.sent){status.textContent='Solicitação enviada. Confira a planilha; o navegador não consegue confirmar a gravação.';return}
  if(T.sending||!T.log.length)return;
  T.sending=true;if(retry)retry.hidden=true;status.textContent='Enviando automaticamente as respostas...';
  try{
    await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({versao:VERSION,sessionId:T.sessionId,name:T.name,consentAt:T.consentAt,consentVersion:T.consentVersion,tasks:T.log})});
    T.sent=true;T.sending=false;persist();
    status.textContent='Solicitação enviada. Confira a planilha; o navegador não consegue confirmar a gravação.';
  }catch(error){
    T.sending=false;status.textContent='Não foi possível enviar automaticamente. Verifique a conexão e tente novamente.';if(retry)retry.hidden=false;
  }
}
function showResults(){
  const T=S.test,rows=T.log.map(r=>`<tr><td><b>${r.id}</b></td><td>${esc(r.resultado)}</td><td>${r.segundos}s</td><td>${r.toques} (${r.toquesSemResposta})</td><td>${r.telas}</td><td>${r.nota||'-'}</td></tr>${r.comentario||r.resposta?`<tr><td></td><td colspan="5" class="muted">${r.resposta?`Respondeu ${esc(r.resposta)} faltas. `:''}${esc(r.comentario)}</td></tr>`:''}`).join('');
  $('modal').innerHTML=`<div class="modal"><div class="card"><h2>Resultados (${VERSION})</h2><p class="muted">Participante: ${esc(T.name||'(sem nome)')}</p>
  ${T.log.length?`<div class="scroll-x"><table><thead><tr><th>Tarefa</th><th>Resultado</th><th>Tempo</th><th>Toques (sem resposta)</th><th>Telas</th><th>Nota</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p>Nenhuma tarefa registrada ainda.</p>'}
  <p class="muted" style="font-size:13px">“Toques sem resposta” são toques em áreas que não fazem nada. Eles indicam onde o usuário esperava um controle.</p>
  <p class="muted" style="font-size:13px">Com seu consentimento, os dados listados acima s&#227;o enviados automaticamente ao concluir as tarefas.</p>
  <div class="row"><button class="btn" id="retry-sheet" hidden>Tentar enviar novamente</button><button class="btn" id="cp">Copiar resumo</button><button class="btn" id="cl">Fechar</button></div><p id="sheet-status" class="muted" role="status" style="font-size:13px;min-height:18px">${T.sent?'Solicitação enviada. Confira a planilha.':T.mode==='done'?'Enviando automaticamente as respostas...':'O envio automático acontece ao concluir as tarefas.'}</p><p id="cpm" class="muted" style="font-size:13px;min-height:18px"></p>
  <textarea id="tx" rows="6" readonly style="font-size:13px">${esc(summaryText())}</textarea></div></div>`;
  $('retry-sheet').onclick=sendResultsToSheet;
  $('cl').onclick=()=>{$('modal').innerHTML=''};
  $('cp').onclick=()=>{const t=$('tx');t.select();let ok=false;try{navigator.clipboard.writeText(t.value).then(()=>{$('cpm').textContent='Resumo copiado. Envie ao grupo.'},()=>{$('cpm').textContent='Selecione o texto abaixo e copie.'});ok=true}catch(_){}if(!ok)$('cpm').textContent='Selecione o texto abaixo e copie.'};
}

/* ===== sessão: contagem regressiva real ===== */
setInterval(()=>{ if(S.view==='saiu')return; S.timers.sec=(S.timers.sec||0)+1; if(S.timers.sec>=60){S.timers.sec=0;S.minutes=Math.max(0,S.minutes-1); if(S.minutes===2&&S.test.mode!=='task'){S.sheet=true} render()} },1000);

render();updateSide();showIntro();
