const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Import the standalone builder that mirrors exportFicha.ts
const { buildPDF, sampleData } = require('./test_build_pdf.js');

(async () => {
  try {
    console.log("=== INICIANDO TESTE COMPLETO DE EXPORTAÇÃO INTEGRADA ===");

    // 1. Gera PDF oficial com dados do formulário
    const pdfBytes = await buildPDF(sampleData);
    const pdfPath = path.join(__dirname, '..', 'public', 'dead-hours-ficha-carlos-corvo-silveira.pdf');
    fs.writeFileSync(pdfPath, pdfBytes);
    console.log(`[1/4] PDF gerado com sucesso: ${pdfPath} (${pdfBytes.length} bytes)`);

    // 2. Valida o PDF gerado
    const doc = await PDFDocument.load(pdfBytes);
    const form = doc.getForm();
    const fields = form.getFields();
    console.log(`[2/4] Leitura de campos AcroForm: ${fields.length} campos encontrados.`);

    const requiredFields = [
      'nome_personagem', 'nome_jogador', 'idade', 'ocupacao',
      'attr_forca', 'attr_agilidade', 'attr_vigor', 'attr_intelecto', 'attr_percepcao', 'attr_presenca',
      'especializacao_1', 'especializacao_2',
      'vital_vida', 'vital_folego', 'vital_defesa', 'vital_carga',
      'aparencia', 'personalidade',
      'objetivo_pessoal', 'maior_medo', 'ligacao_sobrevivente', 'segredo_conflito',
      'equip_arma', 'equip_ferramenta', 'equip_outros',
      'declaracao_lida', 'assinatura_jogador', 'data_registro'
    ];

    for (const rf of requiredFields) {
      const field = form.getField(rf);
      if (!field) {
        throw new Error(`Campo ausente: ${rf}`);
      }
    }
    console.log(`[3/4] Todos os ${requiredFields.length} campos obrigatórios validados com sucesso.`);

    // 3. Testa edição e reabertura
    const testDoc = await PDFDocument.load(pdfBytes);
    const testForm = testDoc.getForm();
    testForm.getTextField('nome_personagem').setText('Helena "Falcão" Santos');
    testForm.getTextField('attr_vigor').setText('4');
    testForm.getTextField('vital_vida').setText('18 PV');
    testForm.getTextField('aparencia').setText('Médica socorrista com marcas de queimadura química nos braços e estetoscópio militar.');

    const modifiedBytes = await testDoc.save();
    const reloaded = await PDFDocument.load(modifiedBytes);
    const reloadedForm = reloaded.getForm();

    const nomeEditado = reloadedForm.getTextField('nome_personagem').getText();
    const vigEditado = reloadedForm.getTextField('attr_vigor').getText();
    const vidaEditada = reloadedForm.getTextField('vital_vida').getText();
    const aparenciaEditada = reloadedForm.getTextField('aparencia').getText();

    if (
      nomeEditado === 'Helena "Falcão" Santos' &&
      vigEditado === '4' &&
      vidaEditada === '18 PV' &&
      aparenciaEditada.includes('socorrista')
    ) {
      console.log("[4/4] Edição, salvamento e reabertura validados com 100% de persistência.");
    } else {
      throw new Error("Falha na persistência dos campos editados.");
    }

    console.log("\n=== TESTE CONCLUÍDO COM SUCESSO TOTAL! ===");
  } catch (err) {
    console.error("ERRO NO TESTE:", err);
    process.exit(1);
  }
})();
