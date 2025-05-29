export function transformRouterList(routerList: any) {
  function generateChildren(list: any) {
    list.map((item: any) => {
      if (item.children && item.children.length > 0) {
        generateChildren(item.children);
      }
      item.title = item.meta?.title.replaceAll(/\s+/g, '');

      // 处理路径
      if (item.meta?.frameSrc || item.meta?.iframeSrc) {
        const src = item.meta.frameSrc || item.meta.iframeSrc;
        item.path = src.startsWith('/') && src !== '' ? src : `/${src}`;
        // 确保 iframeSrc 存在
        item.meta.iframeSrc = src;
      } else if (
        item.path === '' && // 如果路径为空，且有子路由，则设置重定向到第一个子路由
        item.children &&
        item.children.length > 0
      ) {
        const firstChild = item.children[0];
        if (firstChild.path) {
          item.redirect = firstChild.path;
        }
      }

      // 处理组件
      const src = item.meta?.frameSrc || item.meta?.iframeSrc;
      if (src && !src.endsWith('.vue')) {
        item.component = 'IFrameView';
        // 将 src 作为 props 传递给 IFrameView
        item.props = {
          src,
        };
      }

      // 生成唯一名称
      item.name =
        item.meta?.title.replaceAll(/\s+/g, '') + String(Math.random());
      return item;
    });
    return list;
  }

  return generateChildren(routerList);
}
