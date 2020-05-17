var tableelement = $(".imageGallery1");
//ajax call
$.ajax({
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jjean.jacques10",
    type: "GET",
    dataType: "json"
}).done(function (data, textStatus, jqXHR) {
    data['items'].forEach(element => {
        description = clean_description(element["description"]);
        guid = element["guid"];
        thumbnail = element["thumbnail"];
        title = element["title"];
        date = new Date(element["pubDate"]);
        day = date.getDay();
        month = date.toLocaleString('default', { month: 'long' });
        year = date.getFullYear();

        var item =
            '<div class="col-lg-3 col-md-3 col-sm-6 ' + year + '">' +
            '<div class="h_gallery_item">' +
            '<div class="g_img_item">' +
            '<img class="img-fluid" src="' + thumbnail + '" alt="">' +
            '<a class="light" href="' + thumbnail + '"><img src="img/talks/icon.png" alt=""></a>' +
            '</div>' +
            '<div class="g_item_text">' +
            '<a href="' + guid + '" target="_blank"' +
            'title="Abre em nova aba" rel="noopener noreferrer">' +
            '<h4><span lang="en">' + title + '</span></h4>' +
            '</a>' +
            '<p class="event_name"><span lang="en">Medium</span></p>' +
            '<div class="links">' +
            '<a href="' + guid + '" target="_blank" title="Abre em nova aba" rel="noopener noreferrer"><span class="button" id="pt">Artigo</span></a>' +
            '<a href="' + guid + '" target="_blank" title="Abre em nova aba" rel="noopener noreferrer"><span class="button" id="en">Article</span></a>' +
            '</div>' +
            '<div class="metadata">' +
            '<p>São Paulo (SP) - Brasil</p>' +
            '<p id="pt">' + day + ', ' + month + ' - ' + year + '</p>' +
            '<p id="en">' + month + ', ' + day + ' - ' + year + '</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        tableelement.append(item);
    });

});

function clean_description(description) {
    description = description.substring(0, 90);
    description = description.replace("<h3>", "<p>");
    cut = description.search('<\/h3>\s\w+');
    description = description.replace(cut, "  ");
    description = description.replace("<h4>", "<p>");
    cut = description.search('<\/h4>\s\w+');
    description = description.replace(cut, "  ");
    description += '...</p>';
    console.log(description);
    return description;
}