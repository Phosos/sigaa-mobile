/* ===== dados fictícios (Ciência da Computação, UFRRJ) ===== */
const TURMAS=[
 {id:'sd',n:'Sistemas Distribuídos',c:'IC768',f:8,l:15},
 {id:'cp',n:'Compiladores',c:'IC741',f:1,l:15},
 {id:'rc',n:'Redes de Computadores',c:'IC732',f:3,l:15,open:true},
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
const RECENT=['Estruturas de Dados','Org. de Computadores'];
const E={'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'};const esc=s=>String(s).replace(/[<>&"]/g,m=>E[m]);
const status=(f,l)=>{const r=f/l;return r>=.75?['bad','Crítico']:r>=.5?['warn','Atenção']:['ok','Em dia']};
const ICO={
 home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
 book:'<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/></svg>',
 grade:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>'};

/* ===== estado ===== */
const S={view:'home',arg:null,stack:[],tab:'resumo',sem:'2026.2',query:'',minutes:25,sheet:false,toast:'',loading:false,error:null,
  sim:{slow:false,err:false},draft:'',savedDraft:false,
  test:{mode:'intro',name:'',idx:-1,t0:0,taps:0,miss:0,views:new Set(),log:[],cur:null,done:false,rate:0,comment:'',answer:'',stage:'task'},
  timers:{}};
const TASKS=[
 {id:'T1',text:'Descubra quantas faltas você tem em Redes de Computadores.',ask:true,start:()=>go('home',null,true)},
 {id:'T2',text:'Baixe o arquivo “Redes – Aula 8.pdf”.',start:()=>go('home',null,true)},
 {id:'T3',text:'Descubra onde emitir o seu histórico.',start:()=>go('home',null,true)},
 {id:'T4',text:'Você preenche o plano de matrícula e para por alguns minutos. A tela avisa que a sessão vai expirar. Continue de onde parou.',
  start:()=>{S.draft='Priorizar turmas de manhã.';S.savedDraft=false;go('plano',null,true);clearTimeout(S.timers.sess);S.timers.sess=setTimeout(()=>{if(S.test.mode==='task'&&S.test.idx===3&&S.test.stage==='task'){S.sheet=true;render()}},7000)}}];

/* ===== navegação ===== */
const $=id=>document.getElementById(id);
function root(v){return {home:'home',perfil:'home',plano:'serv',turmas:'turmas',turma:'turmas',freq:'turmas',notas:'notas',serv:'serv',grupo:'serv',historico:'serv',saiu:'home'}[v]||'home'}
function track(v){if(S.test.mode==='task')S.test.views.add(v+(v==='turma'?':'+S.tab:''))}
function go(v,arg,reset){
  const apply=()=>{
    if(reset)S.stack=[];else S.stack.push({view:S.view,arg:S.arg,tab:S.tab});
    S.view=v;S.arg=arg||null;if(v==='turma'&&!reset)S.tab='resumo';
    S.loading=false;track(v);check('view',v);render();
  };
  S.toast='';
  if(S.sim.err){S.sim.err=false;S.error=()=>{S.error=null;go(v,arg,reset)};render();return}
  if(S.sim.slow){S.loading=true;render();setTimeout(apply,1400);return}
  apply();
}
function back(){const p=S.stack.pop();if(!p)return go('home',null,true);S.view=p.view;S.arg=p.arg;S.tab=p.tab;render()}
function tabTo(t){const m={home:'home',turmas:'turmas',notas:'notas',serv:'serv'};S.query='';go(m[t],null,true)}
function toast(m){S.toast=m;render();clearTimeout(S.timers.toast);S.timers.toast=setTimeout(()=>{S.toast='';render()},2200)}

/* ===== telas ===== */
const hd=(t,sub,right='')=>`<div class="hd"><div><h1>${t}</h1>${sub?`<small>${sub}</small>`:''}</div>${right}</div>`;
const bk=()=>`<button class="back" data-act="back" aria-label="Voltar">‹</button>`;
const chipOf=(f,l)=>{const [k,t]=status(f,l);return `<span class="chip ${k}">${t}</span>`};

function vHome(){
  const sd=TURMAS[0];
  return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div>
  ${hd('Olá, Marina','Ciência da Computação · 2026.2',`<div class="row" style="flex-wrap:nowrap"><button class="pill avatar" data-act="perfil" aria-label="Meu perfil">MD</button><button class="pill" data-act="sheet">${S.minutes} min</button></div>`)}
  <div class="pad">
   <div class="hero"><small>Próxima aula · terça, 17/11</small><h2>Redes de Computadores</h2><div style="font-size:12px;color:var(--on-green2)">14h–16h · Lab 215</div><button data-act="turma" data-arg="rc">Abrir turma</button></div>
   <div class="sec">Frequência que pede atenção</div>
   <button class="item" data-act="toast" data-arg="Turma não detalhada neste protótipo."><div class="grow"><b>${sd.n}</b><span class="s">${sd.f} faltas de ${sd.l} permitidas</span></div>${chipOf(sd.f,sd.l)}</button>
   <div class="sec">Avisos recentes</div>
   <button class="item" data-act="toast" data-arg="Aviso não detalhado neste protótipo."><div class="grow"><b>Aula de 19/11 suspensa</b></div><span class="chev">›</span></button>
   <button class="item" data-act="toast" data-arg="Aviso não detalhado neste protótipo."><div class="grow"><b>Entrega do trabalho de sockets</b></div><span class="chev">›</span></button>
   <div class="sec">Seu curso</div>
   <button class="box" style="width:100%;text-align:left" data-act="perfil"><div class="row" style="justify-content:space-between;align-items:flex-end"><div><small class="muted">IRA</small><div class="big" style="font-size:30px">7,48</div></div><div style="flex:1;max-width:150px"><small class="muted">Integralização 39%</small><div class="bar" style="margin:6px 0 0"><i style="width:39%"></i></div></div></div><div class="muted" style="font-size:12px;margin-top:10px">Matrícula 20250012345</div></button>
   <div class="sec">Atalhos</div>
   <div class="row"><button class="pill" data-act="tab" data-arg="notas">Notas</button><button class="pill" data-act="tab" data-arg="turmas">Turmas</button><button class="pill" data-act="tab" data-arg="serv">Serviços</button></div>
  </div>`}

function vTurmas(){
  return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div>${hd('Turmas',`2026.2 · ${TURMAS.length} turmas`)}
  <div class="pad">${TURMAS.map(t=>`<button class="item" data-act="turma" data-arg="${t.id}"><div class="grow"><b>${t.n}</b><span class="s">${t.c} · ${t.f===1?'1 falta':t.f+' faltas'} de ${t.l}</span></div>${chipOf(t.f,t.l)}</button>`).join('')}</div>`}

function turmaHead(){return `<div class="sbar dark"><span>09:41</span><span>●●● 5G</span></div>
 <div class="thead"><button class="ib" data-act="back" aria-label="Voltar">‹</button><div class="t"><small>IC732 · T01 · 2026.2</small><b>Redes de Computadores</b></div><button class="ib" data-act="refresh" aria-label="Atualizar">↻</button></div>
 <div class="tabs" role="tablist">${[['resumo','Resumo'],['conteudo','Conteúdo'],['atividades','Atividades'],['mais','Mais']].map(([k,t])=>`<button role="tab" aria-selected="${S.tab===k}" data-act="tab2" data-arg="${k}">${t}</button>`).join('')}</div>`}
function vTurma(){
  const t=TURMAS[2];let b='';
  if(S.tab==='resumo')b=`<div class="box"><div class="row" style="justify-content:space-between"><small class="muted">Suas faltas</small>${chipOf(t.f,t.l)}</div><div class="row" style="align-items:baseline;gap:8px;margin-top:6px"><span class="big">${t.f}</span><span class="muted">de ${t.l} permitidas</span></div><div class="bar"><i style="width:${t.f/t.l*100}%"></i></div><div class="muted" style="font-size:12px">Restam ${t.l-t.f} faltas</div><button class="btn sm" style="margin-top:10px" data-act="freq">Ver faltas por data ›</button></div>
   <div class="box"><small class="muted">ⓘ Andamento da turma</small><div style="margin-top:4px">45 de 60 aulas dadas (75%). Esse número é da turma, não das suas faltas.</div></div>
   <div class="box"><b>⚠ Aula de 19/11 suspensa</b><div class="muted" style="margin:4px 0 8px">Suspensa por causa do feriado de 20/11. Retomamos na terça (24/11).</div><button class="btn sm" data-act="toast" data-arg="Aviso completo não detalhado neste protótipo.">Ler aviso completo</button></div>
   <button class="item" data-act="tab2" data-arg="atividades"><div class="grow"><b>Atividade nova</b><span class="s">Lista 4 – Transporte e congestionamento</span></div><span class="chip new">Nova</span></button>`;
  if(S.tab==='conteudo')b=`<div class="muted" style="font-size:12px;margin:2px 0 10px">Mais recente primeiro</div>
   <div class="topic"><div class="d">05/11</div><h4>Camada de transporte: TCP e controle de congestionamento</h4><button class="file" data-act="dl" data-arg="aula9"><span>Redes – Aula 9.pdf</span><span>⤓</span></button><button class="file" data-act="dl" data-arg="lab4"><span>Roteiro do laboratório 4</span><span>⤓</span></button></div>
   <div class="topic"><div class="d">27/10</div><h4>Camada de rede: IP, sub-redes e roteamento</h4><button class="file" data-act="dl" data-arg="aula8"><span>Redes – Aula 8.pdf</span><span>⤓</span></button></div>
   <button class="btn" style="width:100%" data-act="toast" data-arg="Tópicos anteriores não detalhados neste protótipo.">Ver 3 tópicos anteriores</button>`;
  if(S.tab==='atividades')b=[['Lista 4 – Transporte e congestionamento','Entrega 12/11','new','Nova'],['Trabalho de sockets','Entrega 24/11','warn','Em andamento'],['Lista 3 – IP e roteamento','Entregue em 02/11','ok','Entregue']].map(a=>`<button class="item" data-act="toast" data-arg="Atividade não detalhada neste protótipo."><div class="grow"><b>${a[0]}</b><span class="s">${a[1]}</span></div><span class="chip ${a[2]}">${a[3]}</span></button>`).join('');
  if(S.tab==='mais')b=[['Frequência','freq'],['Notas da turma','notas'],['Participantes',''],['Plano de ensino',''],['Avisos','']].map(a=>`<button class="item" data-act="${a[1]?'mais':'toast'}" data-arg="${a[1]||'Item não detalhado neste protótipo.'}"><div class="grow"><b>${a[0]}</b></div><span class="chev">›</span></button>`).join('');
  return turmaHead()+`<div class="pad" style="padding-top:12px" id="tbody">${b}</div>`}

function vFreq(){const t=TURMAS[2];return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div>
 <div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<div><h1>Frequência</h1><small>Redes de Computadores · 2026.2</small></div></div></div>
 <div class="pad"><div class="box"><div class="row" style="align-items:baseline;gap:8px"><span class="big">${t.f}</span><span class="muted">faltas · limite de ${t.l}</span></div><div class="bar"><i style="width:${t.f/t.l*100}%"></i></div><div class="muted" style="font-size:12px">75% de presença mínima sobre as 60 aulas.</div></div>
 <div class="sec">Faltas registradas</div>
 ${[['22/10','Quinta'],['29/09','Terça'],['25/08','Terça']].map(a=>`<div class="item" style="cursor:default"><div class="grow"><b>${a[0]}</b><span class="s">${a[1]} · 14h às 16h</span></div><span class="chip warn">Falta</span></div>`).join('')}
 <div class="sec">Aulas que não contam</div>
 <div class="item" style="cursor:default"><div class="grow"><b>19/11</b><span class="s">Quinta · suspensa, véspera do feriado</span></div><span class="chip neutral">Não conta</span></div></div>`}

function vNotas(){
  const n=NOTAS[S.sem];
  let body;
  if(!n)body=TURMAS.slice(0,6).map(t=>`<div class="item" style="cursor:default"><div class="grow"><b>${t.n}</b><span class="s">${t.c}</span></div><span class="chip neutral">Sem notas</span></div>`).join('');
  else body=n.map(x=>`<div class="box"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div><b>${x.n}</b><div class="muted" style="font-size:12px">${x.c}</div></div><span class="chip ok">Aprovado</span></div><div class="row" style="align-items:baseline;gap:8px;margin-top:8px"><span class="big" style="font-size:38px">${x.r}</span><span class="muted">resultado · ${x.f} faltas</span></div><div class="nota-g">${['1ª','2ª','3ª','Opt.'].map((k,i)=>`<div>${k}<b>${x.p[i]}</b></div>`).join('')}</div></div>`).join('');
  return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div>${hd('Notas','Resultado e faltas juntos, por semestre')}
  <div class="pad"><div class="semp">${['2026.2','2026.1'].map(s=>`<button data-act="sem" data-arg="${s}" aria-pressed="${S.sem===s}">${s}</button>`).join('')}</div>${body}</div>`}

function results(q){
  q=q.trim().toLowerCase();if(!q)return null;
  const out=[];GRUPOS.forEach(g=>g.items.forEach(i=>{if(i.toLowerCase().includes(q)||g.t.toLowerCase().includes(q)&&q.length>3)out.push([g,i])}));return out}
function resHtml(){
  const r=results(S.query);
  if(r===null)return GRUPOS.map(g=>`<button class="item" data-act="grupo" data-arg="${g.id}"><div class="grow"><b>${g.t}</b><span class="s">${g.s}</span></div><span class="chip neutral">${g.items.length} itens</span></button>`).join('')+`<div style="text-align:center;margin-top:6px"><button class="btn sm" style="border:0;text-decoration:underline" data-act="toast" data-arg="Versão para computador não disponível neste protótipo.">Abrir versão completa do SIGAA</button></div>`;
  if(!r.length)return `<div class="empty">Nada encontrado.<br>Tente histórico, matrícula ou atestado.</div>`;
  return r.map(([g,i])=>`<button class="item" data-act="item" data-arg="${esc(i)}"><div class="grow"><b>${esc(i)}</b><span class="s">${g.t}</span></div><span class="chev">›</span></button>`).join('')}
function vServ(){return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div>${hd('Serviços','6 grupos por intenção')}
 <div class="pad"><label class="search"><span aria-hidden="true">🔍</span><input id="q" type="search" placeholder="Buscar: histórico, matrícula…" value="${esc(S.query)}" autocomplete="off" aria-label="Buscar serviços"></label><div style="height:12px"></div><div id="res">${resHtml()}</div></div>`}
function vGrupo(){const g=GRUPOS.find(x=>x.id===S.arg);
  const sec=g.id==='mat'?[['Fazer matrícula',g.items.slice(0,5)],['Acompanhar',g.items.slice(5,8)],['Outros',g.items.slice(8)]]:[[null,g.items]];
  return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<div><h1>${g.t}</h1><small>${g.s}</small></div></div></div>
  <div class="pad">${sec.map(([t,its])=>(t?`<div class="sec">${t}</div>`:'')+its.map(i=>`<button class="item" style="min-height:46px" data-act="item" data-arg="${esc(i)}"><div class="grow"><b>${esc(i)}</b></div><span class="chev">›</span></button>`).join('')).join('')}</div>`}
function vHist(){return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<div><h1>Histórico</h1><small>Documentos</small></div></div></div>
 <div class="pad"><div class="box"><b>Marina Duarte</b><div class="muted" style="font-size:12px;margin:2px 0 10px">Matrícula 20250012345 · Ciência da Computação</div><div class="kv"><span>IRA</span><b>7,48</b></div><div class="kv"><span>Integralização</span><b>39%</b></div></div>
 <button class="btn pri" style="width:100%;min-height:48px;border-radius:14px" data-act="toast" data-arg="Emissão não disponível neste protótipo.">Emitir histórico (PDF)</button></div>`}
function vPlano(){return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<div><h1>Plano de matrículas</h1><small>2026.2 · rascunho</small></div></div></div>
 <div class="pad"><div class="sec">Turmas escolhidas</div>${['Sistemas Distribuídos · IC768','Compiladores · IC741','Inteligência Artificial · IC755'].map(t=>`<div class="item" style="cursor:default"><div class="grow"><b>${t}</b></div><span class="chip ok">✓ Incluída</span></div>`).join('')}
 <div class="sec">Observações</div><textarea id="draft" rows="3" aria-label="Observações do plano">${esc(S.draft)}</textarea>
 <div class="muted" style="font-size:12px;margin-top:8px">${S.savedDraft?'Rascunho mantido após a sessão ser estendida.':'Salvo como rascunho.'}</div>
 <button class="btn pri" style="width:100%;min-height:48px;border-radius:14px;margin-top:14px" data-act="toast" data-arg="Envio não disponível neste protótipo.">Enviar plano</button></div>`}
function vPerfil(){return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="hd"><div class="row" style="flex-wrap:nowrap;gap:10px">${bk()}<h1>Meu perfil</h1></div></div>
 <div class="pad"><div class="hero" style="display:flex;gap:12px;align-items:center"><div class="pill avatar" style="width:46px;height:46px;color:var(--green);background:#fff">MD</div><div><b style="font-size:16px">Marina Duarte</b><div style="font-size:12px;color:var(--on-green2)">Ciência da Computação · Bacharelado</div></div></div>
 <div class="box" style="margin-top:10px"><small class="muted">Matrícula</small><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b style="font-size:20px;letter-spacing:.02em">20250012345</b><button class="btn sm" data-act="copy">Copiar</button></div><small class="muted">Semestre atual 2026.2</small></div>
 <div class="box"><small class="muted">Índices acadêmicos</small><div class="row" style="align-items:baseline;gap:8px"><span class="big" style="font-size:38px">7,48</span><span class="muted">IRA</span></div><div class="row" style="justify-content:space-between;margin-top:8px"><small class="muted">Currículo integralizado</small><small><b>39%</b></small></div><div class="bar"><i style="width:39%"></i></div></div>
 <div class="box"><small class="muted">Carga horária que falta</small>${[['Obrigatória','1.380 h'],['Optativa','330 h'],['Complementar','120 h'],['Total do currículo','3.000 h']].map(a=>`<div class="kv"><span>${a[0]}</span><b>${a[1]}</b></div>`).join('')}</div>
 <div class="muted" style="font-size:12px">Emitir atestado · Dados pessoais · Senha</div></div>`}
function vSaiu(){return `<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="pad" style="padding-top:80px;text-align:center"><div class="logo" style="margin:0 auto 14px;width:56px;height:56px;font-size:22px">S</div><h1 style="font-size:20px;margin:0 0 8px">Você saiu</h1><p class="muted">Seu rascunho do plano de matrícula foi mantido.</p><button class="btn pri" style="min-height:46px;margin-top:10px" data-act="relogin">Entrar de novo</button></div>`}
const VIEWS={home:vHome,turmas:vTurmas,turma:vTurma,freq:vFreq,notas:vNotas,serv:vServ,grupo:vGrupo,historico:vHist,plano:vPlano,perfil:vPerfil,saiu:vSaiu};

function render(){
  const sc=$('screen');
  const keepScroll=sc.querySelector('.body')?sc.querySelector('.body').scrollTop:0;
  let inner;
  if(S.error)inner=`<div class="sbar"><span>09:41</span><span>●○○ sem sinal</span></div><div class="body"><div class="empty" style="padding-top:110px"><div style="font-size:34px">⚠</div><b style="color:var(--ink);font-size:16px">Sem conexão</b><p>Tente de novo.</p><button class="btn pri" data-act="retry">Tentar de novo</button></div></div>`;
  else if(S.loading)inner=`<div class="sbar"><span>09:41</span><span>●●● 5G</span></div><div class="body" style="padding:16px"><div class="muted" style="margin:6px 0 14px;font-weight:600">Carregando…</div><div class="sk" style="height:70px;margin-bottom:10px"></div><div class="sk" style="height:56px;margin-bottom:10px"></div><div class="sk" style="height:56px;margin-bottom:10px"></div><div class="sk" style="height:56px"></div></div>`;
  else inner=`<div class="body" id="body">${VIEWS[S.view]()}</div>`;
  const r=root(S.view);
  const tabs=[['home','Início','home'],['turmas','Turmas','book'],['notas','Notas','grade'],['serv','Serviços','grid']];
  const showBar=S.view!=='saiu';
  sc.innerHTML=inner+(showBar?`<nav class="tabbar" aria-label="Navegação principal">${tabs.map(([k,l,i])=>`<button data-act="tab" data-arg="${k}" ${r===k?'aria-current="page"':''}>${ICO[i]}${l}</button>`).join('')}</nav>`:'')
   +(S.toast?`<div class="toast" role="status">${esc(S.toast)}</div>`:'')
   +(S.sheet?`<div class="shade" data-act="noop"></div><div class="sheet" role="dialog" aria-label="Sua sessão"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h2>Sua sessão</h2><button class="back" data-act="closeSheet" aria-label="Fechar">✕</button></div><div class="box" style="margin:0 0 10px">⏱ Faltam 2 minutos para a sessão expirar por falta de uso.</div><p class="muted" style="font-size:13px;margin:0 0 6px">Avisamos antes de desconectar. O que você estava preenchendo fica salvo como rascunho.</p><button class="btn pri" data-act="extend">Continuar conectado</button><button class="btn" data-act="logout">Sair e manter rascunho</button></div>`:'');
  const b=sc.querySelector('.body');if(b)b.scrollTop=(S.keepTop?0:keepScroll);S.keepTop=false;
}

/* ===== eventos do protótipo ===== */
$('screen').addEventListener('click',e=>{
  const T=S.test;
  if(T.mode==='task'&&T.stage==='task'){T.taps++}
  const el=e.target.closest('[data-act],button,input,textarea,label');
  if(!el){if(T.mode==='task'&&T.stage==='task')T.miss++;updateSide();return}
  if(el.matches('input,textarea,label'))return;
  const a=el.dataset.act,g=el.dataset.arg;
  if(!a){if(T.mode==='task'&&T.stage==='task')T.miss++;updateSide();return}
  switch(a){
   case'back':back();break;
   case'tab':tabTo(g);break;
   case'tab2':S.tab=g;track('turma');render();break;
   case'turma':if(g==='rc')go('turma');else{if(T.mode==='task'&&T.stage==='task')T.miss++;toast('Turma não detalhada neste protótipo.')}break;
   case'freq':go('freq');break;
   case'mais':if(g==='freq')go('freq');else tabTo('notas');break;
   case'refresh':toast('Atualizado agora');break;
   case'perfil':go('perfil');break;
   case'sheet':S.sheet=true;render();break;
   case'closeSheet':S.sheet=false;render();break;
   case'extend':S.sheet=false;S.minutes=25;S.savedDraft=true;check('extend');toast('Sessão estendida por mais 25 minutos');break;
   case'logout':S.sheet=false;go('saiu',null,true);break;
   case'relogin':S.minutes=25;go('plano',null,true);break;
   case'sem':S.sem=g;render();break;
   case'grupo':go('grupo',g);break;
   case'item':
     if(g==='Histórico')go('historico');
     else if(g==='Meu plano de matrículas')go('plano');
     else{if(T.mode==='task'&&T.stage==='task')T.miss++;toast('Item não detalhado neste protótipo.')}break;
   case'dl':toast('Arquivo baixado');check('dl',g);break;
   case'copy':try{navigator.clipboard.writeText('20250012345').catch(()=>{})}catch(_){}toast('Matrícula copiada');break;
   case'toast':if(T.mode==='task'&&T.stage==='task')T.miss++;toast(g);break;
   case'retry':if(S.error)S.error();break;
   case'noop':break;
  }
  updateSide();
});
$('screen').addEventListener('input',e=>{
  if(e.target.id==='q'){S.query=e.target.value;$('res').innerHTML=resHtml();}
  if(e.target.id==='draft'){S.draft=e.target.value}
});

/* ===== teste de usabilidade ===== */
function curTask(){return TASKS[S.test.idx]}
function startTask(i){
  const T=S.test;T.mode='task';T.idx=i;T.stage='task';T.t0=Date.now();T.taps=0;T.miss=0;T.views=new Set(['home']);T.rate=0;T.comment='';T.answer='';T.cur={outcome:null};
  S.sheet=false;S.toast='';TASKS[i].start();clearInterval(S.timers.tick);S.timers.tick=setInterval(tick,1000);updateSide();
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
function persist(){try{localStorage.setItem('sigaa-proto-resultados',JSON.stringify({nome:S.test.name,log:S.test.log}))}catch(_){}}
function summaryText(){
  const T=S.test;
  let s=`SIGAA Mobile · teste de usabilidade\nParticipante: ${T.name||'(sem nome)'}\nData: ${new Date().toLocaleString('pt-BR')}\n\n`;
  T.log.forEach(r=>{s+=`${r.id} · ${r.resultado} · ${r.segundos}s · ${r.toques} toques (${r.toquesSemResposta} sem resposta) · ${r.telas} telas · facilidade ${r.nota||'-'}/5${r.resposta?` · respondeu ${r.resposta} faltas`:''}${r.comentario?`\n   Comentário: ${r.comentario}`:''}\n`});
  return s}
function esc2(x){return esc(x)}

function updateSide(){
  const T=S.test,side=$('side');
  const brand=`<div class="brand"><div class="logo">S</div><b>SIGAA Mobile</b></div>`;
  const desk=`<div class="card desk"><h3>Trabalho de IHC</h3><div class="muted" style="line-height:1.5">Interação Humano-Computador ? Sistemas de Informação. Grupo: Gustavo Gevú, Lucas Francisco, Nicolas Moreno e Pedro Costa. Protótipo com dados e fluxos fictícios.</div></div>`;
  let main='';
  if(T.mode==='task'){
    const t=curTask();
    if(T.stage==='task')main=`<div class="card"><div class="row" style="justify-content:space-between"><span class="task-n">Tarefa ${T.idx+1} de ${TASKS.length}</span><span class="timer" id="tm">0:00</span></div><div class="task-t">${esc(t.text)}</div><div class="row"><button class="btn pri" data-side="done">Terminei</button><button class="btn" data-side="give">Desisto</button></div></div>`;
    else if(T.stage==='answer')main=`<div class="card"><span class="task-n">Tarefa ${T.idx+1} · resposta</span><div class="task-t">Quantas faltas você tem em Redes de Computadores?</div><div class="row" style="flex-wrap:nowrap"><input id="ans" type="number" min="0" max="60" inputmode="numeric" placeholder="Número de faltas" value="${esc(T.answer)}"><button class="btn pri" data-side="ans">Confirmar</button></div></div>`;
    else main=`<div class="card"><span class="task-n">Tarefa ${T.idx+1} · ${T.cur.outcome==='sucesso'?'concluída ✓':T.cur.outcome==='desistiu'?'encerrada':'registrada'}</span><div class="task-t">Quão fácil foi essa tarefa?</div><div class="stars" role="group" aria-label="Facilidade de 1 a 5">${[1,2,3,4,5].map(n=>`<button data-side="star" data-n="${n}" aria-pressed="${T.rate===n}">${n}</button>`).join('')}</div><div class="row" style="justify-content:space-between;font-size:12px;margin:6px 0 12px" ><span class="muted">1 · muito difícil</span><span class="muted">5 · muito fácil</span></div><textarea id="cm" rows="2" placeholder="O que foi mais fácil e o que foi mais difícil? (opcional)">${esc(T.comment)}</textarea><div class="row" style="margin-top:10px"><button class="btn pri" data-side="next" ${T.rate?'':'disabled style="opacity:.5"'}>${T.idx+1<TASKS.length?'Próxima tarefa':'Ver resultados'}</button></div></div>`;
  }else if(T.mode==='done'){
    main=`<div class="card"><span class="task-n">Teste concluído</span><div class="task-t">Obrigado, ${esc(T.name||'participante')}!</div><div class="row"><button class="btn pri" data-side="results">Ver resultados</button><button class="btn" data-side="restart">Refazer</button></div></div>`;
  }else if(T.mode==='free'){
    main=`<div class="card"><span class="task-n">Exploração livre</span><div class="task-t">Navegue à vontade pelo protótipo.</div><button class="btn pri" data-side="start">Começar o teste com tarefas</button></div>`;
  }
  const fac=`<div class="card desk"><h3>Facilitador</h3><div class="tog"><input type="checkbox" id="slow" ${S.sim.slow?'checked':''}><label for="slow">Simular lentidão (“Carregando…”)</label></div><div class="tog" style="margin-top:8px"><input type="checkbox" id="err" ${S.sim.err?'checked':''}><label for="err">Falhar a próxima navegação (“Sem conexão”)</label></div><div class="row" style="margin-top:12px"><button class="btn sm" data-side="sess">Abrir aviso de sessão</button><button class="btn sm" data-side="results">Resultados</button></div></div>`;
  // não recria o painel durante a digitação
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
   case'next':T.comment=$('cm')?$('cm').value:'';saveTask();if(T.mode==='done')showResults();break;
   case'results':showResults();break;
   case'restart':T.log=[];T.name=T.name;startTask(0);break;
   case'start':T.log=[];startTask(0);break;
   case'sess':S.sheet=true;render();break;
  }
});
$('side').addEventListener('change',e=>{if(e.target.id==='slow')S.sim.slow=e.target.checked;if(e.target.id==='err')S.sim.err=e.target.checked});
$('side').addEventListener('input',e=>{if(e.target.id==='cm')S.test.comment=e.target.value});

function showIntro(){
  $('modal').innerHTML=`<div class="modal"><div class="card"><div class="brand" style="margin-bottom:12px"><div class="logo">S</div><b>SIGAA Mobile</b></div><h2>Teste de usabilidade</h2>
  <p>Este é um protótipo desenvolvido para a disciplina de IHC (Interação Humano-Computador), por um grupo de Sistemas de Informação. O objetivo é melhorar a interface de módulos do SIGAA, priorizados com base em questionários respondidos por quase 50 pessoas, que apontaram estes entre os módulos que mais desagradaram na plataforma oficial. Os dados são fictícios. Você fará 4 tarefas curtas, de cerca de 3 minutos cada. Estamos testando o protótipo, não você.</p>
  <p>Integrantes: Gustavo Gevú, Lucas Francisco, Nicolas Moreno e Pedro Costa.</p>
  <p>Se puder, pense em voz alta. Ao fim de cada tarefa você dá uma nota de 1 a 5 para a facilidade. Os tempos e toques ficam só neste aparelho e você escolhe se envia o resumo.</p>
  <label for="nm" style="font-weight:600;display:block;margin:12px 0 6px">Seu nome ou apelido (opcional)</label><input id="nm" type="text" autocomplete="off">
  <div class="row" style="margin-top:16px"><button class="btn pri" id="go1">Começar o teste</button><button class="btn" id="go2">Só explorar</button></div></div></div>`;
  $('go1').onclick=()=>{S.test.name=$('nm').value.trim();$('modal').innerHTML='';S.test.log=[];startTask(0)};
  $('go2').onclick=()=>{S.test.name=$('nm').value.trim();$('modal').innerHTML='';S.test.mode='free';updateSide()};
}
function showResults(){
  const T=S.test,rows=T.log.map(r=>`<tr><td><b>${r.id}</b></td><td>${esc(r.resultado)}</td><td>${r.segundos}s</td><td>${r.toques} (${r.toquesSemResposta})</td><td>${r.telas}</td><td>${r.nota||'-'}</td></tr>${r.comentario||r.resposta?`<tr><td></td><td colspan="5" class="muted">${r.resposta?`Respondeu ${esc(r.resposta)} faltas. `:''}${esc(r.comentario)}</td></tr>`:''}`).join('');
  $('modal').innerHTML=`<div class="modal"><div class="card"><h2>Resultados</h2><p class="muted">Participante: ${esc(T.name||'(sem nome)')}</p>
  ${T.log.length?`<div class="scroll-x"><table><thead><tr><th>Tarefa</th><th>Resultado</th><th>Tempo</th><th>Toques (sem resposta)</th><th>Telas</th><th>Nota</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p>Nenhuma tarefa registrada ainda.</p>'}
  <p class="muted" style="font-size:13px">“Toques sem resposta” são toques em áreas que não fazem nada. Eles indicam onde o usuário esperava um controle.</p>
  <div class="row"><button class="btn pri" id="cp">Copiar resumo</button><button class="btn" id="cl">Fechar</button></div><p id="cpm" class="muted" style="font-size:13px;min-height:18px"></p>
  <textarea id="tx" rows="6" readonly style="font-size:12px">${esc(summaryText())}</textarea></div></div>`;
  $('cl').onclick=()=>{$('modal').innerHTML=''};
  $('cp').onclick=()=>{const t=$('tx');t.select();let ok=false;try{navigator.clipboard.writeText(t.value).then(()=>{$('cpm').textContent='Resumo copiado. Envie ao grupo.'},()=>{$('cpm').textContent='Selecione o texto abaixo e copie.'});ok=true}catch(_){}if(!ok)$('cpm').textContent='Selecione o texto abaixo e copie.'};
}

/* ===== sessão: contagem regressiva real ===== */
setInterval(()=>{ if(S.view==='saiu')return; S.timers.sec=(S.timers.sec||0)+1; if(S.timers.sec>=60){S.timers.sec=0;S.minutes=Math.max(0,S.minutes-1); if(S.minutes===2&&S.test.mode!=='task'){S.sheet=true} render()} },1000);

render();updateSide();showIntro();
