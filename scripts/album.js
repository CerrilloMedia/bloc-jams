var currentAlbum;

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';
    
    var $row = $(template);
    
    var clickHandler = function() {
        // find the song item number (string) of song row        
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.s
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1]; 
            // set play-button on player bar to pause as well.
            updatePlayerBarSong();
        } else if ( currentlyPlayingSongNumber === songNumber ) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
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
        
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        
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

// track the index of current song
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var updatePlayerBarSong = function(album) {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    // When any song is playing, display pause button
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    }
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if ( currentSongIndex >= currentAlbum.songs.length ) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Why wouldn't we use updatePlayerBarSong for the following lines?
    $('.currently-playing .song-item').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .song-artist-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) { // return song number, not song index
        console.log("getLastSongNumber: " + index);
        return index == (currentAlbum.length - 1) ? 1 : index + 2;      
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    console.log(currentSongIndex);
    if ( currentSongIndex < 0 ) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1; // set "previous" song
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex]; // set new song
    console.log("currentlyPlayingSongNumber: " + currentlyPlayingSongNumber);
    
    // Why wouldn't we use updatePlayerBarSong for the following lines?
    $('.currently-playing .song-item').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .song-artist-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex) > currentAlbum.songs.length ? 1 : getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    console.log("lastSongNmber: " + lastSongNumber);
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

// previous & next buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

/* Cycle Through Albums
$('.album-cover-art').click(function() {
    var index = albumsCollection.indexOf(currentAlbum) + 1;
    if (albumsCollection[index] === undefined ) {
        index = 0;
    }
    currentlyPlayingSong = null;
    setCurrentAlbum(currentAlbum = albumsCollection[index]);
    // currentAlbum[0] = albumsCollection[index];    
});
*/