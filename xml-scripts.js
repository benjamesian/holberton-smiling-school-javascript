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

const queryOptions = {
  q: '',
  topic: 'all',
  sortBy: 'most_popular',
}

function makeCardHTML(videoData, carousel=true) {
  return `
  <div class="${carousel ? "carousel-item" : ""} col-md-6 col-lg-3">
    <div class="">
      <div class="card border-0">
        <div class="position-relative">
          <img class="card-img-top img-fluid" src="${
            videoData.thumb_url
          }" alt="">
          <img class="card-img-overlay m-auto align-self-center" src="./images/play.png" alt="">
        </div>
        <div class="card-body">
          <h5 class="card-title">${videoData.title}</h5>
          <p class="card-text text-muted">
            ${videoData["sub-title"]}
          </p>
          <div class="row align-items-center my-2">
            <img class="col-3 img-fluid rounded-circle" src=${
              videoData.author_pic_url
            } alt="">
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

function slideCarousel(carouselItems, direction) {
  switch (direction) {
    case "left":
      carouselItems.push(carouselItems.pop(0));
      break;
    case "right":
      carouselItems.unshift(carouselItems.pop());
      break;
  }
}

function loadContent(data) {
  $.get(data.url, function (res) {
    $(data.loaderID).hide();
    $(data.parentID).append(
      res.reduce((acc, el) => acc + data.handler(el), "")
    );
    $(`${data.parentID} .carousel-item`).first().addClass("active");
  });
}

function queryCourses(q, topic, sort) {
  $.get(`https://smileschool-api.hbtn.info/xml/courses?q=${q||''}&topic=${topic||'all'}&sort=${sort||'most_popular'}`,
    function (res) {
      const xml = $.parseXML(res);
      const $courses = $(res).find('courses').children()
      const data = $courses.map(el => el.childNodes);
      // const data = $courses.map(el => el.find('id'))
      console.log('res', res, $courses, data);

      $("#courseLoader").hide();
      $("#courseVideos").html((res.courses.length || 0) + ' videos');
      $("#courseInner").html(
        res.courses.reduce((acc, el) => acc + makeCardHTML(el, false), "")
      )
    }
  );
}

$(document).ready(function () {
  [
    {
      url: "https://smileschool-api.hbtn.info/xml/quotes",
      loaderID: "#quoteLoader",
      parentID: "#quoteInner",
      handler: makeQuoteHTML,
    },
    {
      url: "https://smileschool-api.hbtn.info/xml/popular-tutorials",
      loaderID: "#videoLoader",
      parentID: "#videoInner",
      handler: makeCardHTML,
    },
    {
      url: "https://smileschool-api.hbtn.info/xml/latest-videos",
      loaderID: "#latestLoader",
      parentID: "#latestInner",
      handler: makeCardHTML,
    },
  ].forEach(loadContent);
  queryCourses('', 'all', 'most_popular');
  $("#keywords").focusout(
    function (e) {
      if (e.target.value === queryOptions.q) {
        return;
      }
      queryOptions.q = e.target.value;
      queryCourses(queryOptions.q, queryOptions.topic, queryOptions.sortBy);
    });
  $(".sortOptions .dropdown-item").on('click', 
    function (e) {
      switch (e.target.text) {
        case 'Most Popular':
          queryOptions.sortBy = 'most_popular';
          break;
        case 'Most Recent':
          queryOptions.sortBy = 'most_recent';
          break;
        case 'Most Viewed':
          queryOptions.sortBy = 'most_viewed';
          break;
      }
      $('#sortDropdown span').text(e.target.text);
      queryCourses(queryOptions.q, queryOptions.topic, queryOptions.sortBy);
    });
    $(".topicOptions .dropdown-item").on('click', 
    function (e) {
      switch (e.target.text) {
        case 'Novice':
          queryOptions.topic = 'novice';
          break;
        case 'Intermediate':
          queryOptions.topic = 'intermediate';
          break;
        case 'Expert':
          queryOptions.topic = 'expert';
          break;
      }
      $('#topicDropdown span').text(e.target.text);
      queryCourses(queryOptions.q, queryOptions.topic, queryOptions.sortBy);
    });
});
