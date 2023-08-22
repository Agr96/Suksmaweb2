var webPath = '/';
if(document.location.hostname == 'localhost') webPath = '/suksma/';

$(document).ready(function() {
  $('[data-hide="true"]').hide();
  $(document).on('click','.expander',function(e){
    e.preventDefault();
    $('[data-name="'+$(this).attr('data-expand')+'"]').fadeIn('slow');
    $(this).remove();
  });

  var isPC = window.matchMedia("(min-width: 1280px)").matches;
  $(window).resize(function(){
    $($('body').width() < 1280)?isPC=false:isPC=true;
  });

  if(!isPC){
    $(document).on('click','[data-toggle="nav"]',function(){
      if($('.navbar').hasClass('show')){
        $('.navbar').removeClass('show').addClass('close').next('div').removeClass('masked');
      }else{
        if($('.navbar').hasClass('close')){
          $('.navbar').removeClass('close').addClass('show').next('div').addClass('masked');
        }else{
          $('.navbar').addClass('show').next('div').addClass('masked');
        }
      }
    });
    $('.dropdown').click(function() {
      $(this).children('ul').toggleClass('show');
    });
  }

  $(document).scroll(function() {
    var y = $(this).scrollTop();
    if(y>80){
      $('.arrow-up').addClass('open');
    }else {
      $('.arrow-up').removeClass('open');
    }

  });

  $('[data-dom="hide"]').hide();
  $('.gallery-loadmore').click(function() {
    $('[data-dom="hide"]').fadeIn();
    $(this).hide();
  });


  $.ajax({
    url:webPath+'instagram.php',data:'GET',datatype:'html',beforeSend:function(){
      $('.ig-posts').html('<p id="ig-status">Loading...</p>');
      $('.ig-posts-more').remove();
    },success:function(data){
      $('#ig-status').remove();
      $('.ig-posts').html(data).after('<a target="_blank" href="https://www.instagram.com/sman1.sukawati/" class="btn ig">Kunjungi kami @sman1.sukawati</a>');
    }
  });

  $.ajax({
    url:webPath+'check-server.php?cmd=unbk',type:'GET',datatype:'json', beforeSend(){
      $('.server .status').append('<span class="check">Connecting...</span>');
    },
    success:function(data){
      $('.server .check').remove();
      for (var i = 0; i < data.length; i++) {
        var server = $('#'+data[i].id);
        var serverStatus = server.children('.status');
        var url = 'http://'+data[i].host+':'+data[i].port;
        if(data[i].status){
          serverStatus.append('SERVER '+(i+1)+' [Online]');
          server.attr('href',url);
          server.attr('target','_blank');
        }else {
          server.removeClass('online');
          serverStatus.append('SERVER '+(i+1)+' [Offline]');
          server.attr('href','javascript:;');
        }
      }
    }
  });

  //podcast
  init();
	function init(){
		var current = 0;
		var audio = $('#audio');
		var playlist = $('#playlist');
		var tracks = playlist.find('li a');
		var len = tracks.length - 1;
		audio[0].volume = .10;
		audio[0].play();
		playlist.on('click','a', function(e){
			e.preventDefault();
			link = $(this);
			current = link.parent().index();
			run(link, audio[0]);
		});
		audio[0].addEventListener('ended',function(e){
			current++;
			if(current == len){
				current = 0;
				link = playlist.find('a')[0];
			}else{
				link = playlist.find('a')[current];
			}
			run($(link),audio[0]);
		});
	}
	function run(link, player){
			player.src = link.attr('href');
			par = link.parent();
			par.addClass('active').siblings().removeClass('active');
			player.load();
			player.play();
	}


}); // end jq

/*Limit*/
readMore();
window.addEventListener('resize',readMore);
function readMore(){
  document.querySelectorAll('[data-hlimit]').forEach(function(el){
    var height = el.offsetHeight;
    var maxHeight = el.getAttribute('data-hlimit');
    if(height > maxHeight){
      el.style.maxHeight = maxHeight+'px';
      el.innerHTML +='<span class="expand"><a class="expand-open" href="javascript:;">+Expand</a></span>';
      el.classList.add(el.getAttribute('data-class'));
    }
  });
}
/*Limit Close*/
document.addEventListener('click',function(evt){
  if(evt.target.matches('.expand-open')){
    var parentDom = evt.target.closest('[data-hlimit]');
    parentDom.classList.remove(parentDom.getAttribute('[data-class]'));
    parentDom.style.maxHeight='';
    evt.target.parentNode.remove();
  }
},false);
