$(function () {

    var map = initializeMap();
    var $addItemButton = $('#options-panel').find('button');

    var $listGroups = {
        hotel: $('#hotel-list').children('ul'),
        restaurant: $('#restaurant-list').children('ul'),
        activity: $('#activity-list').children('ul')
    };

    // var collections = {
    //     hotel: hotels,
    //     restaurant: restaurants,
    //     activity: activities
    // };

    var $itinerary = $('#itinerary');

    var $addDayButton = $('#day-add');
    var $dayTitle = $('#day-title').children('span');
    var $removeDayButton = $('#day-title').children('button');
    var $dayButtonList = $('.day-buttons');

    var days = [
    ];

    var currentDayNum = 1;

    /*
    --------------------------
    END VARIABLE DECLARATIONS
    --------------------------
     */

    $.post('/api/days/add', function() {
        $.get('/api/days', function(result){
            result.forEach(function(day){
                days.push([]);
                $dayButtonList.append(createDayButton(day.number));
            })
            $('.day-buttons button:nth-child(2)').addClass('current-day');
        })
    });



    $addItemButton.on('click', function () {

        var $this = $(this);
        var $select = $this.siblings('select');
        var sectionName = $select.attr('data-type');
        var itemId = parseInt($select.val(), 10);
        var $list = $listGroups[sectionName];

        var name = $select[0].selectedOptions[0].innerHTML;
        // var collection = collections[sectionName];
        // var item = findInCollection(collection, itemId);

        $.post('/api/days/' + currentDayNum + '/' +sectionName + 's/add', {name: name}, function(name) {
            item = {name: name}
            // var marker = drawMarker(map, sectionName, item.place.location);
            $list.append(create$item(item));

            days[currentDayNum - 1].push({
                item: item,
                //marker: marker,
                type: sectionName
            });

            //mapFit();
        });

    });

    $itinerary.on('click', 'button.remove', function () {

        var $this = $(this);
        var $item = $this.parent();
        var itemName = $item.children('span').text();
        var day = days[currentDayNum - 1];
        var indexOfItemOnDay = findIndexOnDay(day, itemName);
        var itemOnDay = day.splice(indexOfItemOnDay, 1)[0];

        itemOnDay.marker.setMap(null);
        $item.remove();

        mapFit();

    });

    $addDayButton.on('click', function () {
        $.post('/api/days/add', function(newDay){
            $newDayButton = createDayButton(newDay.number);
            days.push([]);
            $dayButtonList.append($newDayButton);
            switchDay(newDay.number);
        })
        // var newDayNum = days.length + 1;
        // var $newDayButton = createDayButton(newDayNum);
        // days.push([]);
        // $addDayButton.before($newDayButton);
        // switchDay(newDayNum);
    });

    $dayButtonList.on('click', '.day-btn', function () {
        var dayNumberFromButton = parseInt($(this).text(), 10);
        switchDay(dayNumberFromButton);
    });

    $removeDayButton.on('click', function () {
        if (currentDayNum === 1) alert('Sorry, day one cannot be removed!');
        else if (currentDayNum !== days.length) alert('Sorry, day must be removed from the end!');
        else {
            $.post('/api/days/' + currentDayNum + '/delete', function() {
                wipeDay();
                days.splice(currentDayNum - 1, 1);

                if (days.length === 0) {
                    days.push([]);
                }

                reRenderDayButtons();
                switchDay(currentDayNum-1);
            });
        }


    });

    // fillInOptions(hotels, $('#hotel-choices'));
    // fillInOptions(restaurants, $('#restaurant-choices'));
    // fillInOptions(activities, $('#activity-choices'));

    /*
    --------------------------
    END NORMAL LOGIC
    --------------------------
     */

    // Create element functions ----

    function create$item(item) {

        var $div = $('<div />');
        var $span = $('<span />').text(item.name);
        var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

        $div.append($span).append($removeButton);

        return $div;

    }

    function createDayButton(number) {
        return $('<button class="btn btn-circle day-btn">' + number + '</button>');
    }

    // End create element functions ----

    function fillInOptions(collection, $selectElement) {
        collection.forEach(function (item) {
            $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>');
        });
    }

    function switchDay(dayNum) {
        wipeDay();
        currentDayNum = dayNum;
        renderDay();
        $dayTitle.text('Day ' + dayNum);
        mapFit();
    }

    function renderDay() {
        var currentDay = days[currentDayNum - 1];

        $dayButtonList
            .children('button')
            .eq(currentDayNum)
            .addClass('current-day');

        currentDay.forEach(function (attraction) {
            var $listToAddTo = $listGroups[attraction.type];
            $listToAddTo.append(create$item(attraction.item));
            attraction.marker.setMap(map);
        });

    }

    function wipeDay() {

        $dayButtonList.children('button').removeClass('current-day');

        Object.keys($listGroups).forEach(function (key) {
           $listGroups[key].empty();
        });

        if (days[currentDayNum - 1]) {
            days[currentDayNum - 1].forEach(function (attraction) {
                attraction.marker.setMap(null);
            });
        }

    }

    function reRenderDayButtons() {

        var numberOfDays = days.length;

        $dayButtonList.children('button').not($addDayButton).remove();

        for (var i = 0; i < numberOfDays; i++) {
            $dayButtonList.append(createDayButton(i + 1));
        }

    }

    function mapFit() {

        var currentDay = days[currentDayNum - 1];
        var bounds = new google.maps.LatLngBounds();

        currentDay.forEach(function (attraction) {
            bounds.extend(attraction.marker.position);
        });

        map.fitBounds(bounds);

    }

    // Utility functions ------

    function findInCollection(collection, id) {
        return collection.filter(function (item) {
            return item.id === id;
        })[0];
    }

    function findIndexOnDay(day, itemName) {
        for (var i = 0; i < day.length; i++) {
            if (day[i].item.name === itemName) {
                return i;
            }
        }
        return -1;
    }

    // End utility functions ----

});
