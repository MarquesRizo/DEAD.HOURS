const fs = require('fs');
const { PDFDocument, rgb, StandardFonts, TextAlignment, degrees } = require('pdf-lib');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const REF_W = 1000;
const REF_H = 1414;

const sx = (x) => (x / REF_W) * PAGE_WIDTH;
const sy = (h) => (h / REF_H) * PAGE_HEIGHT;
const py = (y) => PAGE_HEIGHT - (y / REF_H) * PAGE_HEIGHT;

// Colors
const cBg = rgb(9 / 255, 9 / 255, 9 / 255);
const cCard = rgb(19 / 255, 19 / 255, 19 / 255);
const cCardHeader = rgb(26 / 255, 26 / 255, 26 / 255);
const cCardAlt = rgb(14 / 255, 14 / 255, 14 / 255);
const cInput = rgb(12 / 255, 12 / 255, 12 / 255);
const cBorder = rgb(51 / 255, 51 / 255, 51 / 255);
const cBorderLight = rgb(65 / 255, 65 / 255, 65 / 255);
const cBorderRed = rgb(120 / 255, 29 / 255, 36 / 255);
const cRedBright = rgb(170 / 255, 40 / 255, 48 / 255);
const cRedDark = rgb(75 / 255, 17 / 255, 23 / 255);
const cTextWhite = rgb(227 / 255, 222 / 255, 211 / 255);
const cTextPure = rgb(1, 1, 1);
const cTextMuted = rgb(119 / 255, 115 / 255, 108 / 255);
const cTextGold = rgb(195 / 255, 187 / 255, 169 / 255);

// Vitals
const cLife = rgb(120 / 255, 29 / 255, 36 / 255);
const cStamina = rgb(140 / 255, 109 / 255, 35 / 255);
const cDefense = rgb(44 / 255, 74 / 255, 111 / 255);
const cCargo = rgb(63 / 255, 94 / 255, 70 / 255);

function sanitizeForWinAnsi(text, font) {
  if (!text) return '';
  const replacements = {
    '→': '->', '←': '<-', '↑': '^', '↓': 'v', '↔': '<->',
    '✓': '[X]', '✔': '[X]', '✗': '[ ]', '✘': '[ ]',
    '…': '...', '•': '•', '·': '·',
    '💀': '[morte]', '🧟': '[infectado]', '🔪': '[faca]', '🔫': '[arma]', '💉': '[cura]'
  };

  let result = '';
  for (const char of Array.from(text)) {
    if (replacements[char]) {
      result += replacements[char];
      continue;
    }
    try {
      font.encodeText(char);
      result += char;
    } catch {
      const normalized = char.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
      try {
        font.encodeText(normalized);
        result += normalized;
      } catch {
        result += ' ';
      }
    }
  }
  return result;
}

async function buildPDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const form = pdfDoc.getForm();

  // Helper drawing functions
  const drawBox = (x, y, w, h, opts = {}) => {
    page.drawRectangle({
      x: sx(x),
      y: py(y + h),
      width: sx(w),
      height: sy(h),
      color: opts.color,
      borderColor: opts.borderColor,
      borderWidth: opts.borderWidth ?? 0,
      rotate: opts.rotate,
    });
  };

  const drawLineSeg = (x1, y1, x2, y2, color, thickness = 1) => {
    page.drawLine({
      start: { x: sx(x1), y: py(y1) },
      end: { x: sx(x2), y: py(y2) },
      color,
      thickness: sx(thickness),
    });
  };

  const drawTextAt = (text, x, y, size, font, color, opts = {}) => {
    if (!text) return;
    const clean = sanitizeForWinAnsi(text, font);
    const sizePt = sx(size);
    let drawX = sx(x);
    if (opts.alignCenter && opts.boxW) {
      const w = font.widthOfTextAtSize(clean, sizePt);
      drawX = sx(x) + (sx(opts.boxW) - w) / 2;
    }
    page.drawText(clean, {
      x: drawX,
      y: py(y),
      size: sizePt,
      font,
      color,
      rotate: opts.rotate,
    });
  };

  const addField = (name, val, x, y, w, h, opts = {}) => {
    const field = form.createTextField(name);
    const fSize = opts.fontSize ? sx(opts.fontSize) : 8.5;
    const fFont = opts.font || fontCourierBold;
    const fColor = opts.textColor || cTextWhite;

    field.addToPage(page, {
      x: sx(x),
      y: py(y + h),
      width: sx(w),
      height: sy(h),
      borderWidth: 0,
      backgroundColor: undefined,
      borderColor: undefined,
      textColor: fColor,
    });

    if (opts.multiline) {
      field.enableMultiline();
    }
    if (opts.alignCenter) {
      field.setAlignment(TextAlignment.Center);
    }

    field.defaultUpdateAppearances(fFont);
    field.setFontSize(fSize);
    field.setText(sanitizeForWinAnsi(val || '', fFont));
    return field;
  };

  // 1. Fill background
  drawBox(0, 0, 1000, 1414, { color: cBg });

  // 2. Subtle grid lines
  const cGrid = rgb(15 / 255, 15 / 255, 15 / 255);
  for (let x = 0; x < 1000; x += 36) {
    drawLineSeg(x, 0, x, 1414, cGrid, 0.5);
  }
  for (let y = 0; y < 1414; y += 36) {
    drawLineSeg(0, y, 1000, y, cGrid, 0.5);
  }

  // 3. Outer borders
  drawBox(14, 14, 972, 1386, { borderColor: cBorder, borderWidth: 1.5 });
  drawBox(18, 18, 964, 1378, { borderColor: rgb(75 / 255, 17 / 255, 23 / 255), borderWidth: 0.8 });

  // Corner crosshairs
  drawTextAt("[ + ]", 22, 29, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 955, 29, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 22, 1400, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 955, 1400, 8, fontCourierBold, cBorderRed);

  // 4. Top security bar
  drawBox(28, 24, 944, 20, { color: cRedDark, borderColor: cBorderRed, borderWidth: 1 });
  drawTextAt("DEAD HOURS // REGISTRO DE SOBREVIVENTE // PROTOCOLO DE TRIAGEM 1.0", 38, 38, 7.5, fontCourierBold, cTextPure);
  drawTextAt("UTC-3 (BRASILIA)", 750, 38, 7.5, fontCourier, cTextGold);
  drawTextAt("CAMPO ATIVO", 885, 38, 7.5, fontCourierBold, cRedBright);

  // 5. Header Principal
  drawBox(28, 52, 54, 54, { color: cCard, borderColor: cBorderRed, borderWidth: 2 });
  drawTextAt("DH", 34, 82, 18, fontHelveticaBold, cTextPure);
  drawTextAt("SURV", 37, 98, 7.5, fontCourierBold, cRedBright);

  drawTextAt("REGISTRO DE SOBREVIVENTE", 92, 74, 20, fontHelveticaBold, cTextPure);
  drawTextAt("DOSSIE TECNICO DE IDENTIFICACAO E APTIDAO DE CAMPO", 95, 94, 8.5, fontCourier, cTextGold);

  drawTextAt("REF: DH-REG-04 // SERVICO ATIVO", 725, 66, 8, fontCourier, cTextMuted);
  drawTextAt("POSTO DE TRIAGEM: SECTOR Z-01", 725, 78, 8, fontCourier, cTextMuted);
  drawBox(725, 84, 180, 18, { color: cBorderRed, borderColor: cRedBright, borderWidth: 1 });
  drawTextAt("SOBREVIVENTE AVALIADO", 725, 96.5, 8.5, fontCourierBold, cTextPure, { alignCenter: true, boxW: 180 });

  drawLineSeg(28, 118, 972, 118, cBorderRed, 2);

  // Section Header Function
  const drawSectionHeader = (y, num, title, code) => {
    drawBox(28, y, 944, 24, { color: cCardHeader, borderColor: cBorder, borderWidth: 1 });
    drawBox(28, y, 5, 24, { color: cBorderRed });
    drawBox(38, y + 3, 22, 18, { color: cRedDark, borderColor: cBorderRed, borderWidth: 1 });
    drawTextAt(num, 38, y + 16, 8.5, fontCourierBold, cTextPure, { alignCenter: true, boxW: 22 });
    drawTextAt(title, 68, y + 17, 10.5, fontHelveticaBold, cTextPure);
    drawTextAt(code, 735, y + 16, 8, fontCourier, cTextMuted);
  };

  // ==================== 1. IDENTIFICAÇÃO ====================
  drawSectionHeader(130, "01", "IDENTIFICACAO DO INDIVIDUO", "SEC-01 // REGISTRO CIVIL & CAMPO");

  drawBox(28, 160, 740, 108, { color: cCard, borderColor: cBorder, borderWidth: 1 });

  drawTextAt("NOME DO SOBREVIVENTE (IDENTIFICADOR DE CAMPO):", 38, 174, 7.5, fontCourier, cTextMuted);
  drawBox(38, 180, 720, 26, { color: rgb(28 / 255, 12 / 255, 14 / 255), borderColor: cBorderRed, borderWidth: 1 });
  addField('nome_personagem', data.nomePersonagem, 44, 182, 708, 22, {
    font: fontHelveticaBold,
    fontSize: 13,
    textColor: cTextPure
  });

  drawTextAt("NOME DO JOGADOR:", 38, 220, 7.5, fontCourier, cTextMuted);
  drawBox(38, 224, 345, 22, { color: cInput, borderColor: cBorder, borderWidth: 1 });
  addField('nome_jogador', data.nomeJogador, 42, 226, 337, 18, {
    font: fontHelveticaBold,
    fontSize: 9,
    textColor: cTextWhite
  });

  drawTextAt("IDADE CRONOLOGICA:", 400, 220, 7.5, fontCourier, cTextMuted);
  drawBox(400, 224, 120, 22, { color: cInput, borderColor: cBorder, borderWidth: 1 });
  addField('idade', data.idade, 404, 226, 112, 18, {
    font: fontHelveticaBold,
    fontSize: 9,
    textColor: cTextWhite
  });

  drawTextAt("OCUPACAO ANTERIOR:", 535, 220, 7.5, fontCourier, cTextMuted);
  drawBox(535, 224, 223, 22, { color: cInput, borderColor: cBorder, borderWidth: 1 });
  addField('ocupacao', data.ocupacao, 539, 226, 215, 18, {
    font: fontHelveticaBold,
    fontSize: 9,
    textColor: cTextWhite
  });

  // Photo Box
  drawBox(780, 160, 192, 108, { color: cCard, borderColor: cBorder, borderWidth: 1 });
  drawBox(792, 168, 168, 92, { borderColor: cBorderLight, borderWidth: 0.8 });
  drawTextAt("[ REGISTRO FACIAL ]", 792, 202, 7.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 168 });
  drawTextAt("ARQUIVO DE CAMPO", 792, 214, 6.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 168 });
  drawBox(812, 232, 130, 18, { color: cBorderRed, borderColor: cRedBright, borderWidth: 1 });
  drawTextAt("TRIAGEM OK", 812, 244, 8, fontCourierBold, cTextPure, { alignCenter: true, boxW: 130 });

  // ==================== 2. ATRIBUTOS ====================
  drawSectionHeader(280, "02", "MATRIZ DE ATRIBUTOS PRINCIPAIS (12 PONTOS DISTRIBUIDOS)", "SEC-02 // BIO-METRICA OPERACIONAL");

  const attrs = [
    { key: 'forca', field: 'attr_forca', name: 'FORCA', tag: '[FOR]', desc: 'Massa & Combate', val: data.forca },
    { key: 'agilidade', field: 'attr_agilidade', name: 'AGILIDADE', tag: '[AGI]', desc: 'Reflexo & Furtivo', val: data.agilidade },
    { key: 'vigor', field: 'attr_vigor', name: 'VIGOR', tag: '[VIG]', desc: 'Saude & Imunidade', val: data.vigor },
    { key: 'intelecto', field: 'attr_intelecto', name: 'INTELECTO', tag: '[INT]', desc: 'Logica & Reparos', val: data.intelecto },
    { key: 'percepcao', field: 'attr_percepcao', name: 'PERCEPCAO', tag: '[PER]', desc: 'Atencao & Rastreio', val: data.percepcao },
    { key: 'presenca', field: 'attr_presenca', name: 'PRESENCA', tag: '[PRE]', desc: 'Moral & Sangue Frio', val: data.presenca }
  ];

  const attrWidth = 150;
  const attrGap = 8.8;
  const startX = 28;

  attrs.forEach((a, i) => {
    const x = startX + i * (attrWidth + attrGap);
    const numVal = parseInt(a.val) || 0;
    const isHigh = numVal >= 3;

    drawBox(x, 310, attrWidth, 120, {
      color: cCard,
      borderColor: isHigh ? cBorderRed : cBorder,
      borderWidth: 1
    });

    const headerBg = isHigh ? rgb(36 / 255, 20 / 255, 22 / 255) : cCardHeader;
    drawBox(x, 310, attrWidth, 22, { color: headerBg, borderColor: cBorder, borderWidth: 1 });
    if (isHigh) {
      drawBox(x, 330, attrWidth, 2, { color: cBorderRed });
    }
    drawTextAt(`${a.tag} ${a.name}`, x, 325, 8.5, fontHelveticaBold, isHigh ? cTextPure : cTextGold, {
      alignCenter: true,
      boxW: attrWidth
    });

    // Central Value Field
    addField(a.field, a.val, x + 10, 336, attrWidth - 20, 42, {
      font: fontHelveticaBold,
      fontSize: 24,
      textColor: isHigh ? cTextPure : cTextWhite,
      alignCenter: true
    });

    // Pips (1 to 5)
    const dotStartX = x + attrWidth / 2 - 18;
    for (let d = 1; d <= 5; d++) {
      const dx = dotStartX + (d - 1) * 8;
      const dotFilled = d <= numVal;
      drawBox(dx, 384, 5, 5, {
        color: dotFilled ? cBorderRed : rgb(40 / 255, 40 / 255, 40 / 255),
        borderColor: cBorder,
        borderWidth: 0.5
      });
    }

    // Footer
    drawBox(x, 404, attrWidth, 26, { color: cCardAlt, borderColor: cBorder, borderWidth: 0.5 });
    drawTextAt(a.desc, x, 420, 6.5, fontCourier, cTextMuted, { alignCenter: true, boxW: attrWidth });
  });

  // Especializações Strip
  drawBox(28, 438, 944, 34, { color: cCard, borderColor: cBorder, borderWidth: 1 });
  drawTextAt("ESPECIALIZACOES (+2):", 38, 458, 9.5, fontHelveticaBold, cTextGold);

  // Spec 1
  drawBox(215, 442, 355, 26, { color: cCardHeader, borderColor: cBorderRed, borderWidth: 1 });
  drawBox(215, 442, 3, 26, { color: cBorderRed });
  addField('especializacao_1', data.esp1, 222, 444, 280, 22, {
    font: fontCourierBold,
    fontSize: 8.5,
    textColor: cTextWhite
  });
  drawBox(510, 445, 52, 20, { color: cRedDark, borderColor: cBorderRed, borderWidth: 1 });
  drawTextAt("+2 [INT]", 510, 458, 8, fontCourierBold, cRedBright, { alignCenter: true, boxW: 52 });

  // Spec 2
  drawBox(582, 442, 380, 26, { color: cCardHeader, borderColor: cBorderRed, borderWidth: 1 });
  drawBox(582, 442, 3, 26, { color: cBorderRed });
  addField('especializacao_2', data.esp2, 589, 444, 305, 22, {
    font: fontCourierBold,
    fontSize: 8.5,
    textColor: cTextWhite
  });
  drawBox(902, 445, 52, 20, { color: cRedDark, borderColor: cBorderRed, borderWidth: 1 });
  drawTextAt("+2 [FOR]", 902, 458, 8, fontCourierBold, cRedBright, { alignCenter: true, boxW: 52 });

  // ==================== 3. MONITORES VITAIS DE COMBATE ====================
  drawSectionHeader(484, "03", "MONITORES VITAIS & PARAMETROS OPERACIONAIS", "SEC-03 // STATUS DE COMBATE");

  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  const cargaCalc = 5 + numFor;

  const vitals = [
    { title: "PONTOS DE VIDA", formula: "10 + (VIG x 2)", field: "vital_vida", val: `${vidaCalc} PV`, unit: "PV", sub: "INTEGRIDADE", color: cLife, totalDots: 16, fillDots: Math.min(vidaCalc, 16) },
    { title: "PONTOS DE FOLEGO", formula: "5 + VIG", field: "vital_folego", val: `${folegoCalc} PF`, unit: "PF", sub: "RESISTENCIA", color: cStamina, totalDots: 8, fillDots: Math.min(folegoCalc, 8) },
    { title: "DEFESA PASSIVA", formula: "10 + AGI", field: "vital_defesa", val: `${defesaCalc} DEF`, unit: "DEF", sub: "ESQUIVA BASE", color: cDefense, totalDots: 8, fillDots: Math.min(defesaCalc - 8, 8) },
    { title: "CAPACIDADE CARGA", formula: "5 + FOR", field: "vital_carga", val: `${cargaCalc} SLOTS`, unit: "SLOTS", sub: "LIMITE DE PESO", color: cCargo, totalDots: 8, fillDots: Math.min(cargaCalc, 8) }
  ];

  const vitWidth = 227;
  const vitGap = 12;

  vitals.forEach((v, i) => {
    const x = 28 + i * (vitWidth + vitGap);

    drawBox(x, 514, vitWidth, 108, { color: cCard, borderColor: cBorder, borderWidth: 1 });
    drawBox(x, 514, 5, 108, { color: v.color });

    drawTextAt(v.title, x + 12, 528, 8, fontCourier, cTextMuted);
    drawTextAt(v.formula, x + 135, 528, 6.5, fontCourier, cTextGold);
    drawLineSeg(x + 12, 534, x + vitWidth - 10, 534, cBorder, 0.8);

    // Large Vital Field
    addField(v.field, v.val, x + 12, 540, 110, 32, {
      font: fontHelveticaBold,
      fontSize: 18,
      textColor: cTextPure
    });

    drawTextAt(v.sub, x + 130, 560, 6.5, fontCourier, cTextMuted);

    // Damage Tracker Pips
    const boxX = x + 12;
    const boxY = 578;
    const boxW = vitWidth - 22;
    const boxH = 34;
    drawBox(boxX, boxY, boxW, boxH, { color: cInput, borderColor: cBorder, borderWidth: 0.8 });

    const pipW = 18;
    const pipH = 10;
    const pipGap = 6;
    for (let p = 0; p < v.totalDots; p++) {
      const row = Math.floor(p / 8);
      const col = p % 8;
      const px = boxX + 6 + col * (pipW + pipGap);
      const pyBox = boxY + 6 + row * (pipH + 3);
      const isFilled = p < v.fillDots;
      drawBox(px, pyBox, pipW, pipH, {
        color: isFilled ? v.color : rgb(35 / 255, 35 / 255, 35 / 255),
        borderColor: cBorder,
        borderWidth: 0.5
      });
    }
  });

  // ==================== 4. PERFIL FÍSICO & PSICOLÓGICO ====================
  drawSectionHeader(634, "04", "PERFIL FISICO & PSICOLOGICO", "SEC-04 // AVALIACAO DESCRITIVA");

  const colW = 466;
  // Col 1: Aparência
  drawBox(28, 664, colW, 135, { color: cCard, borderColor: cBorder, borderWidth: 1 });
  drawTextAt("APARENCIA FISICA & MARCAS DISTINTIVAS:", 38, 680, 8, fontCourier, cTextMuted);
  drawTextAt("IDENTIFICACAO VISUAL", 360, 680, 7, fontCourier, cTextMuted);
  drawLineSeg(38, 686, 484, 686, cBorder, 0.8);
  addField('aparencia', data.aparencia, 38, 692, colW - 20, 100, {
    font: fontHelvetica,
    fontSize: 8.5,
    textColor: cTextGold,
    multiline: true
  });

  // Col 2: Personalidade
  drawBox(506, 664, colW, 135, { color: cCard, borderColor: cBorder, borderWidth: 1 });
  drawTextAt("PERSONALIDADE & CONDUTA SOB PRESSAO:", 516, 680, 8, fontCourier, cTextMuted);
  drawTextAt("ESTABILIDADE COGNITIVA", 825, 680, 7, fontCourier, cTextMuted);
  drawLineSeg(516, 686, 962, 686, cBorder, 0.8);
  addField('personalidade', data.personalidade, 516, 692, colW - 20, 100, {
    font: fontHelvetica,
    fontSize: 8.5,
    textColor: cTextGold,
    multiline: true
  });

  // ==================== 5. HISTÓRICO & ÂNCORAS NARRATIVAS ====================
  drawSectionHeader(811, "05", "HISTORICO & ANCORAS NARRATIVAS", "SEC-05 // MOTIVACOES & TRAUMAS");

  const anchors = [
    { label: "OBJETIVO PESSOAL:", field: "objetivo_pessoal", val: data.objetivo, x: 28, y: 841 },
    { label: "MAIOR MEDO:", field: "maior_medo", val: data.medo, x: 506, y: 841 },
    { label: "LIGACAO COM SOBREVIVENTE:", field: "ligacao_sobrevivente", val: data.ligacao, x: 28, y: 917 },
    { label: "SEGREDO OU CONFLITO:", field: "segredo_conflito", val: data.segredo, x: 506, y: 917 }
  ];

  anchors.forEach((anc) => {
    drawBox(anc.x, anc.y, colW, 68, { color: cCard, borderColor: cBorder, borderWidth: 1 });
    drawTextAt(anc.label, anc.x + 10, anc.y + 16, 8, fontCourierBold, cRedBright);
    addField(anc.field, anc.val, anc.x + 10, anc.y + 22, colW - 20, 42, {
      font: fontHelvetica,
      fontSize: 8.5,
      textColor: cTextWhite,
      multiline: true
    });
  });

  // ==================== 6. MANIFESTO DE CARGA & EQUIPAMENTO ====================
  drawSectionHeader(997, "06", "MANIFESTO DE CARGA & EQUIPAMENTO INICIAL", "SEC-06 // LOGISTICA DE SOBREVIVENCIA");

  const invItems = [
    { label: "ARMA PRINCIPAL:", slot: "SLOT 1", field: "equip_arma", val: data.arma, note: "Condicao: Robusta | Peso: 1 slot", x: 28, w: 290 },
    { label: "FERRAMENTA DE CAMPO:", slot: "SLOT 2", field: "equip_ferramenta", val: data.ferramenta, note: "Condicao: Operacional | Iluminacao 10m", x: 330, w: 290 },
    { label: "OUTROS ITENS & MANTIMENTOS:", slot: "SLOTS 3-4", field: "equip_outros", val: data.outrosItens, note: "Slots Ocupados: 4 / 8 Capacidade Maxima", x: 632, w: 340 }
  ];

  invItems.forEach((item) => {
    drawBox(item.x, 1027, item.w, 88, { color: cCard, borderColor: cBorder, borderWidth: 1 });
    drawTextAt(item.label, item.x + 10, 1042, 7.5, fontCourier, cTextMuted);
    drawTextAt(item.slot, item.x + item.w - 75, 1042, 7.5, fontCourier, cTextGold);

    drawBox(item.x + 10, 1048, item.w - 20, 38, { color: cInput, borderColor: cBorder, borderWidth: 1 });
    drawBox(item.x + 10, 1048, 3, 38, { color: cBorderRed });

    addField(item.field, item.val, item.x + 16, 1050, item.w - 30, 20, {
      font: fontCourierBold,
      fontSize: 8,
      textColor: cTextWhite
    });
    drawTextAt(item.note, item.x + 16, 1080, 6.5, fontCourier, cTextMuted);
  });

  // ==================== 7. DECLARAÇÃO LEGAL & ASSINATURA ====================
  drawSectionHeader(1127, "07", "DECLARACAO LEGAL & AUTENTICACAO DE CAMPO", "SEC-07 // HOMOLOGACAO");

  drawBox(28, 1157, 944, 215, { color: cCardAlt, borderColor: cBorder, borderWidth: 1 });

  // Termo legal container
  drawBox(38, 1167, 924, 56, { color: cInput, borderColor: cBorderLight, borderWidth: 0.8 });

  // Checkbox
  const chk = form.createCheckBox('declaracao_lida');
  if (data.declaracaoLida) {
    chk.check();
  }
  chk.addToPage(page, {
    x: sx(48),
    y: py(1177 + 16),
    width: sx(16),
    height: sy(16),
    borderWidth: 1,
    borderColor: cBorderRed,
    backgroundColor: cRedDark,
  });

  const txtTermo1 = "DECLARACAO DE CIENCIA E REGRAS: Confirmo que li e aceito as regras de sobrevivencia, combate,";
  const txtTermo2 = "ausencia, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de";
  const txtTermo3 = "que cada decisao no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana.";
  drawTextAt(txtTermo1, 74, 1182, 7.5, fontCourier, cTextMuted);
  drawTextAt(txtTermo2, 74, 1195, 7.5, fontCourier, cTextMuted);
  drawTextAt(txtTermo3, 74, 1208, 7.5, fontCourier, cTextMuted);

  drawLineSeg(38, 1234, 962, 1234, cBorder, 0.8);

  // Signatures Row
  addField('assinatura_jogador', data.assinatura, 50, 1256, 330, 36, {
    font: fontTimesItalic,
    fontSize: 16,
    textColor: cTextPure
  });
  drawLineSeg(50, 1294, 380, 1294, cBorderLight, 1);
  drawTextAt("ASSINATURA FORMAL DO SOBREVIVENTE", 50, 1308, 7.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 330 });

  addField('data_registro', data.data, 410, 1262, 140, 30, {
    font: fontCourierBold,
    fontSize: 10,
    textColor: cTextPure,
    alignCenter: true
  });
  drawLineSeg(410, 1294, 550, 1294, cBorderLight, 1);
  drawTextAt("DATA DE REGISTRO OFICIAL", 410, 1308, 7.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 140 });

  // Official Military Stamp (Tilted -3 degrees)
  // Center is at X=780, Y=1278 in 1000x1414 space
  const stampAngle = degrees(-3);
  drawBox(650, 1254, 270, 48, {
    color: rgb(45 / 255, 12 / 255, 15 / 255),
    borderColor: cBorderRed,
    borderWidth: 2,
    rotate: stampAngle
  });
  drawTextAt("SOBREVIVENTE HOMOLOGADO", 650, 1272, 10, fontHelveticaBold, cRedBright, {
    alignCenter: true,
    boxW: 270,
    rotate: stampAngle
  });
  drawTextAt("POSTO DE TRIAGEM // APTO AO ERMO", 650, 1286, 7.5, fontCourierBold, cTextGold, {
    alignCenter: true,
    boxW: 270,
    rotate: stampAngle
  });
  drawTextAt("REGISTRO PERMANENTE // SECTOR Z-01", 650, 1298, 6.5, fontCourier, cTextWhite, {
    alignCenter: true,
    boxW: 270,
    rotate: stampAngle
  });

  // Final appearance update
  form.updateFieldAppearances(fontHelveticaBold);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Sample Data
const sampleData = {
  nomeJogador: "Marcos Roberto",
  nomePersonagem: "Carlos 'Corvo' Silveira",
  idade: "34 anos",
  ocupacao: "Mecânico Automotivo & Eletricista",
  aparencia: "Cicatriz profunda no supercílio direito decorrente de estilhaços. Barba curta e desgrenhada, mãos grossas e calejadas com marcas de queimadura de solda. Veste jaqueta de couro surrada reforçada com fita silver tape nos punhos e cotovelos, coturnos industriais com biqueira de aço reforçada e calça tática desbotada.",
  personalidade: "Pragmático, silencioso e analítico. Sob estresse extremo foca em tarefas mecânicas ou reparos imediatos para manter a calma. Não tolera desperdício de comida nem de munição. Desconfiado por natureza perante novos grupos, mas leal até as últimas consequências a quem conquista seu respeito no campo.",
  forca: "3",
  agilidade: "2",
  vigor: "3",
  intelecto: "2",
  percepcao: "1",
  presenca: "1",
  esp1: "Mecânica de Veículos e Motores",
  esp2: "Luta com Lâminas & Machados",
  objetivo: "Encontrar a filha de 8 anos supostamente evacuada com o comboio de refugiados do setor sul.",
  medo: "Espaços confinados e escuros sem rotas secundárias de fuga ou saídas visíveis.",
  ligacao: "Salvou a médica Helena durante a queda da ponte rodoviária; confia no julgamento dela cegamente.",
  segredo: "Trancou o portão da oficina com colegas feridos dentro durante o primeiro surto mortal da infecção.",
  arma: "Chave de Roda Pesada (1d6+3 // Impacto)",
  ferramenta: "Lanterna Tática c/ Dínamo Manual",
  outrosItens: "Cantil 1L militar, Ração seca (x2), Fita isolante industrial",
  declaracaoLida: true,
  assinatura: "Carlos 'Corvo' Silveira",
  data: "18/11/2026"
};

  module.exports = { buildPDF, sampleData };
  if (require.main === module) {
    (async () => {
      try {
        const bytes = await buildPDF(sampleData);
        fs.writeFileSync("C:\\DEAD.HOURS\\public\\preview-ficha.pdf", bytes);
        console.log("SUCCESS: PDF created successfully. Size:", bytes.length, "bytes");
      } catch (err) {
        console.error("ERROR generating PDF:", err);
        process.exit(1);
      }
    })();
  }
