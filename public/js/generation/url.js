function addParam(parameter) {
  //console.info('addParam')

  let params = new URL(document.location.href).searchParams;
  let filter = params.get("filter");

  if (!filter) {
    let array = [];

    if (!array.includes(parameter.toLowerCase())) {
      let url = new URL(window.location);

      array.push(parameter.toLowerCase());
      url.searchParams.set("filter", array);
      window.history.pushState({}, "", url);

      console.log(getStatut(array));
      return true;
    } else {
      return false;
    }
  } else {
    let array = filter.split(",");

    if (!array.includes(parameter.toLowerCase())) {
      let url = new URL(window.location);

      array.push(parameter.toLowerCase());
      url.searchParams.set("filter", array);

      window.history.pushState({}, "", url);
      getStatut(array);
      return true;
    } else {
      return false;
    }
  }
}
function removeParam(parameter) {
  //console.info('removeParam')

  let params = new URL(document.location.href).searchParams;
  let filter = params.get("filter");

  if (!filter) {
    var url = window.location.href.split("?")[0] + "?";
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] != "filter") {
        url = url + sParameterName[0] + "=" + sParameterName[1] + "&";
      }
    }

    window.history.pushState({}, "", url.substring(0, url.length - 1));
  } else {
    let array = filter.split(",");

    array.splice(array.indexOf(parameter), 1);

    if (array.length > 0) {
      if (!array.includes(parameter.toLowerCase())) {
        let url = new URL(window.location);

        url.searchParams.set("filter", array);

        window.history.pushState({}, "", url);
      }
    } else {
      var url = window.location.href.split("?")[0] + "?";
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] != "filter") {
          url = url + sParameterName[0] + "=" + sParameterName[1] + "&";
        }
      }

      window.history.pushState({}, "", url.substring(0, url.length - 1));
    }
  }
}
