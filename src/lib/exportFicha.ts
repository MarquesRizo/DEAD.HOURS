import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
 * Gera e baixa a ficha preenchida como imagem PNG em alta resolução (1024x1536)
 * utilizando a arte oficial de referência de DEAD HOURS como base.
 */
export async function downloadFichaPNG(data: FichaData): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/ficha-base.jpg';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1536;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Não foi possível obter contexto 2D do canvas.');
        }

        // Desenha imagem de fundo oficial
        ctx.drawImage(img, 0, 0, 1024, 1536);

        // Configuração de estilo de texto (estilo máquina de escrever/caneta grafite escura)
        ctx.fillStyle = '#1c1916';
        ctx.textBaseline = 'bottom';

        const drawSingleLine = (
          text: string,
          x: number,
          lineY: number,
          maxWidth: number,
          fontSize = 18
        ) => {
          if (!text) return;
          ctx.save();
          let currentSize = fontSize;
          ctx.font = `600 ${currentSize}px "IBM Plex Mono", "Courier New", monospace`;
          while (ctx.measureText(text).width > maxWidth && currentSize > 10) {
            currentSize -= 1;
            ctx.font = `600 ${currentSize}px "IBM Plex Mono", "Courier New", monospace`;
          }
          ctx.fillText(text, x, lineY - 3);
          ctx.restore();
        };

        const drawCentered = (
          text: string,
          centerX: number,
          lineY: number,
          fontSize = 24
        ) => {
          if (!text) return;
          ctx.save();
          ctx.font = `bold ${fontSize}px "IBM Plex Mono", "Courier New", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(text, centerX, lineY);
          ctx.restore();
        };

        // 1. Identificação
        drawSingleLine(data.nomeJogador, 485, 230, 440, 18);
        drawSingleLine(data.nomePersonagem, 530, 260, 395, 18);
        drawSingleLine(data.idade, 415, 296, 65, 17);
        drawSingleLine(data.aparencia, 445, 346, 480, 16);
        drawSingleLine(data.personalidade, 475, 389, 450, 16);
        drawSingleLine(data.ocupacao, 630, 429, 295, 16);

        // 2. Atributos (caixas à esquerda, centralizado no box de x: 247 a 365, centro em 306)
        drawCentered(data.forca, 306, 526, 24);
        drawCentered(data.agilidade, 306, 577, 24);
        drawCentered(data.vigor, 306, 628, 24);
        drawCentered(data.intelecto, 306, 679, 24);
        drawCentered(data.percepcao, 306, 730, 24);
        drawCentered(data.presenca, 306, 781, 24);

        // 3. Especializações
        drawSingleLine(data.esp1, 455, 513, 470, 16);
        drawSingleLine(data.esp2, 455, 552, 470, 16);

        // 4. Histórico
        drawSingleLine(data.objetivo, 585, 597, 340, 16);
        drawSingleLine(data.medo, 535, 638, 390, 16);
        drawSingleLine(data.ligacao, 735, 678, 190, 15);
        drawSingleLine(data.segredo, 625, 724, 300, 16);

        // 5. Equipamento Inicial
        drawSingleLine(data.arma, 125, 874, 330, 16);
        drawSingleLine(data.ferramenta, 175, 925, 280, 16);
        drawSingleLine(data.outrosItens, 180, 976, 275, 16);

        // 6. Declaração
        if (data.declaracaoLida) {
          ctx.save();
          ctx.font = 'bold 20px "IBM Plex Mono", monospace';
          ctx.fillStyle = '#781D24';
          ctx.fillText('✓', 505, 895);
          ctx.restore();
        }

        drawSingleLine(data.assinatura, 705, 1001, 220, 16);

        // Converte para blob e faz download
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
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Não foi possível carregar a imagem base da ficha.'));
    };
  });
}

/**
 * Gera e baixa a ficha em formato PDF interativo com campos AcroForm editáveis
 * sobre a arte oficial de fundo de DEAD HOURS.
 */
export async function downloadFichaPDF(data: FichaData): Promise<void> {
  const bgBytes = await fetch('/images/ficha-base.jpg').then((res) => {
    if (!res.ok) throw new Error('Falha ao baixar imagem de fundo da ficha.');
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

  // Helper para criar campo de texto transparente posicionado sobre a linha
  // Lembrar: em PDF, y=0 fica no canto inferior esquerdo (bottom-left)
  const addField = (
    name: string,
    val: string,
    x: number,
    topY: number,
    width: number,
    height = 24,
    fontSize = 14
  ) => {
    const field = form.createTextField(name);
    field.setText(val || '');
    field.setFontSize(fontSize);
    field.addToPage(page, {
      x,
      y: 1536 - topY,
      width,
      height,
      borderWidth: 0,
      textColor: rgb(0.1, 0.09, 0.08),
    });
    return field;
  };

  // 1. Identificação
  addField('nome_jogador', data.nomeJogador, 485, 236, 440, 24, 15);
  addField('nome_personagem', data.nomePersonagem, 530, 266, 395, 24, 15);
  addField('idade', data.idade, 415, 302, 70, 24, 15);
  addField('aparencia', data.aparencia, 445, 352, 480, 24, 14);
  addField('personalidade', data.personalidade, 475, 395, 450, 24, 14);
  addField('ocupacao', data.ocupacao, 630, 435, 295, 24, 14);

  // 2. Atributos (boxes centralizados)
  addField('attr_forca', data.forca, 280, 528, 55, 32, 20);
  addField('attr_agilidade', data.agilidade, 280, 579, 55, 32, 20);
  addField('attr_vigor', data.vigor, 280, 630, 55, 32, 20);
  addField('attr_intelecto', data.intelecto, 280, 681, 55, 32, 20);
  addField('attr_percepcao', data.percepcao, 280, 732, 55, 32, 20);
  addField('attr_presenca', data.presenca, 280, 783, 55, 32, 20);

  // 3. Especializações
  addField('especializacao_1', data.esp1, 455, 519, 470, 24, 14);
  addField('especializacao_2', data.esp2, 455, 558, 470, 24, 14);

  // 4. Histórico
  addField('objetivo_pessoal', data.objetivo, 585, 603, 340, 24, 14);
  addField('maior_medo', data.medo, 535, 644, 390, 24, 14);
  addField('ligacao_sobrevivente', data.ligacao, 735, 684, 190, 24, 13);
  addField('segredo_conflito', data.segredo, 625, 730, 300, 24, 14);

  // 5. Equipamento Inicial
  addField('equip_arma', data.arma, 125, 880, 330, 24, 14);
  addField('equip_ferramenta', data.ferramenta, 175, 931, 280, 24, 14);
  addField('equip_outros', data.outrosItens, 180, 982, 275, 24, 14);

  // 6. Declaração
  const declaracaoCheck = form.createCheckBox('declaracao_lida');
  if (data.declaracaoLida) {
    declaracaoCheck.check();
  }
  declaracaoCheck.addToPage(page, {
    x: 495,
    y: 1536 - 905,
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: rgb(0.47, 0.11, 0.14),
  });

  addField('assinatura_jogador', data.assinatura, 705, 1007, 220, 24, 14);

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
