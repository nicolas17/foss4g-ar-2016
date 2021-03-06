'use strict';

Handlebars.registerHelper('columnSize', function(content) {
  return Math.round(10 / content.rooms.length);
});

Handlebars.registerHelper('log', function(object) {
  console.log(object);
});

Handlebars.registerHelper('day', function(track) {
  return moment(track.start).format('dddd');
});

Handlebars.registerHelper('time', function(track) {
  return moment(track.start).format('HH:mm') + ' - ' + moment(track.end).format('HH:mm');
});

var programmeTemplate = function(data) {
  var source = $('#programme-template').html();
  var template = Handlebars.compile(source);
  $.each(data, function(dayIndex, day) {
    $('#programme').append(template(day));
  });
  $('[data-toggle="popover"]').popover({html: true});
};

var blocksTemplate = function(data, timestamp) {
  var blocks = {};
  var source = $('#blocks-template').html();
  var template = Handlebars.compile(source);
  $.each(data, function(dayIndex, day) {
    if (day.content) {
      $.each(day.content.agenda, function(blockIndex, block) {
        if (typeof blocks.currentBlock !== 'undefined' || timestamp < moment(block.start)) {
          blocks.nextBlock = block;
          blocks.nextBlock.day = day;
          return false;
        } else if (timestamp >= moment(block.start) && timestamp < moment(block.end)) {
          blocks.currentBlock = block;
          blocks.currentBlock.day = day;
        }
      });
    }
    if (typeof blocks.nextBlock !== 'undefined') {
      return false;
    }
  });
  $('#blocks > div:first').html(template(blocks));
};

var getProgramme = function() {
  $.getJSON('/programme.json')
    .done(function(data) {
      if ($('#programme-template').length) {
        programmeTemplate(data);
      } else if ($('#blocks-template').length) {
        blocksTemplate(data, moment());
        setInterval(function () {
          blocksTemplate(data, moment());
        }, 60000);
      }
    })
    .fail(function(error) {
      console.log(error);
    });
};

$(function() {
  getProgramme();
});
