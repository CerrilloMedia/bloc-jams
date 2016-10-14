var currentAlbum;

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>';
    
    var $row = $(template);
    
    var clickHandler = function() {
        // find the song item number (string) of song row        
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.s
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            
            // currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);            
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            
            $('.volume .fill').width(currentVolume + "%");
            $('.volume .thumb').css("left", currentVolume + "%");
            
            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
            
        } else if ( currentlyPlayingSongNumber === songNumber ) {
            if ( currentSoundFile.isPaused() ) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
        
    };
        
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number'); // select the node
        var songNumber = parseInt(songNumberCell.attr('data-song-number')); // select the data from node attribute
        
        // if song-item-number isn't already currentPlayingSong, change to play button        
        if ( songNumber !== currentlyPlayingSongNumber ) {
            songNumberCell.html(playButtonTemplate);
        }
        
    };
    
    var offHover = function(event) {
        
        var songNumberCell = $(this).find('.song-item-number'); // select the node
        var songNumber = parseInt(songNumberCell.attr('data-song-number')); // select the data from node attribute
        
        if ( songNumber !== currentlyPlayingSongNumber ) {
            songNumberCell.html(songNumber); // Change contents of node
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);    
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    
    currentAlbum = album;   
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    // Empty Song list
    $albumSongList.empty();
    
    // rePopulate song list
    for (var i = 0 ; i < album.songs.length ; i++ ) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
}; 

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) { // if a soundfile is playing or paused.
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
        });
        
    // continuous play until end of album, or confirm re-play at albums end
    currentSoundFile.bind('ended', function() {
        if ( currentlyPlayingSongNumber != currentAlbum.songs.length) {
            nextSong();
        } else if (
            confirm("Album finished, would you like to hear it again?")) {
            nextSong();
        }
    });
    }
};

// Create a function to update the slider (for either song track or volume) percentage width and position of slider
var updateSeekPercentage = function( $seekBar, seekBarFillRatio ) {
    var offsetXPercent = seekBarFillRatio * 100; // horizontal value (x) for slider  
    
    offsetXPercent = Math.max(0, offsetXPercent);  // return whichever is greater
    offsetXPercent = Math.min(100,offsetXPercent); // return whichever is less
    
    var percentageString = offsetXPercent + "%"; // get string before passing into css attributes
    $seekBar.find('.fill').width(percentageString); // width of slider bar
    $seekBar.find('.thumb').css({left: percentageString}); // position of slider button
    
};

var setupSeekBars = function() {
    
    var $seekBars = $('.player-bar .seek-bar'); // 
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left; // utilize jQuery pageX offset
        var barWidth = $(this).width();
        
        // offset (px) / barWidth (px) would need to be passed into updateSeekPercentage()
        // and since this ratio is only from 0 to 1 it's multiplied by 100 to be between 0 and 100
        var seekBarFillRatio = offsetX / barWidth;
        
        // passing $(this) references the clicked .seek-bar only (not both) along with the fill ratio of the clicked bar
        if ($(event.target).parentsUntil('.player-bar').hasClass('currently-playing')) {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    // find the .thumb whose mousedown event was triggered
    $seekBars.find('.thumb').mousedown(function(event) {
        
        var $seekBar = $(this).parent(); // parent seekBar of whichever .thumb triggered a mousedown event
        
        // the mousedown function event triggers mousemove method
        $(document).bind('mousemove.thumb', function(event) {
            // console.log(this);
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth =  $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }
            
            updateSeekPercentage($seekBar,seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
            
        });
        
    });
    
};

// track the index of current song
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
          formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    };
};

var filterTimeCode = function(timeInSeconds) {
    var minutes = parseInt(timeInSeconds/60);
    var seconds = Math.floor(timeInSeconds % 60);
    return minutes + ":" + ( seconds > 9 ? seconds : "0" + seconds);
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeinPlayerBar = function(totalTime) {    
    $('.total-time').text(filterTimeCode(totalTime));
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBarSong = function(album) {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    // When any song is playing, show pause button
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeinPlayerBar(currentSongFromAlbum.duration);   
};

var nextSong = function() {
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if ( currentSongIndex >= currentAlbum.songs.length ) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .song-artist-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) { // return song number, not song index
        return index == (currentAlbum.length - 1) ? 1 : index + 2;      
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if ( currentSongIndex < 0 ) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .song-artist-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex) > currentAlbum.songs.length ? 1 : getLastSongNumber(currentSongIndex);
    
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//tracking songs and albums
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

// previous & next buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});