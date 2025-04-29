export function transformRouterList(routerList: any) {
  function generateChildren(list: any) {
    list.map((item: any) => {
      if (item.children && item.children.length > 0) {
        generateChildren(item.children);
      }
      item.title = item.meta?.title.replaceAll(/\s+/g, '');
      item.path =
        item.meta?.frameSrc.startsWith('/') && item.meta?.frameSrc !== ''
          ? item.meta.frameSrc
          : `/${item.meta?.frameSrc}`;
      item.name =
        item.meta?.title.replaceAll(/\s+/g, '') + String(Math.random());
      return item;
    });
    return list;
  }

  return generateChildren(routerList);
}
