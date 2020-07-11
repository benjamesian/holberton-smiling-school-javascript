function makeQuoteHTML(quoteData) {
  return `
    <div class="carousel-item">
      <div class="d-flex justify-content-center align-items-center p-5 mx-5">
        <img class="rounded-circle img-fluid mx-4" src="${quoteData.pic_url}" width="150" height="150">
        <div>
          <p>
            ${quoteData.text}
          </p>
          <div class="font-weight-bold">
            ${quoteData.name}
          </div>
          <div class="font-italic">
            ${quoteData.title}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getStarPath(nStars, current) {
  return nStars >= current ? "./images/star_on.png" : "./images/star_off.png";
}

function makeCardHTML(videoData) {
  return `
  <div class="carousel-item col-md-6 col-lg-3">
    <div class="">
      <div class="card border-0">
        <div class="position-relative">
          <img class="card-img-top img-fluid" src="${videoData.thumb_url}" alt="">
          <img class="card-img-overlay m-auto align-self-center" src="./images/play.png" alt="">
        </div>
        <div class="card-body">
          <h5 class="card-title">${videoData.title}</h5>
          <p class="card-text text-muted">
            ${videoData["sub-title"]}
          </p>
          <div class="row align-items-center my-2">
            <img class="col-3 img-fluid rounded-circle" src=${videoData.author_pic_url} alt="">
            <h6 class="col color-primary pl-0">${videoData.author}</h6>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <div class="">
              <img src=${getStarPath(videoData.star, 1)} alt="">
              <img src=${getStarPath(videoData.star, 2)} alt="">
              <img src=${getStarPath(videoData.star, 3)} alt="">
              <img src=${getStarPath(videoData.star, 4)} alt="">
              <img src=${getStarPath(videoData.star, 5)} alt="">
            </div>
            <div class="color-primary">
              ${videoData.duration}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

$(document).ready(function () {
  $.get("https://smileschool-api.hbtn.info/quotes", function (data) {
    $("#quoteLoader").hide();
    data.forEach(function (quoteData) {
      $("#quoteInner").append(makeQuoteHTML(quoteData));
    });
    $("#quoteInner .carousel-item").first().addClass("active");
  });

  $.get("https://smileschool-api.hbtn.info/popular-tutorials", function (data) {
    $("#videoLoader").hide();
    data.forEach(function (videoData) {
      $("#videoInner").append(makeCardHTML(videoData));
    });
    $("#videoInner .carousel-item").first().addClass("active");
  });

  $.get("https://smileschool-api.hbtn.info/latest-videos", function (data) {
    $("#latestLoader").hide();
    data.forEach(function (latestData) {
      $("#latestInner").append(makeCardHTML(latestData));
    });
    $("#latestInner .carousel-item").first().addClass("active");
  });
});
