import { ref } from 'vue';

import { getCaptchaImage, getComps } from '#/api';

interface selectType {
  label: string;
  value: string;
}
export const useLogin = () => {
  const compsList = ref<selectType[]>([]);
  const img = ref<string>('');
  const uuid = ref<string>('');
  const getCompsList = async () => {
    const { compList } = await getComps();
    compsList.value = compList.map((item) => {
      return {
        label: item.dsca,
        value: item.comp,
      };
    });
  };
  const getVerification = async () => {
    const data = await getCaptchaImage();
    img.value = data.img;
    uuid.value = data.uuid;
  };
  return {
    compsList,
    uuid,
    img,
    getCompsList,
    getVerification,
  };
};
