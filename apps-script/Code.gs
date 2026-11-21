const SPREADSHEET_ID = '1-YiZe5PvS5aHGzGG9yfcX4GV8bUO3qbeZMQbRYrTwzA';
const SHEET_NAME = 'Respostas';
const HEADERS = [
  'session_id', 'enviado_em', 'participante', 'tarefa_id', 'tarefa',
  'resultado', 'segundos', 'toques', 'toques_sem_resposta', 'telas',
  'nota_facilidade', 'resposta', 'comentario'
];

function doPost(e) {
  try {
    const payload = JSON.parse(e && e.postData ? e.postData.contents : '{}');
    if (!payload.sessionId || !Array.isArray(payload.tasks) || payload.tasks.length === 0 || payload.tasks.length > 20) {
      return json_({ ok: false, error: 'invalid_payload' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

      const values = sheet.getDataRange().getValues();
      if (values.slice(1).some(row => String(row[0]) === String(payload.sessionId))) {
        return json_({ ok: true, duplicate: true });
      }

      const timestamp = new Date();
      const participant = safeText_(payload.name, 120);
      const rows = payload.tasks.map(task => [
        safeText_(payload.sessionId, 100), timestamp, participant,
        safeText_(task.id, 20), safeText_(task.tarefa, 500),
        safeText_(task.resultado, 100), safeNumber_(task.segundos),
        safeNumber_(task.toques), safeNumber_(task.toquesSemResposta),
        safeNumber_(task.telas), safeNumber_(task.nota),
        safeText_(task.resposta, 200), safeText_(task.comentario, 2000)
      ]);
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
      return json_({ ok: true, rows: rows.length });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message || error) });
  }
}

function safeText_(value, maxLength) {
  let text = String(value == null ? '' : value).replace(/\u0000/g, '').slice(0, maxLength);
  // Prevent participant text from being interpreted as a spreadsheet formula.
  if (/^[=+@-]/.test(text)) text = "'" + text;
  return text;
}

function safeNumber_(value) {
  if (value == null || value === '') return '';
  const number = Number(value);
  return Number.isFinite(number) ? number : '';
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
