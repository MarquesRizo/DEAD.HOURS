import { PDFDocument, rgb, StandardFonts, PDFFont, TextAlignment } from 'pdf-lib';

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
}

/**
 * Helper para carregar a imagem base com segurança através de decode()
 * prevenindo downloads duplicados, race conditions e renderização em branco.
 */
async function loadBaseImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;

  if (typeof img.decode === 'function') {
    try {
      await img.decode();
      return img;
    } catch {
      // Fallback para onload se decode() falhar no ambiente
    }
  }

  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível carregar a imagem base da ficha.'));
  });
}

/**
 * Sanitiza e mapeia caracteres para garantir compatibilidade 100% com WinAnsi (StandardFonts do PDF)
 * sem descartar silenciosamente informações do jogador e evitando exceções durante o save().
 */
function sanitizeForWinAnsi(text: string, font: PDFFont): string {
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
  // Itera por pontos de código Unicode completos (evitando corromper emojis / surrogates)
  for (const char of Array.from(text)) {
    if (replacements[char]) {
      result += replacements[char];
      continue;
    }

    try {
      font.encodeText(char);
      result += char;
    } catch {
      // Se não for codificável em WinAnsi, tenta normalização para decompor acentos
      const normalized = char.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
      try {
        font.encodeText(normalized);
        result += normalized;
      } catch {
        // Fallback seguro em vez de lançar exceção
        result += ' ';
      }
    }
  }

  return result;
}

/**
 * Gera e baixa a ficha preenchida como imagem PNG em alta resolução (1024x1536)
 * com tipografia de alta legibilidade, alinhamento visual preciso sobre as linhas da arte
 * e presença visual simulando um documento de sobrevivente preenchido.
 */
export async function downloadFichaPNG(data: FichaData): Promise<void> {
  // 1. Carrega a imagem base oficial de forma assíncrona e segura
  const img = await loadBaseImage('/images/ficha-base.jpg');

  // 2. Aguarda prontidão das fontes web se disponíveis
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Prossegue mesmo se fonts.ready falhar
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do canvas.');
  }

  // 3. Desenha a imagem base oficial de fundo
  ctx.drawImage(img, 0, 0, 1024, 1536);

  // 4. Estilos de texto (tinta escura densa com sensação de máquina de escrever / carimbo)
  const darkInk = '#100f0d';
  const redStamp = '#781D24';

  const drawLine = (
    text: string,
    x: number,
    baselineY: number,
    maxWidth: number,
    fontSize = 18
  ) => {
    if (!text) return;
    ctx.save();
    let currentSize = fontSize;
    ctx.fillStyle = darkInk;
    ctx.textBaseline = 'alphabetic';
    ctx.font = `bold ${currentSize}px "Courier New", "IBM Plex Mono", monospace`;

    // Auto-ajuste de tamanho caso o texto exceda a largura da linha
    while (ctx.measureText(text).width > maxWidth && currentSize > 10) {
      currentSize -= 1;
      ctx.font = `bold ${currentSize}px "Courier New", "IBM Plex Mono", monospace`;
    }

    ctx.fillText(text, x, baselineY);
    ctx.restore();
  };

  const drawMultiline = (
    text: string,
    x: number,
    baselineY: number,
    maxWidth: number,
    maxLines = 2,
    baseFontSize = 17,
    lineHeight = 17
  ) => {
    if (!text || !text.trim()) return;
    ctx.save();
    ctx.fillStyle = darkInk;
    ctx.textBaseline = 'alphabetic';

    const rawParagraphs = text.split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
    if (rawParagraphs.length === 0) {
      ctx.restore();
      return;
    }

    let currentSize = baseFontSize;
    const breakIntoLines = (fSize: number): string[] => {
      ctx.font = `bold ${fSize}px "Courier New", "IBM Plex Mono", monospace`;
      const res: string[] = [];
      for (const paragraph of rawParagraphs) {
        const words = paragraph.split(/\s+/);
        let currentLine = '';
        for (const word of words) {
          const candidate = currentLine ? `${currentLine} ${word}` : word;
          if (ctx.measureText(candidate).width <= maxWidth) {
            currentLine = candidate;
          } else {
            if (currentLine) res.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) res.push(currentLine);
      }
      return res;
    };

    let lines = breakIntoLines(currentSize);

    // Ajusta o tamanho da fonte caso o texto gere mais linhas que o permitido
    while (lines.length > maxLines && currentSize > 11) {
      currentSize -= 1;
      lines = breakIntoLines(currentSize);
    }

    // Se ainda assim exceder o teto de linhas, trunca a última com reticências
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      let last = lines[maxLines - 1];
      while (ctx.measureText(last + '...').width > maxWidth && last.length > 3) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = last.trim() + '...';
    }

    ctx.font = `bold ${currentSize}px "Courier New", "IBM Plex Mono", monospace`;

    if (lines.length === 1) {
      // Linha única: assenta perfeitamente sobre a linha sublinhada
      ctx.fillText(lines[0], x, baselineY);
    } else {
      // Multilinha: distribui as 2 linhas confortavelmente no espaço do campo
      const startY = baselineY - lineHeight + 2;
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, startY + idx * lineHeight);
      });
    }

    ctx.restore();
  };

  const drawAttr = (text: string, centerX: number, centerY: number) => {
    if (!text) return;
    ctx.save();
    ctx.fillStyle = darkInk;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 26px "Arial Black", "Impact", sans-serif';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  };

  // --- 1. IDENTIFICAÇÃO (Coordenadas calibradas nas linhas reais) ---
  // Linha 1: Nome do Jogador (linha Y=349)
  drawLine(data.nomeJogador, 510, 344, 430, 20);
  // Linha 2: Nome do Personagem (linha Y=392)
  drawLine(data.nomePersonagem, 560, 387, 380, 20);
  // Linha 3: Idade (linha Y=437)
  drawLine(data.idade, 425, 432, 70, 19);
  // Linha 4: Aparência física (linha Y=469)
  drawMultiline(data.aparencia, 460, 464, 480, 2, 17, 17);
  // Linha 5: Personalidade (linha Y=516)
  drawMultiline(data.personalidade, 490, 511, 450, 2, 17, 17);
  // Linha 6: Ocupação anterior ao apocalipse (linha Y=555)
  drawLine(data.ocupacao, 645, 550, 295, 18);

  // --- 2. ATRIBUTOS (Centro exato das 6 caixas retangulares X=248 a 365, centro X=306) ---
  drawAttr(data.forca, 306, 706);
  drawAttr(data.agilidade, 306, 757);
  drawAttr(data.vigor, 306, 807);
  drawAttr(data.intelecto, 306, 858);
  drawAttr(data.percepcao, 306, 908);
  drawAttr(data.presenca, 306, 959);

  // --- 3. ESPECIALIZAÇÕES (Linhas Y=658 e Y=713) ---
  drawLine(data.esp1, 480, 653, 460, 18);
  drawLine(data.esp2, 480, 708, 460, 18);

  // --- 4. HISTÓRICO (Linhas Y=810, 911, 1020, 1078) ---
  drawLine(data.objetivo, 590, 805, 350, 18);
  drawLine(data.medo, 550, 906, 390, 18);
  drawLine(data.ligacao, 755, 1015, 185, 17);
  drawLine(data.segredo, 630, 1073, 310, 18);

  // --- 5. EQUIPAMENTO INICIAL (Linhas Y=1163, 1213, 1263) ---
  drawLine(data.arma, 175, 1158, 265, 18);
  drawLine(data.ferramenta, 225, 1208, 215, 18);
  drawLine(data.outrosItens, 230, 1258, 210, 18);

  // --- 6. DECLARAÇÃO E ASSINATURA ---
  if (data.declaracaoLida) {
    ctx.save();
    ctx.fillStyle = redStamp;
    ctx.strokeStyle = redStamp;
    ctx.lineWidth = 2;
    // Carimbo estilizado militar de confirmação oficial
    ctx.strokeRect(740, 1142, 185, 34);
    ctx.font = 'bold 15px "Courier New", "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONFIRMADO ✓', 832, 1159);
    ctx.restore();
  }

  // Assinatura na linha Y=1291
  if (data.assinatura) {
    ctx.save();
    ctx.fillStyle = darkInk;
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'italic bold 22px "Brush Script MT", "Caveat", "Segoe Script", "Arial", cursive, sans-serif';
    ctx.fillText(data.assinatura, 550, 1286);
    ctx.restore();
  }

  // 5. Converte para blob e dispara download uma única vez
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Falha ao gerar arquivo de imagem.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const cleanName = data.nomePersonagem.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'sobrevivente';
      link.download = `ficha_dead_hours_${cleanName.toLowerCase()}.png`;
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
 * Gera e baixa a ficha em formato PDF interativo com campos AcroForm editáveis
 * sobre a arte oficial de DEAD HOURS, com fundo 100% transparente (sem blocos brancos)
 * e tipografia confortável.
 */
export async function downloadFichaPDF(data: FichaData): Promise<void> {
  const bgBytes = await fetch('/images/ficha-base.jpg').then((res) => {
    if (!res.ok) throw new Error('Falha ao carregar a imagem de fundo da ficha.');
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.create();
  const bgImage = await pdfDoc.embedJpg(bgBytes);

  // Dimensões originais 1024 x 1536
  const page = pdfDoc.addPage([1024, 1536]);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width: 1024,
    height: 1536,
  });

  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // Helper para criar campo interativo editável transparente
  // PDF usa coordenadas a partir do canto inferior esquerdo (y=0 na base: 1536 - topY)
  const addField = (
    name: string,
    val: string,
    x: number,
    topY: number,
    width: number,
    height = 28,
    fontSize = 16,
    multiline = false,
    alignCenter = false
  ) => {
    const field = form.createTextField(name);
    field.addToPage(page, {
      x,
      y: 1536 - topY,
      width,
      height,
      borderWidth: 0,
      backgroundColor: undefined, // Essencial: remove o bloco branco opaco do campo
      borderColor: undefined,     // Essencial: remove contorno opaco
      textColor: rgb(0.08, 0.08, 0.08),
    });

    if (multiline) {
      field.enableMultiline();
    }

    if (alignCenter) {
      field.setAlignment(TextAlignment.Center);
    }

    // Configura a aparência padrão com a fonte embutida antes de setFontSize
    field.defaultUpdateAppearances(font);
    field.setFontSize(fontSize);
    field.setText(sanitizeForWinAnsi(val || '', font));
    return field;
  };

  // --- 1. IDENTIFICAÇÃO (Posicionamento alinhado às linhas da ficha) ---
  addField('nome_jogador', data.nomeJogador, 510, 348, 430, 28, 16);
  addField('nome_personagem', data.nomePersonagem, 560, 392, 380, 28, 16);
  addField('idade', data.idade, 425, 437, 70, 26, 16);
  addField('aparencia', data.aparencia, 460, 469, 480, 28, 13, true);
  addField('personalidade', data.personalidade, 490, 516, 450, 28, 13, true);
  addField('ocupacao', data.ocupacao, 645, 555, 295, 26, 15);

  // --- 2. ATRIBUTOS (Caixas transparentes centradas em X=248 a 365) ---
  addField('attr_forca', data.forca, 248, 725, 117, 38, 22, false, true);
  addField('attr_agilidade', data.agilidade, 248, 776, 117, 38, 22, false, true);
  addField('attr_vigor', data.vigor, 248, 826, 117, 38, 22, false, true);
  addField('attr_intelecto', data.intelecto, 248, 877, 117, 38, 22, false, true);
  addField('attr_percepcao', data.percepcao, 248, 928, 117, 38, 22, false, true);
  addField('attr_presenca', data.presenca, 248, 979, 117, 38, 22, false, true);

  // --- 3. ESPECIALIZAÇÕES (Linhas Y=658 e Y=713) ---
  addField('especializacao_1', data.esp1, 480, 658, 460, 28, 15);
  addField('especializacao_2', data.esp2, 480, 713, 460, 28, 15);

  // --- 4. HISTÓRICO (Linhas Y=810, 911, 1020, 1078) ---
  addField('objetivo_pessoal', data.objetivo, 590, 810, 350, 28, 15);
  addField('maior_medo', data.medo, 550, 911, 390, 28, 15);
  addField('ligacao_sobrevivente', data.ligacao, 755, 1020, 185, 28, 13);
  addField('segredo_conflito', data.segredo, 630, 1078, 310, 28, 15);

  // --- 5. EQUIPAMENTO INICIAL (Linhas Y=1163, 1213, 1263) ---
  addField('equip_arma', data.arma, 175, 1163, 265, 26, 15);
  addField('equip_ferramenta', data.ferramenta, 225, 1213, 215, 26, 14);
  addField('equip_outros', data.outrosItens, 230, 1263, 210, 26, 14);

  // --- 6. DECLARAÇÃO E ASSINATURA ---
  const chk = form.createCheckBox('declaracao_lida');
  if (data.declaracaoLida) {
    chk.check();
  }
  chk.addToPage(page, {
    x: 460,
    y: 1536 - 1145,
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: rgb(0.47, 0.11, 0.14),
    backgroundColor: undefined, // Fundo transparente
  });

  addField('assinatura_jogador', data.assinatura, 550, 1291, 390, 30, 16);

  // Atualiza as aparências de todos os campos do formulário com a fonte embutida
  form.updateFieldAppearances(font);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const cleanName = data.nomePersonagem.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'sobrevivente';
  link.download = `ficha_dead_hours_${cleanName.toLowerCase()}.pdf`;
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
