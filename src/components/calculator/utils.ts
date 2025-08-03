// دالة مساعدة للتعامل مع مفاتيح الترجمة المفقودة
export function safeTranslate(t: Function, key: string, fallback: string): string {
  try {
    const result = t(key);
    return result !== key ? result : fallback;
  } catch (e) {
    console.error(`Translation error for key "${key}":`, e);
    return fallback;
  }
}

// دالة استبدال المتغيرات داخل النصوص المترجمة - غيرت لـ {key}
export function replacePlaceholders(str: string, replacements: Record<string, string>) {
  try {
    return str.replace(/{(\w+)}/g, (_: string, key: string) => replacements[key] ?? '');
  } catch (e) {
    console.error('Error in replacePlaceholders:', e);
    return str;
  }
}