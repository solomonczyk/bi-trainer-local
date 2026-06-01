import type { Level } from '../types/question';

interface KeywordConfig {
  keywords: string[];
  minMatch: number;
  level: Level;
}

/**
 * Простая проверка наличия ключевых слов в тексте (регистронезависимая)
 * Для MVP используется includes, в будущем можно заменить на Levenshtein
 */
function containsKeyword(text: string, keyword: string): boolean {
  const lower = text.toLowerCase();
  const kw = keyword.toLowerCase();
  // Прямое вхождение
  if (lower.includes(kw)) return true;
  // С учётом окончаний (очень простая морфология для русских слов)
  const suffixes = ['а', 'у', 'е', 'ом', 'ой', 'ые', 'ых', 'ым', 'ами', 'ях', 'и', 'ов', 'ам'];
  for (const suffix of suffixes) {
    if (lower.includes(kw + suffix)) return true;
  }
  return false;
}

/**
 * Проверка структуры ответа для Senior уровня:
 * - Наличие цифр/чисел
 * - Конкретные примеры
 */
function checkStructure(text: string): boolean {
  const hasNumbers = /\d+/.test(text);
  const hasExamples = /например|к примеру|пример|case|кейс|проект/.test(text.toLowerCase());
  const hasSpecifics = text.length > 100;
  return hasNumbers && hasExamples && hasSpecifics;
}

export function evaluateKeywords(
  text: string,
  config: KeywordConfig
): { matched: number; total: number; passed: boolean; structureOk: boolean } {
  const matched = config.keywords.filter((kw) => containsKeyword(text, kw)).length;
  const passed = matched >= config.minMatch;
  const structureOk = config.level === 'S' ? checkStructure(text) : true;

  return { matched, total: config.keywords.length, passed, structureOk };
}
