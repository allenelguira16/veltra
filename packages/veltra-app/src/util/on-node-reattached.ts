export function onNodeReattached($node: Node, callback: () => void) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check for added nodes
      for (const node of mutation.addedNodes) {
        if (node === $node) {
          // observer.disconnect();
          callback();
          break;
        }
      }
    }
  });

  queueMicrotask(() => {
    observer.observe($node.parentNode!, { childList: true, subtree: true });
  });
}
