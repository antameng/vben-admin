<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { preferences } from '@vben/preferences';
import { useTabbarStore } from '@vben/stores';

import { VbenSpinner } from '@vben-core/shadcn-ui';

defineOptions({ name: 'IFrameRouterView' });

const spinningList = ref<boolean[]>([]);
const tabbarStore = useTabbarStore();
const route = useRoute();

const enableTabbar = computed(() => preferences.tabbar.enable);

const iframeRoutes = computed(() => {
  if (!enableTabbar.value) {
    return route.meta.iframeSrc ? [route] : [];
  }
  return tabbarStore.getTabs.filter((tab) => !!tab.meta?.iframeSrc);
});

const tabNames = computed(
  () => new Set(iframeRoutes.value.map((item) => item.name as string)),
);

const showIframe = computed(() => iframeRoutes.value.length > 0);

function routeShow(tabItem: RouteLocationNormalized) {
  return tabItem.name === route.name;
}

function canRender(tabItem: RouteLocationNormalized) {
  const { meta, name } = tabItem;

  if (!name || !tabbarStore.renderRouteView) {
    return false;
  }

  if (!enableTabbar.value) {
    return routeShow(tabItem);
  }

  // 跟随 keepAlive 状态,与其他tab页保持一致
  if (
    !meta?.keepAlive &&
    tabNames.value.has(name as string) &&
    name !== route.name
  ) {
    return false;
  }
  return tabbarStore.getTabs.some((tab) => tab.name === name);
}
const actualSrc = 'sysapp.gree.com/GREESCM/m/skipto';
const iframeRefs = ref<HTMLIFrameElement[]>([]);
function setIframeRef(el: HTMLIFrameElement, index: number) {
  iframeRefs.value[index] = el;
}
function hideLoading(index: number) {
  iframeRefs.value[index]?.contentWindow?.postMessage(
    {
      // sourceUrl: `/${props.iframeSrc}`,
      resetSession: false,
      token: localStorage.getItem('token'),
    },
    '*',
  );
  spinningList.value[index] = false;
}

function showSpinning(index: number) {
  const curSpinning = spinningList.value[index];
  // 首次加载时显示loading
  return curSpinning === undefined ? true : curSpinning;
}

// onMounted(() => {
//   window.addEventListener('message', async (e) => {
//     // if (e.data === 'refresh') {
//     //   window.open(this_.iframeSrc, `iframe${this_.currIndex}`, '');
//     // }
//     // eslint-disable-next-line no-console
//     console.log(e.data); // e.data为传递过来的数据
//     // eslint-disable-next-line no-console
//     console.log(e.origin); // e.origin为调用 postMessage 时消息发送方窗口的 origin（域名、协议和端口）
//     // eslint-disable-next-line no-console
//     console.log(e.source); // e.source为对发送消息的窗口对象的引用，可以使用此来在具有不同origin的两个窗口之间建立双向通信
//   });
// });
// eslint-disable-next-line no-console
console.log(iframeRoutes, 'iframe路由');
</script>
<template>
  <template v-if="showIframe">
    <template v-for="(item, index) in iframeRoutes" :key="item.fullPath">
      <div
        v-if="canRender(item)"
        v-show="routeShow(item)"
        class="relative size-full"
      >
        <VbenSpinner :spinning="showSpinning(index)" />
        <iframe
          :ref="(el) => el && setIframeRef(el, index)"
          :src="actualSrc"
          class="size-full"
          @load="hideLoading(index)"
        ></iframe>
      </div>
    </template>
  </template>
</template>
