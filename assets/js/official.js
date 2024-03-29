(function () {
  var urlParam = ['player', '-1']

  var ret = window.location.search.match(/type=((player|agent))|parent=([0-9]+)/ig) || []
  for (var i = 0; i < ret.length; i++) {
    var k = ret[i].split('=')
    if (k.length == 2) {
      if (k[1] == 'player' || k[1] == 'agent') {
        urlParam[0] = k[1]
      }
      if (k[0] == 'parent') {
        urlParam[1] = k[1]
      }
    }
  }

  // if player or agent url matched
  // use it as the reqeust uri
  var url = '/qc/' + urlParam.join('/')
  if (urlParam[1] !== '-1' && document.getElementById('J_Invite'))
    document.getElementById('J_Invite').innerHTML = '<p>[邀请码/INVITE CODE]</p><pre>' + urlParam[1] + '</pre>'


  var bannerImage = document.getElementById('J_Banner')
  if (bannerImage) {
    if (urlParam[0] === 'agent') {
      bannerImage.src = 'assets/img/agent.png'
    } else {
      bannerImage.src = 'assets/img/yibo.png'
    }
  }
  var qcodeCanv = document.getElementById('J_Qcode')
  var downloadLink = document.getElementById('J_DownloadLink')
  var ctx = qcodeCanv.getContext('2d')
  var img = new Image(152, 152);
  img.onload = function () {
    ctx.drawImage(img, 0, 0)
  }
  fetch(url).then(function (res) {
    return res.text().then(function (data) {
      img.src = data
      downloadLink.href = '/download/' + urlParam.join('/')
    })
  }).catch(function (err) {

  })

})(window)