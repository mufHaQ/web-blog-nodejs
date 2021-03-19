anime({
  targets: '.c-item',
  translateX: 800,
  delay: anime.stagger(100, {
    start: 100
  }) // delay starts at 500ms then increase by 100ms for each elements.
})