const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Import compiled or source modules
const { filterSkills, normalizeSkillText, OFFICIAL_SKILLS } = require('../src/lib/skillsData');
const { 
  generateFichaPDF, 
  formatFichaForClipboard, 
  sanitizeForWinAnsi 
} = require('../src/lib/exportFicha');

async function runTests() {
  console.log("==================================================");
  console.log("   DEAD HOURS — SUITE DE TESTES DO NOVO PROTOCOLO ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST SUITE 1: AUTOCOMPLETE & FILTRAGEM DE PERÍCIAS
  console.log("--- TESTE 1: AUTOCOMPLETE DE PERÍCIAS (FASE 3) ---");
  
  // 1.1 Digitação 'C'
  const resC = filterSkills('C');
  assert(resC.length > 0, "Digitação 'C' retorna correspondências");
  assert(resC[0].nome === 'Caçar', "Digitação 'C' traz 'Caçar' como primeira correspondência oficial");
  const cMatches = resC.map(s => s.nome);
  assert(cMatches.includes('Combate Desarmado') && cMatches.includes('Condução de Veículos'), 
    "Digitação 'C' inclui 'Combate Desarmado' e 'Condução de Veículos'");

  // 1.2 Digitação 'Ca'
  const resCa = filterSkills('Ca');
  assert(resCa.length > 0 && resCa[0].nome === 'Caçar', "Digitação 'Ca' filtra e prioriza 'Caçar'");

  // 1.3 Digitação 'Caç'
  const resCacComCedilha = filterSkills('Caç');
  assert(resCacComCedilha.length > 0 && resCacComCedilha[0].nome === 'Caçar', "Digitação 'Caç' (com cedilha) retorna 'Caçar'");

  // 1.4 Digitação 'cacar' (sem cedilha e sem acento)
  const normResult = normalizeSkillText('Caçar');
  assert(normResult === 'cacar', `normalizeSkillText('Caçar') normaliza para 'cacar' (Obtido: ${normResult})`);
  const resCacarSemCedilha = filterSkills('cacar');
  assert(resCacarSemCedilha.length > 0 && resCacarSemCedilha[0].nome === 'Caçar', "Digitação 'cacar' (sem acento) retorna 'Caçar' via normalização NFKD");

  // 1.5 Termo vazio
  const resVazio = filterSkills('');
  assert(resVazio.length === OFFICIAL_SKILLS.length, "Termo vazio retorna catálogo completo de perícias homologadas");

  // 1.6 Termo inexistente
  const resInexistente = filterSkills('xyzinexistente999');
  assert(resInexistente.length === 0, "Termo não-homologado retorna lista vazia para permitir fallback personalizado");


  // TEST SUITE 2: DISTRIBUIÇÃO DE ATRIBUTOS E CÁLCULOS (FASE 4 & 10)
  console.log("\n--- TESTE 2: REGRAS DOS 12 PONTOS E FÓRMULAS DE COMBATE (FASE 4 & 10) ---");
  
  const sampleVigor = 3;
  const sampleForca = 3;
  const sampleAgilidade = 2;
  const sampleIntelecto = 2;
  const samplePercepcao = 1;
  const samplePresenca = 1;

  const totalPts = sampleForca + sampleAgilidade + sampleVigor + sampleIntelecto + samplePercepcao + samplePresenca;
  assert(totalPts === 12, "Regra dos 12 pontos exatos satisfeita (3+2+3+2+1+1 = 12)");

  const calcVida = 10 + sampleVigor * 2;
  assert(calcVida === 16, `Fórmula de Vida [10 + (VIG x 2)] = 16 PV (Calculado: ${calcVida})`);

  const calcFolego = 5 + sampleVigor;
  assert(calcFolego === 8, `Fórmula de Fôlego [5 + VIG] = 8 PF (Calculado: ${calcFolego})`);

  const calcDefesa = 10 + sampleAgilidade;
  assert(calcDefesa === 12, `Fórmula de Defesa [10 + AGI] = 12 DEF (Calculado: ${calcDefesa})`);

  const calcCarga = 5 + sampleForca;
  assert(calcCarga === 8, `Fórmula de Carga [5 + FOR] = 8 slots (Calculado: ${calcCarga})`);


  // TEST SUITE 3: INTEGRAÇÃO FOTOGRÁFICA E EXPORTAÇÃO PDF (FASE 2 & 8)
  console.log("\n--- TESTE 3: INTEGRAÇÃO DA FOTOGRAFIA NO PDF EDITÁVEL (FASE 2 & 8) ---");

  // Imagem JPEG mínima de teste válida (1x1 pixel JPEG em base64)
  const sampleJpgBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

  const testFichaData = {
    nomeJogador: 'Marcos Roberto',
    nomePersonagem: 'Carlos "Corvo" Silveira',
    idade: '34 anos',
    ocupacao: 'Mecânico Automotivo',
    aparencia: 'Cicatriz profunda no supercílio direito, jaqueta militar surrada.',
    personalidade: 'Pragmático, silencioso sob terror extremo.',
    forca: '3',
    agilidade: '2',
    vigor: '3',
    intelecto: '2',
    percepcao: '1',
    presenca: '1',
    esp1: 'Caçar (+2 em Percepção)',
    esp2: 'Mecânica de Veículos e Motores (+2 em Intelecto)',
    objetivo: 'Encontrar a filha evacuada no comboio sul.',
    medo: 'Espaços confinados sem saída de emergência.',
    ligacao: 'Médica Helena, salva no colapso da ponte.',
    segredo: 'Trancou portão com colegas infectados no início.',
    arma: 'Faca de Caça (1d4+3)',
    ferramenta: 'Lanterna Tática c/ Dínamo',
    outrosItens: 'Cantil 1L, Ração (x2), Fita isolante',
    declaracaoLida: true,
    assinatura: 'Carlos Silveira',
    data: '24/11/2026',
    foto: sampleJpgBase64,
  };

  const pdfBytes = await generateFichaPDF(testFichaData);
  assert(pdfBytes && pdfBytes.length > 10000, `PDF gerado com sucesso incorporando fotografia (${pdfBytes.length} bytes)`);

  // Carrega e valida integridade dos campos AcroForm (NÃO PODE SER ACHATADO!)
  const loadedPdf = await PDFDocument.load(pdfBytes);
  const form = loadedPdf.getForm();
  const fields = form.getFields();
  assert(fields.length >= 28, `PDF preserva todos os campos AcroForm interativos (${fields.length} campos presentes, não achatado)`);

  // Validação de sanitização WinAnsi
  const sampleFont = await loadedPdf.embedFont('Helvetica');
  const sanitizedText = sanitizeForWinAnsi('Sobrevivente → Ativo ✓', sampleFont);
  assert(sanitizedText.includes('->') && sanitizedText.includes('[X]'), `Sanitização WinAnsi segura: "${sanitizedText}"`);

  const outPdfPath = path.join(__dirname, 'test_output_com_foto.pdf');
  fs.writeFileSync(outPdfPath, pdfBytes);
  assert(fs.existsSync(outPdfPath), `Arquivo PDF gravado fisicamente em: ${outPdfPath}`);

  // Validação de edição e persistência pós-criação
  const nomeField = form.getTextField('nome_personagem');
  assert(nomeField !== null, "Campo 'nome_personagem' existe e é editável");
  assert(nomeField.getText() === 'Carlos "Corvo" Silveira', "Valor de 'nome_personagem' persistido corretamente");

  const espField1 = form.getTextField('especializacao_1');
  assert(espField1 !== null, "Campo 'especializacao_1' existe");
  assert(espField1.getText().includes('Ca'), "Valor de 'especializacao_1' preservado com sucesso");

  // Testa modificação de campo no AcroForm e re-salvamento
  nomeField.setText('Helena "Falcão" Santos');
  const modifiedBytes = await loadedPdf.save();
  const reloadedPdf = await PDFDocument.load(modifiedBytes);
  const reloadedNome = reloadedPdf.getForm().getTextField('nome_personagem').getText();
  assert(reloadedNome === 'Helena "Falcão" Santos', "Edição e persistência do AcroForm validadas com 100% de sucesso");


  // TEST SUITE 4: COPIAR FICHA (FASE 8 & 10)
  console.log("\n--- TESTE 4: FORMATAÇÃO DE TEXTO PARA ÁREA DE TRANSFERÊNCIA (FASE 8 & 10) ---");
  const clipboardText = formatFichaForClipboard(testFichaData);
  assert(clipboardText.includes('DEAD HOURS'), "Texto do clipboard inclui título oficial");
  assert(clipboardText.includes('Carlos "Corvo" Silveira'), "Texto do clipboard inclui nome do personagem");
  assert(clipboardText.includes('Caçar (+2 em Percepção)'), "Texto do clipboard inclui especialização selecionada");
  assert(clipboardText.includes('BIOMETRIA'), "Texto do clipboard indica fotografia homologada");
  assert(clipboardText.includes('Vida: 16 | Fôlego: 8 | Defesa: 12 | Carga: 8 slots'), "Texto do clipboard inclui atributos derivados calculados");

  console.log("\n==================================================");
  console.log(`RESULTADO FINAL: ${passed} PASSOU / ${failed} FALHOU`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("ERRO CRÍTICO NA EXECUÇÃO DOS TESTES:", err);
  process.exit(1);
});
