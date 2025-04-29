<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, h, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';
import { useLogin } from '#/views/_core/authentication/hooks';

defineOptions({ name: 'Login' });
const AuthenticationLoginRef = ref<InstanceType<
  typeof AuthenticationLogin
> | null>(null);
const { compsList, uuid, img, getCompsList, getVerification } = useLogin();
const authStore = useAuthStore();

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];
// getCompsList();
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: compsList.value,
        placeholder: $t('authentication.selectAccount'),
      },
      defaultValue: '400',
      fieldName: 'comp',
      label: $t('authentication.selectAccount'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.selectAccount') })
        .optional()
        .default('vben'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      defaultValue: '000000',
      dependencies: {
        trigger(values, form) {
          if (values.selectAccount) {
            const findUser = MOCK_USER_OPTIONS.find(
              (item) => item.value === values.selectAccount,
            );
            if (findUser) {
              form.setValues({
                password: '123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      defaultValue: 'gscm*2023*change',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.verifycodeTip'),
      },
      // dependencies: {
      //   trigger(values, form) {
      //     if (values.selectAccount) {
      //       const findUser = MOCK_USER_OPTIONS.find(
      //         (item) => item.value === values.selectAccount,
      //       );
      //       if (findUser) {
      //         form.setValues({
      //           password: '123456',
      //           username: findUser.value,
      //         });
      //       }
      //     }
      //   },
      //   triggerFields: ['selectAccount'],
      // },
      fieldName: 'verifycode',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.verifycodeTip') }),
      suffix: () => {
        return h('img', {
          src: `data:img/jpg;base64,${img.value}`,
          async onClick() {
            await getVerification();
            // 在获取新验证码后更新表单中的 uuid
            AuthenticationLoginRef.value
              ?.getFormApi()
              .setFieldValue('uuid', uuid.value);
          },
          class: 'w-[150px] h-[40px] rounded-md',
        });
      },
    },
    // {
    //   component: markRaw(SliderCaptcha),
    //   fieldName: 'captcha',
    //   rules: z.boolean().refine((value) => value, {
    //     message: $t('authentication.verifyRequiredTip'),
    //   }),
    // },
  ];
});

onMounted(async () => {
  await getCompsList();
  await getVerification();
  AuthenticationLoginRef.value?.getFormApi().setFieldValue('uuid', uuid.value);
});
</script>

<template>
  <AuthenticationLogin
    ref="AuthenticationLoginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-remember-me="false"
    :show-third-party-login="false"
    @submit="authStore.authLogin"
  />
</template>
