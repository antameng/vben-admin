export function transformRouterList(routerList: any) {
  function generateChildren(list: any) {
    list.map((item: any) => {
      if (item.children && item.children.length > 0) {
        generateChildren(item.children);
      }
      item.title = item.meta?.title.replaceAll(/\s+/g, '');

      // 处理路径
      if (item.meta?.frameSrc) {
        item.path =
          item.meta.frameSrc.startsWith('/') && item.meta.frameSrc !== ''
            ? item.meta.frameSrc
            : `/${item.meta.frameSrc}`;
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

      // 生成唯一名称
      item.name =
        item.meta?.title.replaceAll(/\s+/g, '') + String(Math.random());
      return item;
    });
    return list;
  }

  return generateChildren(routerList);
}
