import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import type { Transaction } from '@/types';
import { toCsv } from '@/utils/csv';

// BOM UTF-8: sem ele, o Excel abre o arquivo como ANSI e troca os acentos
// ("Alimentação" vira "AlimentaÃ§Ã£o").
const UTF8_BOM = '﻿';

// Grava os lançamentos em um arquivo .csv de verdade e abre a folha de
// compartilhamento com ele (Arquivos, Mail, Drive, WhatsApp...).
export async function shareTransactionsCsv(transactions: Transaction[]): Promise<void> {
  const csv = toCsv(transactions);

  if (!(await Sharing.isAvailableAsync())) {
    // Sem compartilhamento de arquivos (ex.: navegador): envia como texto.
    await Share.share({ title: 'fintrack.csv', message: csv });
    return;
  }

  const file = new File(Paths.cache, 'fintrack.csv');
  if (file.exists) file.delete();
  file.create();
  file.write(UTF8_BOM + csv);

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: 'Exportar lançamentos',
  });
}
