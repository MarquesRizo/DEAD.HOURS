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
 * desenhando os dados preenchidos diretamente sobre a arte oficial de DEAD HOURS.
 */
export async function downloadFichaPNG(data: FichaData): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const renderCanvas = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1536;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Não foi possível obter contexto 2D do canvas.');
        }

        // 1. Desenha a imagem base oficial de fundo
        ctx.drawImage(img, 0, 0, 1024, 1536);

        // 2. Estilos de texto (tinta escura estilo máquina de escrever / caneta)
        const darkInk = '#121212';
        const redStamp = '#781D24';

        const drawLine = (
          text: string,
          x: number,
          baselineY: number,
          maxWidth: number,
          fontSize = 15
        ) => {
          if (!text) return;
          ctx.save();
          let currentSize = fontSize;
          ctx.fillStyle = darkInk;
          ctx.textBaseline = 'alphabetic';
          ctx.font = `bold ${currentSize}px "Courier New", "IBM Plex Mono", monospace`;

          // Auto-ajuste de tamanho caso o texto seja longo
          while (ctx.measureText(text).width > maxWidth && currentSize > 9) {
            currentSize -= 1;
            ctx.font = `bold ${currentSize}px "Courier New", "IBM Plex Mono", monospace`;
          }

          ctx.fillText(text, x, baselineY);
          ctx.restore();
        };

        const drawAttr = (text: string, centerX: number, centerY: number) => {
          if (!text) return;
          ctx.save();
          ctx.fillStyle = darkInk;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 24px "Impact", "Arial Black", sans-serif';
          ctx.fillText(text, centerX, centerY);
          ctx.restore();
        };

        // --- 1. IDENTIFICAÇÃO ---
        drawLine(data.nomeJogador, 505, 325, 415, 16);
        drawLine(data.nomePersonagem, 550, 360, 370, 16);
        drawLine(data.idade, 425, 390, 65, 15);
        drawLine(data.aparencia, 460, 422, 460, 14);
        drawLine(data.personalidade, 490, 455, 430, 14);
        drawLine(data.ocupacao, 655, 485, 265, 14);

        // --- 2. ATRIBUTOS (Centro das caixas na coluna esquerda x=298) ---
        drawAttr(data.forca, 298, 480);
        drawAttr(data.agilidade, 298, 542);
        drawAttr(data.vigor, 298, 605);
        drawAttr(data.intelecto, 298, 668);
        drawAttr(data.percepcao, 298, 731);
        drawAttr(data.presenca, 298, 792);

        // --- 3. ESPECIALIZAÇÕES ---
        drawLine(data.esp1, 475, 470, 445, 15);
        drawLine(data.esp2, 475, 502, 445, 15);

        // --- 4. HISTÓRICO ---
        drawLine(data.objetivo, 605, 582, 315, 14);
        drawLine(data.medo, 560, 614, 360, 14);
        drawLine(data.ligacao, 760, 644, 160, 13);
        drawLine(data.segredo, 645, 674, 275, 14);

        // --- 5. EQUIPAMENTO INICIAL ---
        drawLine(data.arma, 145, 1120, 310, 14);
        drawLine(data.ferramenta, 195, 1175, 260, 14);
        drawLine(data.outrosItens, 200, 1230, 255, 14);

        // --- 6. DECLARAÇÃO ---
        if (data.declaracaoLida) {
          ctx.save();
          ctx.fillStyle = redStamp;
          ctx.font = 'bold 20px "Arial", sans-serif';
          ctx.fillText('✓', 515, 1120);
          ctx.restore();
        }

        drawLine(data.assinatura, 730, 1270, 190, 14);

        // Converte para blob e inicia download
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

    img.onload = renderCanvas;
    img.onerror = () => {
      reject(new Error('Não foi possível carregar a imagem base da ficha.'));
    };

    img.src = '/images/ficha-base.jpg';

    // Se a imagem já estiver no cache do navegador, força a execução
    if (img.complete) {
      renderCanvas();
    }
  });
}

/**
 * Gera e baixa a ficha em formato PDF interativo com campos AcroForm editáveis
 * sobre a arte oficial de DEAD HOURS, sem o erro de /DA.
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

  // Helper para criar campo interativo editável
  // PDF usa coordenadas a partir do canto inferior esquerdo (y=0 na base)
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
    field.addToPage(page, {
      x,
      y: 1536 - topY,
      width,
      height,
      borderWidth: 0,
      textColor: rgb(0.08, 0.08, 0.08),
    });

    // Configura a aparência padrão com a fonte embutida antes de setFontSize
    field.defaultUpdateAppearances(font);
    field.setFontSize(fontSize);
    field.setText(val || '');
    return field;
  };

  // --- 1. IDENTIFICAÇÃO ---
  addField('nome_jogador', data.nomeJogador, 505, 332, 415, 24, 15);
  addField('nome_personagem', data.nomePersonagem, 550, 370, 370, 24, 15);
  addField('idade', data.idade, 425, 400, 65, 24, 14);
  addField('aparencia', data.aparencia, 460, 432, 460, 24, 13);
  addField('personalidade', data.personalidade, 490, 465, 430, 24, 13);
  addField('ocupacao', data.ocupacao, 655, 495, 265, 24, 13);

  // --- 2. ATRIBUTOS (Boxes na coluna esquerda) ---
  addField('attr_forca', data.forca, 260, 495, 80, 32, 22);
  addField('attr_agilidade', data.agilidade, 260, 558, 80, 32, 22);
  addField('attr_vigor', data.vigor, 260, 622, 80, 32, 22);
  addField('attr_intelecto', data.intelecto, 260, 685, 80, 32, 22);
  addField('attr_percepcao', data.percepcao, 260, 748, 80, 32, 22);
  addField('attr_presenca', data.presenca, 260, 810, 80, 32, 22);

  // --- 3. ESPECIALIZAÇÕES ---
  addField('especializacao_1', data.esp1, 475, 480, 445, 24, 14);
  addField('especializacao_2', data.esp2, 475, 512, 445, 24, 14);

  // --- 4. HISTÓRICO ---
  addField('objetivo_pessoal', data.objetivo, 605, 592, 315, 24, 13);
  addField('maior_medo', data.medo, 560, 624, 360, 24, 13);
  addField('ligacao_sobrevivente', data.ligacao, 760, 654, 160, 24, 12);
  addField('segredo_conflito', data.segredo, 645, 684, 275, 24, 13);

  // --- 5. EQUIPAMENTO INICIAL ---
  addField('equip_arma', data.arma, 145, 1130, 310, 24, 13);
  addField('equip_ferramenta', data.ferramenta, 195, 1185, 260, 24, 13);
  addField('equip_outros', data.outrosItens, 200, 1240, 255, 24, 13);

  // --- 6. DECLARAÇÃO ---
  const chk = form.createCheckBox('declaracao_lida');
  if (data.declaracaoLida) {
    chk.check();
  }
  chk.addToPage(page, {
    x: 512,
    y: 1536 - 1135,
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: rgb(0.47, 0.11, 0.14),
  });

  addField('assinatura_jogador', data.assinatura, 730, 1280, 190, 24, 14);

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
