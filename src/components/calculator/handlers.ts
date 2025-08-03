import { safeTranslate } from '../calculator/utils';
import { userSchema } from '../calculator/validations';
import { ZodError } from 'zod';
import { useUserStore } from './stores/userStore';

// تعريف Type للـ User
interface User {
  ampHour: string | number;
  cycleCut: string | number;
  cycleSupply: string | number;
  phone: string;
  systemType: string;
  governorate: string;
  goodSunlight: boolean | null;
  highBuildings: boolean | null;
  priority: string;
  cutPeriod: 'day' | 'night' | 'day_night' | '';
  battery: string;
  inverter: string;
}

// تعريف Type للأخطاء
interface Errors {
  ampHour: string;
  cycleCut: string;
  cycleSupply: string;
  phone: string;
}

// تعريف Type للخطوة
interface Step {
  value: number;
}

// زر التالي
export function nextStep(step: Step, user: User, errors: Errors) {
  const store = useUserStore();
  console.log('nextStep called', { step: step.value, user, errors });

if (step.value === 6 || step.value === 7 || step.value === 11) {
  try {
    const payload: any = {};
    if (step.value === 6) payload.ampHour = user.ampHour !== "" ? Number(user.ampHour) : undefined;
    if (step.value === 7) {
      payload.cycleCut = user.cycleCut !== "" ? Number(user.cycleCut) : undefined;
      payload.cycleSupply = user.cycleSupply !== "" ? Number(user.cycleSupply) : undefined;
    }
    if (step.value === 11) payload.phone = user.phone || "";

    userSchema.parse(payload);

    errors.ampHour = "";
    errors.cycleCut = "";
    errors.cycleSupply = "";
    errors.phone = "";
  } catch (e) {
    if (e instanceof ZodError) {
      console.error("Validation errors:", e.issues);
      e.issues.forEach((err) => {
        const field = err.path[0] as keyof Errors;
        if (errors[field] !== undefined) errors[field] = err.message;
      });
      return;
    }
  }
}

  if (typeof step.value === 'undefined') {
    console.error('Step is undefined, resetting to 1');
    step.value = 1;
  }
  if (step.value === 4 && user.highBuildings === false) {
    step.value = 6;
  } else if (step.value < 11) {
    step.value++;
  }

  store.saveProgress();
}

// زر السابق
export function prevStep(step: Step, user: User) {
  const store = useUserStore();
  console.log('prevStep called', { step: step.value, user });

  if (step.value === 6 && user.highBuildings === false) {
    step.value = 4;
  } else if (step.value > 1) {
    step.value--;
  }
  store.saveProgress(); // حفظ التقدم بعد تغيير الخطوة
}

// إرسال واتساب
export function sendWhatsApp(
  user: User,
  t: Function,
  errors: Errors,
  estimatedPanels: { value: string | number },
  aiMsg: { value: string }
) {
  console.log('sendWhatsApp called', { user, errors });
  try {
    userSchema.parse({
      ampHour: user.ampHour || "",
      cycleCut: user.cycleCut || "",
      cycleSupply: user.cycleSupply || "",
      phone: user.phone || "",
    });
    // إذا نجح التحقق، امسح الأخطاء
    errors.ampHour = "";
    errors.cycleCut = "";
    errors.cycleSupply = "";
    errors.phone = "";
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('Validation errors:', e.issues);
      e.issues.forEach((err) => {
        const field = err.path[0] as keyof Errors;
        if (errors[field] !== undefined) errors[field] = err.message;
      });
      alert(
        'يرجى تصحيح الأخطاء: ' +
          e.issues.map((err) => err.message).join(', ')
      );
      return;
    }
  }

  if (errors.phone) {
    alert(safeTranslate(t, 'calculator.errors.phone', 'رقم الهاتف غير صالح'));
    return;
  }

  const summary =
    aiMsg.value?.trim() ||
    safeTranslate(t, 'calculator.defaultSummary', 'ملخص الخطة الشمسية');

  let msg = `مرحبا، أحتاج خطة طاقة شمسية:\n
- نوع المنظومة: ${user.systemType}
- المحافظة: ${safeTranslate(t, `calculator.iraqGovernorates.${user.governorate}`, user.governorate)}
- شمس جيدة: ${user.goodSunlight ? safeTranslate(t, 'calculator.yes', 'نعم') : safeTranslate(t, 'calculator.no', 'لا')}
- مبانٍ عالية: ${user.highBuildings ? safeTranslate(t, 'calculator.yes', 'نعم') : safeTranslate(t, 'calculator.no', 'لا')}
- الأولوية: ${user.priority}
- الأمبير/ساعة: ${user.ampHour}
- مدة القطع: ${user.cycleCut} ${safeTranslate(t, 'calculator.hours', 'ساعات')}
- ساعات التوفر: ${user.cycleSupply} ${safeTranslate(t, 'calculator.hours', 'ساعات')}
- فترة القطع: ${
    user.cutPeriod === 'day'
      ? safeTranslate(t, 'calculator.cutPeriodDay', 'نهار فقط')
      : user.cutPeriod === 'night'
      ? safeTranslate(t, 'calculator.cutPeriodNight', 'ليل فقط')
      : safeTranslate(t, 'calculator.cutPeriodDayNight', 'نهار وليل')
  }
- البطارية: ${user.battery}
- الإنفرتر: ${user.inverter}
- الألواح المقدرة: ${estimatedPanels.value}
- رقم الهاتف: ${user.phone}

${summary}`;

  window.open(
    `https://wa.me/009647749992888?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
}

// إعادة التهيئة
export function resetCalculator(
  user: User,
  step: { value: number },
  aiMsg: { value: string },
  resetCount: { value: number },
  t: Function
) {
  const store = useUserStore();
  console.log('resetCalculator called');

  // إعادة تعيين المستخدم والخطوة
  store.reset();

  // إعادة تعيين الخطوة إلى 1
  if (step && typeof step.value === 'number') {
    step.value = 1;
  }

  // تحديث الرسالة مباشرة بعد إعادة تعيين الخطوة
  aiMsg.value = safeTranslate(
    t,
    'calculator.startQuestion',
    'ابدأ بإدخال بياناتك لتصميم نظامك الشمسي!'
  );

  // إعادة ضبط عداد التحديث
  if (resetCount && typeof resetCount.value === 'number') {
    resetCount.value++;
  }

  // إزالة setTimeout
}


