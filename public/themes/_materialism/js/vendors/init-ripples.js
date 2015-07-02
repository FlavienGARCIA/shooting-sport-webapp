// Add ripples to these elements
var withRipples = [
  '.btn:not(.withoutripple)',
  '.card-image',
  '.navbar a:not(.withoutripple)',
  '.dropdown-menu a',
  '.nav-tabs a:not(.withoutripple)',
  '.withripple',
  'aside.sidebar ul a'
].join(',');

function initRipplesWithArrive(){
  $(document).arrive(withRipples, function(){
    initRipples();
  });
}

function initRipples() {
  $(withRipples).ripples();
}
