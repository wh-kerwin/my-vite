import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default function useLang() {
  const i18n = useI18n();
  const lang = computed(() => i18n.locale.value);
  const changeLang = (locale) => {
    i18n.locale.value = locale;
    // 保存用户选择的语言
    localStorage.setItem("lang", locale);
  };

  return {
    lang,
    changeLang
  };
}