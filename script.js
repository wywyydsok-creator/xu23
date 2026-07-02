/**

 * Happy 23rd Birthday - Interactive Experience

 */



document.addEventListener('DOMContentLoaded', function() {

  initLoadingScreen();

  initScrollReveal();

  initMusicPlayer();

  initStoryContent();

  initMessageContent();

  initPhotoGrid();

  initParticles();

  initParallax();
  initNav();
  initCatMascot();
  initImageZoom();

});



function initLoadingScreen() {

  var loading = document.querySelector('.loading-screen');

  if (!loading) return;

  var t = Date.now();

  window.addEventListener('load', function() {

    setTimeout(function() {

      loading.classList.add('hidden');
      setTimeout(initCelebration, 200);

      var m = document.querySelector('.music-control');

      if (m) setTimeout(function() { m.classList.add('visible'); }, 300);

    }, Math.max(0, 1200 - (Date.now() - t)));

  });

  setTimeout(function() {

    if (!loading.classList.contains('hidden')) {

      loading.classList.add('hidden');
      setTimeout(initCelebration, 200);

      var m = document.querySelector('.music-control');

      if (m) setTimeout(function() { m.classList.add('visible'); }, 300);

 }

  }, 4000);

}



function initScrollReveal() {

  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .story-card, .photo-item, .message-content');

  if (!('IntersectionObserver' in window)) { els.forEach(function(e) { e.classList.add('revealed'); }); return; }

  var obs = new IntersectionObserver(function(entries) {

    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });

  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(e) { obs.observe(e); });

}



function initMusicPlayer() {

  var toggle = document.querySelector('.music-toggle');

  var stopBtn = document.querySelector('.music-stop');

  var slider = document.querySelector('.volume-slider input');

  var audio = document.getElementById('bgm');

  if (!toggle || !audio) return;

  var playing = false;

  var fi = null;



  audio.volume = slider ? parseFloat(slider.value) : 0.5;

  toggle.addEventListener('click', function() { playing ? pauseMusic() : playMusic(); });

  if (stopBtn) {

    stopBtn.addEventListener('click', stopMusic);

  }

  function playMusic() {

    audio.muted = false;
    audio.play().then(function() {

      playing = true; toggle.classList.add('playing'); audio.volume = 0;

      fadeIn(slider ? parseFloat(slider.value) : 0.5);

    }).catch(function() {});

  }

  function pauseMusic() {

    if (fi) { clearInterval(fi); fi = null; }

    audio.pause(); playing = false; toggle.classList.remove('playing');

  }

  function stopMusic() {

    if (fi) { clearInterval(fi); fi = null; }

    audio.pause();

    audio.currentTime = 0;

    playing = false;

    toggle.classList.remove('playing');

  }

  function fadeIn(tv) {

    if (fi) { clearInterval(fi); fi = null; }

    var step = 0;

    fi = setInterval(function() {

      step++; audio.volume = Math.min((tv / 20) * step, tv);

      if (step >= 20) { clearInterval(fi); fi = null; }

    }, 50);

  }

function attemptAutoplay() {

audio.muted = true;

audio.play().then(function() {
  playing = true;
  toggle.classList.add('playing');
  audio.volume = 0;
  setTimeout(function() {
    audio.muted = false;
    fadeIn(slider ? parseFloat(slider.value) : 0.5);
  }, 200);

}).catch(function() {
  setTimeout(function() {
    audio.muted = true;
    audio.play().then(function() {
      playing = true;
      toggle.classList.add('playing');
      audio.volume = 0;
      setTimeout(function() {
        audio.muted = false;
        fadeIn(slider ? parseFloat(slider.value) : 0.5);
      }, 200);
    }).catch(function() {
      var handler = function() {
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
        document.removeEventListener('scroll', handler);
        audio.muted = true;
        audio.play().then(function() {
          playing = true;
          toggle.classList.add('playing');
          audio.volume = 0;
          setTimeout(function() {
            audio.muted = false;
            fadeIn(slider ? parseFloat(slider.value) : 0.5);
          }, 200);
        }).catch(function() {});
      };
      document.addEventListener('click', handler);
      document.addEventListener('touchstart', handler);
      document.addEventListener('scroll', handler);
    });
  }, 500);
});
}

attemptAutoplay();

  if (slider) {

    slider.addEventListener('input', function() { audio.volume = parseFloat(slider.value); });

    toggle.addEventListener('mouseenter', function() {

      var v = slider.closest('.volume-slider');

      if (v) v.classList.add('active');

    });

  }

  audio.addEventListener('ended', function() { playing = false; toggle.classList.remove('playing'); });

  audio.addEventListener('error', function() { toggle.title = '\u97f3\u4e50\u6587\u4ef6\u672a\u627e\u5230'; });

}



function initStoryContent() {

  var container = document.querySelector('.story-timeline');

  if (!container) return;

  var defaults = [

    { title: 'First Meet', date: '2025\u5e745\u67081\u65e5', text: '\u6211\u4eec\u76f8\u9047\u5728\u6cb9\u5316\u5382\uff0c\u611f\u8c22\u9c9c\u5564\u798f\u9e7f\u5bb6\\n\u6700\u559c\u6b22\u5403\u996d\u7684\u65f6\u5019\uff0c\u56e0\u4e3a\u80fd\u548c\u4f60\u4e00\u8d77\u8d70\u8d70\u563b\u563b\u563b\\n\u5b9d\u5b9d\u84dd\u8272\u7684\u773c\u775b\u4ffa\u8fd8\u662f\u7b2c\u4e00\u6b21\u89c1' },

    { title: 'First Date', date: '2025\u5e745\u670826\u65e5', text: '\u6211\u4eec\u53bb\u56fd\u8d38\u7684\u72d7\u5496\uff0c\u563b\u563b\u563b\uff0c\u7b2c\u4e00\u6b21\u7275\u624b\u563f\u563f\u563f\\n\u6700\u540e\u9001\u5b9d\u5b9d\u5230\u5bbf\u820d\u56ed\u533a\u5916\u9762' },

    { title: 'Our Journey', date: '\u6211\u4eec\u7684\u70b9\u70b9\u6ef4\u6ef4', text: '\u6211\u4eec\u4e00\u8d77\u8d70\u5728\u4e91\u53f0\u5c71\u7684\u5ce1\u8c37\uff0c\u56db\u5468\u90fd\u662f\u6f7a\u6f7a\u7684\u6eaa\u6d41\uff0c\u975e\u5e38\u7684\u653e\u677e\\n\u5728\u6d1b\u9633\u4eae\u8d77\u6ee1\u57ce\u706f\u706b\u7684\u90a3\u5929\uff0c\u6211\u4eec\u80a9\u5e76\u80a9\u8d70\u5728\u9752\u7816\u8def\u4e0a\uff0c\u6211\u7684\u773c\u91cc\u5168\u662f\u4f60\u3002\\n\u56fe\u4e66\u9986\u91cc\u5b89\u9759\u5b66\u4e60\u7684\u65f6\u5149\uff0c\u53ea\u8981\u4e00\u8f6c\u5934\uff0c\u5c31\u80fd\u770b\u5230\u4f60\u8ba4\u771f\u4fa7\u8138\u7684\u6a21\u6837\uff0c\u90a3\u662f\u5c5e\u4e8e\u6211\u4eec\u6700\u8e0f\u5b9e\u7684\u966a\u4f34\u3002' },

  ];

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function render(stories) {

    var html = '';

    stories.forEach(function(s) {

      var paras = s.text.split('\\n').map(function(p) { return '<p>' + esc(p) + '</p>'; }).join('');

      html += '<div class="story-card"><div class="story-card-inner"><h3 class="story-card-title">' + esc(s.title) + '</h3><div class="story-card-date">' + esc(s.date) + '</div><div class="story-card-text">' + paras + '</div></div></div>';

    });

    container.innerHTML = html;

    initScrollReveal();

  }

  function parseStories(t) {

    var lines = t.split('\\n').map(function(l) { return l.trim(); }).filter(function(l) { return l; });

    var stories = [];

    var cur = null;

    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];

      if (line.indexOf('\u3002') < 0 && line.indexOf('\uff0c') < 0 && line.length < 20 && (i === 0 || lines[i-1] === '' || !cur)) {

        if (cur) stories.push(cur);

        cur = { title: line, date: '', text: '' };

      } else if (cur) {

        if (!cur.date && line.indexOf('\u5e74') >= 0 && line.length < 30) { cur.date = line; }

        else { cur.text += (cur.text ? '\\n' : '') + line; }

      }

    }

    if (cur) stories.push(cur);

    return stories;

  }

  fetch('texts/story.txt').then(function(r) {

    if (!r.ok) throw Error();

    return r.text();

  }).then(function(t) {

    var s = parseStories(t);

    if (s.length) render(s); else render(defaults);

  }).catch(function() { render(defaults); });

}



function initMessageContent() {

  var c = document.querySelector('.message-content');

  if (!c) return;

  var dflt = '\u751f\u65e5\u5feb\u4e50\uff0c\u6211\u7684\u5973\u5b69\u3002\\n23\u5c81\uff0c\u662f\u4e00\u4e2a\u5f88\u7f8e\u597d\u7684\u5e74\u7eaa\u3002\\n\u5e0c\u671b\u4f60\u6240\u6709\u7684\u613f\u671b\u90fd\u80fd\u5b9e\u73b0\uff0c\\n\u6bcf\u4e00\u5929\u90fd\u5145\u6ee1\u9633\u5149\u548c\u7b11\u5bb9\u3002\\n\u611f\u8c22\u4f60\u51fa\u73b0\u5728\u6211\u7684\u751f\u547d\u91cc\uff0c\\n\u8ba9\u6211\u7684\u4e16\u754c\u53d8\u5f97\u5982\u6b64\u6e29\u6696\u3002\\n\u672a\u6765\u7684\u8def\u8fd8\u5f88\u957f\uff0c\\n\u8ba9\u6211\u4eec\u4e00\u8d77\u8d70\u4e0b\u53bb\u3002\\n\u6c38\u8fdc\u7231\u4f60\u3002';

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function render(text) {

    var lines = text.split('\\n').filter(function(l) { return l.trim(); });

    c.querySelector('.message-text').innerHTML = lines.map(function(l) { return '<span class="line">' + esc(l) + '</span>'; }).join('');

    setTimeout(function() { c.classList.add('revealed'); }, 200);

  }

  fetch('texts/message.txt').then(function(r) { if (!r.ok) throw Error(); return r.text(); }).then(function(t) { render(t || dflt); }).catch(function() { render(dflt); });

}



function initPhotoGrid() {
  var container = document.querySelector('.photo-grid');
  if (!container || container.querySelectorAll('.slot-box').length > 0) return;

  var photoFiles = [
    '云台山可爱.jpg','可爱.jpeg','图书馆学习ing.jpg','地铁站摄.jpeg',
    '大观音寺.jpg','宝宝在嵩山.jpg','宝宝在海洋馆.jpg','宝宝在龙潭大峡谷.jpg',
    '宝宝大一.jpg','宝宝武功山之旅.jpg','拼豆成就.jpg','洛阳之美丽.jpg',
    '第一次见面嘿嘿.jpg','红石峡.jpg','美丽之合照.jpg','美翻了.jpeg',
    '非常的非常美丽.jpg','非常美丽.jpg'
  ];
  var base = 'photos/slot/';
  var shuffled = photoFiles.slice();
  for (var si = shuffled.length - 1; si > 0; si--) {
    var sj = Math.floor(Math.random() * (si + 1));
    var st = shuffled[si]; shuffled[si] = shuffled[sj]; shuffled[sj] = st;
  }
  var boxPhotos = [[],[],[]];
  for (var bi = 0; bi < shuffled.length; bi++) {
    boxPhotos[bi % 3].push(shuffled[bi]);
  }

  var html = '<div class="photo-slot-section"><div class="slot-boxes">';
  for (var b = 0; b < 3; b++) {
    html += '<div class="slot-box" data-box="' + b + '"><div class="slot-viewport"><div class="slot-track">';
    for (var p = 0; p < boxPhotos[b].length; p++) {
      html += '<div class="slot-item"><img src="' + base + boxPhotos[b][p] + '" alt="" loading="lazy"></div>';
    }
    html += '</div></div><div class="slot-dots">';
    for (var d = 0; d < boxPhotos[b].length; d++) {
      html += '<span class="dot' + (d === 0 ? ' active' : '') + '"></span>';
    }
    html += '</div></div>';
  }
    html += '</div><div class="slot-actions">';
    html += '<button class="slot-spin-btn" id="slotSpinBtn">?? 随机定格我们的回忆</button>';
    html += '<button class="slot-manage-btn" id="slotManageBtn">管理图库</button>';
  html += '</div></div>';
  container.innerHTML = html;

  var boxes = container.querySelectorAll('.slot-box');
  var slots = [];
  boxes.forEach(function(box, idx) {
    var vp = box.querySelector('.slot-viewport');
    var tk = box.querySelector('.slot-track');
    var dots = box.querySelectorAll('.dot');
    var items = tk.querySelectorAll('.slot-item');
    var total = items.length;
    var cur = 0;

    function goTo(i) {
      if (i < 0) i = 0;
      if (i >= total) i = total - 1;
      cur = i;
      tk.style.transform = 'translateX(' + (-cur * 100) + '%)';
      dots.forEach(function(d, di) { d.classList.toggle('active', di === cur); });
    }
    goTo(0);

    var sx = 0, startTime = 0, drag = false, touchHandled = false;
    vp.addEventListener('touchstart', function(e) {
      if (vp.classList.contains('spinning')) return;
      touchHandled = true;
      sx = e.touches[0].clientX;
      drag = true;
      startTime = Date.now();
      tk.style.transition = 'none';
    }, { passive: true });
    vp.addEventListener('touchmove', function(e) {
      if (!drag || vp.classList.contains('spinning')) return;
      var dx = e.touches[0].clientX - sx;
      var pct = (-cur * 100) + (dx / vp.offsetWidth * 100);
      tk.style.transform = 'translateX(' + pct + '%)';
    }, { passive: true });
    vp.addEventListener('touchend', function(e) {
      if (!drag) return;
      drag = false;
      tk.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
      var dx = e.changedTouches[0].clientX - sx;
      var elapsed = Date.now() - startTime;
      var velocity = Math.abs(dx) / Math.max(elapsed, 1);
      var threshold = vp.offsetWidth * 0.2;
      if (dx < -threshold || (dx < -15 && velocity > 0.4)) {
        goTo(cur + 1);
      } else if (dx > threshold || (dx > 15 && velocity > 0.4)) {
        goTo(cur - 1);
      } else {
        goTo(cur);
      }
      setTimeout(function() { touchHandled = false; }, 350);
    }, { passive: true });
    vp.addEventListener('mousedown', function(e) {
      if (vp.classList.contains('spinning')) return;
      if (touchHandled) return;
      sx = e.clientX;
      drag = true;
      startTime = Date.now();
      tk.style.transition = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (!drag || touchHandled) return;
      var dx = e.clientX - sx;
      var pct = (-cur * 100) + (dx / vp.offsetWidth * 100);
      tk.style.transform = 'translateX(' + pct + '%)';
    });
    document.addEventListener('mouseup', function(e) {
      if (!drag || touchHandled) return;
      drag = false;
      tk.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
      var dx = e.clientX - sx;
      var elapsed = Date.now() - startTime;
      var velocity = Math.abs(dx) / Math.max(elapsed, 1);
      var threshold = vp.offsetWidth * 0.2;
      if (dx < -threshold || (dx < -15 && velocity > 0.4)) {
        goTo(cur + 1);
      } else if (dx > threshold || (dx > 15 && velocity > 0.4)) {
        goTo(cur - 1);
      } else {
        goTo(cur);
      }
    });
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var di = Array.prototype.indexOf.call(dots, this);
        if (!vp.classList.contains('spinning')) goTo(di);
      });
    });
    slots.push({ vp: vp, tk: tk, goTo: goTo, total: total, cur: function() { return cur; } });
  });

  var btn = document.getElementById('slotSpinBtn');
  var spinning = false;
  btn.addEventListener('click', function() {
    if (spinning) return;
    spinning = true;
    btn.disabled = true;
    btn.textContent = '?? 回忆转动中...';
    slots.forEach(function(s) { s.vp.classList.add('spinning'); });
    slots.forEach(function(s) { s.tk.style.transition = ''; });

    var durations = [2600, 2800, 3000];
    var remaining = 3;

    slots.forEach(function(slot, si) {
      var start = Date.now();
      var dur = durations[si];

      function tick() {
        var elapsed = Date.now() - start;
        var p = Math.min(elapsed / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        slot.goTo(Math.floor(Math.random() * slot.total));
        if (p < 1) {
          setTimeout(tick, 50 + eased * 250);
        } else {
          slot.tk.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
          slot.goTo(Math.floor(Math.random() * slot.total));
          remaining--;
         if (remaining === 0) {
            setTimeout(function() {
              spinning = false;
              btn.disabled = false;
              btn.textContent = '?? 随机定格我们的回忆';
              slots.forEach(function(s) { s.vp.classList.remove('spinning'); });
              slots.forEach(function(s) { s.tk.style.transition = ''; });
            }, 400);
          }
        }
      }
      setTimeout(tick, si * 120);
    });
  });
  // Initialize gallery manager
  setupGalleryManager(container);
}


function setupGalleryManager(container) {
  // ---- Default photo list ----
  var defaultFiles = [
    '\u4e91\u53f0\u5c71\u53ef\u7231.jpg','\u53ef\u7231.jpeg','\u56fe\u4e66\u9986\u5b66\u4e60ing.jpg','\u5730\u94c1\u7ad9\u6444.jpeg',
    '\u5927\u89c2\u97f3\u5bfa.jpg','\u5b9d\u5b9d\u5728\u5d69\u5c71.jpg','\u5b9d\u5b9d\u5728\u6d77\u6d0b\u9986.jpg','\u5b9d\u5b9d\u5728\u9f99\u6f6d\u5927\u5ce1\u8c37.jpg',
    '\u5b9d\u5b9d\u5927\u4e00.jpg','\u5b9d\u5b9d\u6b66\u529f\u5c71\u4e4b\u65c5.jpg','\u62fc\u8c46\u6210\u5c31.jpg','\u6d1b\u9633\u4e4b\u7f8e\u4e3d.jpg',
    '\u7b2c\u4e00\u6b21\u89c1\u9762\u563f\u563f.jpg','\u7ea2\u77f3\u5ce1.jpg','\u7f8e\u4e3d\u4e4b\u5408\u7167.jpg','\u7f8e\u7ffb\u4e86.jpeg',
    '\u975e\u5e38\u7684\u975e\u5e38\u7f8e\u4e3d.jpg','\u975e\u5e38\u7f8e\u4e3d.jpg'
  ];
  var base = 'photos/slot/';

  // ---- In-memory storage (replaces IndexedDB for file:// compatibility) ----
  var userPhotosArray = [];
  var nextPhotoId = 1;
  function getAllUserPhotos(cb) { cb(userPhotosArray.slice()); }
  function addUserPhotos(photos, cb) {
    photos.forEach(function(p) {
      userPhotosArray.push({ id: nextPhotoId++, data: p.src, name: p.name, added: Date.now() });
    });
    if (cb) cb();
  }
  function deleteUserPhoto(id, cb) {
    for (var i = 0; i < userPhotosArray.length; i++) {
      if (userPhotosArray[i].id === id) { userPhotosArray.splice(i, 1); break; }
    }
    if (cb) cb();
  }
  function clearAllUserPhotos() { userPhotosArray = []; nextPhotoId = 1; }

  // ---- Create hidden file input ----
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
  document.body.appendChild(fileInput);

  // ---- Create modal ----
  var overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.style.display = 'none';
  overlay.innerHTML =
    '<div class="gallery-modal">' +
      '<div class="gallery-header">' +
        '<div><h3>管理图库 <span class="gallery-count" id="galleryCount"></span></h3></div>' +
        '<button class="gallery-close-btn" id="galleryCloseBtn">&times;</button>' +
      '</div>' +
      '<div class="gallery-toolbar">' +
        '<button class="gallery-add-btn" id="galleryAddBtn">+ 添加照片</button>' +
      '</div>' +
      '<div class="gallery-body" id="galleryBody"></div>' +
      '<div class="gallery-footer"><button class="gallery-confirm-btn" id="galleryConfirmBtn">确定</button></div>'
    '</div>';
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) { overlay.style.display = 'none'; rebuildAllSlots(); }
  });
  document.body.appendChild(overlay);

  // ---- Manage button handler ----
  var manageBtn = container.querySelector('#slotManageBtn');
  if (manageBtn) {
    manageBtn.addEventListener('click', function() {
      refreshGalleryView();
      overlay.style.display = 'flex';
    });
  }

  // ---- Close button ----
 overlay.querySelector('#galleryCloseBtn').addEventListener('click', function() {
   overlay.style.display = 'none';
   rebuildAllSlots();
 });
 overlay.querySelector('#galleryConfirmBtn').addEventListener('click', function() {
   overlay.style.display = 'none';
   rebuildAllSlots();
 });

  // ---- Add button: trigger file picker ----
  overlay.querySelector('#galleryAddBtn').addEventListener('click', function() {
    fileInput.value = '';
    fileInput.click();
  });

  // ---- File selected: read and store ----
  fileInput.addEventListener('change', function() {
    var files = Array.prototype.slice.call(fileInput.files);
    if (files.length === 0) return;
    var maxTotal = 1000;
    getAllUserPhotos(function(existing) {
      var remaining = maxTotal - (existing ? existing.length : 0);
      if (remaining <= 0) {
        alert('图库已满（最多1000张照片），请先删除一些照片再添加。');
        return;
      }
      var toAdd = files.slice(0, remaining);
      var results = [];
      var pending = toAdd.length;
      if (pending === 0) return;
      toAdd.forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          results.push({ src: e.target.result, name: file.name });
          pending--;
          if (pending === 0) {
            addUserPhotos(results, function() {
              refreshGalleryView();
              rebuildAllSlots();
            });
          }
        };
        reader.readAsDataURL(file);
      });
    });
  });

  // ---- Refresh gallery view (load and display) ----
  function refreshGalleryView() {
    var body = overlay.querySelector('#galleryBody');
    var count = overlay.querySelector('#galleryCount');
    getAllUserPhotos(function(userPhotos) {
      var totalDefault = defaultFiles.length;
      var totalUser = userPhotos ? userPhotos.length : 0;
      var grandTotal = totalDefault + totalUser;
      count.textContent = '(' + grandTotal + ' / 1000)';
      if (totalUser === 0) {
        body.innerHTML = '<div class="gallery-empty">还没有添加自定义照片<br>点击上方按钮添加</div>';
        return;
      }
      var h = '';
      for (var i = userPhotos.length - 1; i >= 0; i--) {
        var p = userPhotos[i];
        h += '<div class="gallery-item">';
        h += '<img src="' + p.data + '" alt="" loading="lazy">';
        h += '<button class="gallery-del-btn" data-id="' + p.id + '">&times;</button>';
        h += '</div>';
      }
      body.innerHTML = h;
      // Attach delete handlers
      body.querySelectorAll('.gallery-del-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var id = Number(this.getAttribute('data-id'));
          if (confirm('删除这张照片？')) {
            deleteUserPhoto(id, function() {
              refreshGalleryView();
              rebuildAllSlots();
            });
          }
        });
      });
    });
  }

  // ---- Rebuild all slot boxes with combined photos ----
  function rebuildAllSlots() {
    getAllUserPhotos(function(userPhotos) {
      // Combine default + user photos
      var all = [];
      defaultFiles.forEach(function(f) { all.push({ src: base + f, isDefault: true }); });
      if (userPhotos) {
        userPhotos.forEach(function(up) { all.push({ src: up.data, isDefault: false }); });
      }
      // Shuffle
      for (var si = all.length - 1; si > 0; si--) {
        var sj = Math.floor(Math.random() * (si + 1));
        var st = all[si]; all[si] = all[sj]; all[sj] = st;
      }
      // Distribute into 3 boxes
      var boxPhotos = [[], [], []];
      for (var bi = 0; bi < all.length; bi++) {
        boxPhotos[bi % 3].push(all[bi]);
      }
      // Build HTML
      var h = '<div class="photo-slot-section"><div class="slot-boxes">';
      for (var b = 0; b < 3; b++) {
        h += '<div class="slot-box" data-box="' + b + '"><div class="slot-viewport"><div class="slot-track">';
        for (var p = 0; p < boxPhotos[b].length; p++) {
          h += '<div class="slot-item"><img src="' + boxPhotos[b][p].src + '" alt="" loading="lazy"></div>';
        }
        h += '</div></div><div class="slot-dots">';
        for (var d = 0; d < boxPhotos[b].length; d++) {
          h += '<span class="dot' + (d === 0 ? ' active' : '') + '"></span>';
        }
        h += '</div></div>';
      }
      h += '</div><div class="slot-actions">';
      h += '<button class="slot-spin-btn" id="slotSpinBtn">随机定格我们的回忆</button>';
      h += '<button class="slot-manage-btn" id="slotManageBtn">管理图库</button>';
      h += '</div></div>';
      container.innerHTML = h;

      // Re-initialize slot functionality
      var boxes = container.querySelectorAll('.slot-box');
      var slots = [];
      boxes.forEach(function(box, idx) {
        var vp = box.querySelector('.slot-viewport');
        var tk = box.querySelector('.slot-track');
        var dots = box.querySelectorAll('.dot');
        var items = tk.querySelectorAll('.slot-item');
        var total = items.length;
        var cur = 0;

        function goTo(i) {
          if (i < 0) i = 0;
          if (i >= total) i = total - 1;
          cur = i;
          tk.style.transform = 'translateX(' + (-cur * 100) + '%)';
          dots.forEach(function(d, di) { d.classList.toggle('active', di === cur); });
        }
        goTo(0);

        var sx = 0, startTime = 0, drag = false, touchHandled = false;
        vp.addEventListener('touchstart', function(e) {
          if (vp.classList.contains('spinning')) return;
          touchHandled = true;
          sx = e.touches[0].clientX;
          drag = true;
          startTime = Date.now();
          tk.style.transition = 'none';
        }, { passive: true });
        vp.addEventListener('touchmove', function(e) {
          if (!drag || vp.classList.contains('spinning')) return;
          var dx = e.touches[0].clientX - sx;
          var pct = (-cur * 100) + (dx / vp.offsetWidth * 100);
          tk.style.transform = 'translateX(' + pct + '%)';
        }, { passive: true });
        vp.addEventListener('touchend', function(e) {
          if (!drag) return;
          drag = false;
          tk.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
          var dx = e.changedTouches[0].clientX - sx;
          var elapsed = Date.now() - startTime;
          var velocity = Math.abs(dx) / Math.max(elapsed, 1);
          var threshold = vp.offsetWidth * 0.2;
          if (dx < -threshold || (dx < -15 && velocity > 0.4)) {
            goTo(cur + 1);
          } else if (dx > threshold || (dx > 15 && velocity > 0.4)) {
            goTo(cur - 1);
          } else {
            goTo(cur);
          }
          setTimeout(function() { touchHandled = false; }, 350);
        }, { passive: true });
        vp.addEventListener('mousedown', function(e) {
          if (vp.classList.contains('spinning')) return;
          if (touchHandled) return;
          sx = e.clientX;
          drag = true;
          startTime = Date.now();
          tk.style.transition = 'none';
          e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
          if (!drag || touchHandled) return;
          var dx = e.clientX - sx;
          var pct = (-cur * 100) + (dx / vp.offsetWidth * 100);
          tk.style.transform = 'translateX(' + pct + '%)';
        });
        document.addEventListener('mouseup', function(e) {
          if (!drag || touchHandled) return;
          drag = false;
          tk.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
          var dx = e.clientX - sx;
          var elapsed = Date.now() - startTime;
          var velocity = Math.abs(dx) / Math.max(elapsed, 1);
          var threshold = vp.offsetWidth * 0.2;
          if (dx < -threshold || (dx < -15 && velocity > 0.4)) {
            goTo(cur + 1);
          } else if (dx > threshold || (dx > 15 && velocity > 0.4)) {
            goTo(cur - 1);
          } else {
            goTo(cur);
          }
        });
        dots.forEach(function(dot) {
          dot.addEventListener('click', function() {
            var di = Array.prototype.indexOf.call(dots, this);
            if (!vp.classList.contains('spinning')) goTo(di);
          });
        });
        slots.push({ vp: vp, tk: tk, goTo: goTo, total: total, cur: function() { return cur; } });
      });

      // Re-init spin button
      var btn = container.querySelector('#slotSpinBtn');
      var spinning = false;
      btn.addEventListener('click', function() {
        if (spinning) return;
        spinning = true;
        btn.disabled = true;
        btn.textContent = '回忆转动中...';
        slots.forEach(function(s) { s.vp.classList.add('spinning'); });
        slots.forEach(function(s) { s.tk.style.transition = ''; });
        var durations = [2600, 2800, 3000];
        var remaining = 3;
        slots.forEach(function(slot, si) {
          var start = Date.now();
          var dur = durations[si];
          function tick() {
            var elapsed = Date.now() - start;
            var p = Math.min(elapsed / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            slot.goTo(Math.floor(Math.random() * slot.total));
            if (p < 1) {
              setTimeout(tick, 50 + eased * 250);
            } else {
              slot.tk.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
              slot.goTo(Math.floor(Math.random() * slot.total));
              remaining--;
              if (remaining === 0) {
                setTimeout(function() {
                  spinning = false;
                  btn.disabled = false;
                  btn.textContent = '随机定格我们的回忆';
                  slots.forEach(function(s) { s.vp.classList.remove('spinning'); });
                  slots.forEach(function(s) { s.tk.style.transition = ''; });
                }, 400);
              }
            }
          }
          setTimeout(tick, si * 120);
        });
      });

      // Re-attach manage button handler
      var newManageBtn = container.querySelector('#slotManageBtn');
      newManageBtn.addEventListener('click', function() {
        refreshGalleryView();
        overlay.style.display = 'flex';
      });
    });
  }
}

function initParticles() {

  var canvas = document.getElementById('particles-canvas');

  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  var particles = [];

  var animId = null;

  var active = false;

  function resize() {

    var r = canvas.parentElement.getBoundingClientRect();

    canvas.width = r.width;

    canvas.height = r.height;

  }

  resize();

  window.addEventListener('resize', resize);

  function Particle() {

    this.reset = function() {

      this.x = Math.random() * canvas.width;

      this.y = canvas.height + 20;

      this.sz = Math.random() * 6 + 3;

      this.sy = -(Math.random() * 1.2 + 0.4);

      this.sx = (Math.random() - 0.5) * 0.5;

      this.op = Math.random() * 0.5 + 0.2;

      this.life = 1;

      this.decay = Math.random() * 0.003 + 0.002;

      this.heart = Math.random() > 0.5;

      this.hue = Math.random() * 30 + 340;

      this.rot = Math.random() * Math.PI * 2;

      this.rs = (Math.random() - 0.5) * 0.02;

    };

    this.reset();

    this.update = function() {

      this.y += this.sy;

      this.x += this.sx + Math.sin(this.y * 0.01) * 0.3;

      this.life -= this.decay;

      this.rot += this.rs;

      if (this.life <= 0 || this.y < -30) { this.reset(); this.y = canvas.height + 20; }

    };

    this.draw = function() {

      ctx.save();

      ctx.globalAlpha = this.life * this.op;

      ctx.translate(this.x, this.y);

      ctx.rotate(this.rot);

      if (this.heart) {

        var s = this.sz;

        ctx.fillStyle = 'hsl(' + this.hue + ', 60%, 65%)';

        ctx.beginPath();

        ctx.moveTo(0, s * 0.3);

        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, 0, 0, s * 0.7);

        ctx.bezierCurveTo(s, 0, s * 0.5, -s * 0.3, 0, s * 0.3);

        ctx.fill();

      } else {

        var g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.sz * 2);

        g.addColorStop(0, 'hsla(' + this.hue + ', 80%, 80%, 0.6)');

        g.addColorStop(0.5, 'hsla(' + this.hue + ', 60%, 70%, 0.2)');

        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.arc(0, 0, this.sz * 2, 0, Math.PI * 2);

        ctx.fill();

        ctx.fillStyle = 'hsla(50, 100%, 95%, 0.8)';

        ctx.beginPath();

        ctx.arc(0, 0, this.sz * 0.3, 0, Math.PI * 2);

        ctx.fill();

      }

      ctx.restore();

    };

  }

  function start() {

    if (active) return;

    active = true;

    particles = [];

    for (var i = 0; i < 40; i++) {

      var p = new Particle();

      p.y = Math.random() * canvas.height;

      particles.push(p);

    }

    function loop() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var j = 0; j < particles.length; j++) { particles[j].update(); particles[j].draw(); }

      animId = requestAnimationFrame(loop);

    }

    loop();

  }

  function stop() {

    active = false;

    if (animId) { cancelAnimationFrame(animId); animId = null; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  }

  var sec = document.querySelector('.message-section');

  if (sec && 'IntersectionObserver' in window) {

    var observer = new IntersectionObserver(function(entries) {

      entries.forEach(function(e) { e.isIntersecting ? start() : stop(); });

    }, { threshold: 0.1 });

    observer.observe(sec);

  }

  window.addEventListener('beforeunload', function() { stop(); });

}



function initParallax() {

  var hero = document.querySelector('.hero');

  var cake = document.querySelector('.cake-container');

  var name = document.querySelector('.hero-name');

  if (!hero) return;

  var ticking = false;

  window.addEventListener('scroll', function() {

    if (!ticking) {

      requestAnimationFrame(function() {

        var y = window.scrollY;

        var h = hero.offsetHeight;

        if (y <= h) {

          var p = y / h;

          if (cake) {

            cake.style.transform = 'scale(' + Math.max(0.6, 1 - p * 0.4) + ')';

            cake.style.opacity = Math.max(0, 1 - p * 1.2);

            cake.style.transformOrigin = 'center bottom';

          }

          if (name) name.style.opacity = Math.max(0, 1 - p * 2);

        }

        ticking = false;

      });

      ticking = true;

    }

}, { passive: true });

}
function initNav() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (!toggle) return;
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', function() {
    menu.classList.remove('open');
  });
  menu.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.remove('open');
  });
}

function initCelebration() {
  var container = document.getElementById('celebration');
  if (!container) return;

  var balloonColors = [
    '#E3C4CA', '#D4A6AE', '#C28B95', '#A66D78',
    '#E8D5B7', '#F0DEE2', '#FAF0F2', '#D4A6AE',
    '#E3C4CA', '#C28B95'
  ];
  var confettiColors = [
    '#E3C4CA', '#D4A6AE', '#C28B95', '#A66D78',
    '#E8D5B7', '#F5ECD9', '#FAF0F2', '#E3C4CA',
    '#C28B95', '#D4A6AE'
  ];

  // Create balloons
  for (var i = 0; i < 10; i++) {
    (function(idx) {
      var balloon = document.createElement('div');
      balloon.className = 'balloon';
      var color = balloonColors[idx % balloonColors.length];
      var left = 8 + Math.random() * 84;
      var delay = Math.random() * 1.5;
      var duration = 3.5 + Math.random() * 1.5;
      var xOffset = (Math.random() - 0.5) * 60;

      balloon.style.left = left + '%';
      balloon.style.animationDelay = delay + 's';
      balloon.style.animationDuration = duration + 's';

      var body = document.createElement('div');
      body.className = 'balloon-body';
      body.style.background = 'radial-gradient(circle at 35% 30%, ' + color + ', ' + color + '88)';

      // Highlight shine
      var shine = document.createElement('div');
      shine.style.cssText = 'position:absolute;top:12%;left:18%;width:30%;height:25%;border-radius:50%;background:rgba(255,255,255,0.35);';
      body.appendChild(shine);

      var triangle = document.createElement('div');
      triangle.style.cssText = 'position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ' + color + ';';
      body.appendChild(triangle);

      balloon.appendChild(body);

      var string = document.createElement('div');
      string.className = 'balloon-string';
      balloon.appendChild(string);

      // Sway via inline animation
      var swayX = 10 + Math.random() * 20;
      balloon.style.setProperty('--sway-x', swayX + 'px');
      balloon.animate([
        { transform: 'translateY(0) translateX(0)' },
        { transform: 'translateY(-30vh) translateX(' + swayX/2 + 'px)' },
        { transform: 'translateY(-70vh) translateX(' + (-swayX/2) + 'px)' },
        { transform: 'translateY(-105vh) translateX(' + swayX/3 + 'px)', opacity: 0 }
      ], {
        duration: (duration + delay) * 1000,
        delay: delay * 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
      balloon.style.animation = 'none';

      container.appendChild(balloon);
    })(i);
  }

  // Create confetti spraying from both sides bottom-to-top
  var sideCount = 55;
  for (var s = 0; s < 2; s++) {
    var isLeft = s === 0;
    for (var j = 0; j < sideCount; j++) {
      (function() {
        var c = document.createElement('div');
        c.className = 'confetti';
        if (Math.random() > 0.5) c.classList.add('circle');
        var color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        var size = 5 + Math.random() * 8;
        var delay = Math.random() * 0.3;
        var duration = 2.0 + Math.random() * 1.8;
        var rot = 360 + Math.random() * 1080;
        if (Math.random() > 0.5) rot = -rot;

        c.style.bottom = '-20px';
        c.style.left = (isLeft ? -10 + Math.random() * 40 : 60 + Math.random() * 50) + '%';
        c.style.background = color;
        c.style.width = size + 'px';
        c.style.height = (size * (0.8 + Math.random() * 0.6)) + 'px';
        c.style.opacity = '0';
        c.style.top = 'auto';

        var xDir = isLeft ? 1 : -1;
        var xSpread = 80 + Math.random() * 250;
        var xEnd = xDir * xSpread;
        var yEnd = -(300 + Math.random() * 500);
        var xMid1 = xEnd * (0.2 + Math.random() * 0.2);
        var yMid1 = yEnd * (0.25 + Math.random() * 0.2);
        var xMid2 = xEnd * (0.6 + Math.random() * 0.2);
        var yMid2 = yEnd * (0.6 + Math.random() * 0.2);

        c.animate([
          { opacity: 1, transform: 'translate(0, 0) rotate(0deg)', offset: 0 },
          { opacity: 1, transform: 'translate(' + xMid1 + 'px, ' + yMid1 + 'px) rotate(' + rot*0.2 + 'deg)', offset: 0.2 },
          { opacity: 1, transform: 'translate(' + xMid2 + 'px, ' + yMid2 + 'px) rotate(' + rot*0.5 + 'deg)', offset: 0.5 },
          { opacity: 0.7, transform: 'translate(' + xEnd*0.8 + 'px, ' + yEnd*0.8 + 'px) rotate(' + rot*0.8 + 'deg)', offset: 0.75 },
          { opacity: 0, transform: 'translate(' + xEnd + 'px, ' + yEnd + 'px) rotate(' + rot + 'deg)', offset: 1 }
        ], {
          duration: (duration + delay) * 1000,
          delay: delay * 1000,
          easing: 'cubic-bezier(0.15, 0.5, 0.3, 1)',
          fill: 'forwards'
        });

        container.appendChild(c);
      })();
    }
  }

  // Floating wish strips
  var wishTexts = [
    '\u5E73\u5E73\u5B89\u5B89', '\u5065\u5065\u5EB7\u5EB7', '\u5FEB\u4E50\u4E0D\u6B62\u751F\u65E5',
    '\u4F1A\u6210\u4E3A\u4F1F\u5927\u7684\u6444\u5F71\u5E08', '\u6210\u957F\u7684\u5C81', '\u6C38\u8FDC\u5E78\u798F',
    '\u5C11\u70B9\u70E6\u607C', '\u591A\u70B9\u597D\u8FD0', '\u4E0D\u59D4\u5C48\u81EA\u5DF1',
    '\u8EAB\u4F53\u7B2C\u4E00', '\u4F1A\u8D8A\u6765\u8D8A\u597D',
    '\u5E0C\u671B\u6BCF\u5929\u90FD\u80FD\u7761\u4E2A\u597D\u89C9', '\u4E0A\u73ED\u987A\u987A\u5229\u5229\uFF0C\u4E0B\u73ED\u5F00\u5F00\u5FC3\u5FC3',
    '\u5E0C\u671B\u4F60\u60F3\u505A\u7684\u4E8B\u60C5\u90FD\u6162\u6162\u5B9E\u73B0', '\u613F\u4F60\u4E00\u5E74\u6BD4\u4E00\u5E74\u4ECE\u5BB9',
    '\u613F\u4F60\u7684\u4E16\u754C\u4E00\u76F4\u6709\u5149', '\u5148\u7167\u987E\u597D\u81EA\u5DF1\u7136\u540E\u6162\u6162\u53D8\u5389\u5BB3'
  ];
  var bgPalette = [
    'rgba(253,248,249,0.88)', 'rgba(250,240,242,0.88)', 'rgba(240,222,226,0.88)',
    'rgba(232,196,202,0.88)', 'rgba(248,237,240,0.88)'
  ];

  wishTexts.forEach(function(text, idx) {
    setTimeout(function() {
      var strip = document.createElement('div');
      strip.className = 'wish-strip';
      strip.textContent = text;

      strip.style.left = (5 + Math.random() * 75) + '%';
      strip.style.background = bgPalette[Math.floor(Math.random() * bgPalette.length)];
      strip.style.color = '#A66D78';
      strip.style.border = '1px solid rgba(212,166,174,0.25)';

      var dur = 5 + Math.random() * 4;
      var xSway = (Math.random() - 0.5) * 160;
      var rot = (Math.random() - 0.5) * 40;
      var yDist = -(450 + Math.random() * 400);

      strip.animate([
        { opacity: 0, transform: 'translate(0,0) rotate(0deg)', offset: 0 },
        { opacity: 1, transform: 'translate(' + xSway*0.3 + 'px,' + yDist*0.25 + 'px) rotate(' + rot*0.3 + 'deg)', offset: 0.15 },
        { opacity: 1, transform: 'translate(' + xSway*0.6 + 'px,' + yDist*0.55 + 'px) rotate(' + rot*0.6 + 'deg)', offset: 0.45 },
        { opacity: 0.85, transform: 'translate(' + xSway*0.9 + 'px,' + yDist*0.85 + 'px) rotate(' + rot*0.9 + 'deg)', offset: 0.75 },
        { opacity: 0, transform: 'translate(' + xSway*1.2 + 'px,' + yDist + 'px) rotate(' + rot*1.2 + 'deg)', offset: 1 }
      ], {
        duration: dur * 1000,
        easing: 'cubic-bezier(0.15,0.5,0.3,1)',
        fill: 'forwards'
      });

      container.appendChild(strip);
    }, 3000 + idx * 250);
  });

  // Cleanup after animation
  setTimeout(function() {
    container.innerHTML = '';
 }, 18000);
}



function initCatMascot() {
  var cats = document.querySelectorAll('.cat-mascot');
  if (!cats.length) return;
  cats.forEach(function(cat) {
    cat.addEventListener('click', function() {
      // Collapse the other cat
      cats.forEach(function(other) {
        if (other !== cat) other.classList.remove('expanded');
      });
      this.classList.toggle('expanded');
    });
  });
}





function initImageZoom() {
  var wrappers = document.querySelectorAll('.cat-image-wrapper');
  if (!wrappers.length) return;
  wrappers.forEach(function(w) {
    var img = w.querySelector('.cat-img');
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      // Zoom this wrapper in-place
      w.classList.toggle('zoomed');
    });
  });
  // Close zoomed image when clicking elsewhere on the page
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.cat-image-wrapper.zoomed .cat-img')) {
      wrappers.forEach(function(w) { w.classList.remove('zoomed'); });
    }
  });
}
