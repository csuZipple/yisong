function setCookie(c_name, value, expiredays) {
    // console.log(expiredays);
    // let exdate = new Date()
    // exdate.setDate(exdate.getTime() + expiredays);
    // console.log(exdate);
    // console.log(exdate.toGMTString());
    // document.cookie = c_name + '=' + escape(value) +
    //   ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
    var exdate = new Date();  
    // exdate.setTime(exdate.getTime() + expiredays);
    exdate.setTime(expiredays);  
    // console.log(exdate);
    // console.log(exdate.getTime());
    // console.log(exdate.getTime() + expiredays);
    console.log(exdate.toString());
    
    document.cookie = c_name + "=" + escape(value)+ ((expiredays == null) ? "" : ";expires=" + exdate.toString());  
  }
  
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=')
    let c_end = 0
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1
      c_end = document.cookie.indexOf(';', c_start)
      if (c_end === -1) {
        c_end = document.cookie.length
      }

      return unescape(document.cookie.substring(c_start, c_end))
    }
  }

  return ''
}

function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}

  function getQueryString(name){
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }

  export {
    setCookie,
    getCookie,
    getQueryString,
    delCookie
  }