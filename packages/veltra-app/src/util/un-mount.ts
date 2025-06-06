export const unMount = ($target: Node, callback: Function) => {
  // function isExists(nodes: Node[]): boolean {
  //   for (const node of nodes) {
  //     if (node === $target) {
  //       return true; // Found the target node
  //     }
  //     // Recursively check the node's children
  //     if (isExists(Array.from(node.childNodes))) {
  //       return true;
  //     }
  //   }
  //   return false; // Target not found in this branch
  // }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // console.log();
      // const isRemoved = isExists(Array.from(mutation.removedNodes));
      const isRemoved = Array.from(mutation.removedNodes).includes($target);

      if (isRemoved) {
        callback();
        observer.disconnect();
      }
    }
  });

  if ($target.parentNode)
    observer.observe($target.parentNode, { childList: true, subtree: true });
};
