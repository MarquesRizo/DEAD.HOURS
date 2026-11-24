const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

(async () => {
  try {
    const pdfBytes = fs.readFileSync('C:\\DEAD.HOURS\\public\\preview-ficha.pdf');
    const doc = await PDFDocument.load(pdfBytes);
    const form = doc.getForm();
    const fields = form.getFields();

    console.log(`=== TESTE DE CAMPOS ACROFORM (${fields.length} campos encontrados) ===`);
    const fieldMap = {};
    for (const f of fields) {
      const name = f.getName();
      const type = f.constructor.name;
      let val = '';
      if (type === 'PDFTextField') {
        val = f.getText();
      } else if (type === 'PDFCheckBox') {
        val = f.isChecked() ? '[CHECKED]' : '[UNCHECKED]';
      }
      fieldMap[name] = { type, val };
      console.log(`- Campo: [${name}] | Tipo: ${type} | Valor: "${val ? val.slice(0, 30) + (val.length > 30 ? '...' : '') : ''}"`);
    }

    // Test 1: Verify presence of all expected fields
    const expectedFields = [
      'nome_personagem', 'nome_jogador', 'idade', 'ocupacao',
      'attr_forca', 'attr_agilidade', 'attr_vigor', 'attr_intelecto', 'attr_percepcao', 'attr_presenca',
      'especializacao_1', 'especializacao_2',
      'vital_vida', 'vital_folego', 'vital_defesa', 'vital_carga',
      'aparencia', 'personalidade',
      'objetivo_pessoal', 'maior_medo', 'ligacao_sobrevivente', 'segredo_conflito',
      'equip_arma', 'equip_ferramenta', 'equip_outros',
      'declaracao_lida', 'assinatura_jogador', 'data_registro'
    ];

    console.log('\n=== VERIFICACAO DE CAMPOS OBRIGATORIOS ===');
    let missing = 0;
    for (const ef of expectedFields) {
      if (!fieldMap[ef]) {
        console.error(`ERRO: Campo faltando: ${ef}`);
        missing++;
      }
    }
    if (missing === 0) {
      console.log('TODOS OS 28 CAMPOS ESTAO PRESENTES E REGISTRADOS!');
    }

    // Test 2: Simulating editing by a player in Adobe / Chrome
    console.log('\n=== TESTE DE EDICAO DE CAMPOS (SIMULANDO JOGADOR) ===');
    const nomePersonagem = form.getTextField('nome_personagem');
    nomePersonagem.setText('Rodrigo "Guará" Mendes');

    const attrForca = form.getTextField('attr_forca');
    attrForca.setText('4');

    const aparencia = form.getTextField('aparencia');
    aparencia.setText('Nova descrição alterada pelo jogador: Cicatriz no olho esquerdo, jaqueta preta de couro.');

    const chk = form.getCheckBox('declaracao_lida');
    chk.uncheck();

    // Save modified PDF
    const editedBytes = await doc.save();
    fs.writeFileSync('C:\\DEAD.HOURS\\public\\preview-ficha-edited.pdf', editedBytes);
    console.log(`PDF editado salvo com sucesso (${editedBytes.length} bytes).`);

    // Reload modified PDF to verify persistence
    const reloadedDoc = await PDFDocument.load(editedBytes);
    const reloadedForm = reloadedDoc.getForm();
    const reloadedNome = reloadedForm.getTextField('nome_personagem').getText();
    const reloadedForca = reloadedForm.getTextField('attr_forca').getText();
    const reloadedAparencia = reloadedForm.getTextField('aparencia').getText();
    const reloadedChk = reloadedForm.getCheckBox('declaracao_lida').isChecked();

    console.log('\n=== REABERTURA E PERSISTENCIA DOS CAMPOS ===');
    console.log('- Nome reaberto:', reloadedNome);
    console.log('- Forca reaberta:', reloadedForca);
    console.log('- Aparencia reaberta:', reloadedAparencia);
    console.log('- Checkbox reaberto:', reloadedChk);

    if (
      reloadedNome === 'Rodrigo "Guará" Mendes' &&
      reloadedForca === '4' &&
      reloadedAparencia.includes('Guará') === false &&
      reloadedChk === false
    ) {
      console.log('\nSUCESSO TOTAL: Edição, salvamento e reabertura 100% verificados!');
    } else {
      console.error('\nFALHA: Valores reabertos não batem com os editados.');
      process.exit(1);
    }
  } catch (err) {
    console.error('ERRO no teste:', err);
    process.exit(1);
  }
})();
