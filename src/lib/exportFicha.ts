import { PDFDocument, rgb, StandardFonts, PDFFont, TextAlignment, degrees, Color } from 'pdf-lib';

export interface FichaData {
  nomeJogador: string;
  nomePersonagem: string;
  idade: string;
  ocupacao: string;
  aparencia: string;
  personalidade: string;

  forca: string;
  agilidade: string;
  vigor: string;
  intelecto: string;
  percepcao: string;
  presenca: string;

  esp1: string;
  esp2: string;

  objetivo: string;
  medo: string;
  ligacao: string;
  segredo: string;

  arma: string;
  ferramenta: string;
  outrosItens: string;

  declaracaoLida: boolean;
  assinatura: string;
  data: string;

  // Identificação Fotográfica
  foto?: string;
  fotoZoom?: number;
  fotoOffsetX?: number;
  fotoOffsetY?: number;
}

/**
 * Constantes e paleta de cores compartilhada oficial de DEAD HOURS.
 * Compartilhada rigorosamente entre as renderizações de PDF vetorial e Imagem PNG.
 */
export const FICHA_CONFIG = {
  refWidth: 1000,
  refHeight: 1414,
  pdfWidth: 595.28,
  pdfHeight: 841.89,
  pngScale: 1.5, // Gera PNG em alta resolução (1500x2121 px) perfeito para compartilhamento
  colors: {
    bg: '#090909',
    card: '#131313',
    cardHeader: '#1A1A1A',
    cardAlt: '#101010',
    input: '#0C0C0C',
    border: '#333333',
    borderLight: '#414141',
    borderRed: '#781D24',
    redBright: '#AA2830',
    redDark: '#4B1117',
    textWhite: '#E3DED3',
    textPure: '#FFFFFF',
    textMuted: '#77736C',
    textGold: '#C3BBA9',
    life: '#781D24',
    stamina: '#8C6D23',
    defense: '#2C4A6F',
    cargo: '#3F5E46',
  }
};

/**
 * Gera nomes de arquivo padronizados para download:
 * dead-hours-ficha-[nome-do-sobrevivente].pdf | .png
 */
export function getExportFileName(nomePersonagem: string, extension: 'pdf' | 'png'): string {
  const cleanName = (nomePersonagem || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleanName ? `dead-hours-ficha-${cleanName}.${extension}` : `dead-hours-ficha-sobrevivente.${extension}`;
}

/**
 * Sanitiza e mapeia caracteres para garantir compatibilidade 100% com WinAnsi (StandardFonts do PDF)
 * sem descartar silenciosamente informações do jogador e evitando exceções durante o save().
 */
export function sanitizeForWinAnsi(text: string, font: PDFFont): string {
  if (!text) return '';

  const replacements: Record<string, string> = {
    '→': '->',
    '←': '<-',
    '↑': '^',
    '↓': 'v',
    '↔': '<->',
    '✓': '[X]',
    '✔': '[X]',
    '✗': '[ ]',
    '✘': '[ ]',
    '…': '...',
    '•': '•',
    '·': '·',
    '💀': '[morte]',
    '🧟': '[infectado]',
    '🔪': '[faca]',
    '🔫': '[arma]',
    '💉': '[cura]'
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

/**
 * Cria e compila a ficha completa de DEAD HOURS em formato PDF A4 vetorial do zero,
 * com identidade visual oficial (inspirada no modelo Ordem Paranormal com temática pós-apocalíptica),
 * formulários AcroForm 100% transparentes e interativos, fontes embutidas e suporte a acentos.
 */
export async function generateFichaPDF(data: FichaData): Promise<Uint8Array> {
  const PAGE_WIDTH = FICHA_CONFIG.pdfWidth;
  const PAGE_HEIGHT = FICHA_CONFIG.pdfHeight;
  const REF_W = FICHA_CONFIG.refWidth;
  const REF_H = FICHA_CONFIG.refHeight;

  const sx = (x: number) => (x / REF_W) * PAGE_WIDTH;
  const sy = (h: number) => (h / REF_H) * PAGE_HEIGHT;
  const py = (y: number) => PAGE_HEIGHT - (y / REF_H) * PAGE_HEIGHT;

  // Paleta Oficial em formato PDF rgb()
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

  const cLife = rgb(120 / 255, 29 / 255, 36 / 255);
  const cStamina = rgb(140 / 255, 109 / 255, 35 / 255);
  const cDefense = rgb(44 / 255, 74 / 255, 111 / 255);
  const cCargo = rgb(63 / 255, 94 / 255, 70 / 255);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const form = pdfDoc.getForm();

  const drawBox = (
    x: number,
    y: number,
    w: number,
    h: number,
    opts: {
      color?: Color;
      borderColor?: Color;
      borderWidth?: number;
      rotate?: any;
    } = {}
  ) => {
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

  const drawLineSeg = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: Color,
    thickness = 1
  ) => {
    page.drawLine({
      start: { x: sx(x1), y: py(y1) },
      end: { x: sx(x2), y: py(y2) },
      color,
      thickness: sx(thickness),
    });
  };

  const drawTextAt = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: PDFFont,
    color: Color,
    opts: {
      alignCenter?: boolean;
      boxW?: number;
      rotate?: any;
    } = {}
  ) => {
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

  const addField = (
    name: string,
    val: string,
    x: number,
    y: number,
    w: number,
    h: number,
    opts: {
      fontSize?: number;
      font?: PDFFont;
      textColor?: Color;
      multiline?: boolean;
      alignCenter?: boolean;
    } = {}
  ) => {
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

  // 1. Fundo Oficial
  drawBox(0, 0, 1000, 1414, { color: cBg });

  // 2. Grade tática de precisão
  const cGrid = rgb(15 / 255, 15 / 255, 15 / 255);
  for (let x = 0; x < 1000; x += 36) {
    drawLineSeg(x, 0, x, 1414, cGrid, 0.5);
  }
  for (let y = 0; y < 1414; y += 36) {
    drawLineSeg(0, y, 1000, y, cGrid, 0.5);
  }

  // 3. Molduras e miras táticas de canto
  drawBox(14, 14, 972, 1386, { borderColor: cBorder, borderWidth: 1.5 });
  drawBox(18, 18, 964, 1378, { borderColor: rgb(75 / 255, 17 / 255, 23 / 255), borderWidth: 0.8 });

  drawTextAt("[ + ]", 22, 29, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 955, 29, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 22, 1400, 8, fontCourierBold, cBorderRed);
  drawTextAt("[ + ]", 955, 1400, 8, fontCourierBold, cBorderRed);

  // 4. Barra Superior de Segurança
  drawBox(28, 24, 944, 20, { color: cRedDark, borderColor: cBorderRed, borderWidth: 1 });
  drawTextAt("DEAD HOURS // REGISTRO DE SOBREVIVENTE // PROTOCOLO DE TRIAGEM 1.0", 38, 38, 7.5, fontCourierBold, cTextPure);
  drawTextAt("UTC-3 (BRASILIA)", 750, 38, 7.5, fontCourier, cTextGold);
  drawTextAt("CAMPO ATIVO", 885, 38, 7.5, fontCourierBold, cRedBright);

  // 5. Cabeçalho Principal do Dossiê
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

  const drawSectionHeader = (y: number, num: string, title: string, code: string) => {
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

  // Photo Box (Identificação Fotográfica do Sobrevivente)
  drawBox(780, 160, 192, 108, { color: cCard, borderColor: cBorder, borderWidth: 1 });

  let photoEmbedded = false;
  if (data.foto) {
    try {
      const isPng = data.foto.startsWith('data:image/png');
      const base64Clean = data.foto.replace(/^data:image\/\w+;base64,/, '');
      const binaryStr = typeof atob !== 'undefined' 
        ? atob(base64Clean) 
        : Buffer.from(base64Clean, 'base64').toString('binary');
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const embeddedImg = isPng 
        ? await pdfDoc.embedPng(bytes) 
        : await pdfDoc.embedJpg(bytes);

      page.drawImage(embeddedImg, {
        x: sx(792),
        y: py(168 + 92),
        width: sx(168),
        height: sy(92),
      });

      drawBox(792, 168, 168, 92, { borderColor: cBorderRed, borderWidth: 1.2 });
      drawBox(808, 246, 136, 12, { color: rgb(20 / 255, 10 / 255, 12 / 255), borderColor: cBorderRed, borderWidth: 0.5 });
      drawTextAt("[ REGISTRO BIOMETRICO ]", 808, 254.5, 6, fontCourierBold, cRedBright, { alignCenter: true, boxW: 136 });
      photoEmbedded = true;
    } catch (err) {
      console.warn("Falha ao incorporar fotografia no PDF:", err);
    }
  }

  if (!photoEmbedded) {
    drawBox(792, 168, 168, 92, { borderColor: cBorderLight, borderWidth: 0.8 });
    drawTextAt("[ REGISTRO FACIAL ]", 792, 202, 7.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 168 });
    drawTextAt("ARQUIVO DE CAMPO", 792, 214, 6.5, fontCourier, cTextMuted, { alignCenter: true, boxW: 168 });
    drawBox(812, 232, 130, 18, { color: cBorderRed, borderColor: cRedBright, borderWidth: 1 });
    drawTextAt("TRIAGEM OK", 812, 244, 8, fontCourierBold, cTextPure, { alignCenter: true, boxW: 130 });
  }

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

    addField(a.field, a.val, x + 10, 336, attrWidth - 20, 42, {
      font: fontHelveticaBold,
      fontSize: 24,
      textColor: isHigh ? cTextPure : cTextWhite,
      alignCenter: true
    });

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
    { title: "PONTOS DE VIDA", formula: "10 + (VIG x 2)", field: "vital_vida", val: `${vidaCalc} PV`, color: cLife, totalDots: 16, fillDots: Math.min(vidaCalc, 16), sub: "INTEGRIDADE" },
    { title: "PONTOS DE FOLEGO", formula: "5 + VIG", field: "vital_folego", val: `${folegoCalc} PF`, color: cStamina, totalDots: 8, fillDots: Math.min(folegoCalc, 8), sub: "RESISTENCIA" },
    { title: "DEFESA PASSIVA", formula: "10 + AGI", field: "vital_defesa", val: `${defesaCalc} DEF`, color: cDefense, totalDots: 8, fillDots: Math.min(defesaCalc - 8, 8), sub: "ESQUIVA BASE" },
    { title: "CAPACIDADE CARGA", formula: "5 + FOR", field: "vital_carga", val: `${cargaCalc} SLOTS`, color: cCargo, totalDots: 8, fillDots: Math.min(cargaCalc, 8), sub: "LIMITE DE PESO" }
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

    addField(v.field, v.val, x + 12, 540, 110, 32, {
      font: fontHelveticaBold,
      fontSize: 18,
      textColor: cTextPure
    });

    drawTextAt(v.sub, x + 130, 560, 6.5, fontCourier, cTextMuted);

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
  drawBox(38, 1167, 924, 56, { color: cInput, borderColor: cBorderLight, borderWidth: 0.8 });

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

  form.updateFieldAppearances(fontHelveticaBold);
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Helper de quebra e renderização de texto multilinha para HTML5 Canvas.
 */
function drawCanvasMultiline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
) {
  if (!text) return;
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  let count = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + (line ? ' ' : '') + words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      if (count >= maxLines - 1) {
        let truncated = line;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 3) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(truncated + '...', x, currentY);
        return;
      }
      ctx.fillText(line, x, currentY);
      line = words[n];
      currentY += lineHeight;
      count++;
    } else {
      line = testLine;
    }
  }
  if (line && count < maxLines) {
    ctx.fillText(line, x, currentY);
  }
}

/**
 * Renderiza a ficha preenchida em um elemento HTML5 Canvas com alta resolução,
 * compartilhando exatamente o mesmo layout, proporção e coordenadas do PDF oficial.
 */
export async function renderFichaToCanvas(data: FichaData, canvas: HTMLCanvasElement): Promise<void> {
  const scale = FICHA_CONFIG.pngScale;
  canvas.width = Math.round(FICHA_CONFIG.refWidth * scale);
  canvas.height = Math.round(FICHA_CONFIG.refHeight * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do Canvas.');
  }

  // Aguarda fontes prontas no navegador se disponíveis
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Prossegue mesmo se fonts.ready falhar
    }
  }

  ctx.save();
  ctx.scale(scale, scale);

  const colors = FICHA_CONFIG.colors;

  // 1. Fundo Oficial
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, 1000, 1414);

  // 2. Grade tática de precisão
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1000; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1414);
    ctx.stroke();
  }
  for (let y = 0; y < 1414; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1000, y);
    ctx.stroke();
  }

  // 3. Moldura Externa e Miras
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 972, 1386);

  ctx.strokeStyle = 'rgba(120, 29, 36, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, 964, 1378);

  ctx.fillStyle = colors.borderRed;
  ctx.font = 'bold 11px "IBM Plex Mono", "Consolas", monospace';
  ctx.fillText('[ + ]', 22, 30);
  ctx.fillText('[ + ]', 952, 30);
  ctx.fillText('[ + ]', 22, 1395);
  ctx.fillText('[ + ]', 952, 1395);

  // 4. Barra Superior de Segurança
  ctx.fillStyle = colors.redDark;
  ctx.fillRect(28, 24, 944, 20);
  ctx.strokeStyle = colors.borderRed;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 24, 944, 20);

  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 9.5px "IBM Plex Mono", "Consolas", monospace';
  ctx.fillText('DEAD HOURS // REGISTRO DE SOBREVIVENTE // PROTOCOLO DE TRIAGEM 1.0', 38, 38);
  ctx.fillStyle = colors.textGold;
  ctx.fillText('UTC-3 (BRASILIA)', 740, 38);
  ctx.fillStyle = colors.redBright;
  ctx.fillText('CAMPO ATIVO', 885, 38);

  // 5. Cabeçalho Principal
  ctx.fillStyle = colors.card;
  ctx.fillRect(28, 52, 54, 54);
  ctx.strokeStyle = colors.borderRed;
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 52, 54, 54);

  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 24px "Oswald", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DH', 55, 78);
  ctx.fillStyle = colors.redBright;
  ctx.font = 'bold 8px "IBM Plex Mono", "Consolas", monospace';
  ctx.fillText('SURV', 55, 96);
  ctx.textAlign = 'left';

  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 24px "Oswald", "Arial Black", sans-serif';
  ctx.fillText('REGISTRO DE SOBREVIVENTE', 94, 76);
  ctx.fillStyle = colors.textGold;
  ctx.font = '10px "IBM Plex Mono", "Consolas", monospace';
  ctx.fillText('DOSSIE TECNICO DE IDENTIFICACAO E APTIDAO DE CAMPO', 96, 94);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '9px "IBM Plex Mono", "Consolas", monospace';
  ctx.fillText('REF: DH-REG-04 // SERVICO ATIVO', 725, 68);
  ctx.fillText('POSTO DE TRIAGEM: SECTOR Z-01', 725, 80);

  ctx.fillStyle = colors.borderRed;
  ctx.fillRect(725, 85, 180, 18);
  ctx.strokeStyle = colors.redBright;
  ctx.lineWidth = 1;
  ctx.strokeRect(725, 85, 180, 18);
  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 9px "IBM Plex Mono", "Consolas", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SOBREVIVENTE AVALIADO', 815, 98);
  ctx.textAlign = 'left';

  ctx.strokeStyle = colors.borderRed;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, 118);
  ctx.lineTo(972, 118);
  ctx.stroke();

  // Helper para Seções
  const drawSectionHeader = (y: number, num: string, title: string, code: string) => {
    ctx.fillStyle = colors.cardHeader;
    ctx.fillRect(28, y, 944, 24);
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(28, y, 944, 24);

    ctx.fillStyle = colors.borderRed;
    ctx.fillRect(28, y, 5, 24);

    ctx.fillStyle = colors.redDark;
    ctx.fillRect(38, y + 3, 22, 18);
    ctx.strokeStyle = colors.borderRed;
    ctx.strokeRect(38, y + 3, 22, 18);

    ctx.fillStyle = colors.textPure;
    ctx.font = 'bold 9px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(num, 49, y + 16);

    ctx.font = 'bold 13px "Oswald", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, 68, y + 17);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '8.5px "IBM Plex Mono", monospace';
    ctx.fillText(code, 735, y + 16);
  };

  // ==================== 1. IDENTIFICAÇÃO ====================
  drawSectionHeader(130, "01", "IDENTIFICACAO DO INDIVIDUO", "SEC-01 // REGISTRO CIVIL & CAMPO");

  ctx.fillStyle = colors.card;
  ctx.fillRect(28, 160, 740, 108);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(28, 160, 740, 108);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('NOME DO SOBREVIVENTE (IDENTIFICADOR DE CAMPO):', 38, 174);

  ctx.fillStyle = 'rgba(120, 29, 36, 0.15)';
  ctx.fillRect(38, 180, 720, 26);
  ctx.strokeStyle = colors.borderRed;
  ctx.strokeRect(38, 180, 720, 26);
  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 15px "Oswald", "Inter", sans-serif';
  ctx.fillText(data.nomePersonagem || '—', 46, 198);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('NOME DO JOGADOR:', 38, 220);
  ctx.fillStyle = colors.input;
  ctx.fillRect(38, 224, 345, 22);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(38, 224, 345, 22);
  ctx.fillStyle = colors.textWhite;
  ctx.font = 'bold 11px "Inter", sans-serif';
  ctx.fillText(data.nomeJogador || '—', 46, 239);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('IDADE CRONOLOGICA:', 400, 220);
  ctx.fillStyle = colors.input;
  ctx.fillRect(400, 224, 120, 22);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(400, 224, 120, 22);
  ctx.fillStyle = colors.textWhite;
  ctx.fillText(data.idade || '—', 408, 239);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('OCUPACAO ANTERIOR:', 535, 220);
  ctx.fillStyle = colors.input;
  ctx.fillRect(535, 224, 223, 22);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(535, 224, 223, 22);
  ctx.fillStyle = colors.textWhite;
  ctx.fillText(data.ocupacao || '—', 543, 239);

  // Photo Box (Identificação Fotográfica do Sobrevivente)
  ctx.fillStyle = colors.card;
  ctx.fillRect(780, 160, 192, 108);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(780, 160, 192, 108);

  let canvasPhotoDrawn = false;
  if (data.foto && typeof Image !== 'undefined') {
    try {
      const img = new Image();
      img.src = data.foto;
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = () => resolve(null);
          img.onerror = () => resolve(null);
        });
      }

      if (img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(792, 168, 168, 92);
        ctx.clip();
        ctx.drawImage(img, 792, 168, 168, 92);
        ctx.restore();

        ctx.strokeStyle = colors.borderRed;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(792, 168, 168, 92);

        ctx.fillStyle = 'rgba(20, 10, 12, 0.85)';
        ctx.fillRect(808, 246, 136, 12);
        ctx.strokeStyle = colors.borderRed;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(808, 246, 136, 12);

        ctx.fillStyle = colors.redBright;
        ctx.font = 'bold 7px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ REGISTRO BIOMETRICO ]', 876, 255);
        ctx.textAlign = 'left';

        canvasPhotoDrawn = true;
      }
    } catch (err) {
      console.warn("Falha ao renderizar fotografia no Canvas:", err);
    }
  }

  if (!canvasPhotoDrawn) {
    ctx.strokeStyle = colors.borderLight;
    ctx.strokeRect(792, 168, 168, 92);
    ctx.fillStyle = colors.textMuted;
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ REGISTRO FACIAL ]', 876, 202);
    ctx.font = '7px "IBM Plex Mono", monospace';
    ctx.fillText('ARQUIVO DE CAMPO', 876, 214);

    ctx.fillStyle = colors.borderRed;
    ctx.fillRect(812, 232, 130, 18);
    ctx.strokeStyle = colors.redBright;
    ctx.strokeRect(812, 232, 130, 18);
    ctx.fillStyle = colors.textPure;
    ctx.font = 'bold 8.5px "IBM Plex Mono", monospace';
    ctx.fillText('TRIAGEM OK', 876, 244);
    ctx.textAlign = 'left';
  }

  // ==================== 2. ATRIBUTOS ====================
  drawSectionHeader(280, "02", "MATRIZ DE ATRIBUTOS PRINCIPAIS (12 PONTOS DISTRIBUIDOS)", "SEC-02 // BIO-METRICA OPERACIONAL");

  const attrs = [
    { key: 'forca', name: 'FORCA', tag: '[FOR]', desc: 'Massa & Combate', val: data.forca },
    { key: 'agilidade', name: 'AGILIDADE', tag: '[AGI]', desc: 'Reflexo & Furtivo', val: data.agilidade },
    { key: 'vigor', name: 'VIGOR', tag: '[VIG]', desc: 'Saude & Imunidade', val: data.vigor },
    { key: 'intelecto', name: 'INTELECTO', tag: '[INT]', desc: 'Logica & Reparos', val: data.intelecto },
    { key: 'percepcao', name: 'PERCEPCAO', tag: '[PER]', desc: 'Atencao & Rastreio', val: data.percepcao },
    { key: 'presenca', name: 'PRESENCA', tag: '[PRE]', desc: 'Moral & Sangue Frio', val: data.presenca }
  ];

  const attrWidth = 150;
  const attrGap = 8.8;
  const startX = 28;

  attrs.forEach((a, i) => {
    const x = startX + i * (attrWidth + attrGap);
    const numVal = parseInt(a.val) || 0;
    const isHigh = numVal >= 3;

    ctx.fillStyle = colors.card;
    ctx.fillRect(x, 310, attrWidth, 120);
    ctx.strokeStyle = isHigh ? colors.borderRed : colors.border;
    ctx.strokeRect(x, 310, attrWidth, 120);

    ctx.fillStyle = isHigh ? '#241416' : colors.cardHeader;
    ctx.fillRect(x, 310, attrWidth, 22);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(x, 310, attrWidth, 22);
    if (isHigh) {
      ctx.fillStyle = colors.borderRed;
      ctx.fillRect(x, 330, attrWidth, 2);
    }

    ctx.fillStyle = isHigh ? colors.textPure : colors.textGold;
    ctx.font = 'bold 11px "Oswald", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${a.tag} ${a.name}`, x + attrWidth / 2, 325);

    ctx.fillStyle = isHigh ? colors.textPure : colors.textWhite;
    ctx.font = 'bold 38px "Oswald", "Arial Black", sans-serif';
    ctx.fillText(a.val || '0', x + attrWidth / 2, 368);

    const dotStartX = x + attrWidth / 2 - 18;
    for (let d = 1; d <= 5; d++) {
      const dx = dotStartX + (d - 1) * 8;
      ctx.fillStyle = d <= numVal ? colors.borderRed : '#282828';
      ctx.fillRect(dx, 384, 5, 5);
      ctx.strokeStyle = colors.border;
      ctx.strokeRect(dx, 384, 5, 5);
    }

    ctx.fillStyle = colors.cardAlt;
    ctx.fillRect(x, 404, attrWidth, 26);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(x, 404, attrWidth, 26);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '7.5px "IBM Plex Mono", monospace';
    ctx.fillText(a.desc, x + attrWidth / 2, 420);
    ctx.textAlign = 'left';
  });

  // Especializações Strip
  ctx.fillStyle = colors.card;
  ctx.fillRect(28, 438, 944, 34);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(28, 438, 944, 34);

  ctx.fillStyle = colors.textGold;
  ctx.font = 'bold 12px "Oswald", sans-serif';
  ctx.fillText('ESPECIALIZACOES (+2):', 38, 459);

  ctx.fillStyle = colors.cardHeader;
  ctx.fillRect(215, 442, 355, 26);
  ctx.strokeStyle = colors.borderRed;
  ctx.strokeRect(215, 442, 355, 26);
  ctx.fillStyle = colors.borderRed;
  ctx.fillRect(215, 442, 3, 26);

  ctx.fillStyle = colors.textWhite;
  ctx.font = 'bold 10px "IBM Plex Mono", monospace';
  ctx.fillText(data.esp1 || '—', 226, 458);

  ctx.fillStyle = colors.redDark;
  ctx.fillRect(510, 445, 52, 20);
  ctx.strokeStyle = colors.borderRed;
  ctx.strokeRect(510, 445, 52, 20);
  ctx.fillStyle = colors.redBright;
  ctx.textAlign = 'center';
  ctx.fillText('+2 [INT]', 536, 459);

  ctx.textAlign = 'left';
  ctx.fillStyle = colors.cardHeader;
  ctx.fillRect(582, 442, 380, 26);
  ctx.strokeStyle = colors.borderRed;
  ctx.strokeRect(582, 442, 380, 26);
  ctx.fillStyle = colors.borderRed;
  ctx.fillRect(582, 442, 3, 26);

  ctx.fillStyle = colors.textWhite;
  ctx.font = 'bold 10px "IBM Plex Mono", monospace';
  ctx.fillText(data.esp2 || '—', 593, 458);

  ctx.fillStyle = colors.redDark;
  ctx.fillRect(902, 445, 52, 20);
  ctx.strokeStyle = colors.borderRed;
  ctx.strokeRect(902, 445, 52, 20);
  ctx.fillStyle = colors.redBright;
  ctx.textAlign = 'center';
  ctx.fillText('+2 [FOR]', 928, 459);
  ctx.textAlign = 'left';

  // ==================== 3. MONITORES VITAIS ====================
  drawSectionHeader(484, "03", "MONITORES VITAIS & PARAMETROS OPERACIONAIS", "SEC-03 // STATUS DE COMBATE");

  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  const cargaCalc = 5 + numFor;

  const vitals = [
    { title: "PONTOS DE VIDA", formula: "10 + (VIG x 2)", val: `${vidaCalc} PV`, color: colors.life, sub: "INTEGRIDADE", total: 16, filled: Math.min(vidaCalc, 16) },
    { title: "PONTOS DE FOLEGO", formula: "5 + VIG", val: `${folegoCalc} PF`, color: colors.stamina, sub: "RESISTENCIA", total: 8, filled: Math.min(folegoCalc, 8) },
    { title: "DEFESA PASSIVA", formula: "10 + AGI", val: `${defesaCalc} DEF`, color: colors.defense, sub: "ESQUIVA BASE", total: 8, filled: Math.min(defesaCalc - 8, 8) },
    { title: "CAPACIDADE CARGA", formula: "5 + FOR", val: `${cargaCalc} SLOTS`, color: colors.cargo, sub: "LIMITE DE PESO", total: 8, filled: Math.min(cargaCalc, 8) }
  ];

  const vitWidth = 227;
  const vitGap = 12;

  vitals.forEach((v, i) => {
    const x = 28 + i * (vitWidth + vitGap);

    ctx.fillStyle = colors.card;
    ctx.fillRect(x, 514, vitWidth, 108);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(x, 514, vitWidth, 108);

    ctx.fillStyle = v.color;
    ctx.fillRect(x, 514, 5, 108);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '8.5px "IBM Plex Mono", monospace';
    ctx.fillText(v.title, x + 12, 528);
    ctx.fillStyle = colors.textGold;
    ctx.font = '7.5px "IBM Plex Mono", monospace';
    ctx.fillText(v.formula, x + 135, 528);

    ctx.strokeStyle = colors.border;
    ctx.beginPath();
    ctx.moveTo(x + 12, 534);
    ctx.lineTo(x + vitWidth - 10, 534);
    ctx.stroke();

    ctx.fillStyle = colors.textPure;
    ctx.font = 'bold 28px "Oswald", "Arial Black", sans-serif';
    ctx.fillText(v.val, x + 12, 565);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '7.5px "IBM Plex Mono", monospace';
    ctx.fillText(v.sub, x + 125, 560);

    const boxX = x + 12;
    const boxY = 578;
    const boxW = vitWidth - 22;
    const boxH = 34;

    ctx.fillStyle = colors.input;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    const pipW = 18;
    const pipH = 10;
    const pipGap = 6;
    for (let p = 0; p < v.total; p++) {
      const row = Math.floor(p / 8);
      const col = p % 8;
      const px = boxX + 6 + col * (pipW + pipGap);
      const py = boxY + 6 + row * (pipH + 3);

      ctx.fillStyle = p < v.filled ? v.color : '#252525';
      ctx.fillRect(px, py, pipW, pipH);
      ctx.strokeStyle = colors.border;
      ctx.strokeRect(px, py, pipW, pipH);
    }
  });

  // ==================== 4. PERFIL FÍSICO & PSICOLÓGICO ====================
  drawSectionHeader(634, "04", "PERFIL FISICO & PSICOLOGICO", "SEC-04 // AVALIACAO DESCRITIVA");

  const colW = 466;

  // Aparência
  ctx.fillStyle = colors.card;
  ctx.fillRect(28, 664, colW, 135);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(28, 664, colW, 135);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('APARENCIA FISICA & MARCAS DISTINTIVAS:', 38, 680);
  ctx.fillText('IDENTIFICACAO VISUAL', 360, 680);

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(38, 686);
  ctx.lineTo(484, 686);
  ctx.stroke();

  ctx.fillStyle = colors.textGold;
  ctx.font = '11px "Inter", sans-serif';
  drawCanvasMultiline(ctx, data.aparencia, 38, 704, colW - 20, 16, 5);

  // Personalidade
  ctx.fillStyle = colors.card;
  ctx.fillRect(506, 664, colW, 135);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(506, 664, colW, 135);

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('PERSONALIDADE & CONDUTA SOB PRESSAO:', 516, 680);
  ctx.fillText('ESTABILIDADE COGNITIVA', 825, 680);

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(516, 686);
  ctx.lineTo(962, 686);
  ctx.stroke();

  ctx.fillStyle = colors.textGold;
  ctx.font = '11px "Inter", sans-serif';
  drawCanvasMultiline(ctx, data.personalidade, 516, 704, colW - 20, 16, 5);

  // ==================== 5. HISTÓRICO & ÂNCORAS NARRATIVAS ====================
  drawSectionHeader(811, "05", "HISTORICO & ANCORAS NARRATIVAS", "SEC-05 // MOTIVACOES & TRAUMAS");

  const anchors = [
    { label: "OBJETIVO PESSOAL:", val: data.objetivo, x: 28, y: 841 },
    { label: "MAIOR MEDO:", val: data.medo, x: 506, y: 841 },
    { label: "LIGACAO COM SOBREVIVENTE:", val: data.ligacao, x: 28, y: 917 },
    { label: "SEGREDO OU CONFLITO:", val: data.segredo, x: 506, y: 917 }
  ];

  anchors.forEach((anc) => {
    ctx.fillStyle = colors.card;
    ctx.fillRect(anc.x, anc.y, colW, 68);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(anc.x, anc.y, colW, 68);

    ctx.fillStyle = colors.redBright;
    ctx.font = 'bold 8.5px "IBM Plex Mono", monospace';
    ctx.fillText(anc.label, anc.x + 10, anc.y + 16);

    ctx.fillStyle = colors.textWhite;
    ctx.font = '10.5px "Inter", sans-serif';
    drawCanvasMultiline(ctx, anc.val, anc.x + 10, anc.y + 32, colW - 20, 15, 2);
  });

  // ==================== 6. MANIFESTO DE CARGA & EQUIPAMENTO ====================
  drawSectionHeader(997, "06", "MANIFESTO DE CARGA & EQUIPAMENTO INICIAL", "SEC-06 // LOGISTICA DE SOBREVIVENCIA");

  const invItems = [
    { label: "ARMA PRINCIPAL:", slot: "SLOT 1", val: data.arma, note: "Condicao: Robusta | Peso: 1 slot", x: 28, w: 290 },
    { label: "FERRAMENTA DE CAMPO:", slot: "SLOT 2", val: data.ferramenta, note: "Condicao: Operacional | Iluminacao 10m", x: 330, w: 290 },
    { label: "OUTROS ITENS & MANTIMENTOS:", slot: "SLOTS 3-4", val: data.outrosItens, note: "Slots Ocupados: 4 / 8 Capacidade Maxima", x: 632, w: 340 }
  ];

  invItems.forEach((item) => {
    ctx.fillStyle = colors.card;
    ctx.fillRect(item.x, 1027, item.w, 88);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(item.x, 1027, item.w, 88);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillText(item.label, item.x + 10, 1042);
    ctx.fillStyle = colors.textGold;
    ctx.fillText(item.slot, item.x + item.w - 75, 1042);

    ctx.fillStyle = colors.input;
    ctx.fillRect(item.x + 10, 1048, item.w - 20, 38);
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(item.x + 10, 1048, item.w - 20, 38);

    ctx.fillStyle = colors.borderRed;
    ctx.fillRect(item.x + 10, 1048, 3, 38);

    ctx.fillStyle = colors.textWhite;
    ctx.font = 'bold 10px "IBM Plex Mono", monospace';
    ctx.fillText(item.val || '—', item.x + 16, 1066);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '7px "IBM Plex Mono", monospace';
    ctx.fillText(item.note, item.x + 16, 1080);
  });

  // ==================== 7. DECLARAÇÃO LEGAL & ASSINATURA ====================
  drawSectionHeader(1127, "07", "DECLARACAO LEGAL & AUTENTICACAO DE CAMPO", "SEC-07 // HOMOLOGACAO");

  ctx.fillStyle = colors.cardAlt;
  ctx.fillRect(28, 1157, 944, 215);
  ctx.strokeStyle = colors.border;
  ctx.strokeRect(28, 1157, 944, 215);

  ctx.fillStyle = colors.input;
  ctx.fillRect(38, 1167, 924, 56);
  ctx.strokeStyle = colors.borderLight;
  ctx.strokeRect(38, 1167, 924, 56);

  // Checkbox
  ctx.fillStyle = data.declaracaoLida ? colors.borderRed : colors.card;
  ctx.fillRect(48, 1177, 16, 16);
  ctx.strokeStyle = data.declaracaoLida ? colors.redBright : colors.border;
  ctx.strokeRect(48, 1177, 16, 16);

  if (data.declaracaoLida) {
    ctx.fillStyle = colors.textPure;
    ctx.font = 'bold 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X', 56, 1189.5);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = colors.textMuted;
  ctx.font = '8.5px "IBM Plex Mono", monospace';
  ctx.fillText('DECLARACAO DE CIENCIA E REGRAS: Confirmo que li e aceito as regras de sobrevivencia, combate,', 74, 1182);
  ctx.fillText('ausencia, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de', 74, 1195);
  ctx.fillText('que cada decisao no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana.', 74, 1208);

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(38, 1234);
  ctx.lineTo(962, 1234);
  ctx.stroke();

  // Assinatura
  if (data.assinatura) {
    ctx.fillStyle = colors.textPure;
    ctx.font = 'italic 26px "Caveat", "Brush Script MT", "Georgia", cursive';
    ctx.fillText(data.assinatura, 60, 1284);
  }
  ctx.strokeStyle = colors.borderLight;
  ctx.beginPath();
  ctx.moveTo(50, 1294);
  ctx.lineTo(380, 1294);
  ctx.stroke();
  ctx.fillStyle = colors.textMuted;
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ASSINATURA FORMAL DO SOBREVIVENTE', 215, 1308);

  // Data
  ctx.fillStyle = colors.textPure;
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.fillText(data.data || new Date().toLocaleDateString('pt-BR'), 480, 1284);
  ctx.strokeStyle = colors.borderLight;
  ctx.beginPath();
  ctx.moveTo(410, 1294);
  ctx.lineTo(550, 1294);
  ctx.stroke();
  ctx.fillStyle = colors.textMuted;
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('DATA DE REGISTRO OFICIAL', 480, 1308);
  ctx.textAlign = 'left';

  // Carimbo Oficial Militar
  ctx.save();
  ctx.translate(650, 1254);
  ctx.rotate(-3 * Math.PI / 180);
  ctx.fillStyle = 'rgba(120, 29, 36, 0.25)';
  ctx.fillRect(0, 0, 270, 48);
  ctx.strokeStyle = colors.borderRed;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 270, 48);

  ctx.fillStyle = colors.redBright;
  ctx.font = 'bold 12px "Oswald", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SOBREVIVENTE HOMOLOGADO', 135, 18);

  ctx.fillStyle = colors.textGold;
  ctx.font = 'bold 8.5px "IBM Plex Mono", monospace';
  ctx.fillText('POSTO DE TRIAGEM // APTO AO ERMO', 135, 32);

  ctx.fillStyle = colors.textWhite;
  ctx.font = '7.5px "IBM Plex Mono", monospace';
  ctx.fillText('REGISTRO PERMANENTE // SECTOR Z-01', 135, 43);
  ctx.restore();

  ctx.restore();
}

/**
 * Dispara o download da ficha preenchida em formato de imagem PNG de alta resolução
 * compartilhando exatamente o mesmo design e estrutura visual do PDF.
 */
export async function downloadFichaPNG(data: FichaData): Promise<void> {
  const canvas = document.createElement('canvas');
  await renderFichaToCanvas(data, canvas);

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Falha ao gerar arquivo de imagem PNG.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = getExportFileName(data.nomePersonagem, 'png');
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}

/**
 * Dispara o download da ficha em formato PDF interativo e editável (A4 vetorial)
 * gerada 100% no cliente sem dependência de imagens de fundo rasterizadas.
 */
export async function downloadFichaPDF(data: FichaData): Promise<void> {
  const pdfBytes = await generateFichaPDF(data);
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = getExportFileName(data.nomePersonagem, 'pdf');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Organiza todas as informações preenchidas em um texto padronizado compatível
 * com WhatsApp, Discord, Google Docs, Word e Bloco de notas.
 */
export function formatFichaForClipboard(data: FichaData): string {
  const vForca = parseInt(data.forca) || 0;
  const vAgi = parseInt(data.agilidade) || 0;
  const vVig = parseInt(data.vigor) || 0;

  const vida = 10 + vVig * 2;
  const folego = 5 + vVig;
  const defesa = 10 + vAgi;
  const carga = 5 + vForca;

  return `━━━━━━━━━━━━━━━━━━━━
DEAD HOURS
CADASTRO DE SOBREVIVENTE
━━━━━━━━━━━━━━━━━━━━

IDENTIFICAÇÃO
Nome do jogador: ${data.nomeJogador || '—'}
Nome do personagem: ${data.nomePersonagem || '—'}
Idade: ${data.idade || '—'}
Fotografia: ${data.foto ? 'HOMOLOGADA // BIOMETRIA DE CAMPO VINCULADA' : 'NÃO ANEXADA'}
Aparência física: ${data.aparencia || '—'}
Personalidade: ${data.personalidade || '—'}
Ocupação anterior ao apocalipse: ${data.ocupacao || '—'}

ATRIBUTOS
Força: ${data.forca || '0'}
Agilidade: ${data.agilidade || '0'}
Vigor: ${data.vigor || '0'}
Intelecto: ${data.intelecto || '0'}
Percepção: ${data.percepcao || '0'}
Presença: ${data.presenca || '0'}

ATRIBUTOS DERIVADOS
Vida: ${vida} | Fôlego: ${folego} | Defesa: ${defesa} | Carga: ${carga} slots | Estresse Máx: 10

ESPECIALIZAÇÕES
1. ${data.esp1 || '—'}
2. ${data.esp2 || '—'}

HISTÓRICO
Objetivo pessoal: ${data.objetivo || '—'}
Maior medo: ${data.medo || '—'}
Ligação com outro sobrevivente ou NPC: ${data.ligacao || '—'}
Um segredo ou conflito: ${data.segredo || '—'}

EQUIPAMENTO INICIAL
Arma: ${data.arma || '—'}
Ferramenta: ${data.ferramenta || '—'}
Outros itens: ${data.outrosItens || '—'}

DECLARAÇÃO
Confirmo que li as regras de sobrevivência, combate, ausência e morte permanente de DEAD HOURS.
[${data.declaracaoLida ? 'X' : ' '}] Confirmação de Leitura
Assinatura: ${data.assinatura || '—'}
Data de Registro: ${data.data || '—'}

━━━━━━━━━━━━━━━━━━━━`;
}
