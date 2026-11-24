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
 * Constantes e paleta de materiais oficiais do Prontuário Histórico de DEAD HOURS.
 * Compartilhada rigorosamente entre a renderização de PDF vetorial A4 e Imagem PNG em alta resolução.
 */
export const FICHA_CONFIG = {
  refWidth: 1000,
  refHeight: 1414,
  pdfWidth: 595.28,
  pdfHeight: 841.89,
  pngScale: 1.5, // Gera PNG em alta resolução (1500x2121 px), nítido para impressão e compartilhamento
  colors: {
    // Papel envelhecido e material de arquivo
    paperBase: '#EAE1CB',        // Papel de arquivo amarelado autêntico
    paperDark: '#DECFA9',        // Bordas e desgaste de envelhecimento
    paperVignette: '#B6A07A',    // Desgaste perimetral de manuseio
    paperCrease: '#D4C49F',      // Marca de dobra central de arquivo
    paperLine: '#C2B494',        // Pautas e linhas-guia
    photoPaper: '#FAF7EF',       // Borda física de papel fotográfico
    
    // Tintas documentais de impressão antiga
    inkPrimary: '#161412',       // Fita datilográfica preta carvão principal
    inkSecondary: '#302B24',     // Impressão institucional preexistente
    inkMuted: '#6E6352',         // Rótulos e pautas finas
    inkFaint: '#A49781',         // Linhas pontilhadas e marcações de preenchimento
    
    // Tinta de carimbo oficial desgastado
    stampRed: '#872320',         // Carimbo vermelho desbotado (óxido / sangue seco)
    stampRedDark: '#5E1816',     // Contorno e sombras do carimbo
    
    // Elementos físicos
    paperClip: '#7A756C',        // Clipe metálico de fixação
    cornerBracket: '#2B2620',    // Cantoneiras triangulares de álbum da foto
  }
};

/**
 * Gera nomes de arquivo padronizados para download:
 * dead-hours-dossie-[nome-do-sobrevivente].pdf | .png
 */
export function getExportFileName(nomePersonagem: string, extension: 'pdf' | 'png'): string {
  const cleanName = (nomePersonagem || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleanName ? `dead-hours-dossie-${cleanName}.${extension}` : `dead-hours-dossie-sobrevivente.${extension}`;
}

/**
 * Sanitiza e mapeia caracteres para compatibilidade total com WinAnsi (StandardFonts do PDF)
 * sem descartar informações do jogador e evitando falhas durante doc.save().
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
    '•': '*',
    '·': '-',
    '—': '-',
    '–': '-',
    '“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",
    '×': 'x',
    '★': '*',
    '☆': '*',
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
 * Cria e compila o Prontuário de Sobrevivente em formato PDF A4 vetorial do zero,
 * com identidade visual autêntica de documento histórico físico recuperado,
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

  // Paleta PDF rgb() estritamente histórica e documental
  const cPaperBase = rgb(234 / 255, 225 / 255, 203 / 255);
  const cPaperDark = rgb(222 / 255, 207 / 255, 169 / 255);
  const cPaperVignette = rgb(182 / 255, 160 / 255, 122 / 255);
  const cPaperLine = rgb(194 / 255, 180 / 255, 148 / 255);
  const cPhotoPaper = rgb(250 / 255, 247 / 255, 239 / 255);

  const cInkPrimary = rgb(22 / 255, 20 / 255, 18 / 255);
  const cInkSecondary = rgb(48 / 255, 43 / 255, 36 / 255);
  const cInkMuted = rgb(110 / 255, 99 / 255, 82 / 255);
  const cInkFaint = rgb(164 / 255, 151 / 255, 129 / 255);

  const cStampRed = rgb(135 / 255, 35 / 255, 32 / 255);
  const cStampRedDark = rgb(94 / 255, 24 / 255, 22 / 255);

  const cPaperClip = rgb(122 / 255, 117 / 255, 108 / 255);
  const cCornerBracket = rgb(43 / 255, 38 / 255, 32 / 255);

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
    const fSize = opts.fontSize ? sx(opts.fontSize) : 9;
    const fFont = opts.font || fontCourierBold;
    const fColor = opts.textColor || cInkPrimary;

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

  // ==================== 1. PAPEL ENVELHECIDO & MATERIALIDADE ====================
  // Base do papel antigo
  drawBox(0, 0, 1000, 1414, { color: cPaperBase });

  // Desgaste perimetral de borda e oxidação do papel
  drawBox(0, 0, 1000, 16, { color: cPaperDark });
  drawBox(0, 1398, 1000, 16, { color: cPaperDark });
  drawBox(0, 0, 16, 1414, { color: cPaperDark });
  drawBox(984, 0, 16, 1414, { color: cPaperDark });

  // Manchas de tempo e oxidação orgânica nos cantos
  drawBox(20, 20, 140, 50, { color: cPaperDark });
  drawBox(840, 1350, 140, 48, { color: cPaperDark });
  drawBox(880, 580, 90, 70, { color: cPaperDark });

  // Marca de dobra horizontal de arquivamento (crease na metade da folha: y = 707)
  drawLineSeg(24, 707, 976, 707, rgb(245 / 255, 238 / 255, 222 / 255), 0.8);
  drawLineSeg(24, 708, 976, 708, cPaperLine, 0.6);

  // Moldura institucional com traço tipográfico clássico (hairline duplo)
  drawBox(32, 26, 936, 1362, { borderColor: cInkSecondary, borderWidth: 1.2 });
  drawBox(36, 30, 928, 1354, { borderColor: cInkFaint, borderWidth: 0.5 });

  // Miras e cruzetas de registro nos 4 cantos
  drawTextAt("+", 38, 38, 7.5, fontCourier, cInkMuted);
  drawTextAt("+", 956, 38, 7.5, fontCourier, cInkMuted);
  drawTextAt("+", 38, 1378, 7.5, fontCourier, cInkMuted);
  drawTextAt("+", 956, 1378, 7.5, fontCourier, cInkMuted);

  // ==================== 2. CABEÇALHO DO PRONTUÁRIO (MASTHEAD) ====================
  // Tarja superior institucional
  drawTextAt("PRONTUARIO DE SOBREVIVENTE // ARQUIVO HISTORICO RECUPERADO", 44, 46, 7.5, fontCourierBold, cInkMuted);
  drawTextAt("FORMULARIO N* 104-DH", 845, 46, 7.5, fontCourierBold, cInkMuted);

  drawLineSeg(44, 52, 956, 52, cInkSecondary, 1);
  drawLineSeg(44, 54, 956, 54, cInkFaint, 0.4);

  // Título em Prensa Tipográfica Histórica
  drawTextAt("DEAD HOURS", 44, 82, 24, fontHelveticaBold, cInkPrimary);
  drawTextAt("PRONTUARIO DE IDENTIFICACAO DE SOBREVIVENTE", 46, 98, 10, fontHelveticaBold, cInkSecondary);
  drawTextAt("DOCUMENTACAO DE REGISTRO INDIVIDUAL // EDICAO DE CAMPO", 46, 110, 7.5, fontCourier, cInkMuted);

  // Carimbo histórico "ARQUIVO RECUPERADO" no canto superior direito
  const stampAngleHeader = degrees(-4);
  drawBox(780, 64, 160, 32, { borderColor: cStampRed, borderWidth: 1.4, rotate: stampAngleHeader });
  drawBox(783, 67, 154, 26, { borderColor: cStampRed, borderWidth: 0.5, rotate: stampAngleHeader });
  drawTextAt("DEAD HOURS", 780, 78, 7, fontCourierBold, cStampRed, { alignCenter: true, boxW: 160, rotate: stampAngleHeader });
  drawTextAt("[ ARQUIVO RECUPERADO ]", 780, 90, 8.5, fontHelveticaBold, cStampRedDark, { alignCenter: true, boxW: 160, rotate: stampAngleHeader });

  drawLineSeg(44, 122, 956, 122, cInkSecondary, 1);
  drawLineSeg(44, 124, 956, 124, cInkFaint, 0.4);

  // Helper Oficial para Linhas de Seção Histórica (sem caixas pretas de interface)
  const drawSectionTitle = (y: number, numStr: string, titleStr: string) => {
    drawLineSeg(44, y, 956, y, cInkSecondary, 0.8);
    drawTextAt(numStr, 44, y + 13, 8.5, fontHelveticaBold, cStampRed);
    drawTextAt(titleStr, 68, y + 13, 8.5, fontHelveticaBold, cInkPrimary);
    drawLineSeg(44, y + 17, 956, y + 17, cPaperLine, 0.5);
  };

  // ==================== SEÇÃO 1: IDENTIFICAÇÃO PESSOAL & FOTOGRAFIA ANEXADA ====================
  drawSectionTitle(130, "I.", "IDENTIFICACAO PESSOAL E REGISTRO CIVIL");

  // Dados Pessoais (à esquerda)
  // Nome do Sobrevivente
  drawTextAt("NOME DO SOBREVIVENTE:", 44, 160, 8, fontCourierBold, cInkMuted);
  drawLineSeg(44, 184, 710, 184, cInkSecondary, 1);
  addField('nome_personagem', data.nomePersonagem, 46, 162, 660, 22, {
    font: fontHelveticaBold,
    fontSize: 13,
    textColor: cInkPrimary
  });

  // Nome do Jogador e Idade
  drawTextAt("NOME DO JOGADOR:", 44, 206, 8, fontCourierBold, cInkMuted);
  drawLineSeg(44, 230, 520, 230, cInkSecondary, 0.8);
  addField('nome_jogador', data.nomeJogador, 46, 210, 470, 20, {
    font: fontCourierBold,
    fontSize: 9.5,
    textColor: cInkPrimary
  });

  drawTextAt("IDADE:", 540, 206, 8, fontCourierBold, cInkMuted);
  drawLineSeg(540, 230, 710, 230, cInkSecondary, 0.8);
  addField('idade', data.idade, 544, 210, 160, 20, {
    font: fontCourierBold,
    fontSize: 9.5,
    textColor: cInkPrimary,
    alignCenter: true
  });

  // Ocupação Anterior
  drawTextAt("OCUPACAO ANTERIOR AO COLAPSO:", 44, 252, 8, fontCourierBold, cInkMuted);
  drawLineSeg(44, 276, 710, 276, cInkSecondary, 0.8);
  addField('ocupacao', data.ocupacao, 46, 256, 660, 20, {
    font: fontCourierBold,
    fontSize: 9.5,
    textColor: cInkPrimary
  });

  // Fotografia Física Anexada (à direita)
  const photoFrameX = 735;
  const photoFrameY = 136;
  const photoFrameW = 221;
  const photoFrameH = 146;

  // Passepartout de papel fotográfico com leve relevo físico
  drawBox(photoFrameX, photoFrameY, photoFrameW, photoFrameH, { color: cPhotoPaper, borderColor: cInkSecondary, borderWidth: 0.8 });
  drawBox(photoFrameX + 1, photoFrameY + 1, photoFrameW - 2, photoFrameH - 2, { borderColor: cPaperLine, borderWidth: 0.5 });

  const photoInnerX = photoFrameX + 8;
  const photoInnerY = photoFrameY + 8;
  const photoInnerW = photoFrameW - 16; // 205 px
  const photoInnerH = Math.round(photoInnerW / 1.83); // ~112 px (proporção idêntica ao PhotoUploader)

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
        x: sx(photoInnerX),
        y: py(photoInnerY + photoInnerH),
        width: sx(photoInnerW),
        height: sy(photoInnerH),
      });

      photoEmbedded = true;
    } catch (err) {
      console.warn("Falha ao incorporar fotografia no PDF:", err);
    }
  }

  if (!photoEmbedded) {
    // Espaço em branco no papel para fotografia física
    drawBox(photoInnerX, photoInnerY, photoInnerW, photoInnerH, { color: cPaperBase, borderColor: cInkFaint, borderWidth: 0.8 });
    drawLineSeg(photoInnerX + 8, photoInnerY + 8, photoInnerX + photoInnerW - 8, photoInnerY + photoInnerH - 8, cPaperLine, 0.4);
    drawLineSeg(photoInnerX + 8, photoInnerY + photoInnerH - 8, photoInnerX + photoInnerW - 8, photoInnerY + 8, cPaperLine, 0.4);

    drawTextAt("[ FOTOGRAFIA NAO ANEXADA ]", photoInnerX, photoInnerY + 54, 7.5, fontCourierBold, cInkMuted, {
      alignCenter: true,
      boxW: photoInnerW
    });
    drawTextAt("Registro visual pendente", photoInnerX, photoInnerY + 68, 6.5, fontCourier, cInkFaint, {
      alignCenter: true,
      boxW: photoInnerW
    });
  }

  // Cantoneiras triangulares de fixação da foto física nos 4 cantos
  const drawCornerMount = (cx: number, cy: number, type: 'TL' | 'TR' | 'BL' | 'BR') => {
    const s = 11;
    if (type === 'TL') {
      drawBox(cx, cy, s, 3, { color: cCornerBracket });
      drawBox(cx, cy, 3, s, { color: cCornerBracket });
    } else if (type === 'TR') {
      drawBox(cx - s, cy, s, 3, { color: cCornerBracket });
      drawBox(cx - 3, cy, 3, s, { color: cCornerBracket });
    } else if (type === 'BL') {
      drawBox(cx, cy - 3, s, 3, { color: cCornerBracket });
      drawBox(cx, cy - s, 3, s, { color: cCornerBracket });
    } else if (type === 'BR') {
      drawBox(cx - s, cy - 3, s, 3, { color: cCornerBracket });
      drawBox(cx - 3, cy - s, 3, s, { color: cCornerBracket });
    }
  };
  drawCornerMount(photoInnerX, photoInnerY, 'TL');
  drawCornerMount(photoInnerX + photoInnerW, photoInnerY, 'TR');
  drawCornerMount(photoInnerX, photoInnerY + photoInnerH, 'BL');
  drawCornerMount(photoInnerX + photoInnerW, photoInnerY + photoInnerH, 'BR');

  // Clipe metálico de fixação segurando a foto ao documento
  drawLineSeg(photoInnerX + 16, photoFrameY - 6, photoInnerX + 16, photoFrameY + 18, cPaperClip, 1.5);
  drawLineSeg(photoInnerX + 22, photoFrameY - 6, photoInnerX + 22, photoFrameY + 22, cPaperClip, 1.5);
  drawLineSeg(photoInnerX + 16, photoFrameY - 6, photoInnerX + 22, photoFrameY - 6, cPaperClip, 1.5);

  // Carimbo de autenticação sobrepondo a borda da fotografia
  const stampAnglePhoto = degrees(-5);
  drawBox(photoFrameX + photoFrameW - 95, photoFrameY + photoFrameH - 24, 98, 22, {
    borderColor: cStampRed,
    borderWidth: 1.2,
    rotate: stampAnglePhoto
  });
  drawTextAt("DEAD HOURS", photoFrameX + photoFrameW - 95, photoFrameY + photoFrameH - 14, 6.5, fontCourierBold, cStampRed, {
    alignCenter: true,
    boxW: 98,
    rotate: stampAnglePhoto
  });
  drawTextAt("IDENTIFICACAO", photoFrameX + photoFrameW - 95, photoFrameY + photoFrameH - 6, 6, fontCourier, cStampRed, {
    alignCenter: true,
    boxW: 98,
    rotate: stampAnglePhoto
  });

  // Legenda datilografada da fotografia
  drawTextAt("FOTOGRAFIA ANEXADA", photoFrameX, photoFrameY + photoFrameH - 4, 6.5, fontCourier, cInkMuted, {
    alignCenter: true,
    boxW: photoFrameW
  });

  // ==================== SEÇÃO 2: MATRIZ DE ATRIBUTOS E ESPECIALIZAÇÕES ====================
  drawSectionTitle(296, "II.", "MATRIZ DE ATRIBUTOS DE APTIDAO (12 PONTOS DISTRIBUIDOS)");

  const attrs = [
    { key: 'forca', field: 'attr_forca', name: 'FORCA', tag: 'FOR', desc: 'Massa & Combate', val: data.forca },
    { key: 'agilidade', field: 'attr_agilidade', name: 'AGILIDADE', tag: 'AGI', desc: 'Reflexo & Esquiva', val: data.agilidade },
    { key: 'vigor', field: 'attr_vigor', name: 'VIGOR', tag: 'VIG', desc: 'Saude & Imunidade', val: data.vigor },
    { key: 'intelecto', field: 'attr_intelecto', name: 'INTELECTO', tag: 'INT', desc: 'Logica & Reparo', val: data.intelecto },
    { key: 'percepcao', field: 'attr_percepcao', name: 'PERCEPCAO', tag: 'PER', desc: 'Atencao & Rastreio', val: data.percepcao },
    { key: 'presenca', field: 'attr_presenca', name: 'PRESENCA', tag: 'PRE', desc: 'Moral & Sangue Frio', val: data.presenca }
  ];

  const attrTableX = 44;
  const attrTableY = 320;
  const attrTableW = 912;
  const attrColW = attrTableW / 6; // 152 px cada
  const attrTableH = 92;

  // Grade tabular da matriz de atributos
  drawBox(attrTableX, attrTableY, attrTableW, attrTableH, { borderColor: cInkSecondary, borderWidth: 1 });

  attrs.forEach((a, i) => {
    const cx = attrTableX + i * attrColW;
    const numVal = parseInt(a.val) || 0;

    // Divisórias verticais entre colunas
    if (i > 0) {
      drawLineSeg(cx, attrTableY, cx, attrTableY + attrTableH, cInkSecondary, 0.8);
    }

    // Cabeçalho da coluna
    drawTextAt(`${a.name} [${a.tag}]`, cx, attrTableY + 14, 8, fontHelveticaBold, cInkPrimary, {
      alignCenter: true,
      boxW: attrColW
    });
    drawLineSeg(cx + 4, attrTableY + 18, cx + attrColW - 4, attrTableY + 18, cPaperLine, 0.6);

    // Número do Atributo em destaque datilográfico grande
    addField(a.field, a.val, cx + 10, attrTableY + 22, attrColW - 20, 36, {
      font: fontHelveticaBold,
      fontSize: 22,
      textColor: cInkPrimary,
      alignCenter: true
    });

    // Graduação de pontos (5 caixas quadradas datilografadas [■][■][ ][ ][ ])
    const pipsStartX = cx + attrColW / 2 - 20;
    for (let p = 1; p <= 5; p++) {
      const px = pipsStartX + (p - 1) * 8.5;
      const isFilled = p <= numVal;
      drawBox(px, attrTableY + 62, 6, 6, {
        color: isFilled ? cInkPrimary : cPaperBase,
        borderColor: cInkSecondary,
        borderWidth: 0.6
      });
    }

    // Aplicação / escopo funcional
    drawLineSeg(cx + 4, attrTableY + 74, cx + attrColW - 4, attrTableY + 74, cPaperLine, 0.4);
    drawTextAt(a.desc, cx, attrTableY + 84, 6.5, fontCourier, cInkMuted, {
      alignCenter: true,
      boxW: attrColW
    });
  });

  // Especializações Técnicas (+2) averbadas logo abaixo da matriz
  const specY = 422;
  drawTextAt("ESPECIALIZACOES TECNICAS (+2 DE BONUS):", 44, specY + 14, 8, fontCourierBold, cInkMuted);

  drawTextAt("1.", 260, specY + 14, 8, fontCourierBold, cInkPrimary);
  drawLineSeg(276, specY + 16, 570, specY + 16, cInkSecondary, 0.8);
  addField('especializacao_1', data.esp1, 278, specY - 2, 290, 18, {
    font: fontCourierBold,
    fontSize: 8.5,
    textColor: cInkPrimary
  });
  drawTextAt("(+2)", 576, specY + 14, 7.5, fontCourierBold, cStampRed);

  drawTextAt("2.", 620, specY + 14, 8, fontCourierBold, cInkPrimary);
  drawLineSeg(636, specY + 16, 915, specY + 16, cInkSecondary, 0.8);
  addField('especializacao_2', data.esp2, 638, specY - 2, 275, 18, {
    font: fontCourierBold,
    fontSize: 8.5,
    textColor: cInkPrimary
  });
  drawTextAt("(+2)", 922, specY + 14, 7.5, fontCourierBold, cStampRed);

  // ==================== SEÇÃO 3: CONDIÇÃO OPERACIONAL E LIMITES FÍSICOS ====================
  drawSectionTitle(450, "III.", "CONDICAO OPERACIONAL E PARAMETROS DE COMBATE");

  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  // FÓRMULA OFICIAL DE CARGA: 10 + 2 × For
  const cargaCalc = 10 + numFor * 2;

  const vitals = [
    { title: "PONTOS DE VIDA (PV)", formula: "10 + (2 x VIG)", field: "vital_vida", val: `${vidaCalc} PV`, totalDots: 16, fillDots: Math.min(vidaCalc, 16), sub: "Integridade Fisica" },
    { title: "PONTOS DE FOLEGO (PF)", formula: "5 + VIG", field: "vital_folego", val: `${folegoCalc} PF`, totalDots: 8, fillDots: Math.min(folegoCalc, 8), sub: "Resistencia e Folego" },
    { title: "DEFESA PASSIVA (DEF)", formula: "10 + AGI", field: "vital_defesa", val: `${defesaCalc} DEF`, totalDots: 8, fillDots: Math.min(defesaCalc - 8, 8), sub: "Esquiva e Protecao Base" },
    { title: "CAPACIDADE DE CARGA", formula: "10 + (2 x FOR)", field: "vital_carga", val: `${cargaCalc} SLOTS`, totalDots: 8, fillDots: Math.min(cargaCalc, 8), sub: "Limite de Peso e Transporte" }
  ];

  const vitX = 44;
  const vitY = 474;
  const vitW = 912;
  const vitColW = (vitW - 30) / 4; // ~220.5 px cada
  const vitGap = 10;
  const vitH = 104;

  vitals.forEach((v, i) => {
    const vx = vitX + i * (vitColW + vitGap);

    // Borda física de prontuário
    drawBox(vx, vitY, vitColW, vitH, { borderColor: cInkSecondary, borderWidth: 0.8 });

    drawTextAt(v.title, vx + 10, vitY + 14, 7.5, fontHelveticaBold, cInkPrimary);
    drawTextAt(v.formula, vx + 10, vitY + 24, 7, fontCourierBold, cInkMuted);
    drawLineSeg(vx + 8, vitY + 28, vx + vitColW - 8, vitY + 28, cPaperLine, 0.5);

    // Valor do Vital em destaque datilográfico
    addField(v.field, v.val, vx + 10, vitY + 32, 110, 28, {
      font: fontHelveticaBold,
      fontSize: 16,
      textColor: cInkPrimary
    });

    drawTextAt(v.sub, vx + 10, vitY + 66, 6.5, fontCourier, cInkMuted);

    // Caixas de marcação a lápis para acompanhamento em mesa [ ][ ][ ]...
    const boxX = vx + 8;
    const boxY = vitY + 72;
    const boxW = vitColW - 16;
    const boxH = 24;
    drawBox(boxX, boxY, boxW, boxH, { borderColor: cPaperLine, borderWidth: 0.5 });

    const pipW = 16;
    const pipH = 8;
    const pipGapX = 6;
    for (let p = 0; p < v.totalDots; p++) {
      const row = Math.floor(p / 8);
      const col = p % 8;
      const px = boxX + 6 + col * (pipW + pipGapX);
      const pyBox = boxY + 3 + row * (pipH + 2.5);
      const isFilled = p < v.fillDots;
      drawBox(px, pyBox, pipW, pipH, {
        color: isFilled ? cInkSecondary : cPaperBase,
        borderColor: cInkFaint,
        borderWidth: 0.5
      });
    }
  });

  // ==================== SEÇÃO 4: LAUDO DESCRITIVO E PERFIL COMPORTAMENTAL ====================
  drawSectionTitle(590, "IV.", "LAUDO DESCRITIVO E PERFIL DO INDIVIDUO");

  const descColW = 448;
  const descY = 614;
  const descH = 126;

  // Coluna 1: Aparência Física
  drawBox(44, descY, descColW, descH, { borderColor: cInkSecondary, borderWidth: 0.8 });
  drawTextAt("APARENCIA FISICA E SINAIS DISTINTIVOS", 54, descY + 14, 7.5, fontHelveticaBold, cInkPrimary);
  drawTextAt("(Constituicao, cicatrizes, vestimentas e marcas visuais)", 54, descY + 24, 6.5, fontCourier, cInkMuted);
  drawLineSeg(54, descY + 28, 44 + descColW - 10, descY + 28, cPaperLine, 0.5);

  // Linhas-guia pautadas de relatório antigo
  for (let l = 1; l <= 4; l++) {
    drawLineSeg(54, descY + 28 + l * 20, 44 + descColW - 10, descY + 28 + l * 20, cPaperLine, 0.4);
  }
  addField('aparencia', data.aparencia, 54, descY + 30, descColW - 20, 90, {
    font: fontCourier,
    fontSize: 8.5,
    textColor: cInkPrimary,
    multiline: true
  });

  // Coluna 2: Perfil Psicológico
  const col2X = 508;
  drawBox(col2X, descY, descColW, descH, { borderColor: cInkSecondary, borderWidth: 0.8 });
  drawTextAt("PERFIL PSICOLOGICO E CONDUTA SOB ESTRESSE", col2X + 10, descY + 14, 7.5, fontHelveticaBold, cInkPrimary);
  drawTextAt("(Temperamento, reacoes ao perigo e estabilidade mental)", col2X + 10, descY + 24, 6.5, fontCourier, cInkMuted);
  drawLineSeg(col2X + 10, descY + 28, col2X + descColW - 10, descY + 28, cPaperLine, 0.5);

  for (let l = 1; l <= 4; l++) {
    drawLineSeg(col2X + 10, descY + 28 + l * 20, col2X + descColW - 10, descY + 28 + l * 20, cPaperLine, 0.4);
  }
  addField('personalidade', data.personalidade, col2X + 10, descY + 30, descColW - 20, 90, {
    font: fontCourier,
    fontSize: 8.5,
    textColor: cInkPrimary,
    multiline: true
  });

  // ==================== SEÇÃO 5: ÂNCORAS NARRATIVAS E MOTIVAÇÕES ====================
  drawSectionTitle(752, "V.", "ANCORAS NARRATIVAS E ANTECEDENTES");

  const ancY1 = 776;
  const ancY2 = 840;
  const ancH = 56;

  const anchors = [
    { label: "OBJETIVO PESSOAL:", field: "objetivo_pessoal", val: data.objetivo, x: 44, y: ancY1 },
    { label: "MAIOR MEDO OU VULNERABILIDADE:", field: "maior_medo", val: data.medo, x: 508, y: ancY1 },
    { label: "LIGACAO COM OUTRO SOBREVIVENTE:", field: "ligacao_sobrevivente", val: data.ligacao, x: 44, y: ancY2 },
    { label: "SEGREDO OU PONTO DE CONFLITO:", field: "segredo_conflito", val: data.segredo, x: 508, y: ancY2 }
  ];

  anchors.forEach((anc) => {
    drawBox(anc.x, anc.y, descColW, ancH, { borderColor: cInkSecondary, borderWidth: 0.8 });
    drawTextAt(anc.label, anc.x + 10, anc.y + 12, 7.5, fontCourierBold, cInkPrimary);
    drawLineSeg(anc.x + 10, anc.y + 15, anc.x + descColW - 10, anc.y + 15, cPaperLine, 0.5);
    addField(anc.field, anc.val, anc.x + 10, anc.y + 18, descColW - 20, 34, {
      font: fontCourier,
      fontSize: 8.5,
      textColor: cInkPrimary,
      multiline: true
    });
  });

  // ==================== SEÇÃO 6: MANIFESTO DE CARGA E EQUIPAMENTO ====================
  drawSectionTitle(908, "VI.", "MANIFESTO DE EQUIPAMENTO E CARGA INICIAL");

  const eqY = 932;
  const eqW1 = 295;
  const eqW2 = 295;
  const eqW3 = 302;
  const eqH = 90;

  const invItems = [
    { label: "ARMA PRINCIPAL [SLOT 1]", field: "equip_arma", val: data.arma, note: "Armamento de porte imediato", x: 44, w: eqW1 },
    { label: "FERRAMENTA DE CAMPO [SLOT 2]", field: "equip_ferramenta", val: data.ferramenta, note: "Utilitario e iluminacao", x: 349, w: eqW2 },
    { label: "OUTROS ITENS E PROVISOES [SLOTS 3-4]", field: "equip_outros", val: data.outrosItens, note: "Mochila e mantimentos adicionais", x: 654, w: eqW3 }
  ];

  invItems.forEach((item) => {
    drawBox(item.x, eqY, item.w, eqH, { borderColor: cInkSecondary, borderWidth: 0.8 });
    drawTextAt(item.label, item.x + 10, eqY + 14, 7.5, fontCourierBold, cInkPrimary);
    drawLineSeg(item.x + 8, eqY + 18, item.x + item.w - 8, eqY + 18, cPaperLine, 0.5);

    addField(item.field, item.val, item.x + 10, eqY + 22, item.w - 20, 46, {
      font: fontCourierBold,
      fontSize: 8.5,
      textColor: cInkPrimary,
      multiline: true
    });

    drawTextAt(item.note, item.x + 10, eqY + 80, 6.5, fontCourier, cInkMuted);
  });

  // ==================== SEÇÃO 7: TERMO DE RESPONSABILIDADE E AUTENTICAÇÃO ====================
  drawSectionTitle(1034, "VII.", "TERMO DE CIENCIA E AUTENTICACAO DE REGISTRO");

  const signY = 1058;
  const signH = 196;

  drawBox(44, signY, 912, signH, { borderColor: cInkSecondary, borderWidth: 0.8 });

  // Termo de Declaração de Ciência e Regras
  const chk = form.createCheckBox('declaracao_lida');
  if (data.declaracaoLida) {
    chk.check();
  }
  chk.addToPage(page, {
    x: sx(56),
    y: py(signY + 16 + 14),
    width: sx(14),
    height: sy(14),
    borderWidth: 1,
    borderColor: cStampRed,
    backgroundColor: undefined,
  });

  const txtTermo1 = "DECLARACAO FORMAL: Confirmo ter lido e aceito integralmente as regras de sobrevivencia, combate,";
  const txtTermo2 = "ausencia, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de";
  const txtTermo3 = "que cada decisao tomada no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana.";
  drawTextAt(txtTermo1, 78, signY + 20, 7.5, fontCourierBold, cInkPrimary);
  drawTextAt(txtTermo2, 78, signY + 32, 7.5, fontCourier, cInkSecondary);
  drawTextAt(txtTermo3, 78, signY + 44, 7.5, fontCourier, cInkSecondary);

  drawLineSeg(54, signY + 62, 946, signY + 62, cPaperLine, 0.6);

  // Assinatura do Sobrevivente
  drawTextAt("ASSINATURA FORMAL DO SOBREVIVENTE:", 56, signY + 80, 7.5, fontCourierBold, cInkMuted);
  addField('assinatura_jogador', data.assinatura, 56, signY + 86, 310, 36, {
    font: fontTimesItalic,
    fontSize: 16,
    textColor: cInkPrimary
  });
  drawLineSeg(56, signY + 124, 366, signY + 124, cInkSecondary, 1);
  drawTextAt("Assinatura do Sobrevivente / Jogador", 56, signY + 136, 7, fontCourier, cInkMuted, { alignCenter: true, boxW: 310 });

  // Data Oficial de Expedição
  drawTextAt("DATA DE REGISTRO:", 396, signY + 80, 7.5, fontCourierBold, cInkMuted);
  addField('data_registro', data.data, 396, signY + 92, 140, 28, {
    font: fontCourierBold,
    fontSize: 9.5,
    textColor: cInkPrimary,
    alignCenter: true
  });
  drawLineSeg(396, signY + 124, 536, signY + 124, cInkSecondary, 1);
  drawTextAt("Data de Expedicao Oficial", 396, signY + 136, 7, fontCourier, cInkMuted, { alignCenter: true, boxW: 140 });

  // Carimbo Oficial Vintage de Homologação
  const stampAngleDoc = degrees(-4);
  drawBox(570, signY + 76, 360, 56, {
    borderColor: cStampRed,
    borderWidth: 1.8,
    rotate: stampAngleDoc
  });
  drawBox(573, signY + 79, 354, 50, {
    borderColor: cStampRed,
    borderWidth: 0.6,
    rotate: stampAngleDoc
  });

  drawTextAt("DEAD HOURS", 570, signY + 92, 8.5, fontCourierBold, cStampRed, {
    alignCenter: true,
    boxW: 360,
    rotate: stampAngleDoc
  });
  drawTextAt("* SOBREVIVENTE REGISTRADO *", 570, signY + 107, 12, fontHelveticaBold, cStampRedDark, {
    alignCenter: true,
    boxW: 360,
    rotate: stampAngleDoc
  });
  drawTextAt("ARQUIVO DE SOBREVIVENCIA // HOMOLOGACAO", 570, signY + 121, 7.5, fontCourierBold, cStampRed, {
    alignCenter: true,
    boxW: 360,
    rotate: stampAngleDoc
  });

  // ==================== RODAPÉ DO DOCUMENTO ====================
  drawLineSeg(44, 1360, 956, 1360, cInkSecondary, 0.8);
  drawTextAt("DEAD HOURS RPG // PRONTUARIO DE SOBREVIVENTE // ARQUIVO HISTORICO RECUPERADO", 44, 1374, 7, fontCourier, cInkMuted);
  drawTextAt("DOCUMENTACAO OFICIAL // FORMULARIO 104-DH // PAGINA 1 DE 1", 580, 1374, 7, fontCourier, cInkMuted);

  form.updateFieldAppearances();
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
 * Renderiza o Prontuário preenchido em um elemento HTML5 Canvas com alta resolução,
 * compartilhando rigorosamente a mesma composição física, proporções, coordenadas e identidade visual do PDF.
 */
export async function renderFichaToCanvas(data: FichaData, canvas: HTMLCanvasElement): Promise<void> {
  const scale = FICHA_CONFIG.pngScale;
  canvas.width = Math.round(FICHA_CONFIG.refWidth * scale);
  canvas.height = Math.round(FICHA_CONFIG.refHeight * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do Canvas.');
  }

  // Aguarda fontes do navegador se disponíveis
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

  // ==================== 1. PAPEL ENVELHECIDO & MATERIALIDADE ====================
  // Base do papel antigo
  ctx.fillStyle = colors.paperBase;
  ctx.fillRect(0, 0, 1000, 1414);

  // Efeito de envelhecimento periférico / vinheta nas bordas
  const topGrad = ctx.createLinearGradient(0, 0, 0, 36);
  topGrad.addColorStop(0, 'rgba(182, 160, 122, 0.40)');
  topGrad.addColorStop(1, 'rgba(182, 160, 122, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1000, 36);

  const bottomGrad = ctx.createLinearGradient(0, 1414, 0, 1378);
  bottomGrad.addColorStop(0, 'rgba(182, 160, 122, 0.40)');
  bottomGrad.addColorStop(1, 'rgba(182, 160, 122, 0)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, 1378, 1000, 36);

  const leftGrad = ctx.createLinearGradient(0, 0, 36, 0);
  leftGrad.addColorStop(0, 'rgba(182, 160, 122, 0.40)');
  leftGrad.addColorStop(1, 'rgba(182, 160, 122, 0)');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, 36, 1414);

  const rightGrad = ctx.createLinearGradient(1000, 0, 964, 0);
  rightGrad.addColorStop(0, 'rgba(182, 160, 122, 0.40)');
  rightGrad.addColorStop(1, 'rgba(182, 160, 122, 0)');
  ctx.fillStyle = rightGrad;
  ctx.fillRect(964, 0, 36, 1414);

  // Manchas de tempo orgânicas e oxidação sutil
  ctx.save();
  ctx.fillStyle = 'rgba(195, 175, 135, 0.22)';
  ctx.beginPath();
  ctx.arc(90, 85, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(890, 1340, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(910, 600, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Marca de dobra horizontal de arquivamento (y = 707)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 707);
  ctx.lineTo(976, 707);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(70, 55, 35, 0.16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 708);
  ctx.lineTo(976, 708);
  ctx.stroke();

  // Moldura institucional com traço tipográfico clássico
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(32, 26, 936, 1362);

  ctx.strokeStyle = colors.inkFaint;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(36, 30, 928, 1354);

  // Miras e cruzetas nos cantos
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 10px "Courier New", Courier, monospace';
  ctx.fillText('+', 38, 42);
  ctx.fillText('+', 956, 42);
  ctx.fillText('+', 38, 1378);
  ctx.fillText('+', 956, 1378);

  // ==================== 2. CABEÇALHO DO PRONTUÁRIO (MASTHEAD) ====================
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9.5px "Courier New", Courier, monospace';
  ctx.fillText('PRONTUARIO DE SOBREVIVENTE // ARQUIVO HISTORICO RECUPERADO', 44, 46);
  ctx.fillText('FORMULARIO N* 104-DH', 820, 46);

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, 52);
  ctx.lineTo(956, 52);
  ctx.stroke();

  ctx.strokeStyle = colors.inkFaint;
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(44, 54);
  ctx.lineTo(956, 54);
  ctx.stroke();

  // Título Institucional
  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 28px "Oswald", "Arial Black", sans-serif';
  ctx.fillText('DEAD HOURS', 44, 82);
  ctx.font = 'bold 12px "Oswald", "Arial Black", sans-serif';
  ctx.fillStyle = colors.inkSecondary;
  ctx.fillText('PRONTUARIO DE IDENTIFICACAO DE SOBREVIVENTE', 46, 98);
  ctx.fillStyle = colors.inkMuted;
  ctx.font = '9.5px "Courier New", Courier, monospace';
  ctx.fillText('DOCUMENTACAO DE REGISTRO INDIVIDUAL // EDICAO DE CAMPO', 46, 110);

  // Carimbo no canto superior direito
  ctx.save();
  ctx.translate(780, 64);
  ctx.rotate(-4 * Math.PI / 180);
  ctx.strokeStyle = colors.stampRed;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(0, 0, 160, 32);
  ctx.lineWidth = 0.5;
  ctx.strokeRect(3, 3, 154, 26);
  ctx.fillStyle = colors.stampRed;
  ctx.font = 'bold 8.5px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEAD HOURS', 80, 12);
  ctx.fillStyle = colors.stampRedDark;
  ctx.font = 'bold 10px "Oswald", sans-serif';
  ctx.fillText('[ ARQUIVO RECUPERADO ]', 80, 24);
  ctx.restore();
  ctx.textAlign = 'left';

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, 122);
  ctx.lineTo(956, 122);
  ctx.stroke();

  ctx.strokeStyle = colors.inkFaint;
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(44, 124);
  ctx.lineTo(956, 124);
  ctx.stroke();

  // Helper de Linhas de Seção Histórica
  const drawSectionTitle = (y: number, numStr: string, titleStr: string) => {
    ctx.strokeStyle = colors.inkSecondary;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(44, y);
    ctx.lineTo(956, y);
    ctx.stroke();

    ctx.fillStyle = colors.stampRed;
    ctx.font = 'bold 11px "Oswald", sans-serif';
    ctx.fillText(numStr, 44, y + 13);
    ctx.fillStyle = colors.inkPrimary;
    ctx.fillText(titleStr, 68, y + 13);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(44, y + 17);
    ctx.lineTo(956, y + 17);
    ctx.stroke();
  };

  // ==================== SEÇÃO 1: IDENTIFICAÇÃO PESSOAL & FOTOGRAFIA ANEXADA ====================
  drawSectionTitle(130, "I.", "IDENTIFICACAO PESSOAL E REGISTRO CIVIL");

  // Nome do Sobrevivente
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9.5px "Courier New", monospace';
  ctx.fillText('NOME DO SOBREVIVENTE:', 44, 160);

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, 184);
  ctx.lineTo(710, 184);
  ctx.stroke();

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 15px "Oswald", "Courier New", sans-serif';
  ctx.fillText(data.nomePersonagem || '—', 48, 178);

  // Nome do Jogador e Idade
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9.5px "Courier New", monospace';
  ctx.fillText('NOME DO JOGADOR:', 44, 206);

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(44, 230);
  ctx.lineTo(520, 230);
  ctx.stroke();

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 11.5px "Courier New", monospace';
  ctx.fillText(data.nomeJogador || '—', 48, 224);

  ctx.fillStyle = colors.inkMuted;
  ctx.fillText('IDADE:', 540, 206);
  ctx.beginPath();
  ctx.moveTo(540, 230);
  ctx.lineTo(710, 230);
  ctx.stroke();

  ctx.fillStyle = colors.inkPrimary;
  ctx.textAlign = 'center';
  ctx.fillText(data.idade || '—', 625, 224);
  ctx.textAlign = 'left';

  // Ocupação Anterior
  ctx.fillStyle = colors.inkMuted;
  ctx.fillText('OCUPACAO ANTERIOR AO COLAPSO:', 44, 252);
  ctx.beginPath();
  ctx.moveTo(44, 276);
  ctx.lineTo(710, 276);
  ctx.stroke();

  ctx.fillStyle = colors.inkPrimary;
  ctx.fillText(data.ocupacao || '—', 48, 270);

  // Fotografia Física Anexada (à direita)
  const photoFrameX = 735;
  const photoFrameY = 136;
  const photoFrameW = 221;
  const photoFrameH = 146;

  ctx.fillStyle = colors.photoPaper;
  ctx.fillRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);
  ctx.strokeStyle = colors.paperLine;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(photoFrameX + 1, photoFrameY + 1, photoFrameW - 2, photoFrameH - 2);

  const photoInnerX = photoFrameX + 8;
  const photoInnerY = photoFrameY + 8;
  const photoInnerW = photoFrameW - 16;
  const photoInnerH = Math.round(photoInnerW / 1.83);

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
        ctx.rect(photoInnerX, photoInnerY, photoInnerW, photoInnerH);
        ctx.clip();
        ctx.drawImage(img, photoInnerX, photoInnerY, photoInnerW, photoInnerH);
        ctx.restore();
        canvasPhotoDrawn = true;
      }
    } catch (err) {
      console.warn("Falha ao renderizar fotografia no Canvas:", err);
    }
  }

  if (!canvasPhotoDrawn) {
    ctx.fillStyle = colors.paperBase;
    ctx.fillRect(photoInnerX, photoInnerY, photoInnerW, photoInnerH);
    ctx.strokeStyle = colors.inkFaint;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(photoInnerX, photoInnerY, photoInnerW, photoInnerH);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(photoInnerX + 8, photoInnerY + 8);
    ctx.lineTo(photoInnerX + photoInnerW - 8, photoInnerY + photoInnerH - 8);
    ctx.moveTo(photoInnerX + 8, photoInnerY + photoInnerH - 8);
    ctx.lineTo(photoInnerX + photoInnerW - 8, photoInnerY + 8);
    ctx.stroke();

    ctx.fillStyle = colors.inkMuted;
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ FOTOGRAFIA NAO ANEXADA ]', photoInnerX + photoInnerW / 2, photoInnerY + 54);
    ctx.font = '8px "Courier New", monospace';
    ctx.fillText('Registro visual pendente', photoInnerX + photoInnerW / 2, photoInnerY + 68);
    ctx.textAlign = 'left';
  }

  // Cantoneiras triangulares físicas
  const drawCanvasCornerMount = (cx: number, cy: number, type: 'TL' | 'TR' | 'BL' | 'BR') => {
    const s = 11;
    ctx.fillStyle = colors.cornerBracket;
    if (type === 'TL') {
      ctx.fillRect(cx, cy, s, 3);
      ctx.fillRect(cx, cy, 3, s);
    } else if (type === 'TR') {
      ctx.fillRect(cx - s, cy, s, 3);
      ctx.fillRect(cx - 3, cy, 3, s);
    } else if (type === 'BL') {
      ctx.fillRect(cx, cy - 3, s, 3);
      ctx.fillRect(cx, cy - s, 3, s);
    } else if (type === 'BR') {
      ctx.fillRect(cx - s, cy - 3, s, 3);
      ctx.fillRect(cx - 3, cy - s, 3, s);
    }
  };
  drawCanvasCornerMount(photoInnerX, photoInnerY, 'TL');
  drawCanvasCornerMount(photoInnerX + photoInnerW, photoInnerY, 'TR');
  drawCanvasCornerMount(photoInnerX, photoInnerY + photoInnerH, 'BL');
  drawCanvasCornerMount(photoInnerX + photoInnerW, photoInnerY + photoInnerH, 'BR');

  // Clipe metálico de fixação
  ctx.strokeStyle = colors.paperClip;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(photoInnerX + 16, photoFrameY - 6);
  ctx.lineTo(photoInnerX + 16, photoFrameY + 18);
  ctx.moveTo(photoInnerX + 22, photoFrameY - 6);
  ctx.lineTo(photoInnerX + 22, photoFrameY + 22);
  ctx.moveTo(photoInnerX + 16, photoFrameY - 6);
  ctx.lineTo(photoInnerX + 22, photoFrameY - 6);
  ctx.stroke();

  // Carimbo sobrepondo a foto
  ctx.save();
  ctx.translate(photoFrameX + photoFrameW - 95, photoFrameY + photoFrameH - 24);
  ctx.rotate(-5 * Math.PI / 180);
  ctx.strokeStyle = colors.stampRed;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(0, 0, 98, 22);
  ctx.fillStyle = colors.stampRed;
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEAD HOURS', 49, 9);
  ctx.font = '7px "Courier New", monospace';
  ctx.fillText('IDENTIFICACAO', 49, 18);
  ctx.restore();
  ctx.textAlign = 'left';

  ctx.fillStyle = colors.inkMuted;
  ctx.font = '7.5px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FOTOGRAFIA ANEXADA', photoFrameX + photoFrameW / 2, photoFrameY + photoFrameH - 4);
  ctx.textAlign = 'left';

  // ==================== SEÇÃO 2: MATRIZ DE ATRIBUTOS E ESPECIALIZAÇÕES ====================
  drawSectionTitle(296, "II.", "MATRIZ DE ATRIBUTOS DE APTIDAO (12 PONTOS DISTRIBUIDOS)");

  const attrs = [
    { key: 'forca', name: 'FORCA', tag: 'FOR', desc: 'Massa & Combate', val: data.forca },
    { key: 'agilidade', name: 'AGILIDADE', tag: 'AGI', desc: 'Reflexo & Esquiva', val: data.agilidade },
    { key: 'vigor', name: 'VIGOR', tag: 'VIG', desc: 'Saude & Imunidade', val: data.vigor },
    { key: 'intelecto', name: 'INTELECTO', tag: 'INT', desc: 'Logica & Reparo', val: data.intelecto },
    { key: 'percepcao', name: 'PERCEPCAO', tag: 'PER', desc: 'Atencao & Rastreio', val: data.percepcao },
    { key: 'presenca', name: 'PRESENCA', tag: 'PRE', desc: 'Moral & Sangue Frio', val: data.presenca }
  ];

  const attrTableX = 44;
  const attrTableY = 320;
  const attrTableW = 912;
  const attrColW = attrTableW / 6;
  const attrTableH = 92;

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1;
  ctx.strokeRect(attrTableX, attrTableY, attrTableW, attrTableH);

  attrs.forEach((a, i) => {
    const cx = attrTableX + i * attrColW;
    const numVal = parseInt(a.val) || 0;

    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(cx, attrTableY);
      ctx.lineTo(cx, attrTableY + attrTableH);
      ctx.stroke();
    }

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 10px "Oswald", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${a.name} [${a.tag}]`, cx + attrColW / 2, attrTableY + 14);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx + 4, attrTableY + 18);
    ctx.lineTo(cx + attrColW - 4, attrTableY + 18);
    ctx.stroke();

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 30px "Oswald", "Arial Black", sans-serif';
    ctx.fillText(a.val || '0', cx + attrColW / 2, attrTableY + 52);

    const pipsStartX = cx + attrColW / 2 - 20;
    for (let p = 1; p <= 5; p++) {
      const px = pipsStartX + (p - 1) * 8.5;
      const isFilled = p <= numVal;
      ctx.fillStyle = isFilled ? colors.inkPrimary : colors.paperBase;
      ctx.fillRect(px, attrTableY + 62, 6, 6);
      ctx.strokeStyle = colors.inkSecondary;
      ctx.lineWidth = 0.6;
      ctx.strokeRect(px, attrTableY + 62, 6, 6);
    }

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(cx + 4, attrTableY + 74);
    ctx.lineTo(cx + attrColW - 4, attrTableY + 74);
    ctx.stroke();

    ctx.fillStyle = colors.inkMuted;
    ctx.font = '7.5px "Courier New", monospace';
    ctx.fillText(a.desc, cx + attrColW / 2, attrTableY + 84);
    ctx.textAlign = 'left';
  });

  // Especializações
  const specY = 422;
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9.5px "Courier New", monospace';
  ctx.fillText('ESPECIALIZACOES TECNICAS (+2 DE BONUS):', 44, specY + 14);

  ctx.fillStyle = colors.inkPrimary;
  ctx.fillText('1.', 260, specY + 14);
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(276, specY + 16);
  ctx.lineTo(570, specY + 16);
  ctx.stroke();

  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillText(data.esp1 || '—', 282, specY + 13);
  ctx.fillStyle = colors.stampRed;
  ctx.fillText('(+2)', 576, specY + 14);

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 9.5px "Courier New", monospace';
  ctx.fillText('2.', 620, specY + 14);
  ctx.beginPath();
  ctx.moveTo(636, specY + 16);
  ctx.lineTo(915, specY + 16);
  ctx.stroke();

  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillText(data.esp2 || '—', 642, specY + 13);
  ctx.fillStyle = colors.stampRed;
  ctx.fillText('(+2)', 922, specY + 14);

  // ==================== SEÇÃO 3: CONDIÇÃO OPERACIONAL E LIMITES FÍSICOS ====================
  drawSectionTitle(450, "III.", "CONDICAO OPERACIONAL E PARAMETROS DE COMBATE");

  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  // FÓRMULA OFICIAL DE CARGA: 10 + 2 × For
  const cargaCalc = 10 + numFor * 2;

  const vitals = [
    { title: "PONTOS DE VIDA (PV)", formula: "10 + (2 x VIG)", val: `${vidaCalc} PV`, totalDots: 16, fillDots: Math.min(vidaCalc, 16), sub: "Integridade Fisica" },
    { title: "PONTOS DE FOLEGO (PF)", formula: "5 + VIG", val: `${folegoCalc} PF`, totalDots: 8, fillDots: Math.min(folegoCalc, 8), sub: "Resistencia e Folego" },
    { title: "DEFESA PASSIVA (DEF)", formula: "10 + AGI", val: `${defesaCalc} DEF`, totalDots: 8, fillDots: Math.min(defesaCalc - 8, 8), sub: "Esquiva e Protecao Base" },
    { title: "CAPACIDADE DE CARGA", formula: "10 + (2 x FOR)", val: `${cargaCalc} SLOTS`, totalDots: 8, fillDots: Math.min(cargaCalc, 8), sub: "Limite de Peso e Transporte" }
  ];

  const vitX = 44;
  const vitY = 474;
  const vitW = 912;
  const vitColW = (vitW - 30) / 4;
  const vitGap = 10;
  const vitH = 104;

  vitals.forEach((v, i) => {
    const vx = vitX + i * (vitColW + vitGap);

    ctx.strokeStyle = colors.inkSecondary;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(vx, vitY, vitColW, vitH);

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 9.5px "Oswald", sans-serif';
    ctx.fillText(v.title, vx + 10, vitY + 14);

    ctx.fillStyle = colors.inkMuted;
    ctx.font = 'bold 8.5px "Courier New", monospace';
    ctx.fillText(v.formula, vx + 10, vitY + 24);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(vx + 8, vitY + 28);
    ctx.lineTo(vx + vitColW - 8, vitY + 28);
    ctx.stroke();

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 22px "Oswald", "Arial Black", sans-serif';
    ctx.fillText(v.val, vx + 10, vitY + 52);

    ctx.fillStyle = colors.inkMuted;
    ctx.font = '7.5px "Courier New", monospace';
    ctx.fillText(v.sub, vx + 10, vitY + 66);

    const boxX = vx + 8;
    const boxY = vitY + 72;
    const boxW = vitColW - 16;
    const boxH = 24;
    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    const pipW = 16;
    const pipH = 8;
    const pipGapX = 6;
    for (let p = 0; p < v.totalDots; p++) {
      const row = Math.floor(p / 8);
      const col = p % 8;
      const px = boxX + 6 + col * (pipW + pipGapX);
      const pyBox = boxY + 3 + row * (pipH + 2.5);
      const isFilled = p < v.fillDots;
      ctx.fillStyle = isFilled ? colors.inkSecondary : colors.paperBase;
      ctx.fillRect(px, pyBox, pipW, pipH);
      ctx.strokeStyle = colors.inkFaint;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(px, pyBox, pipW, pipH);
    }
  });

  // ==================== SEÇÃO 4: LAUDO DESCRITIVO E PERFIL COMPORTAMENTAL ====================
  drawSectionTitle(590, "IV.", "LAUDO DESCRITIVO E PERFIL DO INDIVIDUO");

  const descColW = 448;
  const descY = 614;
  const descH = 126;

  // Aparência Física
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(44, descY, descColW, descH);

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 9.5px "Oswald", sans-serif';
  ctx.fillText('APARENCIA FISICA E SINAIS DISTINTIVOS', 54, descY + 14);
  ctx.fillStyle = colors.inkMuted;
  ctx.font = '8px "Courier New", monospace';
  ctx.fillText('(Constituicao, cicatrizes, vestimentas e marcas visuais)', 54, descY + 24);

  ctx.strokeStyle = colors.paperLine;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(54, descY + 28);
  ctx.lineTo(44 + descColW - 10, descY + 28);
  ctx.stroke();

  for (let l = 1; l <= 4; l++) {
    ctx.beginPath();
    ctx.moveTo(54, descY + 28 + l * 20);
    ctx.lineTo(44 + descColW - 10, descY + 28 + l * 20);
    ctx.stroke();
  }

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = '10px "Courier New", monospace';
  drawCanvasMultiline(ctx, data.aparencia, 54, descY + 42, descColW - 20, 18, 5);

  // Perfil Psicológico
  const col2X = 508;
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(col2X, descY, descColW, descH);

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 9.5px "Oswald", sans-serif';
  ctx.fillText('PERFIL PSICOLOGICO E CONDUTA SOB ESTRESSE', col2X + 10, descY + 14);
  ctx.fillStyle = colors.inkMuted;
  ctx.font = '8px "Courier New", monospace';
  ctx.fillText('(Temperamento, reacoes ao perigo e estabilidade mental)', col2X + 10, descY + 24);

  ctx.strokeStyle = colors.paperLine;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(col2X + 10, descY + 28);
  ctx.lineTo(col2X + descColW - 10, descY + 28);
  ctx.stroke();

  for (let l = 1; l <= 4; l++) {
    ctx.beginPath();
    ctx.moveTo(col2X + 10, descY + 28 + l * 20);
    ctx.lineTo(col2X + descColW - 10, descY + 28 + l * 20);
    ctx.stroke();
  }

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = '10px "Courier New", monospace';
  drawCanvasMultiline(ctx, data.personalidade, col2X + 10, descY + 42, descColW - 20, 18, 5);

  // ==================== SEÇÃO 5: ÂNCORAS NARRATIVAS E MOTIVAÇÕES ====================
  drawSectionTitle(752, "V.", "ANCORAS NARRATIVAS E ANTECEDENTES");

  const ancY1 = 776;
  const ancY2 = 840;
  const ancH = 56;

  const anchors = [
    { label: "OBJETIVO PESSOAL:", val: data.objetivo, x: 44, y: ancY1 },
    { label: "MAIOR MEDO OU VULNERABILIDADE:", val: data.medo, x: 508, y: ancY1 },
    { label: "LIGACAO COM OUTRO SOBREVIVENTE:", val: data.ligacao, x: 44, y: ancY2 },
    { label: "SEGREDO OU PONTO DE CONFLITO:", val: data.segredo, x: 508, y: ancY2 }
  ];

  anchors.forEach((anc) => {
    ctx.strokeStyle = colors.inkSecondary;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(anc.x, anc.y, descColW, ancH);

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillText(anc.label, anc.x + 10, anc.y + 12);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(anc.x + 10, anc.y + 15);
    ctx.lineTo(anc.x + descColW - 10, anc.y + 15);
    ctx.stroke();

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = '10px "Courier New", monospace';
    drawCanvasMultiline(ctx, anc.val, anc.x + 10, anc.y + 28, descColW - 20, 14, 2);
  });

  // ==================== SEÇÃO 6: MANIFESTO DE CARGA E EQUIPAMENTO ====================
  drawSectionTitle(908, "VI.", "MANIFESTO DE EQUIPAMENTO E CARGA INICIAL");

  const eqY = 932;
  const eqW1 = 295;
  const eqW2 = 295;
  const eqW3 = 302;
  const eqH = 90;

  const invItems = [
    { label: "ARMA PRINCIPAL [SLOT 1]", val: data.arma, note: "Armamento de porte imediato", x: 44, w: eqW1 },
    { label: "FERRAMENTA DE CAMPO [SLOT 2]", val: data.ferramenta, note: "Utilitario e iluminacao", x: 349, w: eqW2 },
    { label: "OUTROS ITENS E PROVISOES [SLOTS 3-4]", val: data.outrosItens, note: "Mochila e mantimentos adicionais", x: 654, w: eqW3 }
  ];

  invItems.forEach((item) => {
    ctx.strokeStyle = colors.inkSecondary;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(item.x, eqY, item.w, eqH);

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillText(item.label, item.x + 10, eqY + 14);

    ctx.strokeStyle = colors.paperLine;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(item.x + 8, eqY + 18);
    ctx.lineTo(item.x + item.w - 8, eqY + 18);
    ctx.stroke();

    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'bold 10px "Courier New", monospace';
    drawCanvasMultiline(ctx, item.val || '—', item.x + 10, eqY + 34, item.w - 20, 16, 2);

    ctx.fillStyle = colors.inkMuted;
    ctx.font = '7.5px "Courier New", monospace';
    ctx.fillText(item.note, item.x + 10, eqY + 80);
  });

  // ==================== SEÇÃO 7: TERMO DE RESPONSABILIDADE E AUTENTICAÇÃO ====================
  drawSectionTitle(1034, "VII.", "TERMO DE CIENCIA E AUTENTICACAO DE REGISTRO");

  const signY = 1058;
  const signH = 196;

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(44, signY, 912, signH);

  // Termo de Declaração de Ciência e Regras
  ctx.fillStyle = data.declaracaoLida ? colors.stampRed : colors.paperBase;
  ctx.fillRect(56, signY + 16, 14, 14);
  ctx.strokeStyle = colors.stampRed;
  ctx.lineWidth = 1;
  ctx.strokeRect(56, signY + 16, 14, 14);

  if (data.declaracaoLida) {
    ctx.fillStyle = colors.paperBase;
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X', 63, signY + 27);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillText('DECLARACAO FORMAL: Confirmo ter lido e aceito integralmente as regras de sobrevivencia, combate,', 78, signY + 20);
  ctx.fillStyle = colors.inkSecondary;
  ctx.font = '9px "Courier New", monospace';
  ctx.fillText('ausencia, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de', 78, signY + 32);
  ctx.fillText('que cada decisao tomada no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana.', 78, signY + 44);

  ctx.strokeStyle = colors.paperLine;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(54, signY + 62);
  ctx.lineTo(946, signY + 62);
  ctx.stroke();

  // Assinatura
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillText('ASSINATURA FORMAL DO SOBREVIVENTE:', 56, signY + 80);

  if (data.assinatura) {
    ctx.fillStyle = colors.inkPrimary;
    ctx.font = 'italic 26px "Caveat", "Brush Script MT", "Times New Roman", cursive';
    ctx.fillText(data.assinatura, 66, signY + 116);
  }

  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(56, signY + 124);
  ctx.lineTo(366, signY + 124);
  ctx.stroke();

  ctx.fillStyle = colors.inkMuted;
  ctx.font = '8px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Assinatura do Sobrevivente / Jogador', 211, signY + 136);

  // Data
  ctx.textAlign = 'left';
  ctx.fillStyle = colors.inkMuted;
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillText('DATA DE REGISTRO:', 396, signY + 80);

  ctx.fillStyle = colors.inkPrimary;
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(data.data || new Date().toLocaleDateString('pt-BR'), 466, signY + 116);

  ctx.beginPath();
  ctx.moveTo(396, signY + 124);
  ctx.lineTo(536, signY + 124);
  ctx.stroke();

  ctx.fillStyle = colors.inkMuted;
  ctx.font = '8px "Courier New", monospace';
  ctx.fillText('Data de Expedicao Oficial', 466, signY + 136);
  ctx.textAlign = 'left';

  // Carimbo Oficial Vintage de Homologação
  ctx.save();
  ctx.translate(570, signY + 76);
  ctx.rotate(-4 * Math.PI / 180);

  ctx.strokeStyle = colors.stampRed;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(0, 0, 360, 56);
  ctx.lineWidth = 0.6;
  ctx.strokeRect(3, 3, 354, 50);

  ctx.fillStyle = colors.stampRed;
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEAD HOURS', 180, 16);

  ctx.fillStyle = colors.stampRedDark;
  ctx.font = 'bold 14px "Oswald", "Arial Black", sans-serif';
  ctx.fillText('* SOBREVIVENTE REGISTRADO *', 180, 32);

  ctx.fillStyle = colors.stampRed;
  ctx.font = 'bold 8.5px "Courier New", monospace';
  ctx.fillText('ARQUIVO DE SOBREVIVENCIA // HOMOLOGACAO', 180, 45);
  ctx.restore();
  ctx.textAlign = 'left';

  // ==================== RODAPÉ DO DOCUMENTO ====================
  ctx.strokeStyle = colors.inkSecondary;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(44, 1360);
  ctx.lineTo(956, 1360);
  ctx.stroke();

  ctx.fillStyle = colors.inkMuted;
  ctx.font = '8px "Courier New", monospace';
  ctx.fillText('DEAD HOURS RPG // PRONTUARIO DE SOBREVIVENTE // ARQUIVO HISTORICO RECUPERADO', 44, 1374);
  ctx.fillText('DOCUMENTACAO OFICIAL // FORMULARIO 104-DH // PAGINA 1 DE 1', 580, 1374);

  ctx.restore();
}

/**
 * Dispara o download da ficha preenchida em formato de imagem PNG de alta resolução
 * compartilhando exatamente o mesmo design, proporção e estrutura física do PDF.
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
  const carga = 10 + vForca * 2;

  return `━━━━━━━━━━━━━━━━━━━━
DEAD HOURS
PRONTUÁRIO DE SOBREVIVENTE
━━━━━━━━━━━━━━━━━━━━

IDENTIFICAÇÃO
Nome do jogador: ${data.nomeJogador || '—'}
Nome do personagem: ${data.nomePersonagem || '—'}
Idade: ${data.idade || '—'}
Fotografia: ${data.foto ? 'ANEXADA AO PRONTUÁRIO' : 'NÃO ANEXADA'}
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
Confirmo ter lido e aceito as regras de sobrevivência, combate, ausência e morte permanente de DEAD HOURS.
[${data.declaracaoLida ? 'X' : ' '}] Confirmação de Leitura
Assinatura: ${data.assinatura || '—'}
Data de Registro: ${data.data || '—'}

━━━━━━━━━━━━━━━━━━━━`;
}
